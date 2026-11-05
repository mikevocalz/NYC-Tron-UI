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
to be Fluent. The native component expects a bounded width/height
and should be placed on the physical LEFT inside the Windows desktop shell.
Its app-owned route, keyboard focus and theme are outside the component.

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

### Build

```powershell
npm install
npx react-native codegen-windows
msbuild windows/NYCTronFluentFabric/NYCTronFluentFabric.vcxproj /p:Configuration=Release /p:Platform=x64
```

**State:** Native source is under active development; no claim of passing
compilation or end-to-end interaction until Windows CI proves it. The XAML
host-only .NET package from parent PR #12 is already compiled, but this
Fabric component is a different integration requiring its own native build.
There are no custom Tailwind themes inside WinUI; future resource adapters
must map supported consumer semantic tokens to WinUI XAML resources.

References and license:
- https://devblogs.microsoft.com/react-native/%F0%9F%9A%80react-native-windows-v0-82-is-here/
- https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp
- https://microsoft.github.io/react-native-windows/docs/native-platform-components/
- MIT, Microsoft Corporation. See THIRD_PARTY_NOTICES.md.
