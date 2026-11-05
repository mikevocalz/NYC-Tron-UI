# Windows-native UI execution lane

React Native Windows (RNW) v0.85.0 targets RN0.85.3, uses Windows App SDK
1.8 and Visual Studio 2026. Shared NYC-Tron Expo58/mobile targets RN0.88.
Therefore the native Windows control is **optional** and isolated in
`@nyc-tron/windows-fluent`; do not downgrade mobile dependencies or import
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

Our first implementation remains a genuine WinUI `NavigationView` at the
Windows app **host shell** boundary, but we can now implement a separately
version-pinned **Fabric native component adapter**. We must not claim that
adapter works before native compilation and a live RNW host test.

The source in `packages/windows-fluent/windows/NYCTron.Fluent.WinUI3`
provides a real XAML NavigationView, configured at runtime for Auto,
Left, LeftCompact and LeftMinimal, and native invocation/pane state
events. A typed controlled JS controller prepares changes and validates
selection IDs before any future native transport implementation.

## Next blocking integrations

- RNW 0.85 compatible host app with WinUI root/Composition island in a
  **supported** native hosting configuration; no direct Fabric-to-XAML
  component construction assumed.
- Actual RNW TurboModule or host IPC transport implementing the TS interface
  `WindowsNativeNavigationTransport`, with native events.
- Signed Windows build evidence and interactions for Narrator,
  high-contrast, resizing, keyboard focus, menus, selection and RTL labels.
- Consumer Moyo workspace theme adapter; no global Fluent palette or
  app route migration from Expo Router.
- Windows tests must distinguish successful WinUI control source compile
  from a fully working React Native Windows renderer.

### Current implementation path

- Official new support: https://devblogs.microsoft.com/react-native/%F0%9F%9A%80react-native-windows-v0-82-is-here/
- 0.85 official upstream XAML Fabric example:
  https://github.com/microsoft/react-native-windows/blob/react-native-windows_v0.85.0/packages/sample-custom-component/windows/SampleCustomComponent/ComboBox.cpp
- Windows-only Fabric adapter must declare codegen types, create a XAML island
  inside a ContentIslandComponentView, use native NavigationView events and
  preserve the app's controlled route/open state. It must maintain the
  **separate** RNW 0.85 / RN 0.85.3 peer lane.
- Do not directly embed a Fabric Composition root into a XAML UIElement slot
  or use UWP/Paper-era APIs.
