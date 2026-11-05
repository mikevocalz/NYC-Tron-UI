# NYC-Tron native navigation (Expo SDK 58)

**Independent native module** exposing a controlled, vertically centered
navigation rail through real Android **Material3 NavigationRail/NavigationRailItem**
and iOS **SwiftUI Button** controls. It uses the verified SDK 58
`ExpoUIView` native-view DSL, not yet-unsupported Expo Modules v2 view macros.

Use `@nyc-tron/native-navigation/NativeNavigationRail` only in a verified
Expo SDK 58 development app. The consuming app still decides device family,
navigation shell and **physical edge**: ordinary phones keep bottom tabs;
foldables (including covers), tablets and headsets keep the rail physically
RIGHT even with RTL content, per the pinned foldable layout skill.
Web app navigation remains a header plus compact bottom tabs; the package's
functional RN web fallback does not force a web side rail.

```tsx
import { NativeNavigationRail } from "@nyc-tron/native-navigation/NativeNavigationRail";

// Host NavigationShell places this on the physical RIGHT.
<NativeNavigationRail
  items={[{id:"home",label:"Home",glyph:"⌂"},{id:"class",label:"Classes",glyph:"▤"}]}
  selectedId={routeId}
  onSelectionChange={navigate}
  height={usableRailHeight}
  activeColor={theme.colors.primary}
  foregroundColor={theme.colors.foreground}
  backgroundColor={theme.colors.surface}
/>;
```

No route state, display identity inference, theme CSS, raw HTML, WebView,
Rust/Tally engine or video/audio module is bundled. Required native module
autolinking comes from Expo prebuild; Expo Go without a matching custom
development client is not supported.

**Native icon gap:** Current rail accepts app-provided readable glyphs (or
accessible initial-letter fallback). The original @nyc-tron/icons/Rive
outline-selected animation adapter remains a separate enhancement and must
not be claimed here. System contrast and screen reader tests are pending.

Validation: source/TS tests, actual Gradle Compose and Xcode SwiftUI builds
run in the stacked draft branch CI. Surface Duo and headset hardware
testing is a separate physical acceptance gate.
