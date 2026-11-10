# Windows b19b760 native point-provider diagnostic

The native Fabric library, actual consumer executable and packaged deployment
passed again. The UIA run failed at a new point-provider identity assertion,
before it waited for the real tooltip. No tested-package archive was emitted.

- [Workflow run 42867482309](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42867482309)
- [Native job 130010135260](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42867482309/job/130010135260)
- [Original UIA artifact 13788138400](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42867482309/artifacts/13788138400)
- PR60 head: `b19b76078476c0945c7b942e43fceaa5ad7b3feb`
- Actual checkout: `659d796cbfe94868f30d282bda751bee0c842fd3`
- Both trees: `f310c1bb4d628565dd6ace1275604e43d255d056`

## Observed boundary

The native navigation, multiwindow lifecycle, MenuFlyout and ContextFlyout
checkpoints reached the same assertions as the preceding 9b902a2 run. The driver
then observed disappearance of the menu items and delivered off-anchor and
on-anchor pointer input with `SendInput`. `GetCursorPos` confirmed `(8,8)` and
then `(456,347)`, within the tooltip anchor bounds `(336,327,240,40)`.

About 49ms after observing the second position, the new assertion failed:

```text
Pointer hit '' instead of native 'Native tooltip anchor'; bounds=336,327,240,40
```

It required the native button's runtime identity to be the point provider or one
of that provider's ancestors. The installed RNW 0.85.0 source does not guarantee
that: `RootComponentView::UiaProviderFromPoint` returns a hosted XAML leaf when
one is supplied, otherwise it falls back to the island/container provider.
`rnw-source.json` records the exact installed package version, archive integrity,
source path and file hash; `rnw-hit-test-excerpt.cpp` preserves the relevant
implementation. The original driver logged only the unnamed provider's name, so
the precise provider returned in this run cannot be established retrospectively.

The correction records the complete provider chain without treating native-leaf
identity as a prerequisite for waiting. It still requires the actual pointer
inside the visible native anchor, the application's foreground process, genuine
WinUI ToolTip visibility, and actual tooltip dismissal. The screenshot's hovered
fill is not treated as acceptance. Production tooltip code remains unchanged.

The genuine tooltip assertion, inspector and remount checks, OS cross-window
drag and navigation accessibility extension were not reached. Their acceptance
cannot be inferred from successful compilation or earlier checkpoints.

## Retained evidence

The provenance, checkout, job conclusions and original UIA tree are retained
alongside exact log excerpts. `artifact-files.json` records all nine original
artifact files with hashes, sizes and PNG dimensions. All nine original UIA
files, including the eight PNG captures, are retained here unchanged. The full
job log and ZIP remain outside git and in the cited Actions artifact.

The original 309,157-byte decoded job log hashes to
`166c1fdd180f7cf9dd4e7377304cde9c260d5525c0df2f745b0706901bd7d252`.
The original 177,211-byte UIA ZIP hashes to
`7e87e433c865cf94d04cd448ab2323c52739813f4d2bd3110f13996aacd8b8a8`.
