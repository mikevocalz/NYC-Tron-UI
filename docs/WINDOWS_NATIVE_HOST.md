# Windows-native UI execution lane

React Native Windows (RNW) v0.85.0 targets RN0.85.3, uses Windows App SDK
1.8 and Visual Studio 2026. Shared NYC-Tron Expo58/mobile targets RN0.88.
Therefore the native Windows control is **optional** and isolated in
`@nyc-tron/windows-fluent`; do not downgrade mobile dependencies or import
WinUI into generic `@nyc-tron/ui`.

## Why host-level native XAML

RNW Fabric native components render through the Windows Composition
visual layer. The official New Architecture docs explicitly say embedding
WinUI 3 XAML controls as Fabric ComponentViews is not production ready.
To retain **genuine** WinUI `NavigationView` behavior, we implemented
the XAML control at the Windows **app host shell** boundary, separate
from the platform-agnostic JS UI components.

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
