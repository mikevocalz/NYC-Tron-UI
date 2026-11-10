# AppKit compiler failure at the fd86e17 candidate

[Run 42854433102](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42854433102)
passed canonical core packaging, native ARM64/toolchain verification, the actual
Swift isolated-conformance compiler probe, clean archive consumer preparation,
and the installed public API snapshot. The standalone native build then failed
in the private acceptance-driver target. Native interaction checks and the
success-only tested-package upload were skipped.

The actual toolchain was **Xcode 26.2 (17C52), Apple Swift 6.2.3, macOS 26.2 SDK**.
The toolchain file, probe source, and empty successful compiler output are copied
from the verified artifact. The job's passed probe step supplies the execution
result; empty compiler output alone is not treated as a pass. This run progressed
past the previous candidate's Xcode 16.4 ExpoModulesCore errors.

## Exact failure

The sole compiler error in the retained full build log is:

`fatal error: 'yoga/style/Style.h' file not found`

Its include chain starts in `NYCTronAcceptanceDriver.mm`, through the installed
`NYCTronPopover.h` and React Fabric view headers, and ends in
`YogaStylableProps.h`. `compiler-errors.txt` retains the original numbered
diagnostic and target command. `provenance.json` records the full build log's
hash and the excerpt ranges.

The private driver's pod configuration lacked the required Yoga header path.
The subsequent source correction calls the pinned RNmacOS
`install_modules_dependencies(s)` helper for the adapter and driver. That
helper supplies the private Yoga path, transitive Fabric dependencies and the
matching C++ flags. The driver calls it after its existing test-driver xcconfig,
which the helper merges and preserves. The later build must verify the repair;
this directory contains no native interaction or passed-distribution claim.

## Provenance and limits

The PR head was `fd86e17369c68b7b6d1a588ceee8349a6f248dd3`. The actual preparation
receipt records GitHub merge checkout
`0c97bf7f6c3ddf9cac2ae25864c298580d62df76`. Both have tree
`ff49f2a345c781741cce3257686b4379aa43d85e`; their distinct identities are retained
in `checkout.json`.

Artifact `13785568135`, `macos-appkit-native-evidence`, was downloaded and
verified against GitHub's SHA-256 before extraction:

`38a2f37c7fd81db64874dcb3bda460640f907946638311ba53f487c78e7ee7fe`

The metadata, passed/failed/skipped job steps, prepared package identities and
selected raw evidence are retained here. Full build binaries are not copied.
The separate responder-coordinate correction was not part of this tested tree,
and neither it nor the dependency-helper repair has native acceptance evidence
in this directory.
