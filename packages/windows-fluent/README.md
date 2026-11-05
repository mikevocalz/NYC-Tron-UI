# @nyc-tron/windows-fluent — native WinUI 3 NavigationView host

Native **WinUI 3 XAML control** plus a small independently testable TypeScript
state/transport contract. This is **not** a React Native Windows Fabric custom
component yet; it deliberately lives at the Windows app host boundary.

## Supported now

- Real native `NavigationView` control, WinUI 3 Windows App SDK 1.8,
  `net10.0-windows10.0.19041.0`, source in `windows/NYCTron.Fluent.WinUI3`.
- `Auto`, `Left`, `LeftCompact` and `LeftMinimal` presentation modes.
- Native menu/footer destinations with optional Segoe Fluent glyphs,
  selected item, pane title and settings visibility.
- Native `ItemInvoked`, `PaneOpened`, `PaneClosed`, settings callbacks.
- `src/controller.ts` provides strict controlled reconciliation: no
  changing the app's selected route without the app confirming it; blocks
  disabled/stale selection, deduplicates updates and supports unsubscribe.
- The native shell can embed a **XAML UIElement** from an app that supplies one.

## Explicitly not connected yet

**React Native Windows 0.85 uses Composition/Fabric.** Its official
architecture documentation says embedding WinUI XAML inside a Fabric
`ComponentView` is not production ready. The WinUI source in this package
is native, but the `WindowsNativeNavigationTransport` interface is not yet
connected to a real RNW TurboModule and React Native Fabric root cannot
be directly put in the XAML `SetHostedContent` slot. Do NOT claim that this
source is already an end-to-end React Native Windows navigation component.

A host integration follow-up must either embed a verified compatible
WinUI 3 root around the RNW Composition island or use a validated
platform-native hosting API to connect transport callbacks. That requires
a Windows host project, Visual Studio 2026 and native build/test evidence.

### Consumer-facing controller (nonvisual)

```ts
import { createWindowsNavigationController } from "@nyc-tron/windows-fluent/controller";

// `nativeHostTransport` must be an actual implemented RNW-host integration,
// not an empty JS stub or React Native View masquerading as WinUI.
const controller = createWindowsNavigationController(nativeHostTransport, {
  items:[{id:"lessons",label:"Lessons"},{id:"tutors",label:"Tutors"}],
  selectedId:"lessons",
  paneMode:"auto",
  paneOpen:false,
  paneTitle:"Moyo Learn",
}, {
  onSelectionRequested:id => router.navigate(id),
  onPaneOpenRequested:open => navigationStore.setState({open}),
});
controller.update(nextAppState); // update only when app route/store changes
controller.dispose();
```

### No mobile dependency

An app using `@nyc-tron/ui/components/Button` or
`@nyc-tron/panes/AdaptivePaneHost` does not have to import RNW, WinUI or
the Windows App SDK. Moyo, NYC-MON and Nitro Forge retain their own
Tailwind v4/Uniwind tokens and app route owners.

The isolated Windows native shell is conceptually different from
`@nyc-tron/ui/components/navigation/CollapsibleDrawer`, which is a
portable RN UI, **not** native WinUI. Native Android foldables keep their
physical RIGHT rail even when content is compact.

## Windows build

```powershell
dotnet restore windows/NYCTron.Fluent.WinUI3/NYCTron.Fluent.WinUI3.csproj
dotnet build windows/NYCTron.Fluent.WinUI3/NYCTron.Fluent.WinUI3.csproj -c Release -p:Platform=x64
```

This requires Windows 10 SDK / Windows App SDK / .NET 10 and a supported
MSBuild/VS installation. Linux CI can test TS and source but cannot
compile this XAML library. Windows CI is separately gated.

### Sources

- [React Native Windows New Architecture](https://microsoft.github.io/react-native-windows/docs/new-architecture/)
- [React Native Windows 0.85 native components](https://microsoft.github.io/react-native-windows/docs/native-platform-components/)
- [WinUI 3 NavigationView](https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/navigationview)
- [RNW 0.85 release and toolchain](https://devblogs.microsoft.com/react-native/react-native-windows-v0-85-is-here/)

No raw HTML, WebViews, WinUI-only theme imposed on consumers, or fake
component shortcuts. Native XAML compile, host bridge and Narrator/manual
acceptance are separately recorded in NYC-Tron's readiness roster.
