# Observed input-site failure and bounded native unwind

The original 0ae run crashed while enabling a native drag source. Its reconstructed stack enters `DirectUI::UIElement::NotifyCanDragChanged`, `ConfigureAutomaticDragHelper`, `put_IsDirectManipulationCrossSlideContainer`, and `CInputServices::RegisterDirectManipulationCrossSlideContainer` before `GetIslandInputSiteRegistrationForUIElement` calls the WIL unexpected-failure path. The HRESULT carried by that path is `0x8000FFFF`. This conclusion follows the captured context, exact unwind metadata, matching procedure extents and machine instructions; it does not follow merely from exception code `0xC0000409` or the fault module name.

## Exact inputs and method

The analysis starts with thread 6576's AMD64 context from the original exception stream. The exception record reports XAML address `0x7ffb8331c066`; the captured machine RIP is `KERNELBASE!RaiseFailFastException+0x188`. Those addresses describe different parts of the same explicit failure-reporting path. The original dump SHA-256 is `57a3f44abcfaf498c6c609f4f5bdf79d812276530318dc79be19da3917b75618`.

`binary-provenance.json` retains the official download identities. The WindowsAppSDK 1.8.260508005 nuspec pins Microsoft.WindowsAppSDK.WinUI 1.8.260505002. Its x64 XAML DLL matches the dump's timestamp, image size, CodeView GUID and age. The independently acquired official Microsoft PDB has the matching GUID, image age 2, DBI age 2 and PDB-info age 4, consistent with Microsoft's PDB reader validation rule. Its extracted Pdata and Xdata payloads match the exact PE's corresponding byte ranges.

The calculation reverses the version-1 x64 unwind codes, including three chained entries, using stack bytes from the original dump. Every retained KERNELBASE/XAML PC is an exact instruction boundary immediately after a real call; no frame is partway through a legal x64 epilog. `unwind-instruction-validation.json` retains those exact instruction windows. `unwound-frames.json` retains the runtime-function entries, unwind operations, return-address slots and exact procedure extents. Caller records omit volatile register values; the calculation only restores nonvolatile integer registers needed for this RIP/RSP path.

The calculation stops at `NYCTronFluentFabric.dll+0x342b3`. This run did not retain that library's matching binary/PDB, so no symbol name, source line or further caller frame is asserted for that module. The frames above it establish the native property path. `unwind.py` is the original bounded offline calculation for these preserved inputs, not a general debugger or a Windows-executed test. It rejects unsupported metadata and stops when matched unwind data is unavailable.

## Enable operation and reachable source ordering

At `NotifyCanDragChanged+0x6a`, the restored nonvolatile register SIL is 1. The exact procedure prolog copies the incoming boolean DL into SIL. At `RegisterDirectManipulationCrossSlideContainer+0x103`, restored R12B is also 1; its prolog preserves the requested cross-slide flag from R8B in R12B. This was an enable path, rather than a CanDrag teardown assignment.

The exact PDB source-server revision is `eb74b62692d9cdef17575bc11ebd3514ec6cd5b6`. The independently verified C13 checksum binds the original `InputServices.cpp` compiler input. The function fast-fails when the element's island input site has no matching registration. The caller only bypasses that lookup for the special case of a draggable element while the registration collection is entirely empty.

Our baseline `TronDragSurface.cpp` sets XAML content, calls RNW `Connect`, and then applies `CanDrag` from props. It also applies props whenever the surface exists. Installed RNW 0.85 defers that actual connection until its earlier-registered Mounted handler. Other live islands already exist in this acceptance scene. The source therefore contains a direct path that enables CanDrag for the new island before it is connected and registered, consistent with the captured call chain.

The correction waits for both RNW Mounted and WinUI Loaded, verifies current `IsLoaded`, and verifies the owned ContentIsland remains open and connected before assigning CanDrag/AllowDrop. It replays current props on either real lifecycle event, resets readiness and cancels transfers on loss, and rejects late native handlers. It avoids setting CanDrag even to false after registration is lost because the same upstream lookup can also occur on unregistering the cross-slide flag.

This is a source correction supported by the original crash. Its Windows compilation, scene transition, real cross-window drag gestures and later navigation checks require the next native run. The strict acceptance assertions have not been changed.


## Retained records

The [original crash receipt](../README.md), complete original UIA ZIP and decoded
job log remain unchanged. This directory adds derived analysis only.

| Record | What it establishes |
|---|---|
| [exception-context.json](exception-context.json) | Registers and exception parameters used for the calculation. |
| [unwound-frames.json](unwound-frames.json) | Twenty retained frames, exact unwind operations, restored nonvolatile registers, procedure ranges and the explicit stop at the unsymbolized NYC-Tron DLL. |
| [unwind-instruction-validation.json](unwind-instruction-validation.json) | Exact PE instruction bytes around every retained KERNELBASE/XAML location. |
| [unwind.py](unwind.py) | Original offline calculation with its preserved workspace input paths. It requires the original dump and separately downloaded matching binaries/tables; it is not a portable debugger. |
| [binary-provenance.json](binary-provenance.json) | Official Microsoft/NuGet download URLs and exact PE/package identities. |
| [symbol-provenance.json](symbol-provenance.json) | Original dump CodeView identity, official PDB identity, age validation and exact failing procedure extent. |
| [exact-source-provenance.json](exact-source-provenance.json) | Immutable srcsrv revision, original GitHub SHA-256, explicitly CRLF-normalized compiler-input SHA-256, matching C13 checksum and source-line mapping. |
| [pdb-source-checksum.json](pdb-source-checksum.json), [pdb-procedure-lookup.json](pdb-procedure-lookup.json), [pdb-unwind-rva-lookups.json](pdb-unwind-rva-lookups.json) | Original checksum/line/procedure record fields and independently decoded symbol ranges for all eighteen XAML addresses. |
| [pdb-extracted-streams.json](pdb-extracted-streams.json), [independent-input-verification.json](independent-input-verification.json) | Extracted stream identities and independent byte-for-byte comparison with the exact XAML PE, plus an independent exception-stream decode. |
| [analysis-files.json](analysis-files.json) | Exact byte/hash inventory of the retained analysis records. |

The original GitHub `InputServices.cpp` download contains 626,514 bytes, SHA-256
`6ab47408d7c96932dfb20219ec41db14a5a7084c385b43529dc533a79984dfa0`.
Replacing its LF line endings with CRLF, without changing any other byte,
produces 641,626 bytes and SHA-256
`d452759b32222fed2f6e3aa075a7aa0df43f5d32899b524f44d3e87a9846c816`.
That equals the PDB's C13 compiler-input checksum. The downloaded original is
preserved unchanged outside this compact receipt. Full third-party source,
the 301,977,600-byte PDB and the runtime DLLs are intermediate verification
inputs, rather than vendored source or release assets.

Primary references:

- [Exact InputServices.cpp source revision recorded by this PDB](https://github.com/microsoft/microsoft-ui-xaml/blob/eb74b62692d9cdef17575bc11ebd3514ec6cd5b6/src/dxaml/xcp/core/input/InputServices.cpp).
- [Exact native drag-helper source revision recorded by this PDB](https://github.com/microsoft/microsoft-ui-xaml/blob/eb74b62692d9cdef17575bc11ebd3514ec6cd5b6/src/dxaml/xcp/dxaml/lib/UIElement_Partial_DragDrop.cpp).
- [Microsoft PDB reader matching rules](https://github.com/microsoft/microsoft-pdb/blob/master/PDB/dbi/pdb.cpp): matching GUID, PDB-info age at least the image age, and matching nonzero DBI age. The observed values remain recorded separately as image age 2, PDB-info age 4 and DBI age 2.
- [Microsoft MINIDUMP_MODULE format](https://learn.microsoft.com/en-us/windows/win32/api/minidumpapiset/ns-minidumpapiset-minidump_module) and [LLVM DBI stream format](https://llvm.org/docs/PDB/DbiStream.html).

The analysis proves the retained failure path and supports the readiness
correction. It does not turn this failed run into an OS-drag pass, establish
physical-device behavior or change any component acceptance status.
