// The one serial queue all encoding runs on. AVFoundation's writer calls
// block on codec pacing, so they run here and never on the JS thread or the
// main thread. Requests are served in arrival order.
import Foundation

final class MediaEncoderQueue: Sendable {
  private let queue = DispatchQueue(label: "com.nyctron.platformservices.media-encoder", qos: .userInitiated)

  func run<T>(_ work: @escaping @Sendable () throws -> T) async throws -> T {
    try await withCheckedThrowingContinuation { continuation in
      queue.async {
        continuation.resume(with: Result { try work() })
      }
    }
  }
}
