# @nyc-tron/windows-fluent: native WinUI 3 NavigationView host

Native **WinUI 3 XAML control** plus a small independently testable TypeScript
state/transport contract, used at the Windows app host boundary. The React
Native Windows Fabric component is the separate nested package
`@nyc-tron/windows-fluent-fabric` in [`rnw-fabric/`](rnw-fabric/README.md).

Tier: experimental in v1.0.0 (see [Support policy](../../docs/SUPPORT.md)).

## Supported now

- Real native `NavigationView` control, WinUI 3 Windows App SDK 1.8,
  `net10.0-windows10.0.19041.0`, source in `windows/NYCTron.Fluent.WinUI3`.
- `Auto`, `Left`, `LeftCompact` and `LeftMinimal` presentation modes.
- Native menu/footer destinations with optional Segoe Fluent glyphs,
  selected item, pane title and settings visibility.
- Native `ItemInvoked`, `PaneOpened`, `PaneClosed`, settings callbacks.
- Invoking a destination or Settings raises `DestinationInvoked` or
  `SettingsInvoked`; the shell then puts the selection back on the committed
  route, so the indicator only moves when the host calls `SetSelectedId`.
  `SelectsOnInvoked = false` is not used: NavigationView undoes programmatic
  selection of such items.
- The pane works the same way. When the pane opens or closes without
  `SetPaneOpen`, the shell raises `PaneOpenChanged`. A rejected open is
  closed again, and a rejected close is reopened when the pane is inline
  (`Expanded` display mode); the pane then moves when the host calls
  `SetPaneOpen`. A host that accepts asynchronously sees the pane return and
  then move, as the selection indicator does. In the `Compact` and `Minimal`
  display modes the open pane is an overlay that NavigationView closes on
  light dismiss, item invoke or a narrower window; the shell does not force
  it open again, so accept those `false` requests to keep the host in step.
- Each item's Narrator name is its label; the NavigationView's name is the
  pane title.
- `src/controller.ts` provides strict controlled reconciliation: no
  changing the app's selected route or pane without the app confirming it;
  blocks disabled/stale selection, deduplicates updates and supports
  unsubscribe. It also tracks the last native pane observation, so with a
  transport that does not restore the pane itself, the next `update()` puts
  a rejected pane back even when the app state is unchanged.
- The native shell can embed a **XAML UIElement** from an app that supplies one.

## Fabric adapter and host-shell transport

The Fabric adapter is implemented in
[`rnw-fabric/`](rnw-fabric/README.md): `TronNavigationView.cpp` hosts the
NavigationView in an RNW 0.85 `ContentIslandComponentView`.
`winui-fabric.yml` builds it on `windows-2025` and runs a UI Automation
smoke test of a packaged consumer; the latest run is
[42158305089](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305089)
(2026-11-06, commit `e95f2be1`, success). Apps that render React Native
Windows should use that package.

This host-shell package is a different path. Its
`WindowsNativeNavigationTransport` has no RNW implementation, so the
controller below is not connected to a live RNW host. A Fabric Composition
root cannot be passed to the XAML `SetHostedContent` slot.

Unverified for both packages: Narrator speech, high contrast, an RTL run,
window resize, pointer input and Settings focus return.

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
