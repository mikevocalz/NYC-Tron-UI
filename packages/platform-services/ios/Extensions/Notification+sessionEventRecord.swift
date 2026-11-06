// AVAudioSession notifications as the session events JS understands. Every
// record is built with all fields so it does not lean on synthesized defaults.
import AVFoundation

extension Notification {
  /// Nil for a notification the policy has no rule for (a new route, a category change).
  var sessionEventRecord: SessionEventRecord? {
    switch name {
    case AVAudioSession.interruptionNotification: return interruptionRecord
    case AVAudioSession.routeChangeNotification: return routeLossRecord
    case AVAudioSession.mediaServicesWereResetNotification: return Self.record("media-services-reset")
    default: return nil
    }
  }

  private var interruptionRecord: SessionEventRecord? {
    guard let raw = userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
      let type = AVAudioSession.InterruptionType(rawValue: raw)
    else { return nil }
    switch type {
    case .began:
      return Self.record("interruption-began")
    case .ended:
      let optionsRaw = userInfo?[AVAudioSessionInterruptionOptionKey] as? UInt ?? 0
      let shouldResume = AVAudioSession.InterruptionOptions(rawValue: optionsRaw).contains(.shouldResume)
      return SessionEventRecord(type: "interruption-ended", shouldResume: shouldResume, transient: false, canDuck: false, reason: "")
    @unknown default:
      return nil
    }
  }

  // Only the old device going away matters: plugging something in never pauses.
  private var routeLossRecord: SessionEventRecord? {
    guard let raw = userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt,
      AVAudioSession.RouteChangeReason(rawValue: raw) == .oldDeviceUnavailable
    else { return nil }
    let previous = userInfo?[AVAudioSessionRouteChangePreviousRouteKey] as? AVAudioSessionRouteDescription
    let ports = previous?.outputs.map(\.portType) ?? []
    let reason: String
    if ports.contains(where: { [.headphones, .headsetMic, .usbAudio].contains($0) }) {
      reason = "headphones-unplugged"
    } else if ports.contains(where: { [.bluetoothA2DP, .bluetoothLE, .bluetoothHFP].contains($0) }) {
      reason = "bluetooth-disconnected"
    } else {
      reason = "device-unavailable"
    }
    return SessionEventRecord(type: "output-lost", shouldResume: false, transient: false, canDuck: false, reason: reason)
  }

  private static func record(_ type: String) -> SessionEventRecord {
    SessionEventRecord(type: type, shouldResume: false, transient: false, canDuck: false, reason: "")
  }
}
