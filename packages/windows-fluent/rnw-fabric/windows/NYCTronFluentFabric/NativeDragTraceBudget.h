#pragma once
#include <cstddef>

namespace nyctron::desktop {
// Reserve one bounded terminal record. The file cannot grow after exhaustion.
class NativeDragTraceBudget final {
 public:
  static constexpr std::size_t RecordLimit = 512;
  static constexpr std::size_t ByteLimit = 262144;
  static constexpr std::size_t RecordByteLimit = 4096;
  static constexpr std::size_t TerminalReserve = 256;
  bool Accept(std::size_t bytes) noexcept {
    if (m_exhausted) return false;
    if (bytes > RecordByteLimit || m_records >= RecordLimit - 1 || bytes > ByteLimit - TerminalReserve - m_bytes) {
      m_exhausted = true;
      return false;
    }
    ++m_records;
    m_bytes += bytes;
    return true;
  }
  std::size_t Records() const noexcept { return m_records; }
  std::size_t Bytes() const noexcept { return m_bytes; }
 private:
  std::size_t m_records{0}, m_bytes{0};
  bool m_exhausted{false};
};
}
