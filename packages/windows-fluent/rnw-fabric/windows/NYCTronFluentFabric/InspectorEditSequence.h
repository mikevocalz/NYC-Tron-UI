#pragma once
#include <cstdint>
#include <limits>

namespace nyctron::overlays {
enum class InspectorAcknowledgment { Ignore, Remember, Apply, Invalid };

// Advance synchronously with the native text mutation, before rendering or
// queued notifications. Only the current edit may replace the displayed draft.
class InspectorEditSequence {
 public:
  constexpr bool ObserveChange() noexcept {
    if (m_eventCount == std::numeric_limits<int32_t>::max()) return false;
    ++m_eventCount; return true;
  }
  constexpr int32_t EventCount() const noexcept { return m_eventCount; }
  constexpr InspectorAcknowledgment Commit(int32_t count) noexcept {
    if (count < 0 || count > m_eventCount) return InspectorAcknowledgment::Invalid;
    if (count < m_acknowledged) return InspectorAcknowledgment::Ignore;
    m_acknowledged = count;
    return count == m_eventCount ? InspectorAcknowledgment::Apply : InspectorAcknowledgment::Remember;
  }
 private:
  int32_t m_eventCount{0}, m_acknowledged{0};
};
}
