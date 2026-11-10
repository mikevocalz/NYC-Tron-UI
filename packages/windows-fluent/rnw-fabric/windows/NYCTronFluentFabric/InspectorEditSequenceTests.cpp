#include "InspectorEditSequence.h"
#include <string_view>

namespace {
using nyctron::overlays::InspectorAcknowledgment;
using nyctron::overlays::InspectorEditSequence;

constexpr bool MutationBeforeDelayedNotification() {
  InspectorEditSequence edits;
  std::string_view displayed = "NativeRapi";
  edits.ObserveChange();
  const auto earlierAck = edits.EventCount();
  // WinUI Text already contains 'd' before asynchronous TextChanged runs.
  // TextChanging must advance the sequence during that same mutation.
  displayed = "NativeRapid";
  edits.ObserveChange();
  const auto decision = edits.Commit(earlierAck);
  if (decision == InspectorAcknowledgment::Apply) displayed = "NativeRapi";
  // Rendering/queued notification can now finish without erasing the new text.
  return decision == InspectorAcknowledgment::Remember && displayed == "NativeRapid" &&
      edits.Commit(edits.EventCount()) == InspectorAcknowledgment::Apply;
}
constexpr bool RapidEditsRejectOlderWrites() {
  InspectorEditSequence edits;
  for (int32_t i = 1; i <= 17; ++i) {
    if (!edits.ObserveChange() || edits.EventCount() != i) return false;
    if (edits.Commit(i - 1) != InspectorAcknowledgment::Remember) return false;
  }
  if (edits.Commit(17) != InspectorAcknowledgment::Apply) return false;
  return edits.Commit(16) == InspectorAcknowledgment::Ignore;
}
constexpr bool LatestRejectionAndFreshMount() {
  InspectorEditSequence edits;
  if (edits.Commit(-1) != InspectorAcknowledgment::Invalid || edits.Commit(1) != InspectorAcknowledgment::Invalid) return false;
  edits.ObserveChange();
  // Rejection commits the old app value with the current event count. It is
  // eligible to update the native field without manufacturing another event.
  if (edits.Commit(1) != InspectorAcknowledgment::Apply || edits.EventCount() != 1) return false;
  InspectorEditSequence remounted;
  return remounted.EventCount() == 0 && remounted.Commit(1) == InspectorAcknowledgment::Invalid &&
      remounted.Commit(0) == InspectorAcknowledgment::Apply;
}
static_assert(MutationBeforeDelayedNotification(), "An older acknowledgment cannot erase a mutation awaiting TextChanged");
static_assert(RapidEditsRejectOlderWrites(), "Every synchronous edit protects its draft from older app commits");
static_assert(LatestRejectionAndFreshMount(), "Latest rejection applies without advancing the native edit domain");
}
