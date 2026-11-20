---
name: "FocusAndA11yLayer"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/shell/FocusAndA11yLayer"
tier: 1
docs: "handwritten"
platforms: ["ios", "android", "web"]
category: "shell"
tokens: []
registryDependencies: []
a11yStatus: "reviewed-pass"
---

# FocusAndA11yLayer

## Purpose

Provider exposing reduce-motion, screen-reader, high-contrast and input-modality state plus announcements, on iOS, Android, web and QNX.

## Install

- Package: @nyc-tron/ui
- Peers: react, react-native, zustand
- Requires: none

### Registry install

```sh
npx shadcn@latest add @nyc-tron/shell/FocusAndA11yLayer
```

After a registry install, import from the installed path. `shadcn add` rewrites the `@/components` and `@/lib` prefixes to the aliases in the app's `components.json`.
- Import: `import { FocusAndA11yLayer } from "@/components/nyc-tron/ui/components/shell/FocusAndA11yLayer";`

### Tarball install

Install @nyc-tron/ui from the release tarball (README, "Installing from a release"), then import from the package:
- Import: `import { FocusAndA11yLayer } from "@nyc-tron/ui/components/shell/FocusAndA11yLayer";`

### Dependencies

- `./a11y-model` (`initialA11yState`, `modalityAfterKey`, `queueAnnouncement`, types, `motionDuration`).
- External: `react`, `react-native` (`AccessibilityInfo`, `Platform`, `Text`, `View`), `zustand` (optional peer).

## Props

Tier-1 reason: R3 shell core. Import count: 0 (other packages: 0).
Also exported from the same specifier: hooks `useA11yPreferences()` and `useAnnounce()`; function `motionDuration(ms, preferences)`; types `A11yPreferences`, `InputModality`, `Politeness`, `FocusAndA11yLayerProps`. Both hooks throw `Error("<name> needs a FocusAndA11yLayer above it")` outside the layer.

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | none | yes |  |
| `initial` | `Partial<A11yPreferences>` | none (all off, modality `"unknown"`) | no | Starting values; the platform overrides them once it reports. |

`A11yPreferences`: `reduceMotion: boolean`, `screenReader: boolean`, `highContrast: boolean`, `inputModality: "keyboard" | "pointer" | "unknown"` (all readonly).

Helpers: `useAnnounce()` returns `(text: string, politeness?: "polite" | "assertive") => void` (default `"polite"`; blank text is ignored). `motionDuration(ms, {reduceMotion})` returns `0` when reduce motion is on and throws `RangeError` for a negative or non-finite `ms`.

### Tokens

none (no literals or classes).

### Unverified

- UNVERIFIED: what VoiceOver, TalkBack and browsers actually speak for announcements; the code queues text and sets the live-region props only.
- UNVERIFIED: `AccessibilityInfo` method availability and behaviour on QNX and Marathon hosts beyond the error codes the file handles.
- UNVERIFIED: whether `AccessibilityInfo.isHighTextContrastEnabled` and `isDarkerSystemColorsEnabled` exist at runtime on the React Native version in use; the file calls them without a guard.

## Variants

`Politeness`: `"polite"` or `"assertive"`, set per announcement; on web it becomes the `accessibilityLiveRegion` of the hidden announcement text. `InputModality` values come from keydown (navigation keys or modified single keys give `"keyboard"`) and pointerdown (`"pointer"`).

## States

| State | How it is set | What the code does |
|---|---|---|
| `reduceMotion, screenReader, highContrast, inputModality` | derived in code | held in a store and read through `useA11yPreferences`. |
| `Announcement` | derived in code | stored with a `seq` that increments so identical text is read again. |
| `read failure (QNX and Marathon only)` | derived in code | an unexpected rejected read is stored and rethrown during render so it reaches an error boundary. Known codes `ERR_QT_ACCESSIBILITY_UNSUPPORTED` and `ERR_QT_ACCESSIBILITY_UNAVAILABLE` are ignored. |

### Motion

none in source. It supplies `motionDuration` and the `reduceMotion` flag for other components.

### Platform notes

- iOS: reads `isDarkerSystemColorsEnabled` and listens to `darkerSystemColorsChanged` for `highContrast`.
- Android, `qnx`, `marathon`: read `isHighTextContrastEnabled` and listen to `highTextContrastChanged`.
- All platforms: reduce motion and screen reader through `AccessibilityInfo`.
- Web: `matchMedia("(forced-colors: active)")` for `highContrast`, `matchMedia("(prefers-reduced-motion: reduce)")` for `reduceMotion`; `keydown` and `pointerdown` capture listeners write `document.documentElement.dataset.inputModality`; announcements render in a hidden 1 by 1 `View` with an `accessibilityLiveRegion` `Text` and `aria-atomic`. Screen reader detection is not available on web (reports the initial value).
- Non-web: announcements call `AccessibilityInfo.announceForAccessibility`.
- Export conditions: `types`, `react-native`, `default`, same file.

## A11y

- Contrast: No visuals.
- Keyboard and focus: Tracks input modality (keyboard or pointer) through capture listeners on web (:111-116).
- Touch target: Not a control.
- Screen reader: Announcements through AccessibilityInfo.announceForAccessibility on iOS and Android and a visually hidden live region on web (:123-137); useA11yPreferences exposes reduceMotion, screenReader, highContrast.
- Motion: Reads reduceMotion from AccessibilityInfo, QNX and web matchMedia (:72-101) and publishes it. No tier 1 component consumes it (F09).
- Review status: **PASS**. Provides announce and preference hooks; web live region present.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=FocusAndA11yLayer
import {Pressable, Text} from "react-native";
import {FocusAndA11yLayer, motionDuration, useA11yPreferences, useAnnounce} from "@/components/nyc-tron/ui/components/shell/FocusAndA11yLayer";

function SaveButton() {
  const announce = useAnnounce();
  const prefs = useA11yPreferences();
  const duration = motionDuration(200, prefs);
  return <Pressable onPress={() => announce(`Saved, ${duration} ms fade`, "polite")}><Text>Save</Text></Pressable>;
}

export function Example() {
  return <FocusAndA11yLayer initial={{reduceMotion: false}}><SaveButton/></FocusAndA11yLayer>;
}
```

## Do/Don't

### Do

- Mount `FocusAndA11yLayer` above any component that calls `useA11yPreferences` or `useAnnounce`, because both throw outside it.
- Wrap animation lengths in `motionDuration` so `reduceMotion` returns `0`.

### Don't

- Don't pass a negative or non-finite value to `motionDuration`; it throws `RangeError`.
- Don't assume `reduceMotion` already changes the library; no tier 1 component consumes it (F09).
- Don't assume what VoiceOver or TalkBack speak for `useAnnounce`; that output is `UNVERIFIED`.
