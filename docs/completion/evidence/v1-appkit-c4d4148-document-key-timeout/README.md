# AppKit c4: first document-window show remained non-key

The owned c4 run compiled successfully and then failed native acceptance at the
**first** `show('document-1')`. The new diagnostic identifies the failed field:
**`key=false`**, while the other six projected facts were true. This is a
completed failed outcome, not a native pass or a diagnosis of the underlying
focus cause.

## Source and actual run

[Run 42999493080, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42999493080/attempts/1)
tested helper `c4d4148c6135b9e3054255d9e35a950bef959b71` at actual merge
`62a4b3d2385b588d634eb189bfb630679c21b3ef`. The tree was
`34309184ac033c77f891ff18880d55f34dfbbcd8`, with ordered merge parents
`ac5d69585a52a6e945dc996ea08030e190574699` and c4. Both original checkout logs
and fetched Git metadata match. The full 2,050-leaf map and all 284 directory
tree-object hashes were independently verified.

Executed verifier `ae88774e…` and driver `bdd64d6b…` include the reviewed
observation/completion changes. Shipping popover `9e00e3d9…` is unchanged;
external 395's edge fallback and presentation logs are absent. The prepared
[source review](../v1-appkit-c4d4148-show-observation-source/README.md) remains a
separate historical source checkpoint.

Native job `130452053349` completed failure at **10:19:59 UTC** on November 11.
The original error was:

```text
Timed out waiting for visible, key and active native owner window (document-1)
```

The stack points to `waitFor` line 1088, `show` line 1098, and the first
document-window call at **line 1384**. The 20-second wait limit and strict
predicate were unchanged.

## What the new observation establishes

The exact [window-show summary](window-show-summary.json) reports **354 returned
responses**, **zero projected state changes**, **two selected records** and
**352 omitted responses**. Both first and last records contain:

| Assertion facts | Observed |
|---|---|
| Expected process ID matches | true |
| Activation policy is Regular | true |
| Owner can become key | true |

| Final conjunction facts | Observed |
|---|---|
| Visible | true |
| Key | **false** |
| Application active | true |
| Frontmost process matches | true |

`captureFailed` and `countOverflow` are false; omitted state changes are zero.
These are sequential fixed-field observations. The intermediate raw responses
were not independently opened, and the projection does not identify which other
window, if any, was key.

All 20 selected activation records are present in the startup projection.
Operation **2**, for this first document show, reported `key=true` in its earlier
`reply-prepared` snapshot. The later polling projection reports `key=false`.
This establishes different observed states at different points; it does not
identify the responsible callback, exact key-window object, or a pending
transient-popover dismissal.

The original first Escape completion witness and opener-responder assertion
returned, as did inspector reopening/controlled close, sidebar/appearance and
controlled text/selection checks. The document root mounted and the two-window
wait returned before this failure. Shared-document assertions after the first
show, document resizing, drag protocol, the later second document show and
newer-window-focus close witness, minimization and later real-pointer gates
were **not reached**. This differs from e086's later-show failure and external
395's post-close focus assertion.

## Retained evidence and boundaries

The complete [source](source-job.log) and [native](native-job.log) job logs are
retained exactly. The build, startup, tooltip and window-show JSON files are
exact extracted console lines, not reserialized replacements. The original
timestamped startup envelope preserves **10 interleaved stderr lines**; its
single JSON line was extracted separately. The window-show envelope has no
interleaved line and its complete normalized console content is **1,163 bytes**,
within the unchanged 8 KiB limit.

The console reports `window-show-failure.json` was retained by an exclusive
write. The original artifact file itself is uninspected and no hash for it is
claimed. The console projection and its original timestamped envelope are
retained under distinct names.

Core source checks passed **13**, consumer source checks passed **16**, the API
snapshot matched **15 subpaths / 33 declarations**, and the native transport
probe passed **7** cases. Compilation and the typed tooltip summary passed.
Full native acceptance failed; the tested-package upload was skipped. These
counts remain separate.

Artifact **13846767035** reports **54 files / 1,711,186 bytes**, SHA-256
`a96ed4eaa06e49c60979875e64bf493ad208054e34b06fe39b99b5fbc5e1a446`.
ZIP bytes, original app/command/process/sample/tooltip files, compiler transcript
and pixels were not inspected. Their hashes remain producer-reported. The
older command projection read only 262,145 of 1,031,710 bytes; the new dedicated
summary is the direct retained evidence for the failed conjunction.

[provenance.json](provenance.json) binds all inspected bytes and typed records.
[completed-metadata.json](completed-metadata.json) records the exact attempt,
jobs, steps and artifacts. No source fix, retry, ref or host/security change
is included in this receipt.
