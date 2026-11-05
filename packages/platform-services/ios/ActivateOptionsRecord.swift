// Options for activating the audio session; `category` is an
// AudioSessionCategory from src/playback/session.ts.
import ExpoModulesCore

@Record
struct ActivateOptionsRecord {
  var category: String
  var mixWithOthers: Bool = false
}
