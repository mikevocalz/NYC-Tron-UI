# P07 native Display P3 background

ColorDiscPicker now accepts an input-free renderDisc callback with the live HSV value and measured size. Its default renderer remains sRGB; a custom renderer preserves the existing pointer, keyboard and accessibility input owner. The selection center stays transparent with custom rendering, avoiding an sRGB fill over the selected native color.

The independent @nyc-tron/native-controls/DisplayP3DiscLayer export draws a bounded 64×64 native Canvas with SwiftUI Color(.displayP3, ...) on iOS and Compose ColorSpaces.DisplayP3 on Android. Channels are computed as floating point HSV relative to P3 primaries. No RGB8 bitmap or hex conversion lies in this rendering path. It has no interactive state, native resource or gesture owner. Arbitrary document ICC conversion remains a host responsibility.

Both native consumer builds passed, as did workspace TypeScript and the 12 existing/injected-renderer browser regressions. The iOS 27.1 Duo cover consumer displayed the P3 disc; a tap changed the host from hue 0/saturation 1/commits 0 to hue 90.32/saturation 0.503/commits 1. This is a single-path live smoke check, not a recorded two-pass acceptance flow or physical gamut measurement. Android compiled; its P3 interaction is unverified.

Android hosts must choose wideColorGamut activity mode when their product requires it. The library does not alter manifest metadata, orientation, app window dimensions or color mode. The example retains its established manifest and window configuration; no wide-gamut output claim is made for that Android surface. Narrow-gamut output is mapped by the platform. Physical wide-gamut, accessibility narration, desktop and headset acceptance remain open.

References: [SwiftUI color spaces](https://developer.apple.com/documentation/swiftui/color/rgbcolorspace), [Android wide color](https://developer.android.com/training/wide-color-gamut). Compose 1.12.1 is the already configured version; no renderer or engine dependency was added.
