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

CI separately validates: (1) typed JS/source contract, (2) generated
C++ Fabric codegen headers, and (3) the VS2026 native C++/WinRT project.
A successful native library build is **not** a launched RNW app. The
actual app's package autolinking and React root, keyboard, Narrator,
high contrast, RTL and real route events still need end-to-end proof.

## Build

```powershell
npm install
npx react-native codegen-windows
msbuild windows/NYCTronFluentFabric.sln /restore /p:Configuration=Release /p:Platform=x64
```

RNW project files expect a solution context (`SolutionDir` locates
`ExperimentalFeatures.props`), so build the `.sln`, not the `.vcxproj`.

**Build evidence (November 5, 2026):** Windows Fabric codegen and native
C++/WinRT compilation passed at commit `607bcada` in
[Actions run 41966875204](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/41966875204).
This establishes the native library build, not a launched consumer app.
Subsequent changes require their own green native compile.
There are no custom Tailwind themes inside WinUI; future resource adapters
must map supported consumer semantic tokens to WinUI XAML resources.

References and license:
- https://devblogs.microsoft.com/react-native/%F0%9F%9A%80react-native-windows-v0-82-is-here/
- https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp
- https://microsoft.github.io/react-native-windows/docs/native-platform-components/
- MIT, Microsoft Corporation. See THIRD_PARTY_NOTICES.md.

## Controlled route acceptance

Destination and Settings items use WinUI `SelectsOnInvoked(false)`.
Invoking an item requests navigation; the selection indicator changes only
when the app commits a new `selectedId`. Rejected or pending navigation keeps
the current route selected. Menu item instances survive pane/title/selection
updates when the destination data is unchanged, preserving keyboard focus.

Required Windows app checks remain:
- Reject a route request, then accept another; inspect the selected indicator.
- Update pane title/open/selected route with keyboard focus on a destination.
- Invoke Settings while a destination is selected; close Settings and restore focus.
- Change destination data and verify focus recovery, including removed items.
- Narrator, high contrast, RTL, resize and pointer/keyboard interaction.

Source guards and native compilation do not substitute for those app checks.
