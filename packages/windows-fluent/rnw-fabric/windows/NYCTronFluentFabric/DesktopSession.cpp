#include "pch.h"
#include "DesktopSession.h"
#include "DesktopGeometry.h"
#include "DesktopTitleBar.h"
#include "NativeDragBroker.h"
#include <commctrl.h>
#include <winrt/Microsoft.ReactNative.Composition.h>
#include <winrt/Microsoft.UI.interop.h>
#include <JSValueWriter.h>
#include <JSValue.h>
#include <algorithm>
#include <stdexcept>

namespace nyctron::desktop {
namespace RN = winrt::Microsoft::ReactNative;
namespace UI = winrt::Microsoft::UI;
namespace Json = winrt::Windows::Data::Json;
struct DesktopSession::Window {
  std::string id, generation, closeToken;
  std::weak_ptr<DesktopSession> owner;
  HWND hwnd{};
  bool primary{false};
  TitleBarStyle titleBar{TitleBarStyle::Standard};
  // Last metrics read while the window was shown. A minimized window keeps
  // reporting these, since its content keeps the layout it had when shown.
  TitleBarMetrics titleBarMetrics{};
  RN::ReactNativeWindow surface{nullptr};
  UI::Windowing::AppWindow app{nullptr};
  winrt::event_token changed{}, closing{}, destroying{};
};
DesktopSession::DesktopSession(RN::ReactContext context, std::function<void(std::string)> changed, std::function<void(std::string)> error, std::function<void(std::string)> nativeDrag)
  : m_context(std::move(context)), m_changed(std::move(changed)), m_error(std::move(error)), m_nativeDrag(std::move(nativeDrag)), m_owner(NewToken()) {}
DesktopSession::~DesktopSession() { Dispose(); }
void DesktopSession::RequireOwner(std::string const& owner) const {
  if (m_disposed || owner != m_owner) throw std::runtime_error("Stale or disposed native desktop connection");
}
DesktopSession::Window& DesktopSession::Get(std::string const& id) {
  auto iterator = m_windows.find(id);
  if (iterator == m_windows.end()) throw std::runtime_error("Native window is not owned by this connection");
  return *iterator->second;
}
void DesktopSession::Connect(std::string const& primaryId, std::string const& componentName) {
  Json::JsonObject input; input.SetNamedValue(L"id", Json::JsonValue::CreateStringValue(winrt::to_hstring(primaryId)));
  input.SetNamedValue(L"component", Json::JsonValue::CreateStringValue(winrt::to_hstring(componentName)));
  m_primary = ReadId(input, L"id"); m_component = ReadId(input, L"component");
  const auto hwnd = reinterpret_cast<HWND>(RN::ReactCoreInjection::GetTopLevelWindowId(m_context.Properties().Handle()));
  if (!hwnd || !IsWindow(hwnd)) throw std::runtime_error("Current RNW host has no top-level native window");
  m_referenceDpi = GetDpiForWindow(hwnd);
  if (m_referenceDpi <= 0) throw std::runtime_error("Native primary-window DPI is unavailable");
  auto window = std::make_unique<Window>();
  window->id = m_primary; window->generation = NewToken(); window->primary = true; window->hwnd = hwnd;
  window->app = UI::Windowing::AppWindow::GetFromWindowId(UI::GetWindowIdFromWindow(hwnd));
  Observe(std::move(window));
  m_drag = NativeDragBroker::Create(m_owner, [weak = weak_from_this()](auto const& id, auto const& generation) {
    auto self = weak.lock(); return self && self->DragWindowIsLive(id, generation);
  }, m_nativeDrag);
}
void DesktopSession::Observe(std::unique_ptr<Window> window) {
  auto id = window->id, generation = window->generation;
  auto weak = weak_from_this(); window->owner = weak;
  auto* raw = window.get();
  m_windows.emplace(id, std::move(window));
  try {
    raw->changed = raw->app.Changed([weak](auto const&, auto const&) { if (auto self = weak.lock()) self->Changed(); });
    raw->closing = raw->app.Closing([weak, id, generation](auto const&, UI::Windowing::AppWindowClosingEventArgs const& args) {
      if (auto self = weak.lock()) { args.Cancel(true); self->CloseRequest(id, generation); }
    });
    raw->destroying = raw->app.Destroying([weak, id, generation](auto const&, auto const&) {
      if (auto self = weak.lock()) self->Destroyed(id, generation);
    });
    winrt::check_bool(SetWindowSubclass(raw->hwnd, WindowMessage, reinterpret_cast<UINT_PTR>(raw), reinterpret_cast<DWORD_PTR>(raw)));
  } catch (...) { Detach(*raw); m_windows.erase(id); throw; }
}
void DesktopSession::Detach(Window& window) noexcept {
  RemoveWindowSubclass(window.hwnd, WindowMessage, reinterpret_cast<UINT_PTR>(&window));
  try { if (window.changed.value) window.app.Changed(window.changed); } catch (...) {}
  try { if (window.closing.value) window.app.Closing(window.closing); } catch (...) {}
  try { if (window.destroying.value) window.app.Destroying(window.destroying); } catch (...) {}
}
LRESULT CALLBACK DesktopSession::WindowMessage(HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam, UINT_PTR id, DWORD_PTR ref) {
  auto* window = reinterpret_cast<Window*>(ref);
  auto owner = window->owner.lock();
  const bool layout = owner && (message == WM_SIZE || message == WM_DPICHANGED);
  // Copy the identity first: the lookup after DefSubclassProc goes through
  // the session map, never through this pointer.
  std::string windowId, generation;
  if (layout && window->titleBar == TitleBarStyle::Extended) { windowId = window->id; generation = window->generation; }
  if (message == WM_NCDESTROY) RemoveWindowSubclass(hwnd, WindowMessage, id);
  const auto result = DefSubclassProc(hwnd, message, wparam, lparam);
  // DefSubclassProc can destroy the Window; never read its pointer afterwards.
  if (!windowId.empty()) owner->TitleBarLayoutChanged(windowId, generation);
  if (owner && (message == WM_ACTIVATE || message == WM_SIZE || message == WM_MOVE || message == WM_DPICHANGED || message == WM_DISPLAYCHANGE)) owner->Changed();
  return result;
}
void DesktopSession::Changed() noexcept {
  if (m_disposed) return;
  if (m_drag) m_drag->ObserveWindows();
  if (!m_windows.count(m_primary)) return;
  try { m_changed(Snapshot()); }
  catch (std::exception const& error) { m_error(error.what()); }
  catch (winrt::hresult_error const& error) { m_error(winrt::to_string(error.message())); }
  catch (...) { m_error("Native desktop observation failed"); }
}
void DesktopSession::TitleBarLayoutChanged(std::string const& id, std::string const& generation) noexcept {
  auto found = m_windows.find(id);
  if (m_disposed || found == m_windows.end() || found->second->generation != generation || found->second->titleBar != TitleBarStyle::Extended) return;
  try { UpdateTitleBarDragRegion(found->second->app, found->second->hwnd); }
  catch (std::exception const& error) { if (m_error) m_error(error.what()); }
  catch (winrt::hresult_error const& error) { if (m_error) m_error(winrt::to_string(error.message())); }
  catch (...) { if (m_error) m_error("Native title bar drag region update failed"); }
}
bool DesktopSession::DragWindowIsLive(std::string const& id, std::string const& generation) const noexcept {
  auto found = m_windows.find(id);
  return !m_disposed && found != m_windows.end() && found->second->generation == generation && IsWindow(found->second->hwnd) && !IsIconic(found->second->hwnd);
}
void DesktopSession::StartNativeDrag(std::string const& source, std::string const& token, std::string const& request, std::function<void(std::string)> completed) {
  if (!m_drag) throw std::runtime_error("Native drag host is unavailable");
  m_drag->Start(source, token, request, std::move(completed));
}
bool DesktopSession::ResolveNativeDrop(std::string const& token, std::string const& request, bool accepted) {
  if (!m_drag) throw std::runtime_error("Native drag host is unavailable");
  return m_drag->Resolve(token, request, accepted);
}
void DesktopSession::CancelNativeDrag(std::string const& request) { if (m_drag) m_drag->Cancel(request); }
void DesktopSession::EnableNativeDragDiagnostics() {
  if (!m_drag) throw std::runtime_error("Native drag host is unavailable");
  m_drag->EnableDiagnostics();
}
void DesktopSession::CloseRequest(std::string const& id, std::string const& generation) {
  auto iterator = m_windows.find(id);
  if (m_disposed || iterator == m_windows.end() || iterator->second->generation != generation) return;
  if (iterator->second->closeToken.empty()) iterator->second->closeToken = NewToken();
  Changed();
}
void DesktopSession::Destroyed(std::string const& id, std::string const& generation) noexcept {
  auto iterator = m_windows.find(id);
  if (iterator == m_windows.end() || iterator->second->generation != generation) return;
  Detach(*iterator->second); m_windows.erase(iterator); Changed();
}
std::string DesktopSession::Snapshot() {
  Json::JsonObject root; Json::JsonArray displays, windows, closes;
  root.SetNamedValue(L"schema", Json::JsonValue::CreateNumberValue(1));
  root.SetNamedValue(L"ownerToken", Json::JsonValue::CreateStringValue(winrt::to_hstring(m_owner)));
  root.SetNamedValue(L"sequence", Json::JsonValue::CreateNumberValue(static_cast<double>(++m_sequence)));
  root.SetNamedValue(L"referenceDpi", Json::JsonValue::CreateNumberValue(m_referenceDpi));
  root.SetNamedValue(L"focusedId", Json::JsonValue::CreateNullValue());
  const auto scale = 96.0 / m_referenceDpi;
  for (auto const& display : ReadDisplays()) {
    Json::JsonObject value;
    value.SetNamedValue(L"id", Json::JsonValue::CreateStringValue(winrt::to_hstring(display.id)));
    value.SetNamedValue(L"bounds", RectJson(display.work, scale));
    value.SetNamedValue(L"pixelBounds", RectJson(display.bounds));
    value.SetNamedValue(L"pixelWorkArea", RectJson(display.work));
    value.SetNamedValue(L"primary", Json::JsonValue::CreateBooleanValue(display.primary));
    displays.Append(value);
  }
  for (auto const& [id, window] : m_windows) {
    const auto rect = WindowRect(window->hwnd);
    Json::JsonObject value;
    value.SetNamedValue(L"id", Json::JsonValue::CreateStringValue(winrt::to_hstring(id)));
    value.SetNamedValue(L"generation", Json::JsonValue::CreateStringValue(winrt::to_hstring(window->generation)));
    value.SetNamedValue(L"displayId", Json::JsonValue::CreateStringValue(winrt::to_hstring(DisplayId(MonitorFromRect(&rect, MONITOR_DEFAULTTONEAREST)))));
    value.SetNamedValue(L"rect", RectJson(rect, scale));
    value.SetNamedValue(L"pixelRect", RectJson(rect));
    value.SetNamedValue(L"dpi", Json::JsonValue::CreateNumberValue(GetDpiForWindow(window->hwnd)));
    value.SetNamedValue(L"primary", Json::JsonValue::CreateBooleanValue(window->primary));
    value.SetNamedValue(L"status", Json::JsonValue::CreateStringValue(IsIconic(window->hwnd) ? L"minimized" : L"open"));
    if (window->titleBar == TitleBarStyle::Extended && !IsIconic(window->hwnd)) window->titleBarMetrics = ReadTitleBarMetrics(window->app);
    value.SetNamedValue(L"titleBar", TitleBarJson(window->titleBar, window->titleBarMetrics, window->hwnd, scale));
    windows.Append(value);
    if (!IsIconic(window->hwnd) && GetAncestor(GetForegroundWindow(), GA_ROOT) == window->hwnd)
      root.SetNamedValue(L"focusedId", Json::JsonValue::CreateStringValue(winrt::to_hstring(id)));
    if (!window->closeToken.empty()) {
      Json::JsonObject close;
      close.SetNamedValue(L"id", Json::JsonValue::CreateStringValue(winrt::to_hstring(id)));
      close.SetNamedValue(L"generation", Json::JsonValue::CreateStringValue(winrt::to_hstring(window->generation)));
      close.SetNamedValue(L"token", Json::JsonValue::CreateStringValue(winrt::to_hstring(window->closeToken)));
      closes.Append(close);
    }
  }
  root.SetNamedValue(L"displays", displays); root.SetNamedValue(L"windows", windows); root.SetNamedValue(L"pendingCloses", closes);
  return winrt::to_string(root.Stringify());
}
void DesktopSession::Open(std::string const& request) {
  if (request.size() > 8192 || m_windows.size() >= 256) throw std::invalid_argument("Native window request exceeds its budget");
  const auto input = Json::JsonObject::Parse(winrt::to_hstring(request));
  const auto id = ReadId(input, L"id"), displayId = ReadId(input, L"displayId");
  if (m_windows.count(id)) throw std::invalid_argument("Native window ID is already open");
  const auto displays = ReadDisplays();
  if (std::none_of(displays.begin(), displays.end(), [&](auto const& d) { return d.id == displayId; })) throw std::invalid_argument("Requested native display is disconnected");
  const auto title = input.GetNamedString(L"title");
  if (title.size() > 1024) throw std::invalid_argument("Native window title exceeds its budget");
  const auto rect = ReadRect(input.GetNamedObject(L"rect"), m_referenceDpi / 96.0);
  const auto host = RN::ReactNativeHost::FromContext(m_context.Handle());
  auto surface = RN::ReactNativeWindow::CreateFromCompositor(RN::Composition::CompositionUIService::GetCompositor(host.InstanceSettings().Properties()));
  try {
    auto window = std::make_unique<Window>();
    window->id = id; window->generation = NewToken(); window->surface = surface; window->app = surface.AppWindow();
    window->hwnd = UI::GetWindowFromWindowId(window->app.Id()); window->app.Title(title);
    RN::ReactViewOptions options; options.ComponentName(winrt::to_hstring(m_component));
    options.InitialProps([id](RN::IJSValueWriter const& writer) { RN::WriteValue(writer, RN::JSValueObject{{"windowId", id}}); });
    surface.ReactNativeIsland().ReactViewHost(RN::ReactCoreInjection::MakeViewHost(host, options));
    window->app.MoveAndResize({rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top});
    Observe(std::move(window)); surface.AppWindow().Show(true); Changed();
  } catch (...) {
    auto iterator = m_windows.find(id); if (iterator != m_windows.end()) { Detach(*iterator->second); m_windows.erase(iterator); }
    surface.Close(); throw;
  }
}
void DesktopSession::Move(std::string const& id, std::string const& request) {
  if (request.size() > 4096) throw std::invalid_argument("Native window movement exceeds its budget");
  auto const input = Json::JsonObject::Parse(winrt::to_hstring(request));
  const auto displayId = ReadId(input, L"displayId"); const auto displays = ReadDisplays();
  if (std::none_of(displays.begin(), displays.end(), [&](auto const& d) { return d.id == displayId; })) throw std::invalid_argument("Requested native display is disconnected");
  const auto rect = ReadRect(input.GetNamedObject(L"rect"), m_referenceDpi / 96.0);
  auto& window = Get(id);
  window.app.MoveAndResize({rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top});
  // Layout replay raises each native surface bottom-to-top without forcing
  // foreground activation; the caller restores the saved focus separately.
  if (input.GetNamedBoolean(L"raise", false)) window.app.MoveInZOrderAtTop();
}
void DesktopSession::Focus(std::string const& id) {
  auto& window = Get(id); window.app.Show(true); window.app.MoveInZOrderAtTop();
  if (!SetForegroundWindow(window.hwnd) && GetForegroundWindow() != window.hwnd) throw std::runtime_error("Windows refused foreground activation");
}
void DesktopSession::Minimize(std::string const& id) { Get(id).app.Presenter().as<UI::Windowing::OverlappedPresenter>().Minimize(); }
void DesktopSession::Restore(std::string const& id) { Get(id).app.Presenter().as<UI::Windowing::OverlappedPresenter>().Restore(); }
void DesktopSession::SetTitleBar(std::string const& id, std::string const& style) {
  const auto next = ParseTitleBarStyle(style);
  auto& window = Get(id);
  const auto previous = window.titleBar;
  try { ApplyTitleBarStyle(window.app, window.hwnd, next); }
  catch (...) {
    // Put back the last applied style; the original failure is the one reported.
    try { ApplyTitleBarStyle(window.app, window.hwnd, previous); } catch (...) {}
    throw;
  }
  window.titleBar = next;
  // Standard reserves nothing. An Extended window minimized right now reads
  // its metrics when next shown, and reports zeros until then.
  window.titleBarMetrics = next == TitleBarStyle::Extended && !IsIconic(window.hwnd) ? ReadTitleBarMetrics(window.app) : TitleBarMetrics{};
}
void DesktopSession::RequestClose(std::string const& id) { SendMessageW(Get(id).hwnd, WM_CLOSE, 0, 0); }
void DesktopSession::ResolveClose(std::string const& id, std::string const& generation, std::string const& token, bool accepted) {
  auto& window = Get(id);
  if (window.generation != generation || window.closeToken.empty() || window.closeToken != token) throw std::runtime_error("Stale native close request");
  window.closeToken.clear();
  if (!accepted) return;
  auto surface = window.surface; auto app = window.app; const bool primary = window.primary;
  Detach(window); m_windows.erase(id);
  if (primary) app.Destroy(); else surface.Close();
  Changed();
}
void DesktopSession::Dispose() noexcept {
  if (m_disposed) return; m_disposed = true;
  if (m_drag) { m_drag->Dispose(); m_drag.reset(); }
  for (auto const& [id, window] : m_windows) Detach(*window);
  for (auto const& [id, window] : m_windows) {
    if (!window->primary) { try { window->surface.Close(); } catch (...) {} }
  }
  m_windows.clear(); m_changed = nullptr; m_error = nullptr; m_nativeDrag = nullptr;
}
}
