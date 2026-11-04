# Native instruments provenance

## AudioKit/Controls

- Original library: https://github.com/AudioKit/Controls
- Reviewed upstream commit: 717ce0d6d4e18f2849d484b578e0faf13bb38077
- Source files inspected: Sources/Controls/Implementations/ArcKnob.swift,
  XYPad.swift, Control.swift, TwoParameterControl.swift.
- Copyright (c) 2022 Aurelius Prochazka. MIT.
- Included here are newly authored adaptations of interaction geometry and
  visual affordances for SwiftUI / Compose, not an embedded or verbatim Swift
  framework. Keep the upstream notice when distributing substantial derivative
  code. Review the pinned upstream file histories before published release.

The complete upstream license text is retained in
licenses/AudioKit-Controls-MIT.txt inside this package.

Expo Modules SDK 58 custom views use ExpoUIView. Expo Modules 2.0 @ExpoView
and @ViewProps are not exposed by the current core; never claim this view is
a native-view-v2 macro implementation without a successful build.
