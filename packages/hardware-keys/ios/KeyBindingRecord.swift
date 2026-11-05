// One binding JS asks iOS to intercept, split into the parts a UIKeyCommand
// needs. `binding` is the portable string ("Mod+Shift+S"); `key` is its
// canonical key ("S", "ArrowUp", "F5").
import ExpoModulesCore

@Record
struct KeyBindingRecord {
  var binding: String
  var key: String
  var mod: Bool
  var ctrl: Bool
  var alt: Bool
  var shift: Bool
  var title: String
  var overridesSystem: Bool
}
