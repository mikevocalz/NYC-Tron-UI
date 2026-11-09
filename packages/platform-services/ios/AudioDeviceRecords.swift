// Records for @nyc-tron/platform-services/audio. Flat shapes mirror
// src/audio/device.ts: the JS side validates every field again.
import ExpoModulesCore

@Record
struct AudioDeviceDescriptorRecord {
  var id: String
  var name: String
  var kind: String // "input" | "output" | "duplex"
}

@Record
struct AudioDeviceProbeRecord {
  var available: Bool
  var defaultSampleRate: Int
  var outputs: [AudioDeviceDescriptorRecord]
  var inputs: [AudioDeviceDescriptorRecord]
}

@Record
struct AudioOpenOptionsRecord {
  var deviceId: String = ""
  var sampleRate: Int = 0   // 0 = platform default
  var channels: Int = 0     // 0 = platform default
  var sampleFormat: String = "" // "" = platform default
  var bufferMs: Int = 2000
}

@Record
struct AudioStreamHandleRecord {
  var stream: String
  var sampleRate: Int
  var channels: Int
  var sampleFormat: String // actual negotiated encoding ("f32" on Apple)
  var latencyMs: Double
}

@Record
struct AudioWriteRecord {
  var stream: String
  var samples: Data
  var sampleFormat: String // "f32" | "s16", must match the negotiated format
  var frames: Int
}

@Record
struct AudioStatsRecord {
  var stream: String
  var sampleRate: Int
  var channels: Int
  var sampleFormat: String
  var queuedFrames: Int
  var capacityFrames: Int
  var droppedFrames: Int
  var underrunFrames: Int
}

@Record
struct AudioPcmRecord {
  var stream: String
  var samples: Data // interleaved f32le
  var frames: Int
  var sampleRate: Int
  var channels: Int
  var sampleFormat: String
}

@Record
struct AudioDeviceEventRecord {
  var stream: String
  var kind: String // "device-lost" | "error"
  var message: String = ""
}
