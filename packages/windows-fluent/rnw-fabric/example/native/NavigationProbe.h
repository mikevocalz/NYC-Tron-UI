#pragma once
// Private packaged-example observer. It never changes layout, accessibility,
// focus, window activation or input. All visual access belongs to the UI thread.
#include <windows.h>
#include <commctrl.h>
#pragma comment(lib, "Comctl32.lib")
#include <unknwn.h>
#include <inspectable.h>
#include <winrt/Microsoft.ReactNative.h>
#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.Content.h>
#include <winrt/Microsoft.UI.Interop.h>
#include <winrt/Microsoft.UI.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.Automation.h>
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Microsoft.UI.Xaml.Media.h>
#include <winrt/Windows.Data.Json.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Graphics.h>
#include <winrt/Windows.Storage.h>
#include <algorithm>
#include <atomic>
#include <cmath>
#include <cstdint>
#include <limits>
#include <memory>
#include <string>
#include <unordered_set>
#include <vector>

namespace nyctron::fixture {
// Private ABI-only interface, deliberately absent from public package metadata.
// Keep this definition identical to the component's opt-in hook.
struct __declspec(uuid("91bd88af-7765-4adb-8891-f5436ca14c2f")) NavigationProbeHook : ::IUnknown {
  virtual HRESULT STDMETHODCALLTYPE Register(::IInspectable* navigation, ::IInspectable* island,
      ::IInspectable* view, ::IInspectable** ticket) noexcept = 0;
  virtual HRESULT STDMETHODCALLTYPE Unregister(::IInspectable* ticket) noexcept = 0;
};

namespace RN = winrt::Microsoft::ReactNative;
namespace XC = winrt::Microsoft::UI::Xaml::Controls;
namespace X = winrt::Microsoft::UI::Xaml;
namespace Content = winrt::Microsoft::UI::Content;
namespace Json = winrt::Windows::Data::Json;
using Object = winrt::Windows::Foundation::IInspectable;
using Ticket = winrt::Windows::Foundation::Collections::PropertySet;
using Rect = winrt::Windows::Foundation::Rect;
using PixelRect = winrt::Windows::Graphics::RectInt32;
using View = RN::Composition::ContentIslandComponentView;
constexpr uint32_t RegistryLimit = 8;
constexpr uint32_t GenerationLimit = 128;
constexpr uint32_t NodeLimit = 512;
constexpr uint32_t DepthLimit = 24;
constexpr uint32_t RequestLimit = 128;
constexpr uint32_t RequestBytes = 2048;
constexpr uint32_t ResponseBytes = 8192;
constexpr wchar_t MessageName[] = L"NYCTron.Example.NavigationProbe.v1";

inline RN::IReactPropertyName HookKey() {
  return RN::ReactPropertyBagHelper::GetName(
      RN::ReactPropertyBagHelper::GetNamespace(L"NYCTron.Example.NavigationProbe"), L"hook.v1");
}
struct Unavailable { wchar_t const* code; };
[[noreturn]] inline void Refuse(wchar_t const* code) { throw Unavailable{code}; }
inline uintptr_t Identity(Object const& object) {
  if (!object) Refuse(L"object-unavailable");
  return reinterpret_cast<uintptr_t>(object.as<::IUnknown>().get());
}
template<class T> inline T Borrow(::IInspectable* raw) {
  if (!raw) Refuse(L"registration-object-unavailable");
  Object object{nullptr};
  winrt::copy_from_abi(object, raw);
  return object.as<T>();
}
inline std::wstring Decimal(uint64_t value) { return std::to_wstring(value); }
inline void Text(Json::JsonObject const& object, wchar_t const* key, winrt::hstring const& value) {
  object.SetNamedValue(key, Json::JsonValue::CreateStringValue(value));
}
inline void Number(Json::JsonObject const& object, wchar_t const* key, double value) {
  if (!std::isfinite(value)) Refuse(L"nonfinite-record");
  object.SetNamedValue(key, Json::JsonValue::CreateNumberValue(value));
}
inline void Boolean(Json::JsonObject const& object, wchar_t const* key, bool value) {
  object.SetNamedValue(key, Json::JsonValue::CreateBooleanValue(value));
}
inline uint32_t Integer(Json::JsonObject const& object, wchar_t const* key, uint32_t maximum) {
  const auto value = object.GetNamedNumber(key);
  if (!std::isfinite(value) || value < 0 || value > maximum || std::floor(value) != value)
    Refuse(L"request-integer-invalid");
  return static_cast<uint32_t>(value);
}
struct Handle {
  HANDLE value{INVALID_HANDLE_VALUE};
  ~Handle() { if (value != INVALID_HANDLE_VALUE) CloseHandle(value); }
  Handle(Handle const&) = delete;
  Handle& operator=(Handle const&) = delete;
  explicit Handle(HANDLE raw) : value(raw) {}
};
inline std::string ReadComplete(std::wstring const& path, uint32_t limit) {
  Handle file(CreateFileW(path.c_str(), GENERIC_READ, FILE_SHARE_READ, nullptr, OPEN_EXISTING,
      FILE_ATTRIBUTE_NORMAL | FILE_FLAG_OPEN_REPARSE_POINT, nullptr));
  if (file.value == INVALID_HANDLE_VALUE) Refuse(L"request-file-unavailable");
  BY_HANDLE_FILE_INFORMATION before{}, after{};
  if (!GetFileInformationByHandle(file.value, &before) ||
      (before.dwFileAttributes & (FILE_ATTRIBUTE_REPARSE_POINT | FILE_ATTRIBUTE_DIRECTORY)) ||
      before.nFileSizeHigh != 0 || before.nFileSizeLow == 0 || before.nFileSizeLow > limit)
    Refuse(L"request-file-invalid");
  std::string bytes(before.nFileSizeLow, '\0');
  DWORD read = 0;
  if (!ReadFile(file.value, bytes.data(), static_cast<DWORD>(bytes.size()), &read, nullptr) ||
      read != bytes.size() || !GetFileInformationByHandle(file.value, &after) ||
      after.nFileSizeHigh != before.nFileSizeHigh || after.nFileSizeLow != before.nFileSizeLow ||
      after.nFileIndexHigh != before.nFileIndexHigh || after.nFileIndexLow != before.nFileIndexLow ||
      CompareFileTime(&before.ftLastWriteTime, &after.ftLastWriteTime) != 0)
    Refuse(L"request-file-incomplete");
  return bytes;
}
inline void Publish(std::wstring const& path, Json::JsonObject const& object) {
  const auto bytes = winrt::to_string(object.Stringify()) + "\n";
  if (bytes.size() > ResponseBytes) Refuse(L"response-byte-limit");
  const auto temporary = path + L".tmp";
  {
    Handle file(CreateFileW(temporary.c_str(), GENERIC_WRITE, 0, nullptr, CREATE_NEW,
        FILE_ATTRIBUTE_NORMAL | FILE_FLAG_WRITE_THROUGH, nullptr));
    if (file.value == INVALID_HANDLE_VALUE) Refuse(L"response-file-create-failed");
    DWORD written = 0;
    if (!WriteFile(file.value, bytes.data(), static_cast<DWORD>(bytes.size()), &written, nullptr) ||
        written != bytes.size() || !FlushFileBuffers(file.value))
      Refuse(L"response-file-write-failed");
  }
  // No replacement: a sequence is immutable once published. Readers only open
  // the final name, after the complete writer has closed.
  if (!MoveFileExW(temporary.c_str(), path.c_str(), MOVEFILE_WRITE_THROUGH))
    Refuse(L"response-file-publish-failed");
}
inline bool FiniteRect(Rect const& rect) {
  const double right = static_cast<double>(rect.X) + rect.Width;
  const double bottom = static_cast<double>(rect.Y) + rect.Height;
  return std::isfinite(rect.X) && std::isfinite(rect.Y) &&
      std::isfinite(rect.Width) && std::isfinite(rect.Height) &&
      rect.Width > 0 && rect.Height > 0 && std::isfinite(right) && std::isfinite(bottom) &&
      std::abs(right) <= std::numeric_limits<float>::max() &&
      std::abs(bottom) <= std::numeric_limits<float>::max();
}
inline bool ValidPixels(PixelRect const& rect) {
  const int64_t right = static_cast<int64_t>(rect.X) + rect.Width;
  const int64_t bottom = static_cast<int64_t>(rect.Y) + rect.Height;
  return rect.Width > 0 && rect.Height > 0 &&
      right >= INT32_MIN && right <= INT32_MAX && bottom >= INT32_MIN && bottom <= INT32_MAX;
}
inline bool Same(PixelRect const& a, PixelRect const& b) {
  return a.X == b.X && a.Y == b.Y && a.Width == b.Width && a.Height == b.Height;
}
inline bool Contains(PixelRect const& outer, PixelRect const& inner) {
  return inner.X >= outer.X && inner.Y >= outer.Y &&
      static_cast<int64_t>(inner.X) + inner.Width <= static_cast<int64_t>(outer.X) + outer.Width &&
      static_cast<int64_t>(inner.Y) + inner.Height <= static_cast<int64_t>(outer.Y) + outer.Height;
}
inline Json::JsonObject Pixels(PixelRect const& rect) {
  Json::JsonObject object;
  Number(object, L"x", rect.X); Number(object, L"y", rect.Y);
  Number(object, L"left", rect.X); Number(object, L"top", rect.Y);
  Number(object, L"width", rect.Width); Number(object, L"height", rect.Height);
  Number(object, L"right", static_cast<int64_t>(rect.X) + rect.Width);
  Number(object, L"bottom", static_cast<int64_t>(rect.Y) + rect.Height);
  return object;
}

class Observer;
struct WindowLease {
  std::shared_ptr<Observer> observer;
  HWND hwnd{};
};
class Observer : public std::enable_shared_from_this<Observer> {
  struct Entry {
    uint32_t generation{};
    int32_t tag{};
    Ticket ticket{nullptr}; // Opaque identity only: never contains a visual.
    winrt::weak_ref<XC::NavigationView> navigation;
    winrt::weak_ref<Content::ContentIsland> island;
    winrt::weak_ref<View> view;
    winrt::weak_ref<Content::ChildSiteLink> site;
  };
  struct Binding {
    uint32_t generation{};
    winrt::weak_ref<X::XamlRoot> root;
    winrt::weak_ref<XC::Button> toggle;
    winrt::weak_ref<XC::AnimatedIcon> icon;
    uintptr_t rootIdentity{}, toggleIdentity{}, iconIdentity{};
  };
  struct Visuals {
    XC::NavigationView navigation{nullptr};
    X::XamlRoot root{nullptr};
    Content::ContentIsland island{nullptr};
    Content::ChildSiteLink site{nullptr};
    View view{nullptr};
    XC::Button toggle{nullptr};
    XC::AnimatedIcon icon{nullptr};
    uint32_t nodes{}, depth{}, toggles{}, icons{};
  };
  std::wstring m_prefix;
  winrt::hstring m_revision, m_session, m_creation;
  DWORD m_pid{};
  std::atomic<DWORD> m_uiThread{0};
  HWND m_hwnd{};
  UINT m_message{};
  WindowLease* m_lease{};
  std::vector<Entry> m_entries;
  Binding m_binding;
  uint32_t m_generation{}, m_lastSequence{};
  bool m_readyPublished{}, m_closed{};
  std::atomic<bool> m_registrationInvalid{false};
  wchar_t const* m_registrationFailure{};
 public:
  explicit Observer(winrt::hstring revision) : m_revision(std::move(revision)) {
    m_pid = GetCurrentProcessId();
    FILETIME created{}, exited{}, kernel{}, user{};
    if (!GetProcessTimes(GetCurrentProcess(), &created, &exited, &kernel, &user))
      Refuse(L"process-creation-unavailable");
    const uint64_t creation = (static_cast<uint64_t>(created.dwHighDateTime) << 32) | created.dwLowDateTime;
    m_creation = winrt::hstring(Decimal(creation));
    GUID session{};
    winrt::check_hresult(CoCreateGuid(&session));
    wchar_t text[40]{};
    if (StringFromGUID2(session, text, 40) != 39) Refuse(L"session-unavailable");
    m_session = text;
    const auto folder = winrt::Windows::Storage::ApplicationData::Current().LocalFolder().Path();
    m_prefix = std::wstring(folder.c_str(), folder.size()) + L"\\nyctron-navigation-probe-" +
        Decimal(m_pid) + L"-" + Decimal(creation);
    m_message = RegisterWindowMessageW(MessageName);
    if (!m_message) Refuse(L"message-registration-failed");
  }
  Json::JsonObject Header(uint32_t sequence, uint32_t phase) const {
    Json::JsonObject object;
    Number(object, L"schemaVersion", 1);
    Text(object, L"sourceRevision", m_revision);
    Text(object, L"session", m_session);
    Text(object, L"creationFileTime", m_creation);
    Number(object, L"processId", m_pid);
    Text(object, L"windowHandle", winrt::to_hstring(static_cast<int64_t>(reinterpret_cast<intptr_t>(m_hwnd))));
    Number(object, L"threadId", m_uiThread);
    Number(object, L"sequence", sequence);
    Number(object, L"phase", phase);
    Boolean(object, L"complete", true);
    return object;
  }
  void Ready(wchar_t const* failure = nullptr) noexcept {
    if (m_readyPublished) return;
    try {
      auto object = Header(0, 0);
      Text(object, L"status", failure ? L"unavailable" : L"ready");
      if (failure) Text(object, L"failure", failure);
      Number(object, L"messageId", m_message);
      Number(object, L"requestLimit", RequestLimit);
      Number(object, L"requestBytes", RequestBytes);
      Number(object, L"responseBytes", ResponseBytes);
      Publish(m_prefix + L".ready.json", object);
      m_readyPublished = true;
    } catch (...) {
      // Availability remains explicitly absent to the test. App behavior wins.
    }
  }
  void RequireThread() const {
    if (!m_uiThread || GetCurrentThreadId() != m_uiThread) Refuse(L"wrong-ui-thread");
  }
  void RequireOwner() const {
    RequireThread();
    DWORD owner = 0;
    if (m_closed || !m_hwnd || !IsWindow(m_hwnd) ||
        GetWindowThreadProcessId(m_hwnd, &owner) != m_uiThread || owner != m_pid)
      Refuse(L"owner-window-unavailable");
  }
  void Register(Object const& navigationObject, Object const& islandObject,
      Object const& viewObject, ::IInspectable** ticketOut) {
    if (!ticketOut) Refuse(L"ticket-output-unavailable");
    *ticketOut = nullptr;
    const auto navigation = navigationObject.as<XC::NavigationView>();
    const auto island = islandObject.as<Content::ContentIsland>();
    const auto view = viewObject.as<View>();
    const auto context = view.ReactContext();
    if (!context.UIDispatcher().HasThreadAccess()) Refuse(L"wrong-ui-thread");
    const DWORD thread = GetCurrentThreadId();
    DWORD expectedThread = 0;
    if (!m_uiThread.compare_exchange_strong(expectedThread, thread,
          std::memory_order_acq_rel, std::memory_order_acquire) && expectedThread != thread)
      Refuse(L"wrong-ui-thread");
    const auto hwnd = reinterpret_cast<HWND>(RN::ReactCoreInjection::GetTopLevelWindowId(context.Properties()));
    DWORD process = 0;
    if (!hwnd || !IsWindow(hwnd) || GetWindowThreadProcessId(hwnd, &process) != thread || process != m_pid ||
        (m_hwnd && m_hwnd != hwnd) || m_closed) Refuse(L"owner-window-unavailable");
    m_hwnd = hwnd;
    const auto site = view.ChildSiteLink();
    if (!site) Refuse(L"component-not-mounted");
    if (m_registrationInvalid.load(std::memory_order_acquire) || m_entries.size() >= RegistryLimit || m_generation >= GenerationLimit)
      Refuse(L"registry-limit-or-prior-failure");
    const auto navIdentity = Identity(navigation);
    for (auto const& entry : m_entries) {
      const auto registered = entry.navigation.get();
      if (entry.tag == view.Tag() || (registered && Identity(registered) == navIdentity))
        Refuse(L"registry-duplicate");
    }
    Ticket ticket;
    const auto generation = ++m_generation;
    ticket.Insert(L"generation", winrt::box_value(generation));
    Entry entry{generation, view.Tag(), ticket, winrt::make_weak(navigation),
        winrt::make_weak(island), winrt::make_weak(view), winrt::make_weak(site)};
    m_entries.push_back(entry);
    try {
      if (!m_lease) {
        auto lease = std::make_unique<WindowLease>();
        lease->observer = shared_from_this(); lease->hwnd = hwnd;
        if (!SetWindowSubclass(hwnd, WindowMessage, reinterpret_cast<UINT_PTR>(this),
            reinterpret_cast<DWORD_PTR>(lease.get()))) Refuse(L"window-observer-unavailable");
        m_lease = lease.release();
      }
      ticket.as<::IInspectable>().copy_to(ticketOut);
      Ready();
    } catch (...) {
      m_entries.erase(std::remove_if(m_entries.begin(), m_entries.end(),
          [generation](auto const& current) { return current.generation == generation; }), m_entries.end());
      throw;
    }
  }
  void RegistrationFailed(wchar_t const* code) noexcept {
    // Even a wrong-thread ABI caller permanently invalidates this fixture.
    // Only this atomic flag crosses threads; visual/registry state stays owned.
    m_registrationInvalid.store(true, std::memory_order_release);
    if (m_uiThread && GetCurrentThreadId() == m_uiThread) {
      m_registrationFailure = code;
      Ready(code);
    }
  }
  void Unregister(Object const& ticket) {
    RequireThread();
    const auto identity = Identity(ticket);
    const auto iterator = std::find_if(m_entries.begin(), m_entries.end(),
        [identity](auto const& entry) { return Identity(entry.ticket) == identity; });
    if (iterator == m_entries.end()) Refuse(L"registration-ticket-stale");
    const auto generation = winrt::unbox_value<uint32_t>(iterator->ticket.Lookup(L"generation"));
    if (generation != iterator->generation) Refuse(L"registration-ticket-invalid");
    if (m_binding.generation == generation) m_binding = {};
    m_entries.erase(iterator);
  }
  void Close() noexcept {
    m_closed = true;
    m_binding = {};
    m_entries.clear();
    m_lease = nullptr;
  }
  static LRESULT CALLBACK WindowMessage(HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam,
      UINT_PTR id, DWORD_PTR data) noexcept {
    auto* lease = reinterpret_cast<WindowLease*>(data);
    if (!lease) return DefSubclassProc(hwnd, message, wparam, lparam);
    const auto observer = lease->observer;
    if (message == WM_NCDESTROY) {
      RemoveWindowSubclass(hwnd, WindowMessage, id);
      observer->Close();
      delete lease;
      return DefSubclassProc(hwnd, message, wparam, lparam);
    }
    if (message == observer->m_message) {
      if (hwnd == lease->hwnd && wparam > 0 && wparam <= RequestLimit && (lparam == 1 || lparam == 2))
        observer->Request(static_cast<uint32_t>(wparam), static_cast<uint32_t>(lparam));
      return 0;
    }
    return DefSubclassProc(hwnd, message, wparam, lparam);
  }
 private:
  Visuals Find(Entry const& entry) {
    Visuals result;
    result.navigation = entry.navigation.get(); result.island = entry.island.get();
    result.view = entry.view.get(); result.site = entry.site.get();
    Check(entry, result);
    struct Node { X::DependencyObject value{nullptr}; int32_t parent{-1}; uint32_t depth{}; };
    std::vector<Node> nodes{{result.navigation, -1, 0}};
    std::unordered_set<uintptr_t> seen{Identity(result.navigation)};
    int32_t toggle = -1;
    for (size_t index = 0; index < nodes.size(); ++index) {
      const auto node = nodes[index];
      result.depth = std::max(result.depth, node.depth);
      if (auto button = node.value.try_as<XC::Button>()) {
        if (button.Name() == L"TogglePaneButton") { ++result.toggles; toggle = static_cast<int32_t>(index); }
      }
      const int32_t count = X::Media::VisualTreeHelper::GetChildrenCount(node.value);
      if (count < 0) Refuse(L"visual-child-count-invalid");
      for (int32_t child = 0; child < count; ++child) {
        if (nodes.size() >= NodeLimit) Refuse(L"visual-node-limit");
        if (node.depth >= DepthLimit) Refuse(L"visual-depth-limit");
        const auto value = X::Media::VisualTreeHelper::GetChild(node.value, child);
        if (!value || !seen.insert(Identity(value)).second) Refuse(L"visual-identity-duplicate");
        nodes.push_back({value, static_cast<int32_t>(index), node.depth + 1});
      }
    }
    result.nodes = static_cast<uint32_t>(nodes.size());
    if (result.toggles != 1) Refuse(result.toggles ? L"toggle-ambiguous" : L"toggle-unavailable");
    result.toggle = nodes[toggle].value.as<XC::Button>();
    for (size_t index = 0; index < nodes.size(); ++index) {
      auto icon = nodes[index].value.try_as<XC::AnimatedIcon>();
      if (!icon || icon.Name() != L"Icon") continue;
      int32_t parent = nodes[index].parent;
      while (parent >= 0 && parent != toggle) parent = nodes[parent].parent;
      if (parent == toggle) { ++result.icons; result.icon = icon; }
    }
    if (result.icons != 1) Refuse(result.icons ? L"icon-ambiguous" : L"icon-unavailable");
    return result;
  }
  void Check(Entry const& entry, Visuals& values) {
    RequireOwner();
    if (m_registrationInvalid.load(std::memory_order_acquire))
      Refuse(m_registrationFailure ? m_registrationFailure : L"registration-failed");
    if (m_entries.size() != 1 || m_entries.front().generation != entry.generation ||
        Identity(m_entries.front().ticket) != Identity(entry.ticket))
      Refuse(L"component-unmounted-or-changed");
    if (!values.navigation || !values.island || !values.view || !values.site ||
        !values.view.ReactContext().UIDispatcher().HasThreadAccess() || values.view.Tag() != entry.tag)
      Refuse(L"component-unmounted-or-changed");
    const auto currentSite = values.view.ChildSiteLink();
    if (!currentSite || currentSite.IsClosed() || values.site.IsClosed() ||
        Identity(currentSite) != Identity(values.site))
      Refuse(L"component-unmounted-or-changed");
    if (values.island.IsClosed() || !values.island.IsConnected()) Refuse(L"island-unavailable");
    const auto root = values.navigation.XamlRoot();
    if (!root || !root.IsHostVisible() || Identity(root.ContentIsland()) != Identity(values.island))
      Refuse(L"xaml-root-unavailable");
    if (values.root && Identity(values.root) != Identity(root)) Refuse(L"xaml-root-changed");
    values.root = root;
    const auto window = winrt::Microsoft::UI::GetWindowFromWindowId(root.ContentIslandEnvironment().AppWindowId());
    if (!window || window != m_hwnd) Refuse(L"xaml-owner-mismatch");
    if (!values.navigation.IsLoaded() ||
        X::Automation::AutomationProperties::GetName(values.navigation) != L"NYC-Tron")
      Refuse(L"navigation-unavailable");
  }
  void Ancestry(X::FrameworkElement const& element, X::FrameworkElement const& ancestor) {
    auto current = element.as<X::DependencyObject>();
    std::unordered_set<uintptr_t> seen;
    for (uint32_t depth = 0; depth <= DepthLimit; ++depth) {
      if (!current || !seen.insert(Identity(current)).second) Refuse(L"visual-ancestry-invalid");
      if (auto visual = current.try_as<X::UIElement>()) {
        if (visual.Visibility() != X::Visibility::Visible || !std::isfinite(visual.Opacity()) || visual.Opacity() <= 0)
          Refuse(L"visual-not-visible");
      }
      if (Identity(current) == Identity(ancestor)) return;
      current = X::Media::VisualTreeHelper::GetParent(current);
    }
    Refuse(L"visual-ancestry-depth-limit");
  }
  PixelRect Bounds(X::FrameworkElement const& element, Visuals const& values) {
    if (!element.IsLoaded() || Identity(element.XamlRoot()) != Identity(values.root))
      Refuse(L"visual-root-changed");
    const double width = element.ActualWidth(), height = element.ActualHeight();
    if (!std::isfinite(width) || !std::isfinite(height) || width <= 0 || height <= 0 ||
        width > std::numeric_limits<float>::max() || height > std::numeric_limits<float>::max())
      Refuse(L"visual-size-invalid");
    Rect local{0, 0, static_cast<float>(width), static_cast<float>(height)};
    if (!FiniteRect(local)) Refuse(L"visual-size-invalid");
    // nullptr targets the private XAML island root, including NavigationView's
    // own RTL transform. Explicit navigation/root.Content targets omit it.
    const auto transformed = element.TransformToVisual(nullptr).TransformBounds(local);
    if (!FiniteRect(transformed)) Refuse(L"visual-transform-invalid");
    if (values.island.IsClosed() || !values.island.IsConnected()) Refuse(L"island-unavailable");
    const auto converter = values.root.CoordinateConverter();
    if (!converter) Refuse(L"coordinate-converter-unavailable");
    const auto pixels = converter.ConvertLocalToScreen(transformed);
    if (!ValidPixels(pixels)) Refuse(L"screen-bounds-invalid");
    return pixels;
  }
  Json::JsonObject Snapshot(uint32_t phase, uint32_t expectedGeneration) {
    RequireOwner();
    if (m_registrationInvalid.load(std::memory_order_acquire))
      Refuse(m_registrationFailure ? m_registrationFailure : L"registration-failed");
    if (m_entries.size() != 1) Refuse(m_entries.empty() ? L"navigation-registration-missing" : L"navigation-registration-ambiguous");
    // Copy the weak entry and opaque ticket before provider calls. Reentrant
    // unmount/removal cannot invalidate a vector reference; Check still rejects
    // a removed/replaced generation before accepting any snapshot.
    const auto entry = m_entries.front();
    if ((phase == 1 && (m_binding.generation || expectedGeneration)) ||
        (phase == 2 && (!m_binding.generation || expectedGeneration != entry.generation ||
          m_binding.generation != entry.generation))) Refuse(L"binding-generation-mismatch");
    auto values = Find(entry); // Complete bounded search; never select after truncation.
    Ancestry(values.icon, values.toggle);
    Ancestry(values.toggle, values.navigation);
    if (phase == 2 &&
        (Identity(values.root) != m_binding.rootIdentity ||
         Identity(values.toggle) != m_binding.toggleIdentity || Identity(values.icon) != m_binding.iconIdentity ||
         !m_binding.root.get() || !m_binding.toggle.get() || !m_binding.icon.get()))
      Refuse(L"template-identity-changed");
    const auto firstNavigation = Bounds(values.navigation, values);
    const auto firstToggle = Bounds(values.toggle, values);
    const auto firstIcon = Bounds(values.icon, values);
    Check(entry, values);
    Ancestry(values.icon, values.toggle); Ancestry(values.toggle, values.navigation);
    const auto navigation = Bounds(values.navigation, values);
    const auto toggle = Bounds(values.toggle, values);
    const auto icon = Bounds(values.icon, values);
    Check(entry, values);
    if (!Contains(navigation, toggle) || !Contains(toggle, icon)) Refuse(L"screen-bounds-outside-container");
    const bool stable = Same(firstNavigation, navigation) && Same(firstToggle, toggle) && Same(firstIcon, icon);
    if (phase == 1) {
      m_binding = {entry.generation, winrt::make_weak(values.root), winrt::make_weak(values.toggle),
          winrt::make_weak(values.icon), Identity(values.root), Identity(values.toggle), Identity(values.icon)};
    }
    Json::JsonObject object, binding, counts;
    Number(binding, L"generation", entry.generation); Number(binding, L"componentTag", entry.tag);
    // These role IDs are local to the generation. Actual object identity is
    // checked in native code; memory addresses are never serialized.
    Number(binding, L"navigation", 1); Number(binding, L"root", 2);
    Number(binding, L"toggle", 3); Number(binding, L"icon", 4);
    Boolean(binding, L"identityVerified", true);
    Number(counts, L"registryEntries", m_entries.size()); Number(counts, L"nodesDiscovered", values.nodes);
    Number(counts, L"nodesRead", values.nodes); Number(counts, L"maxDepth", values.depth);
    Number(counts, L"toggles", values.toggles); Number(counts, L"icons", values.icons);
    Boolean(counts, L"complete", true);
    object.SetNamedValue(L"binding", binding); object.SetNamedValue(L"counts", counts);
    object.SetNamedValue(L"navigation", Pixels(navigation));
    object.SetNamedValue(L"toggle", Pixels(toggle)); object.SetNamedValue(L"icon", Pixels(icon));
    Boolean(object, L"stable", stable);
    Text(object, L"coordinateContract", L"same-XamlRoot-RectInt32-physical-screen");
    Text(object, L"stabilityScope", L"matching-sequential-observations-not-atomic-or-render-complete");
    return object;
  }
  void Request(uint32_t sequence, uint32_t phase) noexcept {
    if (!m_uiThread || GetCurrentThreadId() != m_uiThread || sequence != m_lastSequence + 1) return;
    try {
      RequireOwner();
      const auto bytes = ReadComplete(m_prefix + L".request-" + Decimal(sequence) + L".json", RequestBytes);
      const auto request = Json::JsonObject::Parse(winrt::to_hstring(bytes));
      if (Integer(request, L"schemaVersion", 1) != 1 || Integer(request, L"processId", UINT32_MAX) != m_pid ||
          Integer(request, L"sequence", RequestLimit) != sequence || Integer(request, L"phase", 2) != phase ||
          request.GetNamedString(L"sourceRevision") != m_revision || request.GetNamedString(L"session") != m_session ||
          request.GetNamedString(L"creationFileTime") != m_creation ||
          request.GetNamedString(L"windowHandle") != winrt::to_hstring(static_cast<int64_t>(reinterpret_cast<intptr_t>(m_hwnd))))
        Refuse(L"request-identity-mismatch");
      const auto generation = Integer(request, L"generation", GenerationLimit);
      ++m_lastSequence; // One authenticated observation attempt; no retries or replacement.
      auto response = Header(sequence, phase);
      try {
        response.SetNamedValue(L"snapshot", Snapshot(phase, generation));
        Text(response, L"status", L"observed");
      } catch (Unavailable const& error) {
        Text(response, L"status", L"unavailable"); Text(response, L"failure", error.code);
      } catch (...) {
        Text(response, L"status", L"unavailable"); Text(response, L"failure", L"native-observation-failed");
      }
      Publish(m_prefix + L".response-" + Decimal(sequence) + L".json", response);
    } catch (...) {
      // Malformed/incomplete input, stale sequences and IO failures never
      // affect app behavior. The driver fails if no fresh complete reply exists.
    }
  }
};

struct Hook final : winrt::implements<Hook, Object, NavigationProbeHook> {
  std::shared_ptr<Observer> observer;
  explicit Hook(std::shared_ptr<Observer> value) : observer(std::move(value)) {}
  HRESULT STDMETHODCALLTYPE Register(::IInspectable* navigation, ::IInspectable* island,
      ::IInspectable* view, ::IInspectable** ticket) noexcept override {
    if (ticket) *ticket = nullptr;
    try {
      observer->Register(Borrow<Object>(navigation), Borrow<Object>(island), Borrow<Object>(view), ticket);
      return S_OK;
    } catch (Unavailable const& error) { observer->RegistrationFailed(error.code); return E_FAIL; }
    catch (...) { observer->RegistrationFailed(L"registration-failed"); return E_FAIL; }
  }
  HRESULT STDMETHODCALLTYPE Unregister(::IInspectable* ticket) noexcept override {
    try { observer->Unregister(Borrow<Object>(ticket)); return S_OK; }
    catch (Unavailable const& error) { observer->RegistrationFailed(error.code); return E_FAIL; }
    catch (...) { observer->RegistrationFailed(L"unregistration-failed"); return E_FAIL; }
  }
};
inline void ConfigureNavigationProbe(RN::ReactInstanceSettings const& settings, winrt::hstring const& revision) noexcept {
  try {
    if (revision.size() != 40 || std::any_of(revision.begin(), revision.end(),
        [](wchar_t c) { return !((c >= L'0' && c <= L'9') || (c >= L'a' && c <= L'f')); }))
      return;
    auto observer = std::make_shared<Observer>(revision);
    settings.Properties().Set(HookKey(), winrt::make<Hook>(std::move(observer)));
  } catch (...) {
    // The example remains an ordinary app. The fixture requires its own
    // matching ready record and fails explicitly if configuration was absent.
  }
}
} // namespace nyctron::fixture
