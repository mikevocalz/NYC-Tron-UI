# Windows compiler failure at the fc85173 candidate

This directory preserves the failed [PR 60 Windows run 42853882887](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42853882887).
The source gates passed. The native job validated the source API snapshot,
installed the fresh three-archive consumer, generated the native code and
application, and passed the consumer TypeScript and owner tests. It then failed while
compiling the installed Fabric C++ library. The executable build, deployment,
UI Automation and tested-package retention steps were skipped.

## Exact checkout and diagnostic

The PR head was `fc85173985e7e7a2a9d37e2562151b6a70092278`. The native job checked
out GitHub's merge revision `99bb0c171ec404559578b36fd615f1fc5cc66399`.
The original checkout log prints both the merge message and the full checked-out
SHA. `checkout-excerpt.txt` retains those lines; `checkout.json` records the
independently resolved Git trees and parents. Both revisions have tree
`b8c8e1e8409746b5d8290c6d398b2c6a130d0506`; their commit identities are distinct.

The compiler reports **C2039** at `TronOverlayAnchor.cpp(33,16)`:
`ShouldConstrainPopupsToWorkArea` is not a member of the SDK's projected
`winrt::Microsoft::UI::Xaml::XamlIsland` class. `compiler-errors.txt` preserves
the numbered original diagnostic, the failed process exit, and the later
UIA upload warning. The observed environment was Windows Server 2025,
runner image `windows-2025-vs2026` version `20261103.298`, with
MSBuild `18.11.1-1.26513.3+940033be3`.

The source correction removes that unsupported explicit setter and retains
the supported flyout root-bounds setting. Microsoft's
[VisualTree implementation](https://github.com/microsoft/microsoft-ui-xaml/blob/main/dxaml/xcp/core/inc/VisualTree.h)
initializes the underlying work-area constraint to true. No RNW or SDK pin
was changed. The correction is included in PR 60's subsequent
`3e2c88f91905b23e2286659948cfcf1970292264` candidate; that candidate's native
execution is a separate result.

## Retained evidence and limits

`workflow-jobs.json` and `artifact-metadata.json` retain the reported step
conclusions and artifact listing. The only artifact is
`windows-fabric-shared-packages`, the canonical shared dependency archives
from the Ubuntu source job. There is **no** `windows-fabric-tested-package`
and no UIA artifact for this run. The successful upload step means only that
the action handled the missing evidence directory; its log says no files
were found and no artifact would be uploaded.

`provenance.json` records the original full decoded job log's UTF-8 byte
length, SHA-256, retained excerpt ranges, and the skipped gates. The complete
log and binaries are excluded from Git. Each excerpt adds source line numbers
and normalizes line endings to LF while preserving the original per-line
content. The preparation receipt was not uploaded after the compile failure,
so this record attributes the checkout directly to the native job log and
does not invent a prepared adapter SHA-256.

This record establishes the compiler failure. It does not establish native
menu, inspector, tooltip, cross-window drag, navigation accessibility, or
window lifecycle acceptance for this candidate or for the later correction.
