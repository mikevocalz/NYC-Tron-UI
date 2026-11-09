// Bounded single-producer/single-consumer ring of interleaved Float32 PCM
// frames for @nyc-tron/platform-services/audio.
//
// One writer thread (the JS-facing write/read path) and one realtime
// consumer (the AVAudioSourceNode render block, or the input tap's drain
// direction reversed). Indices and counters sit behind a short
// OSAllocatedUnfairLock critical section: bounded, allocation-free on both
// sides, but NOT formally wait-free — the P09 decision doc calls for a
// prototype before claiming realtime guarantees, so this stays flagged
// unverified on device.
import AVFoundation
import os

final class PCMRingBuffer {
  let channels: Int
  let capacityFrames: Int

  private var storage: [Float]
  private var head = 0 // next write frame, modulo capacity
  private var tail = 0 // next read frame, modulo capacity
  private var count = 0
  private var _droppedFrames = 0
  private var _underrunFrames = 0
  private let lock = OSAllocatedUnfairLock()

  init(channels: Int, capacityFrames: Int) {
    self.channels = max(1, channels)
    self.capacityFrames = max(1, capacityFrames)
    self.storage = [Float](repeating: 0, count: self.capacityFrames * self.channels)
  }

  var droppedFrames: Int { lock.withLock { _droppedFrames } }
  var underrunFrames: Int { lock.withLock { _underrunFrames } }
  var queuedFrames: Int { lock.withLock { count } }

  /// Pushes up to `frames` interleaved Float32 samples; returns frames stored.
  /// Overflow drops the incoming tail and counts it — played audio stays contiguous.
  @discardableResult
  func push(_ samples: UnsafeBufferPointer<Float>, frames: Int) -> Int {
    guard frames > 0 else { return 0 }
    return lock.withLock {
      let free = capacityFrames - count
      let n = min(free, frames)
      if n <= 0 { _droppedFrames += frames; return 0 }
      for i in 0..<n {
        let srcBase = i * channels
        let dstBase = head * channels
        for c in 0..<channels {
          storage[dstBase + c] = srcBase + c < samples.count ? samples[srcBase + c] : 0
        }
        head = (head + 1) % capacityFrames
      }
      count += n
      _droppedFrames += frames - n
      return n
    }
  }

  /// Pops up to `frames` interleaved Float32 samples into `out`; returns frames read.
  @discardableResult
  func pop(into out: UnsafeMutableBufferPointer<Float>, frames: Int) -> Int {
    guard frames > 0 else { return 0 }
    return lock.withLock {
      let n = min(frames, count)
      for i in 0..<n {
        let srcBase = tail * channels
        let dstBase = i * channels
        for c in 0..<channels {
          if dstBase + c < out.count { out[dstBase + c] = storage[srcBase + c] }
        }
        tail = (tail + 1) % capacityFrames
      }
      count -= n
      return n
    }
  }

  /// Realtime render pull: copies `frameCount` frames of silence-padded
  /// output into a non-interleaved float AudioBufferList. Runs on the
  /// audio render thread — no allocation, no blocking beyond the short lock.
  func render(frameCount: AVAudioFrameCount, buffers: UnsafeMutablePointer<AudioBufferList>) {
    lock.lock()
    let wanted = Int(frameCount)
    let n = min(wanted, count)
    let list = UnsafeMutableAudioBufferListPointer(buffers)
    let outChannels = min(channels, list.count)
    for c in 0..<outChannels {
      guard let data = list[c].mData else { continue }
      let dst = data.assumingMemoryBound(to: Float.self)
      for i in 0..<wanted {
        dst[i] = i < n ? storage[(tail + i) % capacityFrames * channels + c] : 0
      }
    }
    for c in outChannels..<list.count {
      guard let data = list[c].mData else { continue }
      let dst = data.assumingMemoryBound(to: Float.self)
      for i in 0..<wanted { dst[i] = 0 }
    }
    if n < wanted { _underrunFrames += wanted - n }
    tail = (tail + n) % capacityFrames
    count -= n
    lock.unlock()
  }
}
