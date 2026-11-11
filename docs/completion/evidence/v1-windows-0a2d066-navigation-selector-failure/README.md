# External Windows navigation: measured progress, failed drawer assertion

The completed native job for external PR60 head `0a2d0661ef651be6b2ea6c5586f58bce686973c6` compiled and deployed the consumer, then failed with **“The actual native drawer did not collapse and expand.”** It exited with code 1. The native distribution retention and upload steps were skipped. This receipt preserves the complete source and native job logs plus the adjacent native runs that isolate the preceding width/alignment change. It does not establish complete native acceptance or a supported unelevated host.

## Exact executed sources

| Source head | Run / native job | Actual checkout from native log line 111 | Complete tree |
| --- | --- | --- | --- |
| `0b99266c09723b73bf4c4be061d7ed8de4935fc2` | [42996235176](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42996235176) / 130441347661 | `943ed8086eb3964821ee7d87221a00b9a7046193` | `5781b08ebc128a526d19989f9406d7524a4171f4` |
| `c9ddfcfa9e173e3eb056a7eb46ff7f2d99c54f2d` | [42998020660](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42998020660) / 130447331638 | `87df9ba9a287e7761f73392c7851e249ecc2c6c6` | `326f7b99269ca17629ecef462721123c9b6bb291` |
| `0a2d0661ef651be6b2ea6c5586f58bce686973c6` | [42999747451](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42999747451) / 130453312644 | `f705fd2b678298d810b715963908f31c4086ac5f` | `328cc454cb1a5022955bf8aa93741584a3a6be4e` |

All three were completed attempt-1 `pull_request` runs. Each generated merge has ordered parents `ac5d69585a52a6e945dc996ea08030e190574699` followed by its stated source head. All 2,076 leaves and 284 tree objects were independently checked for each source tree. The generated merge tree matches its source head. The current source log separately records `f705fd2b` at line 123. [metadata.json](metadata.json) retains the completed job/step and artifact snapshots.

These are external helper sources. Their drag lifecycle files remain `d7c28b55 / 561bd52c / 2d88c353`; they do not contain the reviewed `a2148fdc / be0d4e84 / 0c3ae907` corrections in PR63. No result here transfers to that different candidate.

## What the 0a2 run establishes

The [source log](source-job.log) records 13 passing source tests and then the full Fabric suite with **49 passing tests, zero failures, cancellations or skips**. The 13 are included in the 49; they are not 62 distinct tests. Durations were 56.222783 ms and 121.861975 ms respectively. The isolated API check matched one package, eight typed subpaths and 44 reachable declarations. This is not the separate 1,204-test root suite.

The [native log](native-job.log) and completed steps record successful script validation, native package compilation, consumer compilation and deployment. Navigation progressed through settings focus return, three resize selection checks, the RTL selection observation and a reported RTL screenshot. It then reported LTR, close-pane and open-pane actions. The first drawer failure is line 2064 at 10:08:20.8599475 UTC; exit 1 is line 2081. The stack at line 2075 points to the final rethrow after cleanup, not a separately identified failing provider call.

The app was reported alive at failure, with its original HWND still belonging to PID 880. The high-contrast acceptance stage was not reached. Reported screenshot paths and the UIA tree are evidence of capture attempts; their actual image/member contents have not been inspected.

Four retained console environment summaries report app PID 880 and existing-shell PID 3708 with High integrity RID 12288, TokenElevation 1, elevation type 1 and UIAccess 0. Shell eligibility remained `observed-ineligible`: eight true, two false and two unobserved predicates. Native progress does not promote this environment to supported-host acceptance.

## What the adjacent runs isolate

The complete map comparison from `0b99266` to `c9ddfcf` changes **only** `TronNavigationView.cpp`, from blob `88a7321c` to `785dffe4`. It adds a method that assigns the owned `TogglePaneButton` a compact width and left alignment, then invokes it after props and in the existing low-priority callback. The UIA navigation script is identical between those heads.

Before that mutation, [0b9's native log](adjacent-0b99266-native.log) failed the strict toggle-mirroring assertion at line 2005. The later RTL trace had a 320-wide NavigationView and a 320-wide toggle. After it, [c9's native log](adjacent-c9ddfcf-native.log) reached the later drawer assertion, which failed at line 2019. Its later RTL trace had a 320-wide NavigationView and a 48-wide toggle. The sole `c9ddfcf` to `0a2d066` change adds pane diagnostics in the navigation script; it preserves the selection comparator, predicates and waits.

Both c9 and 0a2 native traces record the NavigationView width changing from 48 when closed to 320 when reopened. These are **native container observations**, distinct from the UIA candidate selected by `Native-Pane`. The trace's positions are relative to the NavigationView, not screen coordinates, and do not independently prove rendered mirroring or physical-left placement.

The width mutation is not endorsed by this receipt. The pinned WinUI source deliberately includes the pane title inside the toggle when appropriate. The same retained trace narrows its first named ContentPresenter from 272 to 4 and the title TextBlock from 60 to 22. That warrants preserving the native title layout when designing a better RTL witness. No clipped pixels were inspected.

## Selector defect and remaining uncertainty

The executed `Native-Pane` selects the largest `Width * Height` among descendants named `NYC-Tron`, without rejecting empty, nonfinite or offscreen candidates. Microsoft's [Rect.Empty contract](https://learn.microsoft.com/en-us/dotnet/api/system.windows.rect.empty?view=windowsdesktop-10.0) assigns negative-infinite dimensions; their product is positive infinity. Such a candidate can replace a valid pane. The pinned NavigationView template also assigns the navigation name to `MenuItemsHost`, so the name alone is not unique.

That is a demonstrated source/geometry hazard. **The exact failed runtime candidate and its closed/open UIA measurements remain unknown** because the pane breadcrumb file is in an uninspected artifact. The console does not establish whether this run's assertion reflects the selected measurement target or a shipping pane-behavior defect. Control-flow progress through the older physical-left predicate is therefore not independent proof of valid physical-left geometry.

A separate primary-source audit has also revised the earlier ownership assessment: the [official .NET implementation](https://source.dot.net/Microsoft.Private.Windows.Core/Windows/Win32/PInvokeCore.SystemParametersInfo.cs.html), pinned to `dotnet/dotnet@461c220b`, explicitly contradicts the [Win32 reference's LocalFree requirement](https://learn.microsoft.com/en-us/windows/win32/api/winuser/ns-winuser-highcontrastw) for the GET scheme pointer. Copying that borrowed pointer without freeing it is source-supported; our owned SET allocation still requires its existing cleanup. This does not identify the historical driver-crash cause, and no underlying Windows implementation was inspected.

## Retention and limits

The four complete logs preserve their original decoded UTF-8 bytes, including BOM and line endings. Their Git and SHA-256 identities were computed independently, created as immutable blobs and verified by exact readback. [provenance.json](provenance.json) contains all identities, line references, source comparisons and interpretation limits.

The 0a2 UIA artifact is `13846136835`, reported size 508,213 bytes and digest `9dad2b4608549a0155acff413140c1292f50c8f367558e4cc7f886caac9298a8`; the upload reports 57 files. The adjacent artifact identities are retained in metadata. **All ZIPs remain unextracted and all PNGs/raw member files uninspected.** Their digests and member counts are producer/API reports, not independently recomputed archive hashes.

The later external `594b6170` source and its outcomes are outside this receipt. No source, workflow, host, security setting or ref was changed to collect these records, and no run was dispatched or rerun. Full native, final combined-source and eight-platform acceptance remain separate gates.
