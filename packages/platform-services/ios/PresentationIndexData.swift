import CoreMedia

/// Plain worker result, independent of the Expo bridge record encoding.
struct PresentationIndexData {
  let durationUs: Double
  let timesUs: [Double]
  /// Exact edit-mapped rational timestamps remain on the native worker.
  let presentationTimes: [CMTime]

  func presentationTime(microseconds: Int64) -> CMTime? {
    let wanted = Double(microseconds)
    var lower = 0
    var upper = timesUs.count
    while lower < upper {
      let middle = lower + (upper - lower) / 2
      if timesUs[middle] < wanted { lower = middle + 1 } else { upper = middle }
    }
    guard lower < timesUs.count, timesUs[lower] == wanted else { return nil }
    return presentationTimes[lower]
  }
}

