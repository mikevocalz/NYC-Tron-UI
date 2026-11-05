// iOS side of @nyc-tron/platform-services/playback (N-17).
//
// Owns the AVAudioSession activation and reports interruptions (calls,
// alarms, Siri), output loss (headphones out, Bluetooth gone) and media
// services resets as "session" events. The pause/resume policy is
// nextPlaybackState in JS; the player stays the app's.
import AVFoundation
import ExpoModulesCore

@ExpoModule("NYCTronPlaybackSession")
public final class NYCTronPlaybackSessionModule: Module {
  @Event("session")
  var onSession: (SessionEventRecord) -> Void

  private var observer: AudioSessionObserver?

  /// False when the category is unknown or the OS refused activation (for
  /// example during a phone call); the reason is not an app error.
  @JS
  @MainActor
  func activate(_ options: ActivateOptionsRecord) async -> Bool {
    guard let category = options.sessionCategory else { return false }
    let session = AVAudioSession.sharedInstance()
    do {
      try session.setCategory(category, mode: .default, options: options.sessionOptions)
      try session.setActive(true)
    } catch {
      return false
    }
    if observer == nil {
      observer = AudioSessionObserver { [weak self] record in self?.onSession(record) }
    }
    observer?.start()
    return true
  }

  /// Lets other apps' audio come back to full volume.
  @JS
  @MainActor
  func deactivate() async {
    observer?.stop()
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
  }

  public override func willDestroy() {
    observer?.stop()
  }
}
