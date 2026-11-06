// Decoded PCM: a raw file of little-endian Float32 samples interleaved by
// channel, `frames` sample frames long.
import ExpoModulesCore

@Record
struct DecodedAudioRecord {
  var uri: String
  var sampleRate: Double
  var channels: Double
  var frames: Double
}
