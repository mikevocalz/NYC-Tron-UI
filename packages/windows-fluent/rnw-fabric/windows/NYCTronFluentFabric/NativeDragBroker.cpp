#include "pch.h"
#include "NativeDragBroker.h"
#include "NativeDragTrace.h"
#include "DesktopGeometry.h"
#include <winrt/Windows.Data.Json.h>
#include <chrono>
#include <map>
#include <stdexcept>

namespace nyctron::desktop {
namespace Json = winrt::Windows::Data::Json;
namespace {
// Weak native connection index; all callers run on the same RNW UI dispatcher.
std::map<std::string, std::weak_ptr<NativeDragBroker>> connections;
void String(Json::JsonObject const& value, wchar_t const* name, std::string const& text) { value.SetNamedValue(name, Json::JsonValue::CreateStringValue(winrt::to_hstring(text))); }
}
struct NativeDragBroker::Active {
  std::string source, sourceGeneration, startRequest, nonce, token;
  std::string target, targetGeneration, dropRequest;
  SourceReady sourceReady;
  std::function<void(bool)> dropReady;
  std::function<void(std::string)> completed;
  winrt::Microsoft::UI::Dispatching::DispatcherQueueTimer timer{nullptr};
  bool started{false}, approved{false};
};
void NativeDragBroker::EnableDiagnostics() {
  if (m_disposed) throw std::runtime_error("Native drag owner is unavailable");
  m_trace = NativeDragTrace::Enable(m_owner);
  Trace("broker-diagnostics-enabled");
}
void NativeDragBroker::DiagnosticState(Json::JsonObject const& record, std::string const& nonce, std::string const& id, std::string const& generation) const noexcept {
  try {
    auto boolean = [&](wchar_t const* key, bool value) { record.SetNamedValue(key, Json::JsonValue::CreateBooleanValue(value)); };
    boolean(L"brokerDisposed", m_disposed);
    boolean(L"activePresent", !!m_active);
    boolean(L"evaluatedWindowLive", m_live(id, generation));
    boolean(L"noncePresent", !nonce.empty());
    boolean(L"canTarget", CanTarget(nonce, id, generation));
    if (m_active) {
      boolean(L"nativeStarted", m_active->started);
      boolean(L"sourceLive", m_live(m_active->source, m_active->sourceGeneration));
      boolean(L"targetLive", m_live(m_active->target, m_active->targetGeneration));
      boolean(L"evaluatedWindowDiffersFromSource", id != m_active->source);
      boolean(L"nonceMatches", m_active->nonce == nonce);
      boolean(L"dropRequestPresent", !m_active->dropRequest.empty());
      boolean(L"dropDecisionPending", !!m_active->dropReady);
      boolean(L"appApproved", m_active->approved);
    }
  } catch (...) { /* State observation cannot affect the broker. */ }
}
void NativeDragBroker::Trace(char const* stage, char const* effect) const noexcept {
  if (!NativeDragTrace::Enabled(m_owner)) return;
  try {
    Json::JsonObject record;
    String(record, L"stage", stage);
    if (effect) String(record, L"effect", effect);
    DiagnosticState(record, m_active ? m_active->nonce : "", m_active ? m_active->target : "", m_active ? m_active->targetGeneration : "");
    NativeDragTrace::Record(m_owner, record);
  } catch (...) {}
}
NativeDragBroker::NativeDragBroker(std::string owner, IsLive live, std::function<void(std::string)> event)
  : m_owner(std::move(owner)), m_live(std::move(live)), m_event(std::move(event)) {}
NativeDragBroker::~NativeDragBroker() { Dispose(); }
std::shared_ptr<NativeDragBroker> NativeDragBroker::Create(std::string owner, IsLive live, std::function<void(std::string)> event) {
  auto broker = std::make_shared<NativeDragBroker>(std::move(owner), std::move(live), std::move(event));
  connections[broker->m_owner] = broker; return broker;
}
std::shared_ptr<NativeDragBroker> NativeDragBroker::Find(std::string const& owner) {
  auto it = connections.find(owner); return it == connections.end() ? nullptr : it->second.lock();
}
void NativeDragBroker::ArmDeadline() {
  if (m_active->timer) m_active->timer.Stop();
  auto timer = winrt::Microsoft::UI::Dispatching::DispatcherQueue::GetForCurrentThread().CreateTimer();
  timer.IsRepeating(false); timer.Interval(std::chrono::seconds(30));
  timer.Tick([weak = weak_from_this()](auto const&, auto const&) { if (auto self = weak.lock()) self->Cancel("", "timeout"); });
  m_active->timer = timer; timer.Start();
}
std::string NativeDragBroker::PrepareSource(std::string const& id, std::string const& generation, SourceReady ready) {
  if (m_disposed || m_active || !m_live(id, generation)) throw std::runtime_error("Native drag source is unavailable or another drag is active");
  auto active = std::make_unique<Active>(); active->source = id; active->sourceGeneration = generation;
  active->startRequest = NewToken(); active->nonce = NewToken(); active->sourceReady = std::move(ready);
  const auto request = active->startRequest; m_active = std::move(active);
  try { ArmDeadline(); } catch (...) { Cancel(request); throw; }
  Trace("broker-source-prepared");
  return request;
}
void NativeDragBroker::Start(std::string const& source, std::string const& token, std::string const& request, std::function<void(std::string)> completed) {
  if (!m_active || m_disposed || m_active->started || m_active->startRequest != request || m_active->source != source || token.empty() || token.size() > 256 || !m_live(source, m_active->sourceGeneration))
    throw std::runtime_error("Stale native drag-start request");
  m_active->token = token; m_active->completed = std::move(completed); m_active->started = true;
  Trace("broker-source-started");
  auto ready = std::move(m_active->sourceReady); const auto nonce = m_active->nonce;
  if (m_active->timer) m_active->timer.Stop();
  try { ready(true, nonce); } catch (...) { Cancel(request); throw; }
}
bool NativeDragBroker::CanTarget(std::string const& nonce, std::string const& id, std::string const& generation) const {
  return !m_disposed && m_active && m_active->started && m_active->nonce == nonce && id != m_active->source &&
    m_live(m_active->source, m_active->sourceGeneration) && m_live(id, generation);
}
void NativeDragBroker::Emit(char const* kind) {
  if (!m_active || !m_event) return;
  Json::JsonObject event; String(event, L"kind", kind); String(event, L"ownerToken", m_owner); String(event, L"token", m_active->token);
  String(event, L"sourceId", m_active->source); String(event, L"sourceGeneration", m_active->sourceGeneration);
  String(event, L"targetId", m_active->target); String(event, L"targetGeneration", m_active->targetGeneration); String(event, L"requestId", m_active->dropRequest);
  m_event(winrt::to_string(event.Stringify()));
}
void NativeDragBroker::Hover(std::string const& nonce, std::string const& id, std::string const& generation) {
  if (!CanTarget(nonce, id, generation) || m_active->dropReady || m_active->approved) return;
  if (m_active->target == id && m_active->targetGeneration == generation) return;
  m_active->target = id; m_active->targetGeneration = generation;
  Trace("broker-hover");
  Emit("hover");
}
void NativeDragBroker::Leave(std::string const& id, std::string const& generation) {
  if (!m_active || m_active->dropReady || m_active->approved || m_active->target != id || m_active->targetGeneration != generation) return;
  Trace("broker-leave");
  m_active->target.clear(); m_active->targetGeneration.clear(); Emit("hover");
}
void NativeDragBroker::Offer(std::string const& nonce, std::string const& id, std::string const& generation, std::function<void(bool)> completed) {
  if (!CanTarget(nonce, id, generation) || m_active->dropReady || m_active->approved) { Trace("broker-offer-refused"); completed(false); return; }
  m_active->target = id; m_active->targetGeneration = generation; m_active->dropRequest = NewToken(); m_active->dropReady = std::move(completed);
  ArmDeadline();
  Trace("broker-offer");
  Emit("offer");
}
bool NativeDragBroker::Resolve(std::string const& token, std::string const& request, bool accepted) {
  if (m_disposed || !m_active || m_active->token != token || m_active->dropRequest != request || !m_active->dropReady)
    throw std::runtime_error("Stale native drop approval");
  const bool allowed = accepted && m_live(m_active->source, m_active->sourceGeneration) && m_live(m_active->target, m_active->targetGeneration);
  m_active->approved = allowed; auto ready = std::move(m_active->dropReady);
  Trace("broker-resolve");
  ready(allowed); return allowed;
}
std::string NativeDragBroker::Result(Active const& active, std::string const& effect, std::string const& reason) const {
  Json::JsonObject result; String(result, L"ownerToken", m_owner); String(result, L"token", active.token); String(result, L"effect", effect); String(result, L"reason", reason);
  String(result, L"sourceId", active.source); String(result, L"sourceGeneration", active.sourceGeneration);
  String(result, L"targetId", active.target); String(result, L"targetGeneration", active.targetGeneration);
  return winrt::to_string(result.Stringify());
}
void NativeDragBroker::NativeCompleted(std::string const& request, std::string const& effect) {
  if (!m_active || m_active->startRequest != request) return;
  const auto observed = effect == "move" ? "move" : effect == "copy" ? "copy" : effect == "link" ? "link" : effect == "none" ? "none" : "unknown";
  Trace("broker-native-completed", observed);
  auto active = std::move(m_active);
  // Cancellation can invalidate the framework's event properties before a
  // pending deferral is released. A cleanup failure must not strand the JS
  // completion after this lease and its deadline have already been removed.
  try { if (active->timer) active->timer.Stop(); } catch (...) {}
  try { if (active->dropReady) active->dropReady(false); } catch (...) {}
  try { if (active->sourceReady) active->sourceReady(false, ""); } catch (...) {}
  if (active->completed) active->completed(Result(*active, effect, effect == "move" && active->approved ? "accepted" : active->dropRequest.empty() ? "cancelled" : "rejected"));
}
void NativeDragBroker::Cancel(std::string const& request, std::string const& reason) noexcept {
  if (!m_active || (!request.empty() && request != m_active->startRequest && request != m_active->token)) return;
  Trace("broker-cancelled");
  auto active = std::move(m_active);
  try { if (active->timer) active->timer.Stop(); } catch (...) {}
  try { if (active->sourceReady) active->sourceReady(false, ""); } catch (...) {}
  try { if (active->dropReady) active->dropReady(false); } catch (...) {}
  // Once a native gesture started, cancellation cannot claim an unobserved
  // OS result, even before approval. Only DropCompleted establishes an effect.
  try { if (active->completed) active->completed(Result(*active, active->started ? "unknown" : "none", reason)); } catch (...) {}
}
void NativeDragBroker::CancelTarget(std::string const& id, std::string const& generation) noexcept {
  if (m_active && m_active->target == id && m_active->targetGeneration == generation) {
    if (m_active->dropReady || m_active->approved) Cancel("", "unavailable");
    else { try { Leave(id, generation); } catch (...) { Cancel("", "unavailable"); } }
  }
}
void NativeDragBroker::ObserveWindows() noexcept {
  if (!m_active) return;
  if (!m_live(m_active->source, m_active->sourceGeneration)) { Cancel("", "unavailable"); return; }
  if (!m_active->target.empty() && !m_live(m_active->target, m_active->targetGeneration)) CancelTarget(m_active->target, m_active->targetGeneration);
}
void NativeDragBroker::Dispose() noexcept {
  if (m_disposed) return; m_disposed = true; Cancel("", "disposed");
  Trace("broker-disposed");
  connections.erase(m_owner); m_event = nullptr; m_trace.reset();
}
}
