# Native WinUI 3 NavigationView inside React Native Windows 0.85 Fabric

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
3. The generated `cpp-app` consumer, built through its solution, with a
   Release bundle that contains one React, one react-native-windows and
   no core react-native files.
4. A UI Automation smoke test of the packaged consumer deployed with
   `run-windows`: the native items are found by their Narrator names,
   Home is selected at launch, Down+Enter on Workspace raises a pending
   request while Home stays selected, Reject keeps Home, and Accept moves
   the native selection to Workspace. Screenshots are uploaded as the
   `winui-fabric-uia-smoke` artifact.

Not covered by CI: Narrator speech output, high contrast, an RTL locale
(the `isRTL` prop is compiled and wired but not exercised), resizing,
pointer input, Settings focus return, and `onNativeError` delivery.

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

**Evidence (November 5, 2026):** all four lanes above passed at commit
`7ce5473` in
[Actions run 42053160714](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42053160714).
Subsequent changes require their own green run. The latest green run is
[42158305089](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305089)
(2026-11-06, commit `e95f2be1`), with the UIA smoke step passing; its
screenshots and hashes are recorded in
`docs/completion/evidence/windows/README.md`. No file in this package has
changed between `e95f2be1` and `d5207cc7`.

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
