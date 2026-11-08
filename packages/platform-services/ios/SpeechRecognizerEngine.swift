// Owns SFSpeechRecognizer sessions on iOS. One serial queue mutates the
// session table; recognition callbacks hop onto it. The module owns the
// AVAudioSession while a session runs (playAndRecord); hosts that also use
// NYCTronPlaybackSession must sequence the two — see README.
import AVFoundation
import Speech

/// One live recognition session. Reference type so the task callback and
/// stop/abort share the same ended/aborted flags.
private final class SpeechSessionEntry {
  let id: String
  let recognizer: SFSpeechRecognizer
  let request: SFSpeechAudioBufferRecognitionRequest
  let engine: AVAudioEngine
  var task: SFSpeechRecognitionTask?
  var ended = false
  var aborted = false

  init(id: String, recognizer: SFSpeechRecognizer, request: SFSpeechAudioBufferRecognitionRequest, engine: AVAudioEngine) {
    self.id = id
    self.recognizer = recognizer
    self.request = request
    self.engine = engine
  }
}

final class SpeechRecognizerEngine {
  /// Matches MAX_SPEECH_SESSIONS in src/speech/recognizer.ts.
  static let maxSessions = 4
  /// Matches MAX_SPEECH_WORDS; JS re-validates.
  static let maxWords = 1000

  private let queue = DispatchQueue(label: "com.nyctron.platformservices.speech")
  private var sessions: [String: SpeechSessionEntry] = [:]
  private var counter = 0
  /// Set by the module before start; receives every session event.
  var onEvent: (SpeechEventRecord) -> Void = { _ in }

  func probe() -> SpeechProbeRecord {
    guard let recognizer = SFSpeechRecognizer(), recognizer.isAvailable else {
      return SpeechProbeRecord(available: false, onDevice: false, networkPossible: true)
    }
    return SpeechProbeRecord(available: true, onDevice: recognizer.supportsOnDeviceRecognition, networkPossible: true)
  }

  // MARK: - Permissions

  /// Speech recognition authorization, then microphone record permission.
  /// Both are requested here so `start` fails with "permission" instead of
  /// surfacing an opaque recognizer error. Host Info.plist must carry
  /// NSSpeechRecognitionUsageDescription and NSMicrophoneUsageDescription.
  private func authorize() async throws {
    let status = await withCheckedContinuation { continuation in
      SFSpeechRecognizer.requestAuthorization { continuation.resume(returning: $0) }
    }
    guard status == .authorized else {
      throw SpeechFailure(.permission, "Speech recognition permission was denied.")
    }
    let granted = await withCheckedContinuation { (continuation: CheckedContinuation<Bool, Never>) in
      if #available(iOS 17.0, *) {
        AVAudioApplication.requestRecordPermission { continuation.resume(returning: $0) }
      } else {
        AVAudioSession.sharedInstance().requestRecordPermission { continuation.resume(returning: $0) }
      }
    }
    guard granted else {
      throw SpeechFailure(.permission, "Microphone permission was denied.")
    }
  }

  // MARK: - Sessions

  func start(_ options: SpeechStartRecord) async throws -> SpeechSessionRecord {
    try await authorize()
    let locale = options.locale.isEmpty ? nil : Locale(identifier: options.locale)
    guard let recognizer = locale.flatMap({ SFSpeechRecognizer(locale: $0) }) ?? SFSpeechRecognizer() else {
      throw SpeechFailure(.unsupportedFormat, "No speech recognizer exists for this locale.")
    }
    if options.onDeviceOnly && !recognizer.supportsOnDeviceRecognition {
      throw SpeechFailure(.unsupportedFormat, "On-device speech recognition is unavailable for this locale or device.")
    }
    return try queue.sync {
      guard sessions.count < Self.maxSessions else {
        throw SpeechFailure(.busy, "At most \(Self.maxSessions) speech sessions may run at once.")
      }
      let request = SFSpeechAudioBufferRecognitionRequest()
      request.shouldReportPartialResults = true
      request.requiresOnDeviceRecognition = options.onDeviceOnly
      request.addsPunctuation = true
      request.taskHint = .dictation
      if !options.hints.isEmpty { request.contextualStrings = options.hints }

      // The module owns the audio session while a session runs; see README
      // for how this interacts with NYCTronPlaybackSession.
      let audioSession = AVAudioSession.sharedInstance()
      do {
        try audioSession.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .allowBluetooth])
        try audioSession.setActive(true)
      } catch {
        throw SpeechFailure(.recognitionFailed, "The audio session could not start for recognition.")
      }

      let audioEngine = AVAudioEngine()
      let input = audioEngine.inputNode
      let format = input.outputFormat(forBus: 0)
      do {
        input.installTap(onBus: 0, bufferSize: 1024, format: format) { buffer, _ in
          request.append(buffer)
        }
        audioEngine.prepare()
        try audioEngine.start()
      } catch {
        try? audioSession.setActive(false, options: .notifyOthersOnDeactivation)
        throw SpeechFailure(.unsupportedFormat, "This device has no usable audio input for recognition.")
      }

      counter += 1
      let id = "ios-\(counter)"
      let entry = SpeechSessionEntry(id: id, recognizer: recognizer, request: request, engine: audioEngine)
      entry.task = recognizer.recognitionTask(with: request) { [weak self] result, error in
        self?.queue.async { self?.handle(result: result, error: error, sessionID: id) }
      }
      sessions[id] = entry
      return SpeechSessionRecord(session: id)
    }
  }

  /// Asks the recognizer to flush: endAudio lets the last hypothesis arrive
  /// as a final result, then the session ends.
  func stop(_ session: String) throws {
    try queue.sync {
      guard let entry = sessions[session], !entry.ended else {
        throw SpeechFailure(.notFound, "The speech session is unknown or already finished.")
      }
      entry.request.endAudio()
    }
  }

  func abort(_ session: String) {
    queue.async {
      guard let entry = sessions[session], !entry.ended else { return }
      entry.aborted = true
      entry.task?.cancel()
      entry.request.endAudio()
      self.finish(entry, kind: "end", reason: "aborted")
    }
  }

  func closeAll() {
    queue.async {
      for entry in self.sessions.values { self.finish(entry, kind: "end", reason: "aborted") }
    }
  }

  // MARK: - Results

  private func handle(result: SFSpeechRecognitionResult?, error: Error?, sessionID: String) {
    guard let entry = sessions[sessionID], !entry.ended else { return }
    if let error = error {
      if entry.aborted {
        finish(entry, kind: "end", reason: "aborted")
      } else {
        finish(entry, kind: "error", code: "recognition-failed", message: error.localizedDescription)
      }
      return
    }
    guard let result = result else { return }
    let text = result.bestTranscription.formattedString
    if result.isFinal {
      emit(entry, kind: "final", text: text, wordsJson: wordsJSON(result))
      finish(entry, kind: "end", reason: entry.aborted ? "aborted" : "finished")
    } else {
      emit(entry, kind: "partial", text: text)
    }
  }

  private func wordsJSON(_ result: SFSpeechRecognitionResult) -> String {
    let segments = result.bestTranscription.segments
    guard !segments.isEmpty else { return "" }
    let words: [[String: Any]] = segments.prefix(Self.maxWords).map { segment in
      ["text": segment.substring, "startS": segment.timestamp, "endS": segment.timestamp + segment.duration]
    }
    guard let data = try? JSONSerialization.data(withJSONObject: words),
          let json = String(data: data, encoding: .utf8) else { return "" }
    return json
  }

  private func emit(_ entry: SpeechSessionEntry, kind: String, text: String = "", wordsJson: String = "") {
    onEvent(SpeechEventRecord(session: entry.id, kind: kind, text: text, wordsJson: wordsJson))
  }

  /// Tears the session down and emits exactly one terminal event. Idempotent
  /// through `ended`, so a late callback after abort cannot double-emit.
  private func finish(_ entry: SpeechSessionEntry, kind: String, reason: String = "", code: String = "", message: String = "") {
    guard !entry.ended else { return }
    entry.ended = true
    sessions.removeValue(forKey: entry.id)
    entry.task?.cancel()
    entry.engine.inputNode.removeTap(onBus: 0)
    entry.engine.stop()
    try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
    onEvent(SpeechEventRecord(session: entry.id, kind: kind, text: "", wordsJson: "", reason: reason, code: code, message: message))
  }
}
