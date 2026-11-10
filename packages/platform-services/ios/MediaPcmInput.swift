// One bounded, reusable source buffer for an AVAudioConverter. This owner stays
// on the decoder's serial worker; the converter consumes each returned buffer
// before asking for more. Compressed decoding never also changes sample rate.
import AVFoundation

final class MediaPcmInput {
  private let reader: AVAssetReader
  private let output: AVAssetReaderTrackOutput
  private let buffer: AVAudioPCMBuffer
  private let sampleRate: Double
  private let channels: Int
  private let bytesPerFrame: Int
  private var sampleBuffer: CMSampleBuffer?
  private var offset = 0
  private var available = 0
  private var expectedTime: Double?
  private(set) var firstTime: Double?
  private(set) var suppliedFrames = 0

  init(reader: AVAssetReader, output: AVAssetReaderTrackOutput, format: AVAudioFormat) throws {
    self.reader = reader
    self.output = output
    sampleRate = format.sampleRate
    channels = Int(format.channelCount)
    bytesPerFrame = channels * MemoryLayout<Float>.size
    guard let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 4096) else {
      throw MediaDecodeFailure(.decodeFailed, "Cannot allocate the source PCM buffer")
    }
    self.buffer = buffer
  }

  /// Nil means the reader really finished, so the converter can drain its tail.
  func next(_ requestedFrames: AVAudioPacketCount) throws -> AVAudioPCMBuffer? {
    guard requestedFrames > 0 else {
      throw MediaDecodeFailure(.decodeFailed, "The converter requested an empty PCM buffer")
    }
    while offset == available {
      guard let next = output.copyNextSampleBuffer() else {
        if reader.status == .failed {
          throw MediaDecodeFailure(avError: reader.error ?? MediaDecodeFailure(.decodeFailed, "The audio reader failed"))
        }
        guard reader.status == .completed else {
          throw MediaDecodeFailure(.decodeFailed, "The audio reader stopped before end of stream")
        }
        return nil
      }
      guard let block = CMSampleBufferGetDataBuffer(next),
        let description = CMSampleBufferGetFormatDescription(next),
        let format = CMAudioFormatDescriptionGetStreamBasicDescription(description)?.pointee,
        format.mSampleRate == sampleRate, Int(format.mChannelsPerFrame) == channels,
        Int(format.mBytesPerFrame) == bytesPerFrame
      else {
        throw MediaDecodeFailure(.unsupportedFormat, "Decoded PCM changed format or contains no sample data")
      }
      let byteCount = CMBlockBufferGetDataLength(block)
      guard byteCount % bytesPerFrame == 0 else {
        throw MediaDecodeFailure(.decodeFailed, "PCM buffer is not frame-aligned")
      }
      available = byteCount / bytesPerFrame
      offset = 0
      guard available > 0 else { continue }
      let time = CMSampleBufferGetPresentationTimeStamp(next).seconds
      guard time.isFinite else { throw MediaDecodeFailure(.decodeFailed, "PCM timestamp is invalid") }
      if let expectedTime, abs(time - expectedTime) > 1.5 / sampleRate {
        throw MediaDecodeFailure(.unsupportedFormat, "Discontinuous PCM timestamps require an edit-aware decoder")
      }
      if firstTime == nil { firstTime = time }
      expectedTime = time + Double(available) / sampleRate
      sampleBuffer = next
    }
    guard let sampleBuffer, let block = CMSampleBufferGetDataBuffer(sampleBuffer),
      let samples = buffer.floatChannelData?[0]
    else { throw MediaDecodeFailure(.decodeFailed, "Cannot access source PCM samples") }
    let count = min(Int(requestedFrames), Int(buffer.frameCapacity), available - offset)
    let status = CMBlockBufferCopyDataBytes(block, atOffset: offset * bytesPerFrame,
      dataLength: count * bytesPerFrame, destination: samples)
    guard status == kCMBlockBufferNoErr else {
      throw MediaDecodeFailure(.decodeFailed, "Could not read a PCM buffer (\(status))")
    }
    offset += count
    suppliedFrames += count
    buffer.frameLength = AVAudioFrameCount(count)
    return buffer
  }
}
