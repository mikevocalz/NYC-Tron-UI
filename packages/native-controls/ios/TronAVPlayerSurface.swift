import SwiftUI
import UIKit
import ExpoModulesCore

struct TronAVPlayerSurface: UIViewRepresentable {
  @ObservedObject var props: TronVideoPlayerProps
  func makeCoordinator() -> TronVideoPlayerCoordinator { TronVideoPlayerCoordinator() }
  func makeUIView(context: Context) -> TronPlayerLayerView {
    let view = TronPlayerLayerView()
    view.playerLayer.videoGravity = .resizeAspect
    view.playerLayer.player = context.coordinator.player
    return view
  }
  func updateUIView(_ view: TronPlayerLayerView, context: Context) {
    view.accessibilityLabel = props.label
    context.coordinator.update(props)
  }
  static func dismantleUIView(_ view: TronPlayerLayerView, coordinator: TronVideoPlayerCoordinator) {
    view.playerLayer.player = nil
    coordinator.close()
  }
}
