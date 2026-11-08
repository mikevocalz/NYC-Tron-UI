// A raw audio source as JS sends it: a file of little-endian interleaved
// PCM samples ("f32" or "s16").
import ExpoModulesCore

@Record
struct EncodeAudioRecord {
  var uri: String
  var sampleRate: Double
  var channels: Double
  var sampleFormat: String
  var frames: Double
}
