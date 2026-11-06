# NYC-Tron native controls

Real SwiftUI (Apple) and Jetpack Compose (Android) native controls adapted from AudioKit/Controls MIT semantics.

## Installation

Install @nyc-tron/native-controls and @expo/ui 58 into an Expo SDK 58 development build, then run Expo prebuild and compile native projects. This package does not run in Expo Go without a custom development client.

Native leaf imports: @nyc-tron/native-controls/ArcKnob and @nyc-tron/native-controls/XYPad. Both view trees render inside an @expo/ui Host. iOS registers them with Expo Modules Core's SwiftUI View DSL and does not depend on ExpoUI, so the pod also builds under Expo 58's SwiftPM integration; Android registers them with ExpoUIView.

## Component API

- ArcKnob: label, value, minimum, maximum, step, size, enabled, accentColor, textColor, onPreview, onCommit, onError.
- XYPad: label, x, y, size, enabled, accentColor, backgroundColor, onPreview, onCommit, onError.

Native local preview is ephemeral. onCommit fires on completed gesture or accessibility adjustment only. The document owner must update controlled values and preserve undo; do not make two independent Rust mutations for a single XY control.

## Native-view API compatibility

SDK 58 supports @ExpoModule and @JS 2.0 macros, but @ExpoView and @ViewProps are not available in core. This package uses the supported view DSL registration (core View on iOS, ExpoUIView on Android) until v2 views land. This is not claimed v2 native-view macro support.

iOS SwiftUI and Android Compose source is implemented; Xcode/Gradle compilation and hardware tests are not yet verified. Web/Windows/macOS/XR keep the existing NYC-Tron RN instrument controls.

No raw HTML, WebView, Expo Audio or Expo Video. Source: AudioKit Controls pinned upstream commit 717ce0d6d4e18f2849d484b578e0faf13bb38077; MIT © 2022 Aurelius Prochazka.

Official Expo native skills used: expo-ui, expo-module, expo-native-ui, expo-migrate-module (https://github.com/expo/skills).

### Display P3 disc background

`@nyc-tron/native-controls/DisplayP3DiscLayer` supplies an input-free native color-managed background for `ColorDiscPicker.renderDisc`:

```tsx
<ColorDiscPicker value={p3Hsv} onCommit={setP3Hsv}
  renderDisc={({size,value}) => <DisplayP3DiscLayer size={size} value={value.v}/>}/>
```

HSV here describes Display P3 primaries. The caller must convert document colors into that display space; passing sRGB HSV does not perform a profile conversion. Native SwiftUI `Color(.displayP3, ...)` and Compose `ColorSpaces.DisplayP3` retain the profile until platform rendering. The background has no gesture or state owner, and the existing disc owns input, preview and single-release commit. Its selection center remains transparent so an sRGB thumb cannot cover the P3 color. Default library rendering remains sRGB.

Android hosts must request `android:colorMode="wideColorGamut"` for their activity when appropriate; this library never changes activity, window, orientation or manifest metadata. A narrow-gamut surface receives system mapping. Simulator screenshots cannot prove physical wide-gamut output. No HDR or arbitrary ICC conversion is provided by this layer. The native acceptance consumer has a separate P3 tab.

Platform references: [SwiftUI Display P3](https://developer.apple.com/documentation/swiftui/color/rgbcolorspace), [Android wide color](https://developer.android.com/training/wide-color-gamut).
