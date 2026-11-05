// A picked file URL as the record JS receives. Name, size and type come from
// the file's resource values; the bookmark only for open-in-place picks.
import Foundation
import UniformTypeIdentifiers

extension URL {
  func pickedDocumentRecord(bookmark: String?) -> PickedDocumentRecord {
    let values = try? resourceValues(forKeys: [.nameKey, .fileSizeKey, .contentTypeKey])
    return PickedDocumentRecord(
      uri: absoluteString,
      name: values?.name ?? lastPathComponent,
      size: values?.fileSize.map(Double.init),
      mimeType: values?.contentType?.preferredMIMEType,
      bookmark: bookmark)
  }

  /// Base64 bookmark that reopens this security-scoped URL in a later launch.
  var bookmarkString: String? {
    (try? bookmarkData(options: [], includingResourceValuesForKeys: nil, relativeTo: nil))?.base64EncodedString()
  }
}
