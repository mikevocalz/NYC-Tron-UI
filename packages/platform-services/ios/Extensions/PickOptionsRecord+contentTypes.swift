// The UTTypes a pick allows. Unknown entries are dropped; nothing known
// left means any item, so a typo never produces a picker that shows nothing.
import UniformTypeIdentifiers

extension PickOptionsRecord {
  var contentTypes: [UTType] {
    let known = types.compactMap { entry -> UTType? in
      if entry.contains("/") { return UTType(mimeType: entry) }
      if entry.hasPrefix(".") { return UTType(filenameExtension: String(entry.dropFirst())) }
      return UTType(entry)
    }
    return known.isEmpty ? [.item] : known
  }

  var opensInPlace: Bool {
    mode == "open-in-place"
  }
}
