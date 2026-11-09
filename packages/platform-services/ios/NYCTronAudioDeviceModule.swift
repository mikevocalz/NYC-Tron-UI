// iOS side of @nyc-tron/platform-services/audio.
//
// probe: aggregate system default endpoints (AVAudioSession lists none).
// openOutput/writeOutput/stats/closeOutput: AVAudioEngine +
// AVAudioSourceNode pulling a bounded interleaved-f32 ring per stream.
// openInput/readInput/closeInput: input-node tap into a second ring;
// requests record permission and a record-capable session category.
// The render thread never calls JS or allocates; drops and underruns are
// counted and polled through stats(), lifecycle failures emit "audio".
import ExpoModulesCore

@ExpoModule("NYCTronAudioDevice")
public final class NYCTronAudioDeviceModule: Module {
  @Event("audio")
  var onAudio: (AudioDeviceEventRecord) -> Void

  private let device = NYCAudioDevice()

  /// The event sink is wired before any stream can emit, same pattern as
  /// NYCTronSpeechModule wiring engine.onEvent inside start().
  private func wireEvents() {
    device.onEvent = { [weak self] record in self?.onAudio(record) }
  }

  @JS
  func probe() -> AudioDeviceProbeRecord {
    device.probe()
  }

  @JS
  func openOutput(_ options: AudioOpenOptionsRecord) throws -> AudioStreamHandleRecord {
    wireEvents()
    do { return try device.openOutput(options) } catch let failure as AudioDeviceFailure { throw failure.exception }
  }

  @JS
  func writeOutput(_ request: AudioWriteRecord) throws {
    do { try device.writeOutput(request) } catch let failure as AudioDeviceFailure { throw failure.exception }
  }

  @JS
  func stats(_ stream: String) throws -> AudioStatsRecord {
    do { return try device.stats(stream) } catch let failure as AudioDeviceFailure { throw failure.exception }
  }

  @JS
  func closeOutput(_ stream: String) {
    device.closeOutput(stream)
  }

  @JS
  func openInput(_ options: AudioOpenOptionsRecord) async throws -> AudioStreamHandleRecord {
    wireEvents()
    do { return try await device.openInput(options) } catch let failure as AudioDeviceFailure { throw failure.exception }
  }

  @JS
  func readInput(_ stream: String, maxFrames: Int) throws -> AudioPcmRecord {
    do { return try device.readInput(stream, maxFrames: maxFrames) } catch let failure as AudioDeviceFailure { throw failure.exception }
  }

  @JS
  func closeInput(_ stream: String) {
    device.closeInput(stream)
  }

  public override func willDestroy() {
    device.closeAll()
  }
}
