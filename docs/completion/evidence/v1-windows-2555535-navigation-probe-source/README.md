# Private native navigation observation: source review

This receipt covers three reviewed source files for an opt-in Windows example fixture. It does not claim C++ compilation, Windows execution, an RTL geometry pass, or a tested package. The separate PowerShell consumer remains outside this three-file review.

The inspected 782 native run completed a bounded Raw UIA walk with one toggle and zero exact Icon peers. That result does not show that the rendered icon was missing or misplaced. This candidate supplies an observation route through the actual applied XAML template, without creating an accessibility peer or changing the layout.

## Exact source boundary

The baseline is `782ed3911dd35950797f7417fed813f5fa669c4e`. The companion manifest contains complete, uniquely reversible edits and the complete new header.

| Source path | Before | Reviewed candidate |
| --- | --- | --- |
| `packages/windows-fluent/rnw-fabric/windows/NYCTronFluentFabric/TronNavigationView.cpp` | `c23cc7f146477a00669921e3f4826e8ff9f39d69` | `0f450e13031f974641e940cb97f550e83405a517` |
| `packages/windows-fluent/rnw-fabric/example/native/NavigationProbe.h` | Absent | `25555353791ca4b35f1be51e7566c2062ecc8091` |
| `packages/windows-fluent/rnw-fabric/example/scripts/prepare-host.mjs` | `83759b80bea450cf9e823ef7fdcf1b88d65d9ba2` | `07bc119118d38befb91f8aecfc94a67a96adfec4` |

There are six component edits, one preparer edit, and one new private header. All other component and preparer bytes are preserved. No workflow, dependency, launcher, security, public JavaScript/component API, template, layout, focus or accessibility change is included.

## Ownership and measurement

The generated example installs a real IInspectable wrapper implementing a private IUnknown ABI. The two source definitions have the same IID and HRESULT/noexcept signatures. Register accepts borrowed IInspectable pointers, AddRefs them through the projected base before querying their types, and returns an owned IInspectable ticket containing only a bounded uint32 generation. No ReactNonAbiValue or C++ container crosses the DLL/EXE boundary.

The registry holds weak navigation, ContentIsland, component-view and ChildSiteLink references. The component unregisters its exact ticket on Unmounted and before destruction closes the island. The observer verifies its current registry generation and ticket, the still-mounted component's same nonclosed ChildSiteLink, and the same open connected island/XamlRoot before and after measurement. Wrong-thread or other ABI hook failure invalidates fixture availability. Registration failure remains secondary to ordinary component lifetime.

A complete VisualTreeHelper search selects exactly one Button named TogglePaneButton and exactly one AnimatedIcon named Icon below that exact button. All nodes consume a 512-node budget; depth is capped at 24. Truncation, duplicate object identity, missing or ambiguous roles fail. Nothing is selected from an incomplete search.

Navigation, toggle and icon rectangles use each visual's actual local size, `TransformToVisual(nullptr).TransformBounds`, then that same XamlRoot's coordinate converter. Null targets the private island root and includes the navigation's own RTL transform. Width, height and transformed extents must be finite; resulting RectInt32 dimensions and summed edges must remain valid. The converter's physical-pixel integer rounding is retained, with no manual scale multiplication.

The observer rechecks owner and visual identity, visibility, ancestry, connection and geometry. Equality of two successive geometry reads is a sampled stability observation. It does not establish an atomic compositor snapshot or completed rendering. Native HWND ownership is not treated as proof that native outer-window and UIA decoration bounds are identical.

## Fixed private protocol

The example uses one registered observation-only window message. Fixed LocalFolder filenames bind PID, process creation FILETIME, a fresh GUID session, exact prepared source revision, HWND, sequence and phase. The driver supplies no path or action. Each request is bounded to 2 KiB and each reply to 8 KiB; there are at most 128 sequences. Ready and response files are written completely to CreateNew temporary files, flushed and closed, then moved to final names without replacement. Published sequence files are immutable.

The native callback requires the exact owner UI thread. It uses a one-time atomic thread binding before mutable state. Only the fixed observation message is intercepted; ordinary messages continue through DefSubclassProc. The registry and subclass keep no strong visual reference. The protocol is a same-process/example observation contract, not an authentication boundary against other code with access to the same app-local files.

The preparer independently adds the probe include/configuration before native module registration, using the exact existing package-preparation revision. The original provider-registration transform remains byte-identical and idempotent; its early return cannot skip probe preparation. The private header is copied with the example and excluded from the package's shipping files inventory. The shipping component hook remains inactive when the example registry property is absent.

## Review and reproducible checks

Root independently fetched and rehashed all three source blobs, replayed and reversed all seven existing-file edits, checked the full new header and exact ABI agreement, and reviewed the owner/lifecycle/geometry/file boundaries. Desktop independently reviewed the public API and ABI route and identified the added current/retained ChildSiteLink.IsClosed guard. Final identified the first-thread load/store race; the candidate uses compare_exchange_strong before mutable registry access.

The companion harness runs seven focused groups in V8: 168 assertions, 14 executions of the actual authored preparer transform with mocked file/URL boundaries, and 17 finite/overflow geometry model cases. Root independently reproduced the same designs and results. These are source, JavaScript-transform and model checks, not native concurrency tests, PowerShell parsing, Windows file operations or a C++ build.

The harness input identities and result are in source-review.json. Its entry point is `reviewNativeNavigationFixture(input)`; the manifest parameter is parsed JSON and the other parameters are exact UTF-8 source strings. The native manifest and protocol are retained unchanged alongside this receipt.

## Primary contracts and remaining gate

The pinned RNW [ReactPropertyBag.h](https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/vnext/Microsoft.ReactNative.Cxx/ReactPropertyBag.h), Git blob `b592c30bb0a2ea0c2444fcb66e05d910fd89a145`, warns that ReactNonAbiValue cannot safely cross DLL/EXE modules. Both the library and official app pch include unknwn.h before WinRT headers. Microsoft's [classic COM authoring guidance](https://learn.microsoft.com/en-us/windows/apps/develop/cpp-winrt/author-coclasses) supports the selected mixed IInspectable/classic-COM implementation. The public [ChildSiteLink.IsClosed](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.content.childsitelink.isclosed?view=windows-app-sdk-1.8) and [ContentIsland.IsConnected](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.content.contentisland.isconnected?view=windows-app-sdk-1.8) contracts support the connection guards. The manifest records exact pinned source/include identities.

A reviewed consumer and an actual native CI run must still establish compile compatibility, file/message delivery, availability of the actual template roles, and strict LTR-to-RTL geometry. The existing native action, pane, selection, capture, later drawer and other acceptance checks remain required. This source review does not resolve the elevated-host support boundary, attribute any earlier crash, or authorize a passed/tested archive receipt.
