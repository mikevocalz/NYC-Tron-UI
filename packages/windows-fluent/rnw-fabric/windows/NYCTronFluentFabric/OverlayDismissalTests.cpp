#include "OverlayDismissal.h"

namespace {
using nyctron::overlays::ClosingDecision;
using nyctron::overlays::OverlayDismissal;
constexpr bool AcceptedClose() {
  OverlayDismissal state;
  if (state.Closing(true, false) != ClosingDecision::Request) return false;
  if (state.Closing(true, false) != ClosingDecision::AwaitDecision) return false;
  state.Commit(false);
  return state.Closing(false, false) == ClosingDecision::Allow;
}
constexpr bool TeardownBypassesPendingDecision() {
  OverlayDismissal state;
  state.Closing(true, false);
  if (state.Closing(true, true) != ClosingDecision::Allow) return false;
  state.AllowClose();
  if (state.Closing(true, false) != ClosingDecision::Allow || !state.Closed()) return false;
  return state.Closing(true, false) == ClosingDecision::Request;
}
constexpr bool ScopeAndKeptOpen() {
  OverlayDismissal state;
  state.Closing(true, false); state.Commit(true);
  if (state.Closing(true, false) != ClosingDecision::AwaitDecision) return false;
  const auto old = state.PendingRequestId();
  state.Reset();
  if (state.Closing(true, false) != ClosingDecision::Request || state.Acknowledge(old)) return false;
  return state.Closing(true, false) == ClosingDecision::AwaitDecision;
}
constexpr bool VetoThenAcceptedRetry() {
  OverlayDismissal state;
  if (state.Closing(true, false) != ClosingDecision::Request) return false;
  const auto first = state.PendingRequestId();
  // The app may veto by doing nothing: no Commit(true) is necessary.
  if (!state.Acknowledge(first) || state.Closing(true, false) != ClosingDecision::Request) return false;
  const auto next = state.PendingRequestId();
  if (next == first || state.Acknowledge(first) || state.Closing(true, false) != ClosingDecision::AwaitDecision) return false;
  if (!state.Acknowledge(next)) return false;
  state.Commit(false);
  return state.Closing(false, false) == ClosingDecision::Allow;
}
constexpr bool AcknowledgementCannotCloseOrReopen() {
  OverlayDismissal state;
  state.Closing(true, false); const auto request = state.PendingRequestId();
  if (!state.Acknowledge(request) || state.Closing(true, false) != ClosingDecision::Request) return false;
  state.AllowClose();
  if (state.Acknowledge(request) || state.Closing(true, false) != ClosingDecision::Allow) return false;
  return state.Closed() && !state.Acknowledge(request);
}
static_assert(AcceptedClose(), "A committed close must release one pending native dismissal");
static_assert(TeardownBypassesPendingDecision(), "Disable and unmount must release a pending dismissal");
static_assert(ScopeAndKeptOpen(), "A delayed acknowledgment cannot release a replacement scope's request");
static_assert(VetoThenAcceptedRetry(), "A veto without a React commit must permit a later accepted dismissal");
static_assert(AcknowledgementCannotCloseOrReopen(), "Delivery acknowledgment must never decide native open state");
}
