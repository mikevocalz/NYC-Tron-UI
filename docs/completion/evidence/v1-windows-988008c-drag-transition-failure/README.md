# Windows inspector remount pass and later drag-scene failure

[Run 42883122854](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42883122854)
passed its source/codegen/API gate, installed native Fabric library compilation,
actual consumer executable build and packaged deployment. The complete native
UIA gate failed later, before the first OS drag gesture. No passed-only desktop
package artifact was emitted.

The published head was `988008cff4e757423967adfe349c1b632efc161b`; the actual
checkout was `231edc1c36e8665a9265d1e5d982650debfaedd3`. Both were independently
fetched/inspected and have tree `c66a9abcf7072f6cfeac1f76264f54b013e96c96`.

## Progress established by this run

The retained ContentIsland/ChildSiteLink cleanup compiled and the first overlay
removal no longer blocked React accessibility traversal. The original snapshots
contain 46 descendants before removal and 49 afterward, both through the retained
root and after reacquiring the same owned HWND. The actual lifecycle header is
present, and the strict old-inspector-anchor disappearance assertion passed.
The primary window was HWND `589966`, process `7572`.

The sequential native driver then returned to the overlay scene and completed
all required remount assertions before issuing the drag-scene command: the
replacement draft was retained, native edit acknowledgment started at zero,
the first new edit was accepted with acknowledgment one, the native ValuePattern
matched, and the inspector closed. These are observed checks within a failed
overall run, not a passed native release receipt.

Rapid typing, controlled rejection, scope replacement and dismissal veto also
passed before that transition. Both original inspector captures in this run
visibly show `NativeRapid123abc`, matching their property assertions. The earlier
`c6c1826` screenshot still remains unchanged with its recorded discrepancy;
this later observation does not prove that earlier frame's cause.

## Later failure and diagnostic limits

The driver sent `Show native drag checks` at `19:23:22.448 UTC`. Thirty seconds
later it failed to find `Native cross-window drag acceptance`. The native log
then reports an enumeration of zero descendants. Its failure capture could not
establish the original window as the stable foreground target and threw a
second exception. No final screenshot, process exit status or crash record was
retained, so this run cannot distinguish process termination from a surviving
process/window with unavailable automation.

The unchanged `uia-tree.txt` in this directory is **not a final-state snapshot**.
It contains the earlier fourteen-element document-window tree written at
`19:23:13.830 UTC`. The driver's empty PowerShell pipeline did not overwrite
that existing file when the final walk returned zero elements. The original
log and original file are both retained so this discrepancy remains visible.
The screenshot exception also masked the original assertion in the final
exception output, though the log preserves both failures.

The next diagnostic correction records the primary failure and owned
process/window state before capture operations, writes empty trees explicitly,
and keeps best-effort failure capture from masking the original error. No
production cause or successful drag interaction is inferred from this run.
Drag-window arrangement, rejected/cancelled/accepted OS transfers and the
navigation accessibility extension were not reached.

## Original evidence

Artifact `13796255494` contains fifteen files. Its original 275,132-byte ZIP
independently matches SHA-256
`4ace67ff7d7eefff1b74119f20f724fe06072a340b81d34fa4fd681da3ac4a92`.
Every original member is retained here with unchanged bytes and is inventoried
in `artifact-files.json`, including all ten PNG images. There is no synthesized
failure screenshot or replacement final tree.

The decoded native job log is 311,950 bytes with SHA-256
`f951f83ddd28f0c5eb9e868b554608f0888631593e19077411c4fed558699704`.
Checkout, build-success and native UI excerpts preserve the original bytes;
their exact source line ranges are recorded in `provenance.json`. The complete
log and original ZIP remain in the original Actions run and the retained raw
download. Native interaction evidence is scoped to this exact checkout and
does not promote the full eight-platform acceptance ledger.
