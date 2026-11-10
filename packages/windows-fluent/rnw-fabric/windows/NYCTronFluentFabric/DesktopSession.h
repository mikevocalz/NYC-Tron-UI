#pragma once
#include <ReactContext.h>
#include <winrt/Microsoft.ReactNative.h>
#include <winrt/Microsoft.UI.Windowing.h>
#include <functional>
#include <map>
#include <memory>
#include <string>

namespace nyctron::desktop {
class NativeDragBroker;
// All state and HWND operations belong to the React UI dispatcher.
class DesktopSession : public std::enable_shared_from_this<DesktopSession> {
 public:
  DesktopSession(winrt::Microsoft::ReactNative::ReactContext context,
    std::function<void(std::string)> changed, std::function<void(std::string)> error, std::function<void(std::string)> nativeDrag);
  ~DesktopSession();
  void Connect(std::string const& primaryId, std::string const& componentName);
  void RequireOwner(std::string const& owner) const;
  std::string Snapshot();
  void Open(std::string const& request);
  void Move(std::string const& id, std::string const& request);
  void Focus(std::string const& id);
  void Minimize(std::string const& id);
  void Restore(std::string const& id);
  void RequestClose(std::string const& id);
  void ResolveClose(std::string const& id, std::string const& generation, std::string const& token, bool accepted);
  void StartNativeDrag(std::string const& source, std::string const& token, std::string const& request, std::function<void(std::string)> completed);
  bool ResolveNativeDrop(std::string const& token, std::string const& request, bool accepted);
  void CancelNativeDrag(std::string const& request);
  void Dispose() noexcept;
  bool IsDisposed() const noexcept { return m_disposed; }
 private:
  struct Window;
  Window& Get(std::string const& id);
  void Observe(std::unique_ptr<Window> window);
  void Detach(Window& window) noexcept;
  void CloseRequest(std::string const& id, std::string const& generation);
  void Destroyed(std::string const& id, std::string const& generation) noexcept;
  void Changed() noexcept;
  bool DragWindowIsLive(std::string const& id, std::string const& generation) const noexcept;
  static LRESULT CALLBACK WindowMessage(HWND hwnd, UINT message, WPARAM wparam, LPARAM lparam, UINT_PTR id, DWORD_PTR ref);
  winrt::Microsoft::ReactNative::ReactContext m_context;
  std::function<void(std::string)> m_changed;
  std::function<void(std::string)> m_error;
  std::function<void(std::string)> m_nativeDrag;
  std::shared_ptr<NativeDragBroker> m_drag;
  std::map<std::string, std::unique_ptr<Window>> m_windows;
  std::string m_owner, m_component, m_primary;
  double m_referenceDpi{96};
  uint64_t m_sequence{0};
  bool m_disposed{false};
};
}
