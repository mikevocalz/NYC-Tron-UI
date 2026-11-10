# Native WinUI 3 navigation, overlays and Windows surfaces in RNW 0.85 Fabric

**Independent Windows-only adapter.** This nested package implements a
genuine WinUI 3 `NavigationView` using RNW 0.85's native XAML
`ContentIslandComponentView`, as shown by Microsoft's upstream
`packages/sample-custom-component/ComboBox.cpp` and
`CalendarView.cpp` (tag `react-native-windows_v0.85.0`).

Do not import this package into Expo SDK 58 / RN 0.88 mobile apps.
The Windows lane pins RNW 0.85.0 + RN 0.85.3 and is tested separately.

The UI is a real XAML island in the React Native Fabric component tree,
not the older UWP Paper renderer or a React Native `View` pretending
to be Fluent. The native component expects a bounded height
and should be placed on the physical LEFT inside the Windows desktop shell.
Its app-owned route, keyboard focus and theme are outside the component.

The island is the NavigationView's whole layout box. The wrapper sizes it
from the committed `paneOpen`: 320 px open and 48 px closed, which are
WinUI's default `OpenPaneLength` and `CompactPaneLength`. `paneMode="auto"`
adapts to the island width, not the window, so inside a sidebar-sized
island it resolves to the minimal layout. Use `expanded`, `compact` or
`minimal` when the layout must not change.

The package also binds `@nyc-tron/windows-fluent`'s controlled navigation
controller to that native view and connects `@nyc-tron/core/window-lifecycle`
to real `ReactNativeWindow`/`AppWindow` surfaces. Additional windows use the
existing `ReactNativeHost`, its compositor and JS instance. App-owned
Zustand document state survives secondary close/reopen; no runtime is
reloaded to create a window.

The library builds against the stable Windows App SDK that RNW 0.85
selects (1.8.260508005), the same version the generated consumer app
uses. It is x64 only.

```tsx
import {TronNavigationView} from "@nyc-tron/windows-fluent-fabric";
<TronNavigationView
  items={[{id:"home",label:"Home"},{id:"learn",label:"Learn"}]}
  selectedId={routeId}
  paneMode="compact"
  paneOpen={paneOpen}
  onSelectionRequested={onNavigate}
  onPaneOpenRequested={setPaneOpen}
/>
```

### Validation matrix

CI validates, on `windows-2025` with Visual Studio 2026:

1. The typed JS/source contract and Windows-only TypeScript (Linux job).
2. RNW Fabric codegen and the native C++/WinRT library build.
3. A fresh consumer outside the checkout installs actual core,
   windows-fluent and windows-fluent-fabric tarballs. The generated
   `cpp-app` consumer builds those installed sources through its solution, with a
   Release bundle that contains one React, one react-native-windows and
   no core react-native files.
   Shared peers come from the Ubuntu job's root release packer, compiler
   and complete notices; their exact hashes are required by release
   assembly. Fabric retains its isolated RNW compiler and runtime pins.
4. A UI Automation smoke test of the packaged consumer deployed with
   `run-windows`: the native items are found by their Narrator names,
   Home is selected at launch, Down+Enter on Workspace raises a pending
   request while Home stays selected, Reject keeps Home, and Accept moves
   the native selection to Workspace. Screenshots are uploaded as the
   `winui-fabric-uia-smoke` artifact. The test also opens a real second
   top-level window, verifies both roots observe one document owner,
   minimizes/restores it, vetoes an unsaved OS close, accepts a saved OS
   close, and reopens the ID with the document state retained. The P0 extension
   requires actual MenuFlyout/ContextFlyout invocation, ToolTip display,
   rapid native inspector typing/rejection/reopen, and OS cross-window mouse
   drags that reject, cancel with Escape, lose a target during approval, and
   accept one authorized Move. These added cases require their own green run.
5. Only after those native checks pass, CI retains the original installed
   Fabric tarball, its SHA256SUMS and `tested-package.json` receipt as
   `windows-fabric-tested-package`. Its lockfile integrity must still match
   the original bytes; release assembly uses those tested bytes.

Not covered by this UIA consumer: Narrator speech output, high contrast, an RTL locale
(the `isRTL` prop is compiled and wired but not exercised), resizing,
Settings focus return, `onNativeError` delivery, physical
monitor disconnect/reconnect and mixed-DPI hardware. The P0 fixture adds
synthetic OS mouse drag input; it does not establish physical pointer, touch
or pen acceptance. The native P0 checks are pending until their matching
Windows workflow and archive receipt pass.

## Build

```powershell
npm install
npm run build
npx react-native codegen-windows
msbuild windows/NYCTronFluentFabric.sln /restore /p:Configuration=Release /p:Platform=x64
```

`npm run build` compiles `src` to `dist`, which the package exports point
at. The release tarball also carries `src`, because codegen reads the typed
spec from `codegenConfig.jsSrcsDir` when the consumer builds.

RNW project files expect a solution context (`SolutionDir` locates
`ExperimentalFeatures.props`), so build the `.sln`, not the `.vcxproj`.

**Historical navigation evidence (November 5, 2026):** the earlier
navigation-only consumer passed at commit
`7ce5473` in
[Actions run 42053160714](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42053160714).
Subsequent changes require their own green run. Another navigation-only green run is
[42158305089](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305089)
(2026-11-06, commit `e95f2be1`), with the UIA smoke step passing; its
screenshots and hashes are recorded in
`docs/completion/evidence/windows/README.md`. Those runs do not qualify the
new desktop module. The current commit needs its own Windows native and
UIA pass, with a matching tested-package receipt, before release.

Tier: experimental in v1.0.0. It cannot be installed in an app that uses the
React Native 0.88 packages; see `docs/SUPPORT.md`.

Hosting requirements found by that run:
- The registration sets `XamlSupport(true)` on the component builder.
  Without it RNW never creates its `XamlApplication`, and the island
  renders empty.
- The consumer must run packaged (`run-windows`). The bare
  `x64\Release` executable exits with `0xC0000409` on startup.
- React Native `Button` exposes no Narrator name or `InvokePattern` on
  RNW 0.85; the acceptance app sets `accessibilityLabel` on each Button.
There are no custom Tailwind themes inside WinUI; future resource adapters
must map supported consumer semantic tokens to WinUI XAML resources.

References and license:
- https://devblogs.microsoft.com/react-native/%F0%9F%9A%80react-native-windows-v0-82-is-here/
- https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp
- https://microsoft.github.io/react-native-windows/docs/native-platform-components/
- MIT, Microsoft Corporation. See THIRD_PARTY_NOTICES.md.

## Controlled route acceptance

Invoking a destination or Settings requests navigation. NavigationView
moves its selection on invoke, so the component puts it back on the committed
route; the indicator changes only when the app commits a new `selectedId`.
`SelectsOnInvoked(false)` is not used: NavigationView undoes programmatic
selection of such items, which left the committed route unselected. Rejected or pending navigation keeps
the current route selected. Menu item instances survive pane/title/selection
updates when the destination data is unchanged, preserving keyboard focus.

The pane follows the same rule. When it opens or closes without a new
`paneOpen`, the component sends `onPaneOpenRequested`. A rejected open is
closed again, and a rejected close is reopened when the pane is inline
(`Expanded` display mode); the pane then moves when the app passes the new
value. JS commits arrive after the restore, so an accepted toggle shows the
pane return and then move, as the selection indicator does. In the compact
and minimal display modes the open pane is an overlay that NavigationView
closes on light dismiss, item invoke or a narrower island; the component does
not force it open again, so accept those `false` requests to keep `paneOpen`
and the island width in step.

Required Windows app checks remain:
- Reject a route request, then accept another; inspect the selected indicator.
- Reject a pane toggle (pane returns, island width unchanged), then accept one.
- Update pane title/open/selected route with keyboard focus on a destination.
- Invoke Settings while a destination is selected; close Settings and restore focus.
- Change destination data and verify focus recovery, including removed items.
- Narrator, high contrast, RTL, resize and pointer/keyboard interaction.

Source guards and native compilation do not substitute for those app checks.

## Controller binding

Create one `createWindowsNavigationBinding()` from the `/navigation-binding`
export. Pass its `transport` to `createWindowsNavigationController` from
`@nyc-tron/windows-fluent/controller`, and mount one `WindowsNavigationHost`
from `/navigation-host` with that binding. The application commits route,
pane and theme state; the transport reports native requests. A binding
cannot be attached to two native views, and detached views cannot emit
events into a later attachment. `example/App.tsx` shows the complete
Zustand-owned flow.

## Native desktop owner

Register a component for secondary documents with `AppRegistry`, then call
`createWindowsWindowHost` from `/windows` once in the existing primary
window. Supply `primaryWindowId`, `componentName`, an initially empty
core registry through `owner.getState/commit`, and `onCloseRequested`.
Every secondary root receives `{windowId}` as its initial props and shares
the primary runtime. Keep actual document/session state outside those roots.

`open`, `move`, `focus`, `minimize`, `restore` and `requestClose` invoke
native APIs on the UI dispatcher. The registry receives observed geometry,
status and focus; a failed native request does not commit predicted state.
Window generations and native owner tokens reject late events from a
closed surface or earlier connection. AppWindow close is canceled until
`resolveClose(request, accepted)` answers that generation's one native
close token. Accepted primary close ends the native app's primary surface;
applications should finish document persistence before accepting it.

`captureLayout()` stores bounds/status/order without native tokens or
document data. `restoreLayout()` requires exactly the currently open IDs,
fits them to connected display work areas using the shared core model,
and moves the existing native surfaces. A restored disconnected display
home is retained through unchanged focus/status observations and may be
restored again when that display returns. The adapter observes display
changes; applications decide when to apply their saved layout. It does
not claim physical display reconnection acceptance from unit tests.

Desktop coordinates use one fixed connection scale:
`logical = global physical pixels * 96 / referenceDpi`. The initial
primary's DPI sets that reference; each observed window also reports its
current content DPI and physical bounds. This avoids converting each
monitor's global origin using a different scale. Persisted layouts carry
their reference DPI so the next connection can convert them correctly.

`beginDrag`, `dragOver`, `drop` and `cancelDrag` expose the shared core's
application-input transfer protocol. Only a live, app-approved drop
returns a transfer; the application applies it to its own document state.
Close, minimizing an involved window, restoring layout, or disposal
invalidates pending transfers. Mount the `/drag-drop` native surfaces below
to obtain actual WinUI/Windows gesture transport; the lower-level methods
remain available for application-authored input integrations.

`dispose()` drains accepted commands, closes owned secondary surfaces,
detaches the primary observer and subscriptions, and leaves the runtime
and application document owner alive. Reconnect using an empty registry.
The `/window-controller` export accepts a transport for deterministic
contract tests; shipping apps should use `/windows`, which requires the
registered native module and has no simulated fallback.


## Native menus, tooltips and anchored inspectors

The `/overlays` subpath exports `WindowsMenuButton`, `WindowsContextMenu`,
`WindowsTooltip`, `WindowsPopover` and `WindowsInspector`. Each mounts a
real WinUI Button in RNW's XAML island. Menus use `MenuFlyout`, context menus
use `ContextFlyout`, tooltips use `ToolTipService`, and popovers/inspectors
use a native `Flyout`, `TextBox` fields and native action Buttons.
`CommandMenuItem` is the unchanged shared contract from
`@nyc-tron/core/overlays`. Native popups may extend beyond their anchor-sized
island and remain constrained to the monitor work area.

Pass a nonempty `scopeId` identifying the current document or selection.
A changed scope or new mount starts a distinct native lifetime: the old
popup closes, counts reset, and queued actions or edits cannot reach the
replacement's callback. Handlers consult only committed React props.
Disabled anchors close their popup and reject queued actions/edits; disabled
commands and read-only fields retain the native corresponding state.

The app supplies `label`, command labels/descriptions, optional tooltip,
and supported `theme` (`system`, `light`, `dark`). Unspecified appearance uses
WinUI defaults. The anchor's explicit `style.direction` takes precedence
over the host locale; all popup content inherits that direction. The app
continues to own surrounding layout, density and colors. Popover fields and
actions preserve native control objects while their IDs remain present;
field reorder restores the focused field and selection where available.

A popover's `open` comes from its app owner. Clicking the native anchor or
native dismissal raises `onOpenRequested`; the app commits the resulting
value. WinUI Closing cancellation holds the popup open without closing and
reopening it. Native duplicates are coalesced until a private, scope/request-bound
acknowledgment confirms callback delivery. That acknowledgment never changes
`open`: keeping `open=true` vetoes the dismissal, even without a React render,
and a later Escape or light-dismiss gesture can request again. Disable, unmount
and scope replacement always permit native teardown. `title`, `description`, up to 32 fields, and up to 128 actions form a
native inspector; arbitrary React children are not reparented into the
WinUI popup. Use one app-owned field model for both the inspector and any
other editor surface.

### Acknowledge inspector edits

Every new scope/mount begins with `acknowledgedEventCount: 0` (or omitted).
`onFieldChangeRequested` receives `{scopeId, id, value, eventCount}`. Commit
the requested value **and** that count to accept the edit. Commit the prior
value **and** that count to reject it. Counts are integers from zero through
2,147,483,647. Discard an asynchronous response if its scope changed or its
count is older than an already committed acknowledgment.

```ts
function handleNativeEdit(request: WindowsInspectorEditRequest) {
  editor.setState(previous => {
    if (request.scopeId !== previous.scopeId ||
        request.eventCount <= previous.acknowledgedEventCount) return previous;
    return {
      ...previous,
      value: isAllowed(request.value) ? request.value : previous.value,
      acknowledgedEventCount: request.eventCount,
    };
  });
}
```

Native typing stays visible while an acknowledgment is pending. An older
response cannot reset a newer draft. When the latest edit is acknowledged,
the native field applies the app's committed value; if it already equals
the typed value, the field and caret are untouched. The app must acknowledge
rejected requests too: simply retaining an old value without the new count
does not resolve the edit. Reset counts to zero when replacing `scopeId`
or remounting the field. The consumer demonstrates both decisions and
checks the exact rapid-typed value after blur and reopen.

## Native cross-window drag and drop

Mount `WindowsDragSource` and `WindowsDropTarget` from `/drag-drop` inside
observed roots of the same connected `WindowsWindowHost`. Supply `host`,
`windowId`, a document/selection `scopeId`, and an accessible `label`.
The source takes an opaque `payload` and `onCompleted`; the target takes
an `approve(offer)` callback. One live drop target is allowed per observed
window. Target approval decides whether the offer is allowed; it must not
move or delete document state.

WinUI `CanDrag` starts the actual OS pointer gesture. Its
`DragStartingEventArgs.GetDeferral()` keeps the event alive while the JS
owner creates a core token. The Windows `DataPackage` carries only an
unpredictable native nonce, never the payload or document. A native
`AllowDrop` target uses `DragEventArgs.GetDeferral()` to await app approval.
All acquired deferrals complete once, including native property failures,
owner disposal and deadline expiry. Start/approval waits are bounded to
30 seconds; no custom message pump blocks the UI or JS dispatcher.

Only a live matching source/target generation, a live approved core token,
and the source's actual WinUI `DropCompleted` **Move** result produce
`result.outcome.transfer`. Apply that transfer to the existing app owner.
The example keeps its document/undo payload in the shared store and changes
its owning window only at this final step. Rejection, Escape, target/source
close or minimize, scope replacement, target unmount, layout restore and
disposal invalidate the offer. Late approval cannot resurrect it.

`result.effect` reports the observed Windows result (`none`, `move`, `copy`,
`link`) or `unknown` when cancellation ends a started native gesture before
an OS completion can be observed. An unknown/copy/link result does not
authorize a move. Removing a source/target cannot manufacture a Windows
cancellation receipt; the broker releases its app ownership and deferrals,
and ignores any later completion. External applications cannot obtain the
app-owned document from this private nonce format.

These APIs implement same-runtime app-owned cross-window transfer. External
file/text import, export to another process, touch/pen behavior and Narrator
speech require their own explicit integration and acceptance.

Microsoft API references:

- [WinUI drag and drop](https://learn.microsoft.com/en-us/windows/apps/develop/data/drag-and-drop)
- [DragStartingEventArgs.GetDeferral](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.dragstartingeventargs.getdeferral?view=windows-app-sdk-1.8)
- [DragEventArgs.GetDeferral](https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.ui.xaml.drageventargs.getdeferral?view=windows-app-sdk-1.8)
- [Flyouts](https://learn.microsoft.com/en-us/windows/apps/design/controls/dialogs-and-flyouts/flyouts)
- [Tooltips](https://learn.microsoft.com/en-us/windows/apps/design/controls/tooltips)
