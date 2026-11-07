# Audio mocked-render CI correction

The rendered horizontal fader fixtures omitted PanResponder gesture state. They now supply distinct per-gesture stateIDs consistently on grant, move, release and termination, with event touch data and retained displacement. Production gesture ownership checks remain intact. Rendered regressions also exercise an old gesture releasing/terminating after a newer gesture starts and a queued accessibility action after source replacement.

The screen-reader assertion exposed a source regression: a successful step or drag release restored the original live gain immediately before the host commit. Discrete steps now emit exactly the stepped onChange value immediately before onCommit, without creating a drag-preview lease.

Horizontal fader, vertical fader and EQ commits share detach/settle handling. Release detaches a preview without sending old feedback. Actual host acknowledgement consumes it on success, including a host success whose guard result becomes stale after source replacement. Rejection or an explicit false host result restores the original callback/value once if no newer preview or clear generation owns feedback. A stale failure cannot overwrite a newer preview. Synchronous host operations remain synchronous inside the existing guard, preserving pendingForAsyncOnly behavior. Drag cancellation retains its original restoration path.

The exported vertical callback fixture now tests reentrant source replacement during rejected-commit restoration; successful commits are explicitly checked to avoid that restoration. Actual rendered horizontal/vertical controls verify successful release ordering and rejected/false commit rollback. These are mocked-native callback checks, not native screen-reader or gesture arbitration acceptance.

Validation: 28 rendered level-fader tests and 32 focused ownership/config/math tests passed (60 total). UI and slots TypeScript passed. Scoped whitespace check passed. No timeline, mixer, dependency, native build or release changes.
