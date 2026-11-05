// What JS asks the document picker for. `types` holds MIME types
// ("image/png"), extensions (".nfd") or UTType identifiers; `mode` is
// "import" (a copy the app owns) or "open-in-place" (the original, with a
// security scope and a bookmark).
import ExpoModulesCore

@Record
struct PickOptionsRecord {
  var types: [String]
  var multiple: Bool
  var mode: String
}
