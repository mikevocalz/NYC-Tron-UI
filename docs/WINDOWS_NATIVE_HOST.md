# Windows-native UI execution lane

React Native Windows (RNW) v0.85.0 targets RN0.85.3, uses Windows App SDK
1.8 and Visual Studio 2026. Shared NYC-Tron Expo58/mobile targets RN0.88.
Therefore the native Windows control is **optional** and isolated in
`@nyc-tron/windows-fluent-fabric`; do not downgrade mobile dependencies or import
WinUI into generic `@nyc-tron/ui`.

## Why host-level native XAML

RNW Fabric native components render through the Windows Composition
visual layer. **The April 2026 RNW v0.82 release enabled native WinUI 3 XAML
islands inside Fabric community components**, including layout, input and
accessibility. The old react-native-windows-samples New Architecture FAQ
that calls this "not production ready yet" is superseded by that release.
RNW v0.85 includes a tested C++/WinRT XAML ComboBox example using
`ContentIslandComponentView`, `XamlIsland` and
`SetContentIslandComponentViewInitializer`.

There are two Windows implementations:

1. **Host shell** (`@nyc-tron/windows-fluent`): a WinUI `NavigationView` in
   `packages/windows-fluent/windows/NYCTron.Fluent.WinUI3`, configured at
   runtime for Auto, Left, LeftCompact and LeftMinimal, with native
   invocation and pane state events. The typed controller in
   `src/controller.ts` validates selection IDs. The separate Fabric package
   now implements `WindowsNativeNavigationTransport` and binds its controlled
   snapshots/events to a native NavigationView. The original C# shell remains
   standalone; it does not host a Fabric Composition root. Shell source was
   merged in PRs #12 and #46.
2. **Fabric adapter** (`@nyc-tron/windows-fluent-fabric`, in
   `packages/windows-fluent/rnw-fabric`): a C++/WinRT component
   (`windows/NYCTronFluentFabric/TronNavigationView.cpp`) that hosts the
   NavigationView in a `ContentIslandComponentView`, with RNW Fabric codegen
   from `src/TronNavigationViewNativeComponent.ts`. Merged in PRs #14 and
   #50.

The Fabric package also owns native desktop windows using the app's existing
ReactNativeHost. Its controller maps observed OS lifecycle/display geometry to
`@nyc-tron/core/window-lifecycle`; the consuming app retains its document store,
route selection and close/drop decisions. Its independent exports keep this
runtime outside the Expo 58 UI dependency lane.

## Fabric adapter evidence

`.github/workflows/winui-fabric.yml` runs on `windows-2025` with Visual
Studio 2026. The earlier retained run is
[42158305089](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42158305089)
(2026-11-06, commit `e95f2be1`, success). Its steps run RNW codegen, build the
C++/WinRT library, compile a generated `cpp-app` consumer, deploy it packaged
and run a UI Automation smoke test. The smoke test finds the native items by
their UIA names, checks that Home is selected at launch, and checks that a
rejected request keeps Home while an accepted one moves the selection.
Details and screenshot hashes: [Windows UIA smoke evidence](completion/evidence/windows/README.md).

That evidence predates the navigation transport and native window additions.
Their updated workflow installs an actual archive, compiles/deploys its
consumer, and records the exact archive hash only after the native checks pass.
The release preserves those tested bytes rather than rebuilding its desktop
archive afterward. Current run identities and limits belong in the
[candidate report](completion/reports/V1-RELEASE-GATES.md).

## Still unverified

- Narrator speech. The smoke test reads UIA names; nothing is spoken.
- High contrast themes.
- An RTL run. The `isRTL` prop is compiled and wired but not exercised.
- Window resize, pane collapse and compact mode.
- Pointer input, Settings focus return and `onNativeError` delivery.
- Any machine other than one GitHub-hosted `windows-2025` runner; no signed
  build.
- Physical cross-window drag/drop and hardware display changes beyond the
  controller's verified state transitions.
- Consumer Moyo workspace theme adapter; no global Fluent palette or app route
  migration from Expo Router.

### Implementation references

- Official new support: https://devblogs.microsoft.com/react-native/%F0%9F%9A%80react-native-windows-v0-82-is-here/
- 0.85 official upstream XAML Fabric example:
  https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp
- Windows-only Fabric adapter must declare codegen types, create a XAML island
  inside a ContentIslandComponentView, use native NavigationView events and
  preserve the app's controlled route/open state. It must maintain the
  **separate** RNW 0.85 / RN 0.85.3 peer lane.
- Do not directly embed a Fabric Composition root into a XAML UIElement slot
  or use UWP/Paper-era APIs.
