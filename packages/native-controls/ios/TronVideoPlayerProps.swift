import ExpoModulesCore

final class TronVideoPlayerProps: ExpoSwiftUI.ViewProps {
  @Field var sourceId: String = ""
  @Field var uri: String = ""
  @Field var paused: Bool = true
  @Field var muted: Bool = false
  @Field var volume: Double = 1
  @Field var rate: Double = 1
  @Field var seekTimeUs: Double = 0
  @Field var seekToken: String = ""
  @Field var label: String = "Video"
  var onStatus = EventDispatcher()
}
