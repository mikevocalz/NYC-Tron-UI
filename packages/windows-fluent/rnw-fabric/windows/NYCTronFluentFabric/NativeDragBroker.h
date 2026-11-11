#pragma once
#include <winrt/Microsoft.UI.Dispatching.h>
#include <winrt/Windows.Data.Json.h>
#include <functional>
#include <memory>
#include <string>

namespace nyctron::desktop {
class NativeDragTrace;
// UI-dispatcher-owned bridge between native WinUI drag deferrals and the app's
// existing core transfer owner. No document or payload is stored natively.
class NativeDragBroker : public std::enable_shared_from_this<NativeDragBroker> {
 public:
  using IsLive = std::function<bool(std::string const&, std::string const&)>;
  using SourceReady = std::function<void(bool, std::string const&)>;
  static std::shared_ptr<NativeDragBroker> Create(std::string owner, IsLive live, std::function<void(std::string)> event);
  static std::shared_ptr<NativeDragBroker> Find(std::string const& owner);
  NativeDragBroker(std::string owner, IsLive live, std::function<void(std::string)> event);
  ~NativeDragBroker();
  std::string PrepareSource(std::string const& id, std::string const& generation, SourceReady ready);
  void Start(std::string const& source, std::string const& token, std::string const& request, std::function<void(std::string)> completed);
  bool CanTarget(std::string const& nonce, std::string const& id, std::string const& generation) const;
  void Hover(std::string const& nonce, std::string const& id, std::string const& generation);
  void Leave(std::string const& id, std::string const& generation);
  void Offer(std::string const& nonce, std::string const& id, std::string const& generation, std::function<void(bool)> completed);
  bool Resolve(std::string const& token, std::string const& request, bool accepted);
  void NativeCompleted(std::string const& request, std::string const& effect);
  void Cancel(std::string const& requestOrToken, std::string const& reason = "cancelled") noexcept;
  void CancelTarget(std::string const& id, std::string const& generation) noexcept;
  void ObserveWindows() noexcept;
  void Dispose() noexcept;
  void EnableDiagnostics();
  void DiagnosticState(winrt::Windows::Data::Json::JsonObject const& record, std::string const& nonce, std::string const& id, std::string const& generation) const noexcept;
 private:
  struct Active;
  void ArmDeadline();
  void Emit(char const* kind);
  std::string Result(Active const& active, std::string const& effect, std::string const& reason) const;
  void Trace(char const* stage, char const* effect = nullptr) const noexcept;
  std::string m_owner;
  IsLive m_live;
  std::function<void(std::string)> m_event;
  std::unique_ptr<Active> m_active;
  std::shared_ptr<NativeDragTrace> m_trace;
  bool m_disposed{false};
};
}
