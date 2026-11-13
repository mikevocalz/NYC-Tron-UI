import XCTest

// Pages the Home Screen until the first named icon is hittable, then writes
// the frame of every named icon on that page and a screenshot. The names come
// from LAUNCHER_NAMES ("A|B|C"), the output directory from LAUNCHER_OUT; pass
// them as TEST_RUNNER_LAUNCHER_NAMES and TEST_RUNNER_LAUNCHER_OUT.
final class LauncherCaptureTests: XCTestCase {
  func testCaptureLauncherPage() throws {
    let env = ProcessInfo.processInfo.environment
    let names = (env["LAUNCHER_NAMES"] ?? "").split(separator: "|").map(String.init)
    let out = env["LAUNCHER_OUT"] ?? NSTemporaryDirectory()
    XCTAssertFalse(names.isEmpty, "LAUNCHER_NAMES is empty")
    let springboard = XCUIApplication(bundleIdentifier: "com.apple.springboard")
    XCUIDevice.shared.press(.home)
    sleep(2)
    XCUIDevice.shared.press(.home)
    sleep(2)
    let anchor = springboard.icons[names[1 < names.count ? 1 : 0]]
    var page = 0
    while !(anchor.exists && anchor.isHittable) && page < 8 {
      springboard.swipeLeft()
      sleep(2)
      page += 1
    }
    XCTAssertTrue(anchor.exists && anchor.isHittable, "\(anchor) is not on any Home Screen page")
    sleep(1)
    let screen = XCUIScreen.main
    var rows: [[String: Any]] = []
    for name in names {
      let icon = springboard.icons[name]
      guard icon.exists else { rows.append(["name": name, "found": false]); continue }
      let f = icon.frame
      rows.append([
        "name": name, "found": true, "hittable": icon.isHittable,
        "label": icon.label,
        "x": f.origin.x, "y": f.origin.y, "width": f.size.width, "height": f.size.height,
      ])
    }
    let bounds = springboard.frame
    let record: [String: Any] = [
      // XCUIScreen has no scale; capture-ios.sh derives px per pt from the
      // simctl screenshot width divided by screenWidth.
      "page": page,
      "screenWidth": bounds.size.width, "screenHeight": bounds.size.height,
      "icons": rows,
    ]
    let json = try JSONSerialization.data(withJSONObject: record, options: [.prettyPrinted, .sortedKeys])
    try json.write(to: URL(fileURLWithPath: out).appendingPathComponent("icons.json"))
    try screen.screenshot().pngRepresentation.write(to: URL(fileURLWithPath: out).appendingPathComponent("xcui-screen.png"))
    print("LAUNCHER_ICONS_JSON " + String(decoding: json, as: UTF8.self).replacingOccurrences(of: "\n", with: " "))
  }
}
