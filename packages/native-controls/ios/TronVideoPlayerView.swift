import SwiftUI
import ExpoModulesCore

struct TronVideoPlayerView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronVideoPlayerProps
  var body: some View { TronAVPlayerSurface(props: props) }
}
