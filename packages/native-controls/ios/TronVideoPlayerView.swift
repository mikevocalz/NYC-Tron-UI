import SwiftUI
import UIKit
import AVFoundation
import ExpoModulesCore

final class TronVideoPlayerProps: ExpoSwiftUI.ViewProps {
  @Field var sourceId: String = ""
  @Field var uri: String = ""
  @Field var paused: Bool = true
  @Field var muted: Bool = false
  @Field var volume: Double = 1
  @Field var rate: Double = 1
  @Field var seekTimeUs: Double = 0
  @Field var seekToken: String = ""
  @Field var label: String = "Video"
  var onStatus = EventDispatcher()
}
struct TronVideoPlayerView: ExpoSwiftUI.View {
  @ObservedObject public var props: TronVideoPlayerProps
  var body: some View { TronAVPlayerSurface(props: props) }
}
@MainActor
private final class TronPlayerLayerView: UIView {
  override class var layerClass: AnyClass { AVPlayerLayer.self }
  var playerLayer: AVPlayerLayer { layer as! AVPlayerLayer }
}
private struct TronAVPlayerSurface: UIViewRepresentable {
  @ObservedObject var props: TronVideoPlayerProps
  func makeCoordinator() -> Coordinator { Coordinator() }
  func makeUIView(context: Context) -> TronPlayerLayerView {
    let view = TronPlayerLayerView()
    view.playerLayer.videoGravity = .resizeAspect
    view.playerLayer.player = context.coordinator.player
    return view
  }
  func updateUIView(_ view: TronPlayerLayerView, context: Context) {
    view.accessibilityLabel = props.label
    context.coordinator.update(props)
  }
  static func dismantleUIView(_ view: TronPlayerLayerView, coordinator: Coordinator) {
    view.playerLayer.player = nil
    coordinator.close()
  }
  @MainActor final class Coordinator {
    let player = AVPlayer()
    private var observer: Any?
    private var statusObserver: NSKeyValueObservation?
    private var endObserver: NSObjectProtocol?
    private var props: TronVideoPlayerProps?
    private var sourceKey = ""
    private var seeking = false
    private var completedToken = ""
    private var requestedToken: String?
    private var generation = 0
    private var terminalError = false
    private var ended = false
    private var appliedPaused: Bool?
    private var appliedRate: Float?
    init() {
      // Audio focus/category remains under the app's sole playback-session owner.
      player.automaticallyWaitsToMinimizeStalling = true
      observer = player.addPeriodicTimeObserver(forInterval: CMTime(value: 1, timescale: 10), queue: .main) { [weak self] _ in self?.emit() }
    }
    private func micros(_ time: CMTime) -> Double {
      let seconds = CMTimeGetSeconds(time)
      return seconds.isFinite && seconds >= 0 ? min(9_007_199_254_740_991, (seconds * 1_000_000).rounded()) : 0
    }
    private func emit(_ status: String? = nil, error: String = "") {
      guard let p = props else { return }
      p.onStatus(["sourceId": p.sourceId, "status": status ?? (terminalError ? "error" : ended ? "ended" : player.currentItem?.status != .readyToPlay ? "loading" : player.rate > 0 ? "playing" : "paused"), "positionUs": micros(player.currentTime()), "durationUs": micros(player.currentItem?.duration ?? .invalid), "seekToken": completedToken, "error": error])
    }
    func update(_ next: TronVideoPlayerProps) {
      props = next
      guard next.seekTimeUs.isFinite, next.seekTimeUs >= 0, next.seekTimeUs <= 9_007_199_254_740_991, next.volume.isFinite, next.rate.isFinite else { player.pause(); terminalError = true; emit("error", error: "Invalid video control values"); return }
      let key = next.sourceId + "\n" + next.uri
      if key != sourceKey {
        generation += 1; sourceKey = key; requestedToken = ""; completedToken = ""; seeking = false; terminalError = false; ended = false; appliedPaused = nil; appliedRate = nil
        player.pause(); player.currentItem?.cancelPendingSeeks(); statusObserver = nil
        if let endObserver { NotificationCenter.default.removeObserver(endObserver); self.endObserver = nil }
        guard let url = URL(string: next.uri), ["file", "https", "http"].contains(url.scheme ?? "") else { player.replaceCurrentItem(with: nil); terminalError = true; emit("error", error: "Unsupported video URL"); return }
        let item = AVPlayerItem(url: url)
        let epoch = generation
        statusObserver = item.observe(\.status, options: [.new]) { [weak self] item, _ in
          DispatchQueue.main.async { [weak self] in
            guard let self, self.generation == epoch else { return }
            if item.status == .failed { self.terminalError = true; self.emit("error", error: "Video decoding failed") }
            else if item.status == .readyToPlay { self.apply(); self.emit("ready") }
          }
        }
        endObserver = NotificationCenter.default.addObserver(forName: .AVPlayerItemDidPlayToEndTime, object: item, queue: .main) { [weak self] _ in
          guard let self, self.generation == epoch else { return }; self.ended = true; self.emit("ended")
        }
        player.replaceCurrentItem(with: item); emit("loading")
      }
      apply()
    }
    private func apply() {
      guard let p = props, !terminalError else { return }
      player.isMuted = p.muted; player.volume = Float(min(1, max(0, p.volume)))
      guard player.currentItem?.status == .readyToPlay else { return }
      if requestedToken != p.seekToken {
        requestedToken = p.seekToken; seeking = true; ended = false; appliedPaused = nil; appliedRate = nil
        let epoch = generation, token = p.seekToken
        player.pause(); player.currentItem?.cancelPendingSeeks()
        let target = CMTime(value: Int64(max(0, min(9_007_199_254_740_991, p.seekTimeUs))), timescale: 1_000_000)
        player.seek(to: target, toleranceBefore: .zero, toleranceAfter: .zero) { [weak self] completed in
          DispatchQueue.main.async { [weak self] in
            guard let self, self.generation == epoch, self.requestedToken == token else { return }
            self.seeking = false
            if completed { self.completedToken = token; self.apply(); self.emit() }
            else { self.emit("error", error: "Video seek did not complete") }
          }
        }
        return
      }
      guard !seeking else { return }
      if p.paused {
        if appliedPaused != true { player.pause() }
        appliedPaused = true; appliedRate = nil
      } else if !ended {
        let rate = Float(min(4, max(0.25, p.rate)))
        if appliedPaused != false || appliedRate != rate { player.playImmediately(atRate: rate) }
        appliedPaused = false; appliedRate = rate
      }
    }
    func close() {
      generation += 1; player.pause(); player.currentItem?.cancelPendingSeeks(); statusObserver = nil
      if let observer { player.removeTimeObserver(observer); self.observer = nil }
      if let endObserver { NotificationCenter.default.removeObserver(endObserver); self.endObserver = nil }
      player.replaceCurrentItem(with: nil); props = nil
    }
  }
}
