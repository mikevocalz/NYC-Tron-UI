// iOS side of @nyc-tron/platform-services/media (N-19).
//
// - probe: duration and the first video and audio track's format.
// - decodeFrame: AVAssetImageGenerator with zero tolerances, so the frame is
//   the one at the requested media time, written as JPEG to Caches.
// - decodeAudio: AVAssetReader to interleaved Float32 PCM, resampled when a
//   rate is given, written as a raw .f32 file to Caches.
// - clearCache: deletes everything the module wrote.
// Times are integer microseconds. All decoding runs on one serial queue the
// module owns; failures throw an Exception whose code is the JS error code.
import ExpoModulesCore

@ExpoModule("NYCTronMediaDecoder")
public final class NYCTronMediaDecoderModule: Module {
  private let worker = MediaDecoderQueue()

  @JS
  func probe(_ uri: String) async throws -> MediaProbeRecord {
    try await decode { try MediaSource(uri: uri).asset().probeRecord() }
  }

  @JS
  func presentationIndexV1(_ uri: String, _ maxFrames: Double) async throws -> PresentationIndexRecord {
    try await decode {
      let source = try MediaSource(uri: uri)
      let index = try source.asset().presentationIndex(maxFrames: maxFrames)
      return PresentationIndexRecord(durationUs: index.durationUs, timesUs: index.timesUs)
    }
  }

  @JS
  func decodeFrame(_ uri: String, _ options: FrameRequestRecord) async throws -> DecodedFrameRecord {
    let request = try checked { try FrameRequest(options) }
    return try await decode { try MediaSource(uri: uri).asset().decodedFrame(request) }
  }

  @JS
  func decodeIndexedFrameV1(_ uri: String, _ options: FrameRequestRecord) async throws -> DecodedFrameRecord {
    let request = try checked { try FrameRequest(options) }
    return try await decode {
      let asset = try MediaSource(uri: uri).asset()
      let index = try asset.presentationIndex(maxFrames: 200_000)
      guard let time = index.presentationTime(microseconds: request.timeUs) else {
        throw MediaDecodeFailure(.outOfRange, "No indexed frame has this presentation timestamp")
      }
      return try asset.decodedFrame(request, exactPresentationTime: time)
    }
  }

  @JS
  func decodeAudio(_ uri: String, _ options: AudioRequestRecord) async throws -> DecodedAudioRecord {
    let request = try checked { try AudioRequest(options) }
    return try await decode { try MediaSource(uri: uri).asset().decodedAudio(request) }
  }

  @JS
  func clearCache() async throws {
    try await decode { try MediaOutputDirectory.clear() }
  }

  private func checked<T>(_ body: () throws -> T) throws -> T {
    do {
      return try body()
    } catch let failure as MediaDecodeFailure {
      throw failure.exception
    }
  }

  private func decode<T>(_ work: @escaping @Sendable () throws -> T) async throws -> T {
    do {
      return try await worker.run(work)
    } catch let failure as MediaDecodeFailure {
      throw failure.exception
    }
  }
}
