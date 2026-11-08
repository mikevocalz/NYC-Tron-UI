// iOS side of @nyc-tron/platform-services/speech.
//
// - probe: SFSpeechRecognizer availability and supportsOnDeviceRecognition.
// - start: requests speech + microphone permission, then streams
//   SFSpeechAudioBufferRecognitionRequest partial/final results as "speech"
//   events. onDeviceOnly maps to requiresOnDeviceRecognition; false permits
//   Apple's server recognition, which the JS consent gate guards.
// - stop: endAudio so the last hypothesis lands as a final result.
// - abort: cancels and emits a terminal "end" with reason "aborted".
// The host app's Info.plist must declare NSSpeechRecognitionUsageDescription
// and NSMicrophoneUsageDescription; this module cannot add them.
import ExpoModulesCore

@ExpoModule("NYCTronSpeech")
public final class NYCTronSpeechModule: Module {
  @Event("speech")
  var onSpeech: (SpeechEventRecord) -> Void

  private let engine = SpeechRecognizerEngine()

  @JS
  func probe() -> SpeechProbeRecord {
    engine.probe()
  }

  @JS
  func start(_ options: SpeechStartRecord) async throws -> SpeechSessionRecord {
    // The event sink is wired here, before any session can emit.
    engine.onEvent = { [weak self] record in self?.onSpeech(record) }
    do {
      return try await engine.start(options)
    } catch let failure as SpeechFailure {
      throw failure.exception
    }
  }

  @JS
  func stop(_ session: String) async throws {
    do {
      try engine.stop(session)
    } catch let failure as SpeechFailure {
      throw failure.exception
    }
  }

  @JS
  func abort(_ session: String) async {
    engine.abort(session)
  }

  public override func willDestroy() {
    engine.closeAll()
  }
}
