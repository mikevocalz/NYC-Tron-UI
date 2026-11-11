#include "pch.h"
#include "TronDragSurface.h"
#include "NativeDragBroker.h"
#include "NativeDragTrace.h"
#ifdef RNW_NEW_ARCH
#include "IslandConnection.h"
#include "codegen/react/components/NYCTronFluentFabric/TronDragSurface.g.h"
#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Input.DragDrop.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Numerics.h>
#include <winrt/Microsoft.UI.Xaml.Automation.h>
#include <winrt/Microsoft.UI.Xaml.Automation.Peers.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <winrt/Windows.ApplicationModel.DataTransfer.h>
#include <winrt/Windows.UI.h>
#include <chrono>
#include <functional>
#include <memory>
#include <mutex>
#include <limits>
#include <stdexcept>
#include <utility>
#include <cmath>
#include <string_view>

namespace winrt::NYCTronFluentFabric {
namespace Xaml = winrt::Microsoft::UI::Xaml;
namespace Peers = Xaml::Automation::Peers;
namespace Transfer = winrt::Windows::ApplicationModel::DataTransfer;
namespace Json = winrt::Windows::Data::Json;
using Broker = nyctron::desktop::NativeDragBroker;
static constexpr wchar_t NonceProperty[] = L"NYCTron.NativeWindowDrag.Nonce";
static constexpr wchar_t PrivateFormat[] = L"application/x-nyc-tron-window-transfer";
static uint64_t NextDiagnosticSurface() noexcept { static uint64_t ordinal = 0; return ++ordinal; }
// Diagnostic only. Bounded observations of windows on this thread. The
// private OleDropTargetInterface property is recorded only as presence/absence;
// it does not establish a public OLE registration or a functioning drop target.
static constexpr uint32_t OleProbeNodeLimit = 40;
static constexpr uint32_t OleProbeDepthLimit = 16;
struct OleProbeState { std::string text; uint32_t inputSites{0}, inputSitesWithOle{0}, count{0}; bool truncated{false}; };
static void ProbeWindow(HWND hwnd, HWND parent, OleProbeState& state, uint32_t depth = 0) noexcept {
  if (state.count >= OleProbeNodeLimit || depth >= OleProbeDepthLimit) { state.truncated = true; return; }
  ++state.count; // Every visited window consumes the budget, including InputSite nodes.
  try {
    wchar_t cls[96] = {}; GetClassNameW(hwnd, cls, 96);
    const bool ole = GetPropW(hwnd, L"OleDropTargetInterface") != nullptr;
    if (std::wstring_view(cls) == L"InputSiteWindowClass") { ++state.inputSites; if (ole) ++state.inputSitesWithOle; }
    else {
      RECT rect{}; GetWindowRect(hwnd, &rect);
      state.text += std::to_string(reinterpret_cast<uintptr_t>(hwnd)) + "<" + std::to_string(reinterpret_cast<uintptr_t>(parent)) + " " + winrt::to_string(cls) +
        (IsWindowVisible(hwnd) ? " vis" : " hid") + (ole ? " ole-prop" : " no-ole-prop") + " " + std::to_string(rect.left) + "," + std::to_string(rect.top) + "," + std::to_string(rect.right) + "," + std::to_string(rect.bottom) + ";";
    }
  } catch (...) {}
  for (HWND child = GetWindow(hwnd, GW_CHILD); child; child = GetWindow(child, GW_HWNDNEXT)) {
    if (state.count >= OleProbeNodeLimit || depth + 1 >= OleProbeDepthLimit) { state.truncated = true; break; }
    ProbeWindow(child, hwnd, state, depth + 1);
  }
}
static void RecordOleProbe(std::string const& owner, char const* after) noexcept {
  if (!nyctron::desktop::NativeDragTrace::Enabled(owner)) return;
  try {
    OleProbeState state;
    EnumThreadWindows(GetCurrentThreadId(), [](HWND top, LPARAM value) -> BOOL {
      auto& probe = *reinterpret_cast<OleProbeState*>(value);
      if (probe.count >= OleProbeNodeLimit) { probe.truncated = true; return FALSE; }
      ProbeWindow(top, GetWindow(top, GW_OWNER), probe);
      if (probe.count >= OleProbeNodeLimit) { probe.truncated = true; return FALSE; }
      return TRUE;
    }, reinterpret_cast<LPARAM>(&state));
    if (state.text.size() > 3000) state.text.resize(3000);
    Json::JsonObject record;
    record.SetNamedValue(L"stage", Json::JsonValue::CreateStringValue(L"ole-probe"));
    record.SetNamedValue(L"after", Json::JsonValue::CreateStringValue(winrt::to_hstring(after)));
    record.SetNamedValue(L"inputSites", Json::JsonValue::CreateNumberValue(state.inputSites));
    record.SetNamedValue(L"inputSitesWithOle", Json::JsonValue::CreateNumberValue(state.inputSitesWithOle));
    record.SetNamedValue(L"visitedWindows", Json::JsonValue::CreateNumberValue(state.count));
    record.SetNamedValue(L"visitLimit", Json::JsonValue::CreateNumberValue(OleProbeNodeLimit));
    record.SetNamedValue(L"depthLimit", Json::JsonValue::CreateNumberValue(OleProbeDepthLimit));
    record.SetNamedValue(L"traversalTruncated", Json::JsonValue::CreateBooleanValue(state.truncated));
    record.SetNamedValue(L"windows", Json::JsonValue::CreateStringValue(winrt::to_hstring(state.text)));
    nyctron::desktop::NativeDragTrace::Record(owner, record);
  } catch (...) {}
}
struct DragDataObservation {
  bool propertiesRead{false}, formatRead{false}, formatPresent{false};
  bool noncePropertyRead{false}, noncePropertyPresent{false}, nonceStringRead{false}, nonceValid{false};
  bool failed{false}, hresultKnown{false}; int32_t hresult{0};
};
struct NativeDragRegionAutomationPeer : Peers::FrameworkElementAutomationPeerT<NativeDragRegionAutomationPeer> {
  explicit NativeDragRegionAutomationPeer(Xaml::FrameworkElement const& owner) : FrameworkElementAutomationPeerT(owner) {}
  winrt::hstring GetClassNameCore() const { return L"NYCTronDragRegion"; }
  Peers::AutomationControlType GetAutomationControlTypeCore() const { return Peers::AutomationControlType::Custom; }
};
struct NativeDragRegion : Xaml::Controls::ContentControlT<NativeDragRegion> {
  NativeDragRegion() {
    HorizontalContentAlignment(Xaml::HorizontalAlignment::Stretch);
    VerticalContentAlignment(Xaml::VerticalAlignment::Stretch);
    IsTabStop(true);
    UseSystemFocusVisuals(true);
  }
  Peers::AutomationPeer OnCreateAutomationPeer() {
    // ContentControl has no built-in peer. Reuse native owner name, geometry,
    // enabled state and focus support, with an explicit non-Button identity.
    return winrt::make<NativeDragRegionAutomationPeer>(static_cast<Xaml::FrameworkElement>(*this));
  }
};
// One keyboard-hook lease belongs to one prepared source drag on its UI thread.
// Both drop routes consult the same owner/nonce binding; unrelated surfaces
// cannot release it. The hook observes Escape and always passes the key on.
struct EscapeLease final {
  ~EscapeLease() { Stop(); }
  void Stop() noexcept {
    auto value = std::exchange(hook, nullptr);
    if (value) UnhookWindowsHookEx(value);
  }
  std::string owner, request, nonce;
  DWORD thread{0}; HHOOK hook{nullptr}; bool seen{false}; uint32_t count{0};
};
struct EscapeWatch {
  static inline thread_local std::weak_ptr<EscapeLease> active;
  static LRESULT CALLBACK Proc(int code, WPARAM wparam, LPARAM lparam) {
    auto lease = active.lock();
    if (lease && code == HC_ACTION && wparam == VK_ESCAPE && (lparam & (1u << 31)) == 0) {
      lease->seen = true;
      if (lease->count < std::numeric_limits<uint32_t>::max()) ++lease->count;
    }
    return CallNextHookEx(lease ? lease->hook : nullptr, code, wparam, lparam);
  }
  static bool Begin(std::shared_ptr<EscapeLease> const& lease, std::string const& owner, std::string const& request) {
    if (!lease || active.lock() || owner.empty() || request.empty()) return false;
    lease->owner = owner; lease->request = request; lease->thread = GetCurrentThreadId();
    lease->hook = SetWindowsHookExW(WH_KEYBOARD, Proc, nullptr, lease->thread);
    if (!lease->hook) return false;
    active = lease;
    return true;
  }
  static bool Bind(std::shared_ptr<EscapeLease> const& lease, std::string const& owner, std::string const& request, std::string const& nonce) {
    if (!lease || active.lock() != lease || !lease->hook || lease->thread != GetCurrentThreadId() ||
        lease->owner != owner || lease->request != request || nonce.empty()) return false;
    lease->nonce = nonce;
    return true;
  }
  static std::shared_ptr<EscapeLease> ForOwner(std::string const& owner) noexcept {
    auto lease = active.lock();
    return lease && lease->owner == owner ? lease : nullptr;
  }
  static bool Seen(std::string const& owner, std::string const& nonce) noexcept {
    auto lease = ForOwner(owner);
    return lease && !nonce.empty() && lease->nonce == nonce && lease->seen;
  }
  static void End(std::shared_ptr<EscapeLease> const& lease) noexcept {
    if (!lease) return;
    if (active.lock() == lease) active.reset();
    lease->Stop();
  }
};
// The parent island proxy and XAML events share the same broker. Only the
// captured UI dispatcher may call that broker; coroutine wait/cancellation
// continuations touch synchronized completion state and enqueue exact cleanup.
namespace InputDnD = winrt::Microsoft::UI::Input::DragDrop;
using DispatcherQueue = winrt::Microsoft::UI::Dispatching::DispatcherQueue;
class DropCompletion final {
 public:
  DropCompletion() : m_signal(CreateEventW(nullptr, TRUE, FALSE, nullptr)) {
    if (!m_signal) winrt::throw_last_error();
  }
  HANDLE Signal() const noexcept { return m_signal.get(); }
  bool Pending() const noexcept {
    std::lock_guard lock(m_mutex);
    return m_phase == Phase::Waiting;
  }
  void Complete(Transfer::DataPackageOperation value) noexcept {
    {
      std::lock_guard lock(m_mutex);
      if (m_phase != Phase::Waiting) return;
      m_result = value; m_phase = Phase::Ready;
    }
    if (!SetEvent(m_signal.get())) Abandon();
  }
  void BindAbandon(std::function<void()> cleanup) {
    bool invoke = false;
    {
      std::lock_guard lock(m_mutex);
      if (m_phase == Phase::Abandoned) invoke = true;
      else if (m_phase != Phase::Returned) m_cleanup = std::move(cleanup);
    }
    if (invoke) Run(cleanup);
  }
  void Abandon() noexcept {
    std::function<void()> cleanup;
    {
      std::lock_guard lock(m_mutex);
      if (m_phase == Phase::Abandoned || m_phase == Phase::Returned) return;
      m_phase = Phase::Abandoned; m_result = Transfer::DataPackageOperation::None;
      cleanup = std::move(m_cleanup);
    }
    SetEvent(m_signal.get());
    Run(cleanup);
  }
  Transfer::DataPackageOperation Take(bool signaled) noexcept {
    if (!signaled) Abandon();
    std::function<void()> released;
    auto result = Transfer::DataPackageOperation::None;
    {
      std::lock_guard lock(m_mutex);
      if (m_phase == Phase::Ready) {
        result = m_result; m_phase = Phase::Returned; released = std::move(m_cleanup);
      }
    }
    return result;
  }
 private:
  enum class Phase { Waiting, Ready, Abandoned, Returned };
  static void Run(std::function<void()>& callback) noexcept { try { if (callback) callback(); } catch (...) {} }
  // The broker callback, cancelling thread and threadpool wait continuation
  // share only these fields. No UI/callback work runs while the mutex is held.
  winrt::handle m_signal;
  mutable std::mutex m_mutex;
  Phase m_phase{Phase::Waiting};
  Transfer::DataPackageOperation m_result{Transfer::DataPackageOperation::None};
  std::function<void()> m_cleanup;
};
using DropComplete = std::shared_ptr<DropCompletion>;
struct ParentDropTarget : winrt::implements<ParentDropTarget, InputDnD::IDropOperationTarget> {
  using Handler = std::function<Transfer::DataPackageOperation(int, InputDnD::DragInfo const&, DropComplete)>;
  ParentDropTarget(DispatcherQueue dispatcher, Handler handler) : m_dispatcher(std::move(dispatcher)), m_handler(std::move(handler)) {}
  winrt::Windows::Foundation::IAsyncOperation<Transfer::DataPackageOperation> EnterAsync(InputDnD::DragInfo info, InputDnD::DragUIOverride) {
    co_return OnOwnerThread() ? m_handler(0, info, nullptr) : Transfer::DataPackageOperation::None;
  }
  winrt::Windows::Foundation::IAsyncOperation<Transfer::DataPackageOperation> OverAsync(InputDnD::DragInfo info, InputDnD::DragUIOverride) {
    co_return OnOwnerThread() ? m_handler(1, info, nullptr) : Transfer::DataPackageOperation::None;
  }
  winrt::Windows::Foundation::IAsyncAction LeaveAsync(InputDnD::DragInfo info) {
    if (OnOwnerThread()) m_handler(2, info, nullptr);
    co_return;
  }
  winrt::Windows::Foundation::IAsyncOperation<Transfer::DataPackageOperation> DropAsync(InputDnD::DragInfo info) {
    auto lifetime = get_strong();
    // Allocate and validate the event before any offer can retain a callback.
    auto complete = std::make_shared<DropCompletion>();
    auto cancellation = co_await winrt::get_cancellation_token();
    cancellation.callback([complete]() noexcept { complete->Abandon(); });
    try {
      if (cancellation()) throw winrt::hresult_canceled();
      if (!OnOwnerThread()) { complete->Complete(Transfer::DataPackageOperation::None); co_return complete->Take(true); }
      const auto immediate = m_handler(3, info, complete);
      if (immediate != Transfer::DataPackageOperation::None) complete->Complete(immediate);
      // Preserve the existing 35 s native wait and the broker's 30 s deadline.
      // A false wait result is terminal even if approval races the timeout.
      const bool signaled = co_await winrt::resume_on_signal(complete->Signal(), std::chrono::seconds(35));
      if (cancellation()) throw winrt::hresult_canceled();
      co_return complete->Take(signaled);
    } catch (...) { complete->Abandon(); throw; }
  }
 private:
  bool OnOwnerThread() const noexcept {
    try { return m_dispatcher && m_dispatcher.HasThreadAccess(); } catch (...) { return false; }
  }
  DispatcherQueue m_dispatcher{nullptr};
  Handler m_handler;
};
struct ParentDropRegistration final {
  winrt::Microsoft::UI::Content::ChildSiteLink site{nullptr};
  winrt::Microsoft::UI::Content::ContentIsland parent{nullptr};
  DispatcherQueue dispatcher{nullptr};
};
// Acquired and completed on the UI dispatcher. Every exit, including exceptions in
// property setters, releases the framework deferral once; no nested message pump.
class DragDeferral final {
 public:
  ~DragDeferral() { Complete(); }
  void Set(Xaml::DragOperationDeferral const& value) noexcept { m_value = value; }
  bool Claim() noexcept { return !std::exchange(m_claimed, true); }
  void Complete() noexcept {
    m_claimed = true; auto value = std::exchange(m_value, nullptr);
    if (value) try { value.Complete(); } catch (...) {}
  }
 private:
  Xaml::DragOperationDeferral m_value{nullptr}; bool m_claimed{false};
};
struct TronDragSurfaceComponentView
    : winrt::implements<TronDragSurfaceComponentView, winrt::IInspectable>,
      Codegen::BaseTronDragSurface<TronDragSurfaceComponentView> {
  ~TronDragSurfaceComponentView() { Destroy(); }
  void Destroy() noexcept {
    if (std::exchange(m_disposed, true)) return;
    ReleaseParentDropObserver();
    EscapeWatch::End(m_escapeLease); m_escapeLease.reset();
    m_mounted = false;
    m_loaded = false;
    Trace("surface-destroying");
    // Release broker deferrals and the XAML island at RNW's removal boundary,
    // before UIA references can postpone the UserData object's final release.
    Cleanup();
    try { if (m_island) m_island.Close(); } catch (...) {}
    m_connection.Close();
  }
  void Mounted(winrt::Microsoft::ReactNative::ComponentView const& view) noexcept {
    if (m_disposed) return;
    try {
      const auto site = view.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>().ChildSiteLink();
      if (m_connection.Site() != site) Cleanup();
      m_connection.SetSite(site);
      m_mounted = true;
      ApplyDragCapabilities();
      Trace("surface-mounted");
    }
    catch (...) { Error("Could not retain the native drag connection"); }
  }
  void Unmounted() noexcept {
    if (m_disposed) return;
    m_mounted = false;
    Trace("surface-unmounted");
    Cleanup();
  }
  void LayoutChanged(winrt::IInspectable const& sender, winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) noexcept {
    if (m_disposed) return;
    try {
      m_connection.UpdateLayout(sender.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>(), args);
      ObserveParentDropTarget();
    }
    catch (...) { Error("Could not update native drag input geometry"); }
  }
  void Loaded() noexcept {
    if (m_disposed) return;
    m_loaded = true;
    ApplyDragCapabilities();
    Trace("surface-loaded");
  }
  void Unloaded() noexcept {
    if (m_disposed) return;
    m_loaded = false;
    Trace("surface-unloaded");
    // Unregistering CanDrag also needs a live input-site registration. Once
    // unloaded, cancel the app transfer without changing that native property.
    Cleanup();
  }
  void InitializeContentIsland(winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView const& view) noexcept {
    try {
      m_island = Xaml::XamlIsland{};
      // ButtonBase consumes PointerPressed before WinUI's automatic drag helper.
      // A real ContentControl region leaves that input to the built-in helper,
      // retaining its mouse/touch/pen recognition and native drag event flow.
      m_surface = winrt::make<NativeDragRegion>().as<Xaml::Controls::ContentControl>();
      m_surface.HorizontalAlignment(Xaml::HorizontalAlignment::Stretch); m_surface.VerticalAlignment(Xaml::VerticalAlignment::Stretch);
      auto background = Xaml::Controls::Border{};
      background.Background(Xaml::Media::SolidColorBrush{winrt::Windows::UI::Colors::Transparent()});
      m_label = Xaml::Controls::TextBlock{};
      m_label.HorizontalAlignment(Xaml::HorizontalAlignment::Center); m_label.VerticalAlignment(Xaml::VerticalAlignment::Center);
      m_label.IsHitTestVisible(false);
      Xaml::Automation::AutomationProperties::SetAccessibilityView(m_label, Peers::AccessibilityView::Raw);
      background.Child(m_label); m_surface.Content(background);
      m_surface.DragStarting([weak = get_weak()](auto const&, Xaml::DragStartingEventArgs const& args) { if (auto self = weak.get()) self->Starting(args); else args.Cancel(true); });
      m_surface.DropCompleted([weak = get_weak()](auto const&, Xaml::DropCompletedEventArgs const& args) {
        if (auto self = weak.get()) {
          if (self->m_disposed || self->m_request.empty()) { EscapeWatch::End(self->m_escapeLease); self->m_escapeLease.reset(); return; }
          auto escape = std::exchange(self->m_escapeLease, {});
          auto request = std::exchange(self->m_request, {});
          std::shared_ptr<Broker> broker;
          try {
            broker = Broker::Find(self->m_owner);
            const auto result = args.DropResult();
            self->Trace("source-drop-completed");
            EscapeWatch::End(escape);
            auto effect = result == Transfer::DataPackageOperation::Move ? "move" : result == Transfer::DataPackageOperation::Copy ? "copy" : result == Transfer::DataPackageOperation::Link ? "link" : result == Transfer::DataPackageOperation::None ? "none" : "unknown";
            if (broker) broker->NativeCompleted(request, effect);
          } catch (...) {
            EscapeWatch::End(escape);
            if (broker) broker->Cancel(request, "unavailable");
            throw;
          }
        }
      });
      m_surface.DragEnter([weak = get_weak()](auto const&, Xaml::DragEventArgs const& args) { if (auto self = weak.get()) self->Hover(args, "target-enter"); });
      m_surface.DragOver([weak = get_weak()](auto const&, Xaml::DragEventArgs const& args) { if (auto self = weak.get()) self->Hover(args, "target-over"); });
      m_surface.DragLeave([weak = get_weak()](auto const&, Xaml::DragEventArgs const&) {
        if (auto self = weak.get()) {
          self->Trace("target-leave");
          if (self->InputReady()) if (auto broker = Broker::Find(self->m_owner)) broker->Leave(self->m_window, self->m_generation);
        }
      });
      m_surface.Drop([weak = get_weak()](auto const&, Xaml::DragEventArgs const& args) { if (auto self = weak.get()) self->Drop(args); });
      m_surface.Loaded([weak = get_weak()](auto const&, auto const&) { if (auto self = weak.get()) self->Loaded(); });
      m_surface.Unloaded([weak = get_weak()](auto const&, auto const&) { if (auto self = weak.get()) self->Unloaded(); });
      m_island.Content(m_surface);
      m_connection.SetIsland(m_island.ContentIsland());
      view.Connect(m_island.ContentIsland()); if (m_props) Apply(*m_props);
    } catch (...) { Error("Could not initialize the native WinUI drag surface"); }
  }
  void UpdateProps(winrt::Microsoft::ReactNative::ComponentView const& view, winrt::com_ptr<Codegen::TronDragSurfaceProps> const& props, winrt::com_ptr<Codegen::TronDragSurfaceProps> const& old) noexcept override {
    if (m_disposed) return;
    m_props = props; if (m_surface && props) Apply(*props);
    Codegen::BaseTronDragSurface<TronDragSurfaceComponentView>::UpdateProps(view, props, old);
  }
  void UpdateEventEmitter(std::shared_ptr<Codegen::TronDragSurfaceEventEmitter> const& emitter) noexcept override {
    Codegen::BaseTronDragSurface<TronDragSurfaceComponentView>::UpdateEventEmitter(emitter);
    auto pending = std::move(m_errors); m_errors.clear(); for (auto const& message : pending) Error(message);
  }
 private:
  void Trace(char const* stage, DragDataObservation const* data = nullptr, std::string const* nonce = nullptr, Xaml::DragEventArgs const& args = nullptr) const noexcept {
    if (!nyctron::desktop::NativeDragTrace::Enabled(m_owner)) return;
    try {
      Json::JsonObject record;
      auto boolean = [&](wchar_t const* key, bool value) { record.SetNamedValue(key, Json::JsonValue::CreateBooleanValue(value)); };
      auto number = [&](wchar_t const* key, double value) { if (std::isfinite(value)) record.SetNamedValue(key, Json::JsonValue::CreateNumberValue(value)); };
      record.SetNamedValue(L"stage", Json::JsonValue::CreateStringValue(winrt::to_hstring(stage)));
      record.SetNamedValue(L"role", Json::JsonValue::CreateStringValue(m_role == "source" ? L"source" : m_role == "target" ? L"target" : L"unknown"));
      number(L"surface", static_cast<double>(m_diagnosticSurface));
      boolean(L"disposed", m_disposed); boolean(L"mounted", m_mounted); boolean(L"loadedEvent", m_loaded);
      boolean(L"inputReady", InputReady());
      const auto escape = EscapeWatch::ForOwner(m_owner);
      boolean(L"escapeSeen", escape && escape->seen); number(L"escapeCount", escape ? escape->count : 0); boolean(L"escapeHook", escape && escape->hook);
      try {
        if (m_surface) {
          boolean(L"isLoaded", m_surface.IsLoaded()); boolean(L"enabled", m_surface.IsEnabled());
          boolean(L"canDrag", m_surface.CanDrag()); boolean(L"allowDrop", m_surface.AllowDrop());
          number(L"actualWidth", m_surface.ActualWidth()); number(L"actualHeight", m_surface.ActualHeight());
        }
        if (m_island) {
          const auto island = m_island.ContentIsland();
          boolean(L"islandPresent", !!island);
          if (island) { boolean(L"islandClosed", island.IsClosed()); if (!island.IsClosed()) boolean(L"islandConnected", island.IsConnected()); }
        }
      } catch (winrt::hresult_error const& error) { boolean(L"stateReadFailed", true); number(L"stateHresult", error.code().value); }
      catch (...) { boolean(L"stateReadFailed", true); }
      auto broker = Broker::Find(m_owner);
      boolean(L"brokerPresent", !!broker);
      if (broker) broker->DiagnosticState(record, nonce ? *nonce : "", m_window, m_generation);
      if (data) {
        boolean(L"propertiesRead", data->propertiesRead); boolean(L"formatRead", data->formatRead);
        if (data->formatRead) boolean(L"formatPresent", data->formatPresent);
        boolean(L"noncePropertyRead", data->noncePropertyRead);
        if (data->noncePropertyRead) boolean(L"noncePropertyPresent", data->noncePropertyPresent);
        boolean(L"nonceStringRead", data->nonceStringRead);
        if (data->nonceStringRead) boolean(L"nonceValid", data->nonceValid);
        boolean(L"eventOperationFailed", data->failed);
        if (data->failed) {
          boolean(L"operationHresultKnown", data->hresultKnown);
          if (data->hresultKnown) number(L"operationHresult", data->hresult);
        }
      }
      if (args) try {
        const auto position = args.GetPosition(m_surface);
        number(L"eventX", position.X); number(L"eventY", position.Y);
        number(L"acceptedOperation", static_cast<int32_t>(args.AcceptedOperation()));
        boolean(L"originalSourceIsSurface", args.OriginalSource() == m_surface);
      } catch (winrt::hresult_error const& error) { boolean(L"eventReadFailed", true); number(L"eventHresult", error.code().value); }
      catch (...) { boolean(L"eventReadFailed", true); }
      nyctron::desktop::NativeDragTrace::Record(m_owner, record);
      if (std::string_view(stage) == "source-starting" || std::string_view(stage) == "source-drop-completed") RecordOleProbe(m_owner, stage);
    } catch (...) { /* Diagnostic allocation/read failures cannot affect input. */ }
  }
  void Error(std::string const& message) noexcept {
    if (m_disposed) return;
    if (auto emitter = EventEmitter()) { Codegen::TronDragSurfaceEventEmitter::OnNativeError error; error.message = message; emitter->onNativeError(std::move(error)); }
    else m_errors.push_back(message);
  }
  // This registration supplies the actual parent-island target. Its unique
  // lease is invalidated before revocation/Close, including reentrant callbacks.
  bool ParentRegistrationReady(std::shared_ptr<ParentDropRegistration> const& registration) const noexcept {
    try {
      if (!registration || !registration->dispatcher || !registration->dispatcher.HasThreadAccess()) return false;
      if (registration != m_parentDropRegistration || !m_parentDropManager ||
          !InputReady() || m_role != "target" || !m_surface.IsEnabled()) return false;
      const auto site = m_connection.Site();
      return site && site == registration->site && !site.IsClosed() &&
        registration->parent && !registration->parent.IsClosed() && site.Parent() == registration->parent;
    } catch (...) { return false; }
  }
  void ObserveParentDropTarget() noexcept {
    auto registration = m_parentDropRegistration;
    try {
      if (!m_props || !InputReady() || m_role != "target" || !m_surface.IsEnabled()) { ReleaseParentDropObserver(); return; }
      const auto site = m_connection.Site();
      if (!site || site.IsClosed()) { ReleaseParentDropObserver(); Trace("parent-drop-observer-unavailable"); return; }
      const auto parent = site.Parent();
      if (!parent || parent.IsClosed()) { ReleaseParentDropObserver(); Trace("parent-drop-observer-unavailable"); return; }
      if (ParentRegistrationReady(m_parentDropRegistration)) return;
      ReleaseParentDropObserver();
      // Preserve a replacement installed by a reentrant native callback.
      if (m_parentDropRegistration) return;
      registration = std::make_shared<ParentDropRegistration>();
      registration->site = site; registration->parent = parent; registration->dispatcher = m_surface.DispatcherQueue();
      if (!registration->dispatcher || !registration->dispatcher.HasThreadAccess()) return;
      auto manager = InputDnD::DragDropManager::GetForIsland(parent);
      m_parentDropRegistration = registration; m_parentDropManager = manager;
      const auto token = manager.TargetRequested([weak = get_weak(), registration](auto const&, InputDnD::DropOperationTargetRequestedEventArgs const& args) {
        try { if (!registration->dispatcher.HasThreadAccess()) return; } catch (...) { return; }
        auto self = weak.get();
        if (!self || !self->ParentRegistrationReady(registration)) return;
        self->Trace("parent-target-requested");
        try {
          args.SetTarget(winrt::make<ParentDropTarget>(registration->dispatcher, [weak, registration](int kind, InputDnD::DragInfo const& info, DropComplete complete) {
            auto owner = weak.get();
            if (!owner || !owner->ParentRegistrationReady(registration)) {
              if (complete) complete->Complete(Transfer::DataPackageOperation::None);
              return Transfer::DataPackageOperation::None;
            }
            return owner->ParentDrop(kind, info, std::move(complete));
          }));
          self->Trace("parent-target-set");
        } catch (...) { self->Trace("parent-target-set-failed"); }
      });
      // A synchronous event can invalidate this lease while registration runs.
      if (m_parentDropRegistration != registration || m_parentDropManager != manager) {
        try { manager.TargetRequested(token); } catch (...) {}
        try { manager.Close(); } catch (...) {}
        return;
      }
      m_parentDropToken = token;
      if (!ParentRegistrationReady(registration)) { ReleaseParentDropObserver(); return; }
      Trace("parent-drop-observer-attached");
    } catch (...) {
      if (m_parentDropRegistration == registration) ReleaseParentDropObserver();
      Trace("parent-drop-observer-failed");
    }
  }
  // Hit test in the parent island's coordinates: the child site's translation
  // and ActualSize are expressed there, as is DragInfo.Position.
  bool ParentPositionInside(InputDnD::DragInfo const& info, double (&out)[6]) const {
    const auto site = m_connection.Site();
    const auto position = info.Position();
    const auto transform = site.LocalToParentTransformMatrix();
    const auto size = site.ActualSize();
    out[0] = position.X; out[1] = position.Y; out[2] = transform.m41; out[3] = transform.m42; out[4] = size.x; out[5] = size.y;
    return position.X >= out[2] && position.Y >= out[3] && position.X < out[2] + out[4] && position.Y < out[3] + out[5];
  }
  static std::string NonceFrom(Transfer::DataPackageView const& view) {
    if (!view.Contains(PrivateFormat)) return "";
    auto properties = view.Properties();
    if (!properties.HasKey(NonceProperty)) return "";
    auto value = winrt::unbox_value<winrt::hstring>(properties.Lookup(NonceProperty));
    return value.empty() || value.size() > 256 ? "" : winrt::to_string(value);
  }
  void TraceParentDrop(char const* stage, double const (&geometry)[6], bool inside, bool allowed) const noexcept {
    if (!nyctron::desktop::NativeDragTrace::Enabled(m_owner)) return;
    try {
      Json::JsonObject record;
      record.SetNamedValue(L"stage", Json::JsonValue::CreateStringValue(winrt::to_hstring(stage)));
      record.SetNamedValue(L"inside", Json::JsonValue::CreateBooleanValue(inside));
      record.SetNamedValue(L"allowed", Json::JsonValue::CreateBooleanValue(allowed));
      const auto escape = EscapeWatch::ForOwner(m_owner);
      record.SetNamedValue(L"escapeSeen", Json::JsonValue::CreateBooleanValue(escape && escape->seen));
      const wchar_t* keys[6] = {L"x", L"y", L"siteX", L"siteY", L"siteWidth", L"siteHeight"};
      for (int i = 0; i < 6; ++i) if (std::isfinite(geometry[i])) record.SetNamedValue(keys[i], Json::JsonValue::CreateNumberValue(geometry[i]));
      nyctron::desktop::NativeDragTrace::Record(m_owner, record);
    } catch (...) {}
  }
  // kind: 0 enter, 1 over, 2 leave, 3 drop. Mirrors Hover/Drop above, with the
  // same broker checks; the position test replaces XAML's own hit test.
  Transfer::DataPackageOperation ParentDrop(int kind, InputDnD::DragInfo const& info, DropComplete complete) noexcept {
    double geometry[6] = {};
    bool inside = false, allowed = false;
    try {
      inside = m_role == "target" && ParentPositionInside(info, geometry);
      auto broker = Broker::Find(m_owner);
      if (kind == 2) {
        if (InputReady() && broker) broker->Leave(m_window, m_generation);
        TraceParentDrop("parent-drop-leave", geometry, inside, false);
        m_parentInside = false;
        return Transfer::DataPackageOperation::None;
      }
      const auto nonce = NonceFrom(info.Data());
      allowed = !EscapeWatch::Seen(m_owner, nonce) && inside && InputReady() && m_surface.IsEnabled() && broker && broker->CanTarget(nonce, m_window, m_generation);
      if (kind == 3) {
        TraceParentDrop("parent-drop-drop", geometry, inside, allowed);
        if (!complete) return Transfer::DataPackageOperation::None;
        if (!allowed || !complete->Pending()) { complete->Complete(Transfer::DataPackageOperation::None); return Transfer::DataPackageOperation::None; }
        const auto target = m_window, generation = m_generation;
        const auto dispatcher = m_surface.DispatcherQueue();
        std::string request;
        try {
          request = broker->Offer(nonce, target, generation, [complete](bool accepted) {
            complete->Complete(accepted ? Transfer::DataPackageOperation::Move : Transfer::DataPackageOperation::None);
          });
          if (!request.empty()) complete->BindAbandon([dispatcher, weak = std::weak_ptr<Broker>(broker), nonce, target, generation, request]() noexcept {
            // This can run on a cancellation/threadpool thread. Never fall back
            // to inline broker access if its original dispatcher is shutting down.
            try {
              dispatcher.TryEnqueue([weak, nonce, target, generation, request]() noexcept {
                if (auto owner = weak.lock()) owner->CancelOffer(nonce, target, generation, request);
              });
            } catch (...) {}
          });
        } catch (...) {
          if (!request.empty()) broker->CancelOffer(nonce, target, generation, request);
          throw;
        }
        // Offer resolves later through Resolve; DropAsync owns the signaled state.
        return Transfer::DataPackageOperation::None;
      }
      if (allowed) broker->Hover(nonce, m_window, m_generation);
      else if (m_parentInside && broker) broker->Leave(m_window, m_generation);
      if (kind == 0 || allowed != m_parentInside) TraceParentDrop(kind == 0 ? "parent-drop-enter" : "parent-drop-over", geometry, inside, allowed);
      m_parentInside = allowed;
      return allowed ? Transfer::DataPackageOperation::Move : Transfer::DataPackageOperation::None;
    } catch (...) { TraceParentDrop("parent-drop-failed", geometry, inside, allowed); if (kind == 3 && complete) complete->Abandon(); return Transfer::DataPackageOperation::None; }
  }
  void ReleaseParentDropObserver() noexcept {
    // Clear the lease first: event removal and Close may reenter native code.
    m_parentDropRegistration.reset();
    auto manager = std::exchange(m_parentDropManager, nullptr);
    const auto token = std::exchange(m_parentDropToken, winrt::event_token{});
    m_parentInside = false;
    try { if (manager) manager.TargetRequested(token); } catch (...) {}
    try { if (manager) manager.Close(); } catch (...) {}
  }
  void Cleanup() noexcept {
    ReleaseParentDropObserver();
    EscapeWatch::End(m_escapeLease); m_escapeLease.reset();
    auto request = std::exchange(m_request, {});
    if (auto broker = Broker::Find(m_owner)) {
      if (!request.empty()) broker->Cancel(request, "unavailable");
      if (m_role == "target") broker->CancelTarget(m_window, m_generation);
    }
  }
  bool InputReady() const noexcept {
    try {
      if (m_disposed || !m_mounted || !m_loaded || !m_surface || !m_surface.IsLoaded() || !m_island) return false;
      const auto island = m_island.ContentIsland();
      return island && !island.IsClosed() && island.IsConnected();
    } catch (...) { return false; }
  }
  void ApplyDragCapabilities() noexcept {
    // RNW defers Connect until Mounted. In WinUI 1.8, setting CanDrag while
    // this element belongs to an unconnected XAML island can fail-fast during
    // input-site registration. Both Mounted and Loaded replay current props
    // so either event ordering is safe; no timer or speculative retry is used.
    if (!m_props || !InputReady()) { ReleaseParentDropObserver(); Trace("capabilities-deferred"); return; }
    try {
      m_surface.CanDrag(m_role == "source" && m_surface.IsEnabled());
      m_surface.AllowDrop(m_role == "target" && m_surface.IsEnabled());
      Trace("capabilities-applied");
      ObserveParentDropTarget();
    } catch (...) { ReleaseParentDropObserver(); Error("Could not apply native drag capabilities"); }
  }
  void Apply(Codegen::TronDragSurfaceProps const& props) noexcept {
    try {
      if (props.scopeToken != m_scope || props.ownerToken != m_owner || props.windowId != m_window || props.generation != m_generation || props.dragRole != m_role || props.disabled.value_or(false)) Cleanup();
      m_scope = props.scopeToken;
      m_owner = props.ownerToken; m_window = props.windowId; m_generation = props.generation; m_role = props.dragRole;
      if (m_role != "source" && m_role != "target") throw std::invalid_argument("Invalid native drag surface role");
      m_label.Text(winrt::to_hstring(props.label));
      Xaml::Automation::AutomationProperties::SetName(m_surface, winrt::to_hstring(props.label));
      m_surface.IsEnabled(!props.disabled.value_or(false));
      ApplyDragCapabilities();
    } catch (...) { Error("Native drag surface properties are invalid"); }
  }
  void Starting(Xaml::DragStartingEventArgs const& args) noexcept {
    Trace("source-starting");
    std::shared_ptr<DragDeferral> completion;
    std::shared_ptr<EscapeLease> escape;
    std::shared_ptr<Broker> broker;
    std::string request;
    try {
      completion = std::make_shared<DragDeferral>(); completion->Set(args.GetDeferral());
      escape = std::make_shared<EscapeLease>();
      auto ready = [args, completion, escape, weak = get_weak()](bool allowed, std::string const& nonce) {
        if (!completion->Claim()) return;
        try {
          auto self = weak.get();
          if (allowed && (!self || !self->InputReady() || self->m_role != "source" || !self->m_surface.IsEnabled() ||
              !EscapeWatch::Bind(escape, self->m_owner, self->m_request, nonce)))
            throw std::runtime_error("Native drag source lease is no longer live");
          args.Cancel(!allowed);
          if (allowed) {
            // The data package carries a nonce only. Documents never leave the JS owner.
            args.Data().SetData(PrivateFormat, winrt::box_value(winrt::to_hstring(nonce)));
            args.Data().Properties().Insert(NonceProperty, winrt::box_value(winrt::to_hstring(nonce)));
            args.Data().RequestedOperation(Transfer::DataPackageOperation::Move);
            self->Trace("source-data-prepared");
          } else EscapeWatch::End(escape);
        } catch (...) {
          try { args.Cancel(true); } catch (...) {}
          EscapeWatch::End(escape); completion->Complete(); throw;
        }
        completion->Complete();
      };
      broker = Broker::Find(m_owner); auto emitter = EventEmitter();
      if (!InputReady() || !broker || !emitter || m_role != "source" || !m_surface.IsEnabled() ||
          (m_escapeLease && m_escapeLease->hook)) { ready(false, ""); return; }
      request = broker->PrepareSource(m_window, m_generation, ready);
      if (!EscapeWatch::Begin(escape, m_owner, request)) throw std::runtime_error("Native drag Escape observation is unavailable");
      m_request = request; m_escapeLease = escape;
      Codegen::TronDragSurfaceEventEmitter::OnDragStarting event; event.scopeToken = m_scope; event.requestId = request; emitter->onDragStarting(std::move(event));
    } catch (...) {
      try { args.Cancel(true); } catch (...) {}
      EscapeWatch::End(escape);
      if (broker && !request.empty()) broker->Cancel(request, "unavailable");
      if (escape && m_escapeLease == escape) { m_escapeLease.reset(); m_request.clear(); }
      if (completion) completion->Complete();
      Error("Native drag start was refused or its owner is unavailable");
    }
  }
  static std::string Nonce(Xaml::DragEventArgs const& args, DragDataObservation& observation) {
    auto properties = args.DataView().Properties();
    observation.propertiesRead = true;
    observation.formatPresent = args.DataView().Contains(PrivateFormat); observation.formatRead = true;
    if (!observation.formatPresent) return "";
    observation.noncePropertyPresent = properties.HasKey(NonceProperty); observation.noncePropertyRead = true;
    if (!observation.noncePropertyPresent) return "";
    auto value = winrt::unbox_value<winrt::hstring>(properties.Lookup(NonceProperty));
    observation.nonceStringRead = true; observation.nonceValid = !value.empty() && value.size() <= 256;
    return value.size() > 256 ? "" : winrt::to_string(value);
  }
  void Hover(Xaml::DragEventArgs const& args, char const* stage) noexcept {
    DragDataObservation observation; std::string nonce;
    try {
      args.Handled(true); args.AcceptedOperation(Transfer::DataPackageOperation::None);
      auto broker = Broker::Find(m_owner); nonce = Nonce(args, observation);
      if (InputReady() && m_role == "target" && m_surface.IsEnabled() && !EscapeWatch::Seen(m_owner, nonce) && broker && broker->CanTarget(nonce, m_window, m_generation)) {
        args.AcceptedOperation(Transfer::DataPackageOperation::Move); broker->Hover(nonce, m_window, m_generation);
      }
    } catch (winrt::hresult_error const& error) { observation.failed = true; observation.hresultKnown = true; observation.hresult = error.code().value; }
    catch (...) { observation.failed = true; }
    // Unrelated or malformed OS data is still refused. Observe only booleans
    // from the existing reads, never copy either nonce or a document value.
    Trace(stage, &observation, &nonce, args);
  }
  void Drop(Xaml::DragEventArgs const& args) noexcept {
    std::shared_ptr<DragDeferral> completion;
    DragDataObservation observation; std::string nonce;
    try {
      args.Handled(true); args.AcceptedOperation(Transfer::DataPackageOperation::None);
      completion = std::make_shared<DragDeferral>(); completion->Set(args.GetDeferral());
      auto ready = [args, completion, weak = get_weak()](bool accepted) {
        if (!completion->Claim()) return;
        try { args.AcceptedOperation(accepted ? Transfer::DataPackageOperation::Move : Transfer::DataPackageOperation::None); }
        catch (...) { try { args.AcceptedOperation(Transfer::DataPackageOperation::None); } catch (...) {} completion->Complete(); throw; }
        if (auto self = weak.get()) self->Trace("target-decision-completed", nullptr, nullptr, args);
        completion->Complete();
      };
      auto broker = Broker::Find(m_owner); nonce = Nonce(args, observation);
      Trace("target-drop", &observation, &nonce, args);
      if (!InputReady() || m_role != "target" || !m_surface.IsEnabled() || EscapeWatch::Seen(m_owner, nonce) || !broker || !broker->CanTarget(nonce, m_window, m_generation)) { ready(false); return; }
      broker->Offer(nonce, m_window, m_generation, ready);
    } catch (...) {
      observation.failed = true;
      try { throw; } catch (winrt::hresult_error const& error) { observation.hresultKnown = true; observation.hresult = error.code().value; } catch (...) {}
      Trace("target-drop-failed", &observation, &nonce, args);
      try { args.AcceptedOperation(Transfer::DataPackageOperation::None); } catch (...) {} if (completion) completion->Complete();
      if (!m_disposed) Cleanup(); Error("Native drop could not reach its live application owner");
    }
  }
  Xaml::XamlIsland m_island{nullptr}; Xaml::Controls::ContentControl m_surface{nullptr}; Xaml::Controls::TextBlock m_label{nullptr};
  nyctron::islands::IslandConnection m_connection;
  winrt::Microsoft::UI::Input::DragDrop::DragDropManager m_parentDropManager{nullptr}; winrt::event_token m_parentDropToken{}; bool m_parentInside{false};
  std::shared_ptr<ParentDropRegistration> m_parentDropRegistration;
  std::shared_ptr<EscapeLease> m_escapeLease;
  winrt::com_ptr<Codegen::TronDragSurfaceProps> m_props;
  std::string m_owner, m_window, m_generation, m_role, m_scope, m_request;
  std::vector<std::string> m_errors; bool m_disposed{false}, m_mounted{false}, m_loaded{false};
  const uint64_t m_diagnosticSurface{NextDiagnosticSurface()};
};
}
void RegisterTronDragSurfaceComponent(winrt::Microsoft::ReactNative::IReactPackageBuilder const& builder) {
  winrt::NYCTronFluentFabric::Codegen::RegisterTronDragSurfaceNativeComponent<winrt::NYCTronFluentFabric::TronDragSurfaceComponentView>(builder,
    [](winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder const& component) {
      component.as<winrt::Microsoft::ReactNative::IReactViewComponentBuilder>().XamlSupport(true);
      component.SetContentIslandComponentViewInitializer([](auto const& view) noexcept {
        auto data = winrt::make_self<winrt::NYCTronFluentFabric::TronDragSurfaceComponentView>(); data->InitializeContentIsland(view); view.UserData(*data);
        view.Mounted([weak = data->get_weak()](winrt::IInspectable const&, winrt::Microsoft::ReactNative::ComponentView const& mounted) noexcept {
          if (auto owner = weak.get()) owner->Mounted(mounted);
        });
        view.Unmounted([weak = data->get_weak()](auto const&, auto const&) noexcept {
          if (auto owner = weak.get()) owner->Unmounted();
        });
        view.LayoutMetricsChanged([weak = data->get_weak()](winrt::IInspectable const& sender, winrt::Microsoft::ReactNative::LayoutMetricsChangedArgs const& args) noexcept {
          if (auto owner = weak.get()) owner->LayoutChanged(sender, args);
        });
        view.Destroying([weak = data->get_weak()](auto const&, auto const&) noexcept {
          if (auto owner = weak.get()) owner->Destroy();
        });
      });
    });
}
#endif
