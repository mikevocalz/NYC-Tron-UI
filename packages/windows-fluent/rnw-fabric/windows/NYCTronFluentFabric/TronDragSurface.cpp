#include "pch.h"
#include "TronDragSurface.h"
#include "NativeDragBroker.h"
#include "NativeDragTrace.h"
#ifdef RNW_NEW_ARCH
#include "IslandConnection.h"
#include "codegen/react/components/NYCTronFluentFabric/TronDragSurface.g.h"
#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Input.DragDrop.h>
#include <winrt/Microsoft.UI.Xaml.Automation.h>
#include <winrt/Microsoft.UI.Xaml.Automation.Peers.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <winrt/Windows.ApplicationModel.DataTransfer.h>
#include <winrt/Windows.UI.h>
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
// Diagnostic only. Lists every window on this thread with class, visibility,
// rect and whether OLE holds a drop target on it (the "OleDropTargetInterface"
// window property RegisterDragDrop sets). InputSiteWindowClass windows are
// summarized so the record stays far below the trace's 4096-byte record limit.
struct OleProbeState { std::string text; uint32_t inputSites{0}, inputSitesWithOle{0}, count{0}; };
static void ProbeWindow(HWND hwnd, HWND parent, OleProbeState& state) noexcept {
  try {
    if (state.count >= 40) return;
    wchar_t cls[96] = {}; GetClassNameW(hwnd, cls, 96);
    const bool ole = GetPropW(hwnd, L"OleDropTargetInterface") != nullptr;
    if (std::wstring_view(cls) == L"InputSiteWindowClass") { ++state.inputSites; if (ole) ++state.inputSitesWithOle; }
    else {
      RECT rect{}; GetWindowRect(hwnd, &rect);
      ++state.count;
      state.text += std::to_string(reinterpret_cast<uintptr_t>(hwnd)) + "<" + std::to_string(reinterpret_cast<uintptr_t>(parent)) + " " + winrt::to_string(cls) +
        (IsWindowVisible(hwnd) ? " vis" : " hid") + (ole ? " OLE" : " noole") + " " + std::to_string(rect.left) + "," + std::to_string(rect.top) + "," + std::to_string(rect.right) + "," + std::to_string(rect.bottom) + ";";
    }
  } catch (...) {}
  for (HWND child = GetWindow(hwnd, GW_CHILD); child; child = GetWindow(child, GW_HWNDNEXT)) ProbeWindow(child, hwnd, state);
}
static void RecordOleProbe(std::string const& owner, char const* after) noexcept {
  if (!nyctron::desktop::NativeDragTrace::Enabled(owner)) return;
  try {
    OleProbeState state;
    EnumThreadWindows(GetCurrentThreadId(), [](HWND top, LPARAM value) -> BOOL {
      ProbeWindow(top, GetWindow(top, GW_OWNER), *reinterpret_cast<OleProbeState*>(value)); return TRUE;
    }, reinterpret_cast<LPARAM>(&state));
    if (state.text.size() > 3000) state.text.resize(3000);
    Json::JsonObject record;
    record.SetNamedValue(L"stage", Json::JsonValue::CreateStringValue(L"ole-probe"));
    record.SetNamedValue(L"after", Json::JsonValue::CreateStringValue(winrt::to_hstring(after)));
    record.SetNamedValue(L"inputSites", Json::JsonValue::CreateNumberValue(state.inputSites));
    record.SetNamedValue(L"inputSitesWithOle", Json::JsonValue::CreateNumberValue(state.inputSitesWithOle));
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
      m_connection.SetSite(view.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>().ChildSiteLink());
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
    try { m_connection.UpdateLayout(sender.as<winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView>(), args); }
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
          if (self->m_disposed || self->m_request.empty()) return;
          const auto result = args.DropResult();
          self->Trace("source-drop-completed");
          auto effect = result == Transfer::DataPackageOperation::Move ? "move" : result == Transfer::DataPackageOperation::Copy ? "copy" : result == Transfer::DataPackageOperation::Link ? "link" : result == Transfer::DataPackageOperation::None ? "none" : "unknown";
          if (auto broker = Broker::Find(self->m_owner)) broker->NativeCompleted(self->m_request, effect);
          self->m_request.clear();
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
  // Diagnostic only. Observes, without ever calling SetTarget, whether the OS
  // drag asks the RNW parent island (the one hosting this nested XAML island)
  // for a drop target. Nothing here changes which object receives the drop.
  void ObserveParentDropTarget() noexcept {
    if (m_parentDropManager || m_role != "target") return;
    try {
      const auto site = m_connection.Site();
      if (!site || site.IsClosed()) { Trace("parent-drop-observer-unavailable"); return; }
      const auto parent = site.Parent();
      if (!parent || parent.IsClosed()) { Trace("parent-drop-observer-unavailable"); return; }
      m_parentDropManager = winrt::Microsoft::UI::Input::DragDrop::DragDropManager::GetForIsland(parent);
      m_parentDropToken = m_parentDropManager.TargetRequested([weak = get_weak()](auto const&, auto const&) {
        if (auto self = weak.get()) self->Trace("parent-target-requested");
      });
      Trace("parent-drop-observer-attached");
    } catch (...) { Trace("parent-drop-observer-failed"); }
  }
  void ReleaseParentDropObserver() noexcept {
    try { if (m_parentDropManager) { m_parentDropManager.TargetRequested(m_parentDropToken); m_parentDropManager.Close(); } } catch (...) {}
    m_parentDropManager = nullptr;
  }
  void Cleanup() noexcept {
    if (auto broker = Broker::Find(m_owner)) {
      if (!m_request.empty()) broker->Cancel(m_request, "unavailable");
      if (m_role == "target") broker->CancelTarget(m_window, m_generation);
    }
    m_request.clear();
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
    if (!m_props || !InputReady()) { Trace("capabilities-deferred"); return; }
    try {
      m_surface.CanDrag(m_role == "source" && m_surface.IsEnabled());
      m_surface.AllowDrop(m_role == "target" && m_surface.IsEnabled());
      Trace("capabilities-applied");
      ObserveParentDropTarget();
    } catch (...) { Error("Could not apply native drag capabilities"); }
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
    try {
      completion = std::make_shared<DragDeferral>(); completion->Set(args.GetDeferral());
      auto ready = [args, completion, weak = get_weak()](bool allowed, std::string const& nonce) {
        if (!completion->Claim()) return;
        try {
          args.Cancel(!allowed);
          if (allowed) {
            // The data package carries a nonce only. Documents never leave the JS owner.
            args.Data().SetData(PrivateFormat, winrt::box_value(winrt::to_hstring(nonce)));
            args.Data().Properties().Insert(NonceProperty, winrt::box_value(winrt::to_hstring(nonce)));
            args.Data().RequestedOperation(Transfer::DataPackageOperation::Move);
            if (auto self = weak.get()) self->Trace("source-data-prepared");
          }
        } catch (...) { try { args.Cancel(true); } catch (...) {} completion->Complete(); throw; }
        completion->Complete();
      };
      auto broker = Broker::Find(m_owner); auto emitter = EventEmitter();
      if (!InputReady() || !broker || !emitter || m_role != "source" || !m_surface.IsEnabled()) { ready(false, ""); return; }
      m_request = broker->PrepareSource(m_window, m_generation, ready);
      Codegen::TronDragSurfaceEventEmitter::OnDragStarting event; event.scopeToken = m_scope; event.requestId = m_request; emitter->onDragStarting(std::move(event));
    } catch (...) {
      try { args.Cancel(true); } catch (...) {} if (completion) completion->Complete();
      if (!m_disposed) Cleanup(); Error("Native drag start was refused or its owner is unavailable");
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
      if (InputReady() && m_role == "target" && m_surface.IsEnabled() && broker && broker->CanTarget(nonce, m_window, m_generation)) {
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
      if (!InputReady() || m_role != "target" || !m_surface.IsEnabled() || !broker || !broker->CanTarget(nonce, m_window, m_generation)) { ready(false); return; }
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
  winrt::Microsoft::UI::Input::DragDrop::DragDropManager m_parentDropManager{nullptr}; winrt::event_token m_parentDropToken{};
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
