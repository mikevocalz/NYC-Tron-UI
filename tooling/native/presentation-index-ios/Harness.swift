import UIKit
import AVFoundation

@main
@MainActor
final class Harness: UIResponder, UIApplicationDelegate {
  func application(_ application: UIApplication, configurationForConnecting session: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    let configuration = UISceneConfiguration(name: "P03", sessionRole: session.role)
    configuration.delegateClass = ProducerScene.self
    return configuration
  }
}

@MainActor
final class ProducerScene: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?
  func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options: UIScene.ConnectionOptions) {
    guard let scene = scene as? UIWindowScene else { return }
    let controller = UIViewController()
    controller.view.backgroundColor = .systemBackground
    let label = UILabel()
    label.numberOfLines = 0
    label.font = .monospacedSystemFont(ofSize: 16, weight: .regular)
    label.text = "P03 producer checks running"
    label.accessibilityIdentifier = "p03-producer-result"
    label.translatesAutoresizingMaskIntoConstraints = false
    controller.view.addSubview(label)
    NSLayoutConstraint.activate([label.leadingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.leadingAnchor, constant: 16), label.trailingAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.trailingAnchor, constant: -16), label.topAnchor.constraint(equalTo: controller.view.safeAreaLayoutGuide.topAnchor, constant: 16)])
    let window = UIWindow(windowScene: scene)
    window.rootViewController = controller
    window.makeKeyAndVisible()
    self.window = window
    DispatchQueue.global(qos: .userInitiated).async {
      let result = Self.verify()
      DispatchQueue.main.async { label.text = result }
    }
  }
  nonisolated static func verify() -> String {
    var evidence: [String] = []
    do {
      let ties = PresentationIndexData(durationUs: 3, timesUs: [1, 2], presentationTimes: [CMTime(value: 1, timescale: 2_000_000), CMTime(value: 3, timescale: 2_000_000)])
      guard let first = ties.presentationTime(microseconds: 1), let second = ties.presentationTime(microseconds: 2),
            CMTimeCompare(first, CMTime(value: 1, timescale: 2_000_000)) == 0,
            CMTimeCompare(second, CMTime(value: 3, timescale: 2_000_000)) == 0,
            ties.presentationTime(microseconds: 0) == nil else { throw NSError(domain: "exact rational tie lookup failed", code: 6) }
      evidence.append("PASS exact rational half-us lookup")
      for name in ["cfr", "vfr", "bframes"] {
        guard let uri = Bundle.main.url(forResource: name, withExtension: "mp4"),
              let expectedUrl = Bundle.main.url(forResource: name, withExtension: "json"),
              let expected = try JSONSerialization.jsonObject(with: Data(contentsOf: expectedUrl)) as? [Double] else { throw NSError(domain: "fixture", code: 1) }
        let asset = try MediaSource(uri: uri.absoluteString).asset()
        let index: PresentationIndexData
        do { index = try asset.presentationIndex(maxFrames: 200_000) }
        catch {
          let reader = try AVAssetReader(asset: asset)
          let track = asset.tracks(withMediaType: .video)[0]
          let output = AVAssetReaderTrackOutput(track: track, outputSettings: nil)
          reader.add(output)
          reader.startReading()
          var raw: [String] = []
          while let sample = output.copyNextSampleBuffer() {
            raw.append("\(CMSampleBufferGetPresentationTimeStamp(sample).seconds)/\(CMSampleBufferGetOutputPresentationTimeStamp(sample).seconds)")
          }
          evidence.append("DEBUG \(name) duration=\(asset.duration.seconds) samples=\(raw) mappings=\(track.segments.map { $0.timeMapping })")
          throw error
        }
        guard index.timesUs == expected else { throw NSError(domain: "PTS mismatch \(name) actual \(index.timesUs) expected \(expected)", code: 2) }
        evidence.append("PASS \(name): \(expected.count) actual PTS")
        for time in index.timesUs {
          let decoded = try asset.decodedImage(at: index.presentationTime(microseconds: Int64(time))!, maximumSize: CGSize(width: 64, height: 64), requiredTimeUs: Int64(time))
          guard decoded.presentationTime.microseconds == Int64(time), decoded.image.width > 0 else { throw NSError(domain: "frame alignment \(name)", code: 5) }
        }
        evidence.append("PASS \(name): exact image-generator alignment")
        if name == "cfr" {
          let wrongTime = CMTimeAdd(index.presentationTime(microseconds: 0)!, CMTime(value: 1, timescale: 10_000_000))
          do {
            _ = try asset.decodedImage(at: wrongTime, maximumSize: CGSize(width: 64, height: 64), requiredTimeUs: 0)
            throw NSError(domain: "same-bucket wrong rational accepted", code: 10)
          } catch let error as MediaDecodeFailure {
            guard error.code == .decodeFailed else { throw error }
            evidence.append("PASS same-bucket wrong rational rejected")
          }
        }
        do {
          _ = try asset.presentationIndex(maxFrames: Double(expected.count - 1))
          throw NSError(domain: "cap accepted", code: 3)
        } catch let error as MediaDecodeFailure {
          guard error.code == .outOfRange else { throw error }
          evidence.append("PASS \(name): cap rejects partial result")
        }
      }
      guard let cfr = Bundle.main.url(forResource: "cfr", withExtension: "mp4"),
            let malformed = Bundle.main.url(forResource: "malformed", withExtension: "mp4") else { throw NSError(domain: "fixture missing", code: 7) }
      let valid = AVURLAsset(url: cfr)
      for cap in [0.0, 1.5, Double.infinity, 200_001.0] {
        do { _ = try valid.presentationIndex(maxFrames: cap); throw NSError(domain: "invalid cap accepted", code: 8) }
        catch let error as MediaDecodeFailure { guard error.code == .outOfRange else { throw error } }
      }
      do { _ = try AVURLAsset(url: malformed).presentationIndex(maxFrames: 10); throw NSError(domain: "malformed accepted", code: 9) }
      catch is MediaDecodeFailure { evidence.append("PASS malformed media rejected") }
      evidence.append("PASS invalid frame budgets rejected")
      let remote = AVURLAsset(url: URL(string: "https://example.invalid/video.mp4")!)
      do { _ = try remote.presentationIndex(maxFrames: 2); throw NSError(domain: "remote accepted", code: 4) }
      catch let error as MediaDecodeFailure { guard error.code == .unsupportedFormat else { throw error }; evidence.append("PASS remote rejected") }
      return "P03 PRODUCER PASS\n" + evidence.joined(separator: "\n")
    } catch { return "P03 PRODUCER FAIL\n\(error)\n" + evidence.joined(separator: "\n") }
  }
}
