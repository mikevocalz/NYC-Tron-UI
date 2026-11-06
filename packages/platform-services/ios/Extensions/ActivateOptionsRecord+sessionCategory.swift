// The AVAudioSession category and options for an activation request.
import AVFoundation

extension ActivateOptionsRecord {
  /// Nil for a category this build does not know.
  var sessionCategory: AVAudioSession.Category? {
    switch category {
    case "playback": return .playback
    case "play-and-record": return .playAndRecord
    case "ambient": return .ambient
    default: return nil
    }
  }

  var sessionOptions: AVAudioSession.CategoryOptions {
    var options: AVAudioSession.CategoryOptions = []
    if mixWithOthers { options.insert(.mixWithOthers) }
    if category == "play-and-record" { options.formUnion([.defaultToSpeaker, .allowBluetoothA2DP]) }
    return options
  }
}
