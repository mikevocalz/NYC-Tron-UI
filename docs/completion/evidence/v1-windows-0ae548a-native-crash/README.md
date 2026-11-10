# Windows drag-scene transition: original native crash evidence

[Run 42887781630](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42887781630)
passed source/codegen/API, installed native library compilation, the actual
consumer executable build and packaged deployment. Its complete native UIA
gate failed during the transition into the drag scene, before any OS drag
started. No passed-only Windows package was produced.

Head `0ae548a01fabd7bfcddefc55ed53e3a637e39fc8` and actual checkout
`5171c0a4e3944fd4d7faf4caa238a016c7c80398` independently match tree
`81c0f37c0836650b00b6c17f3df90b91aac4301a`. This head changes diagnostics;
it does not change production components or native acceptance assertions.

## Observed result

The first overlay-removal transition again exposed 49 descendants through both
the retained and freshly acquired owned UIA root. The subsequent strict inspector
remount assertions completed: retained draft, a new acknowledgment domain starting
at zero, acceptance of the first new edit, matching ValuePattern and close.
The reopened inspector capture visibly contains `NativeRapid123abc`.

The driver requested the drag scene at `19:51:01.3701090 UTC`. A matching
Application Error record at `19:51:01.6449344 UTC` identifies app process 8280,
`Microsoft.UI.Xaml.dll` version `3.1.8.0` and fault RVA `0x41c066`. After the
unchanged 30-second header wait, the retained process handle reported an exit
with code `0xC0000409`; the original HWND 590164 no longer existed. These
observations establish a process crash, rather than only a missing UIA subtree.
The module and exit code alone do not establish the originating API or defect.

The original strict missing-header error survived secondary capture and cleanup.
The final tree now explicitly records zero descendants and its capture time,
instead of retaining the earlier document-window snapshot. The app-specific
WER configuration captured one minidump and reports successful restoration of
its previous settings. The whole-desktop failure image is preserved separately;
no app-window failure image was possible after that owned window disappeared.

## Original evidence and independent verification

`original-uia-artifact.zip` retains the complete original 955,452-byte artifact,
including all 22 members and the minidump. Its SHA-256 is
`21c729d3b1537f703017eed7f25aaea952e06e4cadbcafc0c6ef17441a245e02`.
Every extracted member was independently compared byte for byte. All members
except the dump are also retained directly here; the unmodified dump remains
inside the original ZIP to avoid a second uncompressed copy.

The dump `crash-dumps/NYCTronWindowsExample.exe.8280.dmp` is 4,937,072 bytes,
SHA-256 `57a3f44abcfaf498c6c609f4f5bdf79d812276530318dc79be19da3917b75618`.
That identity matches the original crash-capture receipt. The complete decoded
native job log is also retained unchanged: 314,113 bytes, SHA-256
`f01574b8ee4f22e5c3f0584c37e51989021af7ff99fb5ffa9a3e1663ba6212eb`.
`artifact-files.json`, `checkout.json` and `provenance.json` record these checks.

Symbol and stack analysis is separate from this original receipt. Neither the
real OS-drag checks nor the navigation accessibility extension was reached;
this failed run does not promote the eight-platform acceptance ledger.
