# Windows compiler failure at the 3e2c88f candidate

This directory retains the actual [PR 60 Windows run 42859797630](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42859797630).
All source gates passed. The native job passed the source API snapshot, clean
three-archive installation, installed codegen, generated application, and
consumer TypeScript/owner checks. The installed C++ library then failed to
compile. The executable, deployment, UIA and tested-package steps were skipped.

## Checkout and compiler result

The PR head was `3e2c88f91905b23e2286659948cfcf1970292264`; the native checkout
was merge revision `c8fec3e3471d494350e4b7c993dd800dc39dd56a`. The numbered
checkout excerpt preserves the exact SHA from `git log -1 --format=%H`.
Both revisions resolve to tree `d5fc2c58af6b112bc13fab355b0141b595eb3eff`,
as recorded with their distinct identities and merge parents in `checkout.json`.

Two diagnostics are preserved in `compiler-errors.txt`:

- **C2664:** the installed SDK's `TextChangedEventHandler` supplies an
  `IInspectable` sender, while the application handler required `TextBox const&`.
  The diagnostic traces the mismatched lambda to `TronOverlayAnchor.cpp(195,142)`.
- **C1020:** the portable dismissal regression file reports `unexpected #endif`
  at line 3. Its opening conditional preceded the project's `pch.h` boundary.

The three-file source correction uses the SDK's actual `IInspectable const&`
sender and explicitly casts the attached object to `TextBox`. It also removes
the conditional PCH include from the portable test and marks only that compile
item `PrecompiledHeader=NotUsing`. The remaining library files keep their PCH.
The installed RNW property sheets contain no competing PCH or forced-include
override. Microsoft's [TextChangedEventHandler contract](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.controls.textchangedeventhandler?view=windows-app-sdk-1.8)
defines an object sender, and its [/Yu documentation](https://learn.microsoft.com/en-us/cpp/build/reference/yu-use-precompiled-header-file?view=msvc-170)
explains why code before the PCH include is skipped. The five standard C++17
state assertions compile locally with the corrected standalone file.

The correction is published as PR 60 candidate
`9b902a2506493c0c754a34509eab17923876940d`. Its Windows compilation and UIA
result must be established separately; the local assertion check is not a
substitute for that run.

## Retention and limits

`workflow-jobs.json` and `artifact-metadata.json` preserve the step conclusions
and original artifact listing. Only `windows-fabric-shared-packages` exists.
There is no tested Fabric archive, UIA screenshot or acceptance receipt for
this run. The UIA upload action logged that it found no files.

`provenance.json` records the full decoded native log's original UTF-8 hash,
byte length, numbered excerpt ranges, and skipped gates. Full logs and binaries
are excluded from Git. Excerpts normalize line endings to LF and otherwise
preserve each original line after its added source line number. The preparation
receipt was not uploaded after this failure, so no adapter SHA-256 is inferred.

This failure record provides no native interaction acceptance for either
candidate. The prior island-setter failure remains separately recorded in
`../v1-windows-fc85173-compiler-failure`.
