// iOS side of @nyc-tron/platform-services/encoder.
//
// - probe: VideoToolbox H.264 and AudioConverter AAC availability.
// - encode: AVAssetWriter H.264 + AAC into a faststart MP4 in Caches. Video
//   sources are tightly packed RGBA8 frame files (swizzled to BGRA inside
//   CVPixelBuffers); audio sources are interleaved little-endian PCM (f32 or
//   s16). At least one track is required; both may be given.
// - clearCache: deletes everything the module wrote.
// All encoding runs on one serial queue the module owns; failures throw an
// Exception whose code is the JS error code.
import ExpoModulesCore

@ExpoModule("NYCTronMediaEncoder")
public final class NYCTronMediaEncoderModule: Module {
  private let worker = MediaEncoderQueue()
  private let encoder = MediaEncoder()

  @JS
  func probe() async throws -> EncoderProbeRecord {
    try await run { self.encoder.probe() }
  }

  @JS
  func encode(_ video: EncodeVideoRecord?, _ audio: EncodeAudioRecord?) async throws -> EncodedMediaRecord {
    try await run { try self.encoder.encode(video: video, audio: audio) }
  }

  @JS
  func clearCache() async throws {
    try await run { try MediaEncoderOutputDirectory.clear() }
  }

  private func run<T>(_ work: @escaping @Sendable () throws -> T) async throws -> T {
    do {
      return try await worker.run(work)
    } catch let failure as MediaEncodeFailure {
      throw failure.exception
    }
  }
}
