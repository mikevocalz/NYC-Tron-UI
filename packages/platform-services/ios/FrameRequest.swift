// A checked frame request. JS validates first; this repeats the bounds so a
// caller that skips the JS layer still cannot ask for an unbounded frame.
struct FrameRequest: Sendable {
  /// Matches MAX_FRAME_EDGE in src/media/decoder.ts.
  static let maxEdge = 4096

  let timeUs: Int64
  let maxWidth: Int
  let maxHeight: Int

  init(_ record: FrameRequestRecord) throws {
    guard record.timeUs >= 0, record.timeUs == record.timeUs.rounded(), record.timeUs < 9_007_199_254_740_992 else {
      throw MediaDecodeFailure(.outOfRange, "timeUs must be a nonnegative integer")
    }
    for edge in [record.maxWidth, record.maxHeight] where !edge.isFinite || edge != edge.rounded() || !(1...Double(Self.maxEdge)).contains(edge) {
      throw MediaDecodeFailure(.outOfRange, "maxWidth and maxHeight must be from 1 to \(Self.maxEdge)")
    }
    timeUs = Int64(record.timeUs)
    maxWidth = Int(record.maxWidth)
    maxHeight = Int(record.maxHeight)
  }
}
