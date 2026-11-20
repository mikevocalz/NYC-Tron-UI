---
name: "WindowChromeModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/core/window-chrome"
tier: 2
docs: "generated"
platforms: []
category: "primitive"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# WindowChromeModule

## Purpose

<!-- generated:begin purpose source=packages/core/src/window-chrome.ts -->
_Not documented._
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/core/package.json,packages/core/src/window-chrome.ts -->
- Package: @nyc-tron/core
- Import: `import { DEFAULT_WINDOW_CONTROL_LABELS, NO_TITLE_BAR_INSETS, createPageWindowHost, createWindowChromeController, describeTitleBar } from "@nyc-tron/core/window-chrome";`
- Peers: none
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/core/window-chrome
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/core/src/window-chrome.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `DEFAULT_WINDOW_CONTROL_LABELS` | const | `const DEFAULT_WINDOW_CONTROL_LABELS: Readonly<{ readonly macos: Readonly<{ close: "Close window"; minimize: "Minimize window"; restore: "Restore window"; zoo...` |
| `DescribeTitleBarOptions` | interface | `interface DescribeTitleBarOptions { readonly controls: TitleBarControls; readonly zoomed?: boolean; readonly pending?: WindowChromeCommand; readonly labels?:...` |
| `DrawnControlsLayout` | type | `type DrawnControlsLayout = "macos" \| "windows";` |
| `NO_TITLE_BAR_INSETS` | const | `const NO_TITLE_BAR_INSETS: TitleBarInsets;` |
| `PageWindowHost` | interface | `interface PageWindowHost extends WindowChromeHost { readonly zoom: WindowZoomControl; open(spec: OpenWindowSpec): Outcome; focus(windowId: string): Outcome; }` |
| `PageWindowHostOptions` | interface | `interface PageWindowHostOptions { readonly beforeClose?: (windowId: string) => boolean \| Promise<boolean>; readonly onError?: (error: unknown) => void; }` |
| `TitleBarControls` | type | `type TitleBarControls = { readonly kind: "drawn"; readonly layout: DrawnControlsLayout; } \| { readonly kind: "native"; readonly insets: TitleBarInsets; };` |
| `TitleBarInsets` | interface | `interface TitleBarInsets { readonly leading: number; readonly trailing: number; readonly height: number; }` |
| `TitleBarModel` | interface | `interface TitleBarModel { readonly windowId: string; readonly status: "open" \| "minimized" \| "closed"; readonly focused: boolean; readonly leading: readonly ...` |
| `WindowChromeCommand` | type | `type WindowChromeCommand = "close" \| "minimize" \| "restore" \| "zoom";` |
| `WindowChromeController` | interface | `interface WindowChromeController { readonly windowId: string; getSnapshot(): WindowChromeSnapshot; subscribe(listener: () => void): () => void; run(command: ...` |
| `WindowChromeHost` | interface | `interface WindowChromeHost { getState(): WindowRegistryState; subscribe(listener: () => void): () => void; requestClose(windowId: string): Promise<WindowClos...` |
| `WindowChromeSnapshot` | interface | `interface WindowChromeSnapshot { readonly status: TitleBarModel["status"]; readonly focused: boolean; readonly zoomed?: boolean; readonly pending?: WindowChr...` |
| `WindowCloseResult` | type | `type WindowCloseResult = { readonly closed: true; } \| { readonly closed: false; readonly reason: "vetoed"; };` |
| `WindowCommandResult` | type | `type WindowCommandResult = { readonly command: WindowChromeCommand; readonly status: "done"; } \| { readonly command: "close"; readonly status: "vetoed"; } \| ...` |
| `WindowControlDescriptor` | interface | `interface WindowControlDescriptor { readonly command: WindowChromeCommand; readonly label: string; readonly enabled: boolean; readonly pressed?: boolean; }` |
| `WindowControlLabels` | interface | `interface WindowControlLabels { readonly close: string; readonly minimize: string; readonly restore: string; readonly zoom: string; readonly unzoom: string; }` |
| `WindowZoomControl` | interface | `interface WindowZoomControl { isZoomed(windowId: string): boolean; toggleZoom(windowId: string): Promise<void>; }` |
| `createPageWindowHost` | function | `function createPageWindowHost(options?: PageWindowHostOptions): PageWindowHost;` |
| `createWindowChromeController` | function | `function createWindowChromeController(host: WindowChromeHost, windowId: string): WindowChromeController;` |
| `describeTitleBar` | function | `function describeTitleBar(state: WindowRegistryState, windowId: string, options: DescribeTitleBarOptions): TitleBarModel;` |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/core/src/window-chrome.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
