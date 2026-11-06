// What probe reports. Flat on purpose: JS reads it into MediaProbe
// (toMediaProbe in src/media/decoder.ts) and ignores the video fields when
// hasVideo is false and the audio fields when hasAudio is false.
import ExpoModulesCore

@Record
struct MediaProbeRecord {
  var durationUs: Double
  var hasVideo: Bool
  var width: Double
  var height: Double
  var frameRate: Double
  var videoCodec: String
  var hasAudio: Bool
  var sampleRate: Double
  var channels: Double
  var audioCodec: String
}
