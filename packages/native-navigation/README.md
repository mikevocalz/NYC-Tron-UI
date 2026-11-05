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

### Host sizing and accessibility

Native and web renderers use the same finite dimension validation: width >=64
and height >=44 logical units. Defaults remain 80 compact / 208 expanded and
100% host height. Android fills the measured host width rather than forcing
the default width, and its glyphs inherit Material disabled colors.
iOS exposes the native selected trait so VoiceOver can localize selection.

For a React Native row containing content followed by the rail, use
`flexDirection: I18nManager.isRTL ? "row-reverse" : "row"` to keep the rail
physically right while preserving RTL text. The host still supplies hinge-safe
usable geometry; this component does not infer hardware or fold bounds.

### Short usable regions and large text

Both native adapters keep a bounded vertical scroll viewport. A short action
group remains centered; when destinations exceed the usable height, every
destination remains in the scroll content instead of being clipped outside
the rail. SwiftUI expanded labels use scalable system subheadline typography.
The app must still place the rail inside a hinge-safe usable segment.
Compile checks do not prove scrolling, focus reveal, or physical hinge safety;
exercise 20 destinations in a 160-unit-high host with large text and RTL during
device acceptance.
