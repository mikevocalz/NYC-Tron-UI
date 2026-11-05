// What to hand the share sheet: file URIs, text, or both.
import ExpoModulesCore

@Record
struct ShareOptionsRecord {
  var uris: [String]
  var text: String?
  var title: String?
}
