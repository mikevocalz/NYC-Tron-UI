// Media time in integer microseconds, the unit every JS call uses.
import CoreMedia

extension CMTime {
  init(microseconds: Int64) {
    self = CMTime(value: microseconds, timescale: 1_000_000)
  }

  var microseconds: Int64 {
    CMTimeConvertScale(self, timescale: 1_000_000, method: .roundHalfAwayFromZero).value
  }
}
