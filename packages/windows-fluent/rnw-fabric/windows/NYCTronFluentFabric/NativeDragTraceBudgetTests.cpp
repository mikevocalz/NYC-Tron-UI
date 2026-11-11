#include "NativeDragTraceBudget.h"
#include <cassert>
#include <iostream>
#include <limits>

using nyctron::desktop::NativeDragTraceBudget;

int main() {
  NativeDragTraceBudget records;
  for (std::size_t i = 0; i < NativeDragTraceBudget::RecordLimit - 1; ++i) assert(records.Accept(1));
  assert(!records.Accept(1));
  assert(records.Records() + 1 == NativeDragTraceBudget::RecordLimit);
  assert(!records.Accept(0)); // Exhaustion cannot be reset by smaller events.

  NativeDragTraceBudget bytes;
  while (bytes.Accept(NativeDragTraceBudget::RecordByteLimit)) {}
  assert(bytes.Bytes() + NativeDragTraceBudget::TerminalReserve <= NativeDragTraceBudget::ByteLimit);
  assert(bytes.Bytes() + NativeDragTraceBudget::RecordByteLimit + NativeDragTraceBudget::TerminalReserve > NativeDragTraceBudget::ByteLimit);
  assert(!bytes.Accept(1));

  NativeDragTraceBudget oversized;
  assert(!oversized.Accept(std::numeric_limits<std::size_t>::max()));
  assert(oversized.Bytes() == 0 && oversized.Records() == 0);
  assert(!oversized.Accept(1));

  NativeDragTraceBudget exact;
  assert(exact.Accept(NativeDragTraceBudget::RecordByteLimit));
  assert(exact.Bytes() == NativeDragTraceBudget::RecordByteLimit && exact.Records() == 1);
  std::cout << "native drag trace budget passed: record cap, byte cap, terminal reserve, overflow refusal\n";
}
