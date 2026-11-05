// Listens to AVAudioSession's interruption, route-change and media-services
// notifications and forwards the ones the policy acts on. UIKit posts them
// on arbitrary threads; `emit` is the module's event, which is safe to call
// from any thread, so nothing here hops queues. The observer tokens are the
// only mutable state and are touched only from the module's main-actor
// activate/deactivate.
import AVFoundation

final class AudioSessionObserver: @unchecked Sendable {
  private let emit: @Sendable (SessionEventRecord) -> Void
  private var tokens: [NSObjectProtocol] = []

  init(emit: @escaping @Sendable (SessionEventRecord) -> Void) {
    self.emit = emit
  }

  func start() {
    guard tokens.isEmpty else { return }
    let center = NotificationCenter.default
    let session = AVAudioSession.sharedInstance()
    let names: [Notification.Name] = [
      AVAudioSession.interruptionNotification,
      AVAudioSession.routeChangeNotification,
      AVAudioSession.mediaServicesWereResetNotification,
    ]
    let emit = self.emit
    tokens = names.map { name in
      center.addObserver(forName: name, object: session, queue: nil) { notification in
        if let record = notification.sessionEventRecord {
          emit(record)
        }
      }
    }
  }

  func stop() {
    tokens.forEach(NotificationCenter.default.removeObserver)
    tokens = []
  }

  deinit {
    stop()
  }
}
