// One hardware keydown as JS receives it. On Apple keyboards Command is
// metaKey; JS maps it to `Mod` with bindingFromChord(chord, true).
import ExpoModulesCore

@Record
struct KeyChordRecord {
  var key: String
  var ctrlKey: Bool
  var metaKey: Bool
  var altKey: Bool
  var shiftKey: Bool
  var isRepeat: Bool
  var recording: Bool
}
