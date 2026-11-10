# Windows native drag: no routed target events observed

This receipt preserves the first completed diagnostic run for PR 60 head
`5a9709d9f7c7aa819d36fd68729f11e0cf3295b8`:
[run 42912913242](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42912913242),
[native job 130168331913](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42912913242/job/130168331913).
The actual merge checkout was `ea5f13f4ecff638c7c1d062403c62e2227fa9513`,
tree `7562beb4363bbc54797b75a41f6d9525eb008faf`. Root independently fetched and
verified the head, merge, tree and ordered parents.

## Native result

Source checks, fresh installed-consumer preparation, generated bindings,
fixture typechecks, native library compilation, consumer compilation and
deployment passed. The existing overlay removal and strict inspector remount
checks also passed before the drag scene.

The source received a real native `DragStarting`, prepared the OS data package
and received `DropCompleted` with effect `none`. The required
`Native drag result: none/rejected` assertion failed. The original screenshot
and automation tree show `none/cancelled`, one completed native drag, zero
authorized transfers and document ownership still in the main window. Root
viewed the original failure image. Accepted move and explicit cancellation
cases were not reached.

The original pointer receipt records the held OS cursor at `(726, 240)` over
the target's native bounds `(596, 212, 260, 56)`. The hit root was the owned
document HWND `131622`, process `8940`; button-up insertion succeeded. The
main HWND `655738` and process were alive when failure was captured. The
Application Error/WER query completed with zero matching records.

## What the new trace establishes

The retained trace has 29 consecutive records, 14,142 bytes, no truncation and
no record-error marker. Its copy receipt verifies identical hashes before,
after and in the copy, and confirms the owned process was stopped before the
original trace was removed.

Target surface 2's last capability observation, sequence 22, precedes source
start and records `mounted`, `loadedEvent`, `inputReady`, `isLoaded`, `enabled`,
`allowDrop`, `islandConnected` and `evaluatedWindowLive` all true. The island is
open and its native extent is 260 by 56. Sequences 23 through 28 record source
start, broker preparation/start, source data preparation and native completion.

There are **zero recorded target enter, over, leave or drop events**, and zero
broker hover or offer records. No drop request was established before native
completion. This narrows the next investigation to delivery of native target
events. The trace provides no evidence of a nonce extraction failure or target
approval rejection, because those paths were not observed.

The source-only broker records have `targetLive: false` while no active target
has been assigned. That field does not establish that the actual target window
was unavailable. The last capability record is also not a continuous state
measurement. This receipt does not assign a root cause for the missing events.

## Original evidence

- `original-native-artifact.zip` is the complete 319,338-byte Actions artifact
  `13808318395`, SHA-256
  `88d9b1d5e950ebb0aaddb0da82289268cd36232126ad8b9d8382189a081b8789`.
- Every one of its 24 original members is retained under `originals/`. Root
  verified each extracted and committed file byte-for-byte against the ZIP.
- `original-native-job.log` is the full 316,213-byte UTF-8 serialized decoded
  job log, SHA-256
  `605228ff8ddd8a218cb3f6a8e944a7734782495e629f126d89ec18fe09b5cedb`.
  Root separately fetched the complete log and verified all 314,698 decoded
  characters against the retained file.
- `originals/native-drag-trace.jsonl` has SHA-256
  `f6bf187299c5fe826e0e0d1821e00c17c74096f8562313a069be05923b34f358`.
  Its original BOM-bearing copy receipt is retained beside it.
- `artifact-files.json`, `checkout.json`, `provenance.json` and independent
  workflow metadata record identity, hashes, observed stages and limits.

No original log, JSON, screenshot or ZIP was normalized or repacked. This
failed run does not produce a passed desktop archive or complete native
transfer acceptance. All existing outcome assertions remain required.
