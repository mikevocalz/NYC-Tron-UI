# AppKit compiler failure at the 4c96008 candidate

[Run 42864533576](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42864533576)
passed canonical core packaging, native ARM64/toolchain verification, the actual
Swift isolated-conformance compiler probe, clean archive consumer preparation,
and the installed public API snapshot. The standalone native build then failed
in the `NYCTronAppKit` target. Native interaction checks and the success-only
tested-package upload were skipped.

The actual toolchain was **Xcode 26.2 (17C52), Apple Swift 6.2.3, macOS 26.2 SDK**.
The toolchain file, probe source, and empty successful compiler output are copied
from the verified artifact. The job's passed probe step supplies the execution
result; empty compiler output alone is not treated as a pass.

## Exact failure

`NYCTronPopover.mm` has two primary compiler errors:

- Line 83: `reference to 'Point' is ambiguous`.
- Line 84: `reference to 'Size' is ambiguous`.

The compiler identifies both Apple's global `MacTypes.h` declarations and the
`facebook::react` types. The other six errors follow from the missing `origin`
and `size` variables. `compiler-errors.txt` retains the original numbered
diagnostics and target command. `provenance.json` records the full build log's
hash and the exact excerpt ranges.

The subsequent source correction explicitly qualifies both React Native types.
It also renames the private driver's `Rect` dictionary helper after checking the
global `Rect` typedef in Apple's
[MacTypes.h source](https://github.com/apple-oss-distributions/CarbonHeaders/blob/main/MacTypes.h).
That driver had not reached compilation in this run. The helper rename is a
source correction, not an additional observed CI diagnostic. The later build
must verify both changes and the earlier driver dependency-helper repair.

## Provenance and limits

The PR head was `4c96008d313deb371fa9f7e62399dbb75fd908be`. The actual preparation
receipt records GitHub merge checkout
`fdca922cbde782481f086aa58928da03d6d6aba0`. Both have tree
`a81d31683021fd2047acdb60aefca77b7191069f`; their distinct identities are retained
in `checkout.json`.

Artifact `13788885973`, `macos-appkit-native-evidence`, was downloaded and
verified against GitHub's SHA-256 before extraction:

`979468281e04d122c6bcd1279c056727dcf7475a1fd4220b1049d7b73b0bc45b`

The metadata, passed/failed/skipped job steps, prepared package identities and
selected raw evidence are retained here. Full build binaries are not copied.
No reference app launched, and no ordinary React responder, native control,
popover, window or drag interaction passed in this run. Prepared archive hashes
identify build inputs and do not represent a natively tested distribution.
