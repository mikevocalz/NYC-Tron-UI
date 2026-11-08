# P02 N-13/N-14 platform-service adapters

Wave C checkpoint: the first non-library N-xx rows get NYC-Tron-owned
implementations. `@nyc-tron/platform-services` gains two pure-TypeScript
subpaths that need no native module and behave identically on iOS, Android,
web, macOS, Windows, visionOS, Quest and PICO. Forge's P02 reports proved the
equivalent infrastructure native-side (`reports/P02.md`: N-13/N-14 BUILT-LOCAL,
N-16 BUILT-LOCAL); this checkpoint covers the reusable library half only.

## N-13 LongTaskScheduler — `/scheduler`

`createLongTaskScheduler()` returns a cooperative FIFO queue for host-supplied
decode, export and render work. One task runs at a time; the runner yields to
the event loop before each start so `submit()` returns first and queued work
never executes inside the caller's synchronous stack. Each task receives a
`TaskContext` with `checkpoint()` (yield plus cancellation check),
`throwIfCancelled()`, `isCancelled()` and `reportProgress()` delivering clamped
0..1 progress to per-submit `onProgress`.

`cancel(id)` rejects queued work immediately with `TaskCancelledError` and
marks running work; a running task observes cancellation at its next
checkpoint. `close()` rejects the whole queue, marks the running task and
resolves once it next yields; later submits get an already-rejected `done`.
Queue depth is bounded (`maxPending`, default 256) and ids are unique.

Honest limit: JavaScript cannot preempt synchronous work. A task that never
calls `checkpoint()` keeps the scheduler open and `close()` waits for it.
Native codec offload, worker threads and cancellation of decode already
submitted to a codec remain engine/host responsibilities; this module owns
ordering, bounds, progress and settled results. No JS-blocking claim is made.

## N-14 MediaCache — `/media-cache`

`createMediaCache({ maxBytes, maxEntries?, estimate?, onEvict? })` is a bounded
least-recently-used store for derived bytes the host generates and keys:
waveform peaks, preview frames, thumbnails. `get` refreshes recency, `peek`
does not, `set` evicts oldest-first until both the byte and entry bounds hold,
and a value larger than `maxBytes` is rejected before any mutation. The
default estimator measures `ArrayBuffer`, array-buffer views and `{ bytes }`
wrappers; other shapes require an `estimate` callback. `onEvict` observes
evictions, `clear` and `close`; `delete` and `set` replacement do not report.
`close()` drops every retained reference and rejects later writes.

The cache never decodes media, keys nothing itself and holds no document
state. Cross-host persistence, disk quotas and decoder integration stay with
the consuming app and the N-19 decoder surface.

## Evidence

- `packages/platform-services/src/scheduler/scheduler.ts`,
  `src/media-cache/media-cache.ts`; subpath exports `./scheduler` and
  `./media-cache` in `package.json`.
- `tests/scheduler.test.mjs` (7 cases) and `tests/media-cache.test.mjs`
  (6 cases): FIFO ordering, queued/running cancellation, checkpoint
  observation, progress clamping, failure isolation, pending bound, duplicate
  ids, close semantics; LRU order, byte/entry bounds, oversized rejection,
  replacement accounting, peek vs get, close/clear eviction reporting.
- Executed: `pnpm --filter @nyc-tron/platform-services typecheck`, `build`
  and `test` — 57 tests pass, including the existing native-contract suite.
- `tooling/verify-component-program.mjs` now validates source, evidence and
  public exports for implemented rows outside library scope instead of
  rejecting them; library counts are unchanged.

## Limits

These are TypeScript adapters verified by unit tests and package builds. No
simulator, device, XR or desktop runtime ran them; `acceptance` stays
`unverified` for both rows. Native decode cancellation (N-13's engine half),
persistent media caching and the remaining N-01/N-03/N-04/N-09/N-10/N-11/
N-15/N-16/N-18/N-19 scope are still open in the canonical ledger.
