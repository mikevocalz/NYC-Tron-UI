# Windows 9b902a2 native build and tooltip checkpoint

This directory preserves the first PR60 run in which the native Fabric library,
actual consumer executable and packaged deployment all passed. The complete
native gate failed during tooltip hover. It produced no tested-package archive
and does not establish full native interaction acceptance.

- [Workflow run 42861976128](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42861976128)
- [Native job 129998284241](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42861976128/job/129998284241)
- [Original UIA artifact 13787072023](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42861976128/artifacts/13787072023)
- PR60 head: `9b902a2506493c0c754a34509eab17923876940d`
- Actual checkout: `797e42663d745aacb2d3d92d302f3ca32121f146`
- Both trees: `69d5e39ca0b421b0702020c80a8300ea633d46b3`

## Observed boundary

The installed archive passed source contracts, declaration validation and native
code generation. The corrected C++ code compiled, the actual packaged application
deployed, and UIA launched it. The interaction log then observed controlled route
selection and rejection, two native windows sharing an edited draft, minimize and
restore, close veto, accepted close and reopen. Native menu and context-menu
callbacks committed `approve` and `inspect`. The original tree confirms those
two committed callback values.

The next assertion failed:

```text
Visible native element 'Native tooltip details' did not appear
```

The timeout screenshot and tree contain no visible tooltip. The original driver
moved the pointer immediately after observing the context action callback; it
did not wait for native popup disappearance or record the cursor and hit target.
This leaves the input transition unobserved. It does not prove whether input
delivery or the tooltip implementation caused the failure.

The next driver correction waits for actual popup disappearance, enters the
anchor from outside through `SendInput`, and verifies cursor coordinates and
native hit identity. It still requires the genuine WinUI tooltip and its
dismissal. It changes no production tooltip code and requires a fresh native run.

Inspector interactions, OS cross-window drag and the navigation accessibility
extension were not reached. The later inspector remount regression was not yet
in this checkout. Tested-package retention and upload were skipped.

## Retained evidence

`provenance.json` records the full original decoded-log hash and exact source line
ranges for the excerpts. `checkout.json` records the actual merge commit and its
parents; the tested tree equals the published head's tree. `workflow-jobs.json`
preserves the source/native step conclusions. `artifact-metadata.json` preserves
the Actions inventory, which contains only shared peer packages and failed UIA
evidence, with no tested Fabric distribution.

`artifact-files.json` records all nine original artifact files, byte counts,
SHA-256 hashes and PNG dimensions. `uia-tree.txt` is the unchanged artifact text,
including its BOM. The full 308,967-byte decoded job log hashes to
`2afa8cffea44ab143b365d0b74354b2277fbd9b7b4240d87b0284433a85320e0`.
The original 177,016-byte UIA ZIP hashes to
`3120295d97ebe218f972f1ce25cd42d174bd45f3a6c3563c02d05c5bf2f7dba9`.
All nine original UIA artifact files are retained here, including the eight
unaltered PNG captures. Their downloaded bytes match the manifest. The
[native menu capture](07-native-menu.png) and [failure capture](failure.png)
were independently inspected: the menu is visible in the former; the latter
shows the committed menu/context actions and no visible tooltip. Full logs and
the ZIP remain outside git and are available through the cited Actions artifact.
