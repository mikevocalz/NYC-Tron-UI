// A bookmark turned back into a URL. `stale` means the file moved or was
// renamed: the URL still works now, but the app should save the new bookmark.
import ExpoModulesCore

@Record
struct RestoredAccessRecord {
  var uri: String
  var bookmark: String
  var stale: Bool
}
