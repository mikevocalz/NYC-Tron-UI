// A checked audio request: at most 60 s per call, rate 0 (the file's own)
// or 8-192 kHz. Matches MAX_DECODE_DURATION_US in src/media/decoder.ts.
struct AudioRequest: Sendable {
  static let maxDurationUs: Int64 = 60_000_000

  let startUs: Int64
  let durationUs: Int64
  /// 0 keeps the file's rate.
  let sampleRate: Double

  init(_ record: AudioRequestRecord) throws {
    guard record.startUs >= 0, record.startUs == record.startUs.rounded(), record.startUs < 9_007_199_254_740_992 else {
      throw MediaDecodeFailure(.outOfRange, "startUs must be a nonnegative integer")
    }
    guard record.durationUs > 0, record.durationUs == record.durationUs.rounded(),
      record.durationUs <= Double(Self.maxDurationUs)
    else {
      throw MediaDecodeFailure(.outOfRange, "durationUs must be a positive integer up to \(Self.maxDurationUs) (60 s)")
    }
    guard record.sampleRate.isFinite, record.sampleRate == record.sampleRate.rounded(), record.sampleRate == 0 || (8000...192_000).contains(record.sampleRate) else {
      throw MediaDecodeFailure(.outOfRange, "sampleRate must be 0 or from 8000 to 192000")
    }
    startUs = Int64(record.startUs)
    durationUs = Int64(record.durationUs)
    sampleRate = record.sampleRate.rounded()
  }
}
