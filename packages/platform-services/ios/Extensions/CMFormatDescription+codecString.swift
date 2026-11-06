// The media subtype as its FourCC ("avc1", "hvc1", "aac "), trimmed.
import CoreMedia

extension CMFormatDescription {
  var codecString: String {
    let code = CMFormatDescriptionGetMediaSubType(self)
    let bytes = [24, 16, 8, 0].map { UInt8((code >> $0) & 0xFF) }
    let printable = bytes.allSatisfy { $0 >= 0x20 && $0 < 0x7F }
    return printable ? String(decoding: bytes, as: UTF8.self).trimmingCharacters(in: .whitespaces) : String(code)
  }
}
