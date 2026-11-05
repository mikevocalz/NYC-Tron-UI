import SwiftUI
import ExpoModulesCore

extension View {
  /// The @expo/ui Host lays this view out in SwiftUI, so React Native's
  /// measure() must skip the view's Yoga origin. Publishing a zero content
  /// origin does that; Expo Modules Core clears it on teardown. This is the
  /// one behaviour ExpoUI's UIBaseView wrapper added that these views rely on.
  func zeroContentOrigin(_ shadowNodeProxy: ExpoSwiftUI.ShadowNodeProxy) -> some View {
    onAppear {
      shadowNodeProxy.setContentOrigin?(.zero)
    }
  }
}
