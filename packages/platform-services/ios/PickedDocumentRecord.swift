// One picked document. `size` and `mimeType` are absent when the provider
// does not say; `bookmark` is present only for open-in-place picks.
import ExpoModulesCore

@Record
struct PickedDocumentRecord {
  var uri: String
  var name: String
  var size: Double?
  var mimeType: String?
  var bookmark: String?
}
