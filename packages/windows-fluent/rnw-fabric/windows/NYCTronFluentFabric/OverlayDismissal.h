#pragma once
#include <cstdint>

namespace nyctron::overlays {
enum class ClosingDecision { Allow, Request, AwaitDecision };

// Coalesce duplicate native requests until JS acknowledges callback delivery.
// Delivery does not decide open state: a veto can be followed by a new request.
// Native teardown and a committed close always bypass the request.
class OverlayDismissal {
 public:
  constexpr ClosingDecision Closing(bool committedOpen, bool teardown) noexcept {
    if (!committedOpen || teardown || m_allow) return ClosingDecision::Allow;
    if (m_pending) return ClosingDecision::AwaitDecision;
    if (++m_sequence == 0) ++m_sequence;
    m_pending = m_sequence; return ClosingDecision::Request;
  }
  constexpr uint64_t PendingRequestId() const noexcept { return m_pending; }
  constexpr bool Acknowledge(uint64_t requestId) noexcept {
    if (requestId == 0 || requestId != m_pending) return false;
    m_pending = 0; return true;
  }
  constexpr void Commit(bool open) noexcept { if (!open) m_pending = 0; }
  constexpr void AllowClose() noexcept { m_allow = true; m_pending = 0; }
  constexpr bool Closed() noexcept { const auto allowed = m_allow; Reset(); return allowed; }
  constexpr void Reset() noexcept { m_allow = false; m_pending = 0; }
 private:
  bool m_allow{false};
  uint64_t m_sequence{0}, m_pending{0};
};
}
