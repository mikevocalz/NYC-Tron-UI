// Audio device backend for @nyc-tron/platform-services/audio on iOS.
//
// Playback: one shared AVAudioEngine; each output stream is an
// AVAudioSourceNode whose render block pulls interleaved f32 frames from a
// PCMRingBuffer. The engine never runs on the render thread — the JS host
// pushes lookahead chunks through writeOutput and the ring absorbs jitter.
// Underruns are counted as silence frames and reported through stats().
//
// Capture: a dedicated AVAudioEngine input-node tap pushes interleaved f32
// into a second ring per stream; readInput drains it. Requires record
// permission (checked here) and a record-capable AVAudioSession category —
// coordinate with NYCTronPlaybackSession, which owns activation for
// playback-only apps.
import AVFoundation
import ExpoModulesCore

final class NYCAudioDevice {
  struct OutputStream {
    let id: String
    let node: AVAudioSourceNode
    let ring: PCMRingBuffer
    let sampleRate: Int
    let channels: Int
  }

  struct InputStream {
    let id: String
    let ring: PCMRingBuffer
    let sampleRate: Int
    let channels: Int
  }

  private let engine = AVAudioEngine()
  private var inputEngine: AVAudioEngine?
  private var outputs: [String: OutputStream] = [:]
  private var inputs: [String: InputStream] = [:]
  private var inputTapInstalled = false
  private var counter = 0
  private var configObserver: NSObjectProtocol?
  private let stateLock = NSLock()
  var onEvent: ((AudioDeviceEventRecord) -> Void)?

  // MARK: - probe

  func probe() -> AudioDeviceProbeRecord {
    // AVAudioSession exposes no public endpoint list; report the honest
    // aggregate: the system default output and input are always selectable
    // by leaving deviceId empty.
    let rate = Int(AVAudioSession.sharedInstance().sampleRate)
    return AudioDeviceProbeRecord(
      available: true,
      defaultSampleRate: rate > 0 ? rate : 48000,
      outputs: [AudioDeviceDescriptorRecord(id: "", name: "System default output", kind: "output")],
      inputs: [AudioDeviceDescriptorRecord(id: "", name: "System default input", kind: "input")]
    )
  }

  // MARK: - output

  func openOutput(_ options: AudioOpenOptionsRecord) throws -> AudioStreamHandleRecord {
    try stateLock.withLock {
      let session = AVAudioSession.sharedInstance()
      let outFormat = engine.outputNode.outputFormat(forBus: 0)
      let sampleRate = options.sampleRate > 0 ? options.sampleRate
        : Int(outFormat.sampleRate > 0 ? outFormat.sampleRate : session.sampleRate)
      guard sampleRate >= 8000, sampleRate <= 384000 else {
        throw AudioDeviceFailure(.unsupportedFormat, "sampleRate \(sampleRate) is outside 8000...384000")
      }
      let hwChannels = Int(outFormat.channelCount)
      let channels = options.channels > 0 ? min(8, max(1, options.channels))
        : max(1, min(8, hwChannels > 0 ? hwChannels : 2))
      // AVAudioEngine renders Float32; s16 requests still negotiate f32 and
      // the actual format is reported back honestly.
      guard let format = AVAudioFormat(commonFormat: .pcmFormatFloat32, sampleRate: Float(sampleRate),
                                       channels: AVAudioChannelCount(channels), interleaved: false) else {
        throw AudioDeviceFailure(.unsupportedFormat, "Could not build a Float32 format for \(sampleRate) Hz x \(channels).")
      }
      let capacityFrames = max(256, min(sampleRate * 10, sampleRate * max(1, options.bufferMs) / 1000))
      let ring = PCMRingBuffer(channels: channels, capacityFrames: capacityFrames)
      let node = AVAudioSourceNode(format: format) { _, _, frameCount, audioBufferList in
        ring.render(frameCount: frameCount, buffers: audioBufferList)
        return noErr
      }
      engine.attach(node)
      engine.connect(node, to: engine.mainMixerNode, format: format)
      if !engine.isRunning {
        do { try engine.start() } catch {
          engine.detach(node)
          throw AudioDeviceFailure(.deviceError, "AVAudioEngine failed to start: \(error.localizedDescription)")
        }
      }
      counter += 1
      let id = "ios-out-\(counter)"
      outputs[id] = OutputStream(id: id, node: node, ring: ring, sampleRate: sampleRate, channels: channels)
      installConfigObserverIfNeeded()
      return AudioStreamHandleRecord(stream: id, sampleRate: sampleRate, channels: channels,
                                     sampleFormat: "f32", latencyMs: session.ioBufferDuration * 1000)
    }
  }

  /// Converts little-endian interleaved PCM bytes to Float32 on the caller's
  /// thread (never the render thread) and pushes what fits the ring.
  func writeOutput(_ request: AudioWriteRecord) throws {
    let stream = stateLock.withLock { outputs[request.stream] }
    guard let stream else {
      throw AudioDeviceFailure(.deviceNotFound, "Unknown output stream \"\(request.stream)\".")
    }
    let bytesPerSample = request.sampleFormat == "s16" ? 2 : 4
    let expected = request.frames * stream.channels * bytesPerSample
    guard request.samples.count == expected else {
      throw AudioDeviceFailure(.outOfRange,
        "PCM chunk is \(request.samples.count) bytes but \(request.frames) frames at \(stream.channels) channels/\(request.sampleFormat) needs \(expected).")
    }
    var floats = [Float](repeating: 0, count: request.frames * stream.channels)
    request.samples.withUnsafeBytes { raw in
      if request.sampleFormat == "s16" {
        for i in 0..<floats.count {
          let lo = UInt16(raw[i * 2])
          let hi = UInt16(raw[i * 2 + 1])
          floats[i] = Float(Int32(Int16(bitPattern: UInt16(hi << 8 | lo)))) / 32768
        }
      } else {
        for i in 0..<floats.count {
          let b0 = UInt32(raw[i * 4]), b1 = UInt32(raw[i * 4 + 1]),
              b2 = UInt32(raw[i * 4 + 2]), b3 = UInt32(raw[i * 4 + 3])
          let bits = b0 | b1 << 8 | b2 << 16 | b3 << 24
          floats[i] = Float(bitPattern: bits)
        }
      }
    }
    floats.withUnsafeBufferPointer { stream.ring.push($0, frames: request.frames) }
  }

  func stats(_ streamId: String) throws -> AudioStatsRecord {
    if let output = stateLock.withLock({ outputs[streamId] }) {
      return AudioStatsRecord(stream: streamId, sampleRate: output.sampleRate, channels: output.channels,
                              sampleFormat: "f32", queuedFrames: output.ring.queuedFrames,
                              capacityFrames: output.ring.capacityFrames, droppedFrames: output.ring.droppedFrames,
                              underrunFrames: output.ring.underrunFrames)
    }
    if let input = stateLock.withLock({ inputs[streamId] }) {
      return AudioStatsRecord(stream: streamId, sampleRate: input.sampleRate, channels: input.channels,
                              sampleFormat: "f32", queuedFrames: input.ring.queuedFrames,
                              capacityFrames: input.ring.capacityFrames, droppedFrames: input.ring.droppedFrames,
                              underrunFrames: 0)
    }
    throw AudioDeviceFailure(.deviceNotFound, "Unknown stream \"\(streamId)\".")
  }

  func closeOutput(_ streamId: String) {
    stateLock.withLock {
      guard let stream = outputs.removeValue(forKey: streamId) else { return }
      engine.detach(stream.node)
      if outputs.isEmpty && engine.isRunning { engine.stop() }
    }
  }

  // MARK: - input

  func openInput(_ options: AudioOpenOptionsRecord) async throws -> AudioStreamHandleRecord {
    // Per-device input selection is not exposed by AVAudioSession; a
    // non-empty deviceId is rejected honestly rather than ignored.
    guard options.deviceId.isEmpty else {
      throw AudioDeviceFailure(.unsupportedFormat, "iOS does not expose per-device input selection; leave deviceId empty.")
    }
    let granted = await withCheckedContinuation { (continuation: CheckedContinuation<Bool, Never>) in
      AVAudioSession.sharedInstance().requestRecordPermission { granted in continuation.resume(returning: granted) }
    }
    guard granted else {
      throw AudioDeviceFailure(.permission, "Microphone permission was denied.")
    }
    let session = AVAudioSession.sharedInstance()
    do {
      // playAndRecord when playback streams are live so both directions share
      // one session; record-only otherwise. The playback session module owns
      // activation for playback-only apps — coordinate categories.
      if outputs.isEmpty {
        try session.setCategory(.record, mode: .default)
      } else {
        try session.setCategory(.playAndRecord, mode: .default, options: [.allowBluetooth])
      }
      try session.setActive(true)
    } catch {
      throw AudioDeviceFailure(.deviceError, "Could not activate a record-capable audio session: \(error.localizedDescription)")
    }
    return try stateLock.withLock {
      let captureEngine = self.inputEngine ?? AVAudioEngine()
      self.inputEngine = captureEngine
      let input = captureEngine.inputNode
      let format = input.inputFormat(forBus: 0)
      guard format.sampleRate > 0, format.channelCount > 0 else {
        throw AudioDeviceFailure(.unsupportedFormat, "The input node reports no usable format.")
      }
      let sampleRate = Int(format.sampleRate)
      if options.sampleRate > 0, options.sampleRate != sampleRate {
        throw AudioDeviceFailure(.unsupportedFormat,
          "The input runs at \(sampleRate) Hz; requested \(options.sampleRate) Hz. Capture is not resampled.")
      }
      let channels = max(1, min(8, Int(format.channelCount)))
      let capacityFrames = max(256, min(sampleRate * 10, sampleRate * max(1, options.bufferMs) / 1000))
      let ring = PCMRingBuffer(channels: channels, capacityFrames: capacityFrames)
      let tapChannels = Int(format.channelCount)
      let isFloat = format.commonFormat == .pcmFormatFloat32
      input.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
        let frames = Int(buffer.frameLength)
        var interleaved = [Float](repeating: 0, count: frames * tapChannels)
        if isFloat, let floatData = buffer.floatChannelData {
          for f in 0..<frames {
            for c in 0..<tapChannels { interleaved[f * tapChannels + c] = floatData[c][f] }
          }
        } else if let intData = buffer.int16ChannelData {
          for f in 0..<frames {
            for c in 0..<tapChannels { interleaved[f * tapChannels + c] = Float(Int32(intData[c][f])) / 32768 }
          }
        }
        interleaved.withUnsafeBufferPointer { ring.push($0, frames: frames) }
      }
      inputTapInstalled = true
      if !captureEngine.isRunning {
        do { try captureEngine.start() } catch {
          input.removeTap(onBus: 0)
          inputTapInstalled = false
          throw AudioDeviceFailure(.deviceError, "The capture engine failed to start: \(error.localizedDescription)")
        }
      }
      counter += 1
      let id = "ios-in-\(counter)"
      inputs[id] = InputStream(id: id, ring: ring, sampleRate: sampleRate, channels: channels)
      return AudioStreamHandleRecord(stream: id, sampleRate: sampleRate, channels: channels,
                                     sampleFormat: "f32", latencyMs: session.ioBufferDuration * 1000)
    }
  }

  /// Pops up to `maxFrames` of captured PCM and returns interleaved f32le.
  /// An empty ring returns zero frames rather than blocking.
  func readInput(_ streamId: String, maxFrames: Int) throws -> AudioPcmRecord {
    guard let stream = stateLock.withLock({ inputs[streamId] }) else {
      throw AudioDeviceFailure(.deviceNotFound, "Unknown input stream \"\(streamId)\".")
    }
    let frames = max(0, min(maxFrames, stream.ring.capacityFrames))
    var floats = [Float](repeating: 0, count: frames * stream.channels)
    let got = floats.withUnsafeMutableBufferPointer { stream.ring.pop(into: $0, frames: frames) }
    floats.removeSubrange(got * stream.channels..<floats.count)
    var words = [UInt32](repeating: 0, count: floats.count)
    for i in 0..<floats.count { words[i] = floats[i].bitPattern.littleEndian }
    let data = words.withUnsafeBytes { Data($0) }
    return AudioPcmRecord(stream: streamId, samples: data, frames: got,
                          sampleRate: stream.sampleRate, channels: stream.channels, sampleFormat: "f32")
  }

  func closeInput(_ streamId: String) {
    stateLock.withLock {
      guard inputs.removeValue(forKey: streamId) != nil else { return }
      if inputs.isEmpty, let inputEngine {
        if inputTapInstalled { inputEngine.inputNode.removeTap(onBus: 0); inputTapInstalled = false }
        inputEngine.stop()
        self.inputEngine = nil
        if outputs.isEmpty {
          try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        }
      }
    }
  }

  // MARK: - lifecycle

  private func installConfigObserverIfNeeded() {
    guard configObserver == nil else { return }
    configObserver = NotificationCenter.default.addObserver(
      forName: .AVAudioEngineConfigurationChange, object: engine, queue: nil
    ) { [weak self] _ in
      guard let self else { return }
      // Route/sample-rate changes invalidate running streams; report them
      // rather than letting callers discover silence.
      for id in self.outputs.keys {
        self.onEvent?(AudioDeviceEventRecord(stream: id, kind: "device-lost",
          message: "The audio engine configuration changed; reopen the stream."))
      }
    }
  }

  func closeAll() {
    stateLock.withLock {
      for (_, stream) in outputs { engine.detach(stream.node) }
      outputs.removeAll()
      if engine.isRunning { engine.stop() }
      if let inputEngine {
        if inputTapInstalled { inputEngine.inputNode.removeTap(onBus: 0); inputTapInstalled = false }
        inputEngine.stop()
        self.inputEngine = nil
      }
      inputs.removeAll()
      if let configObserver {
        NotificationCenter.default.removeObserver(configObserver)
        self.configObserver = nil
      }
    }
  }
}
