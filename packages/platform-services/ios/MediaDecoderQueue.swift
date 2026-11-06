// The one serial queue all decoding runs on. AVFoundation's synchronous
// asset, generator and reader calls block, so they run here and never on
// the JS thread or the main thread. Requests are served in arrival order.
import Foundation

final class MediaDecoderQueue: Sendable {
  private let queue = DispatchQueue(label: "com.nyctron.platformservices.media-decoder", qos: .userInitiated)

  func run<T>(_ work: @escaping @Sendable () throws -> T) async throws -> T {
    try await withCheckedThrowingContinuation { continuation in
      queue.async {
        continuation.resume(with: Result { try work() })
      }
    }
  }
}
