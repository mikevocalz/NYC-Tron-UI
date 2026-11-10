import UIKit

/// The OS owns sampling and prediction. This view never owns a document or stroke.
final class TronPointerCaptureView: UIView {
  var emitBatch: (([String: Any]) -> Void)?
  var emitKey: (([String: Any]) -> Void)?
  private var identifiers: [ObjectIdentifier: Int] = [:]
  private var latest: [Int: [String: Any]] = [:]
  private var nextIdentifier = 1
  private var hover: [String: Any]?
  private var heldKeys: [Int: [String: Any]] = [:]
  override var canBecomeFirstResponder: Bool { true }

  init() {
    super.init(frame: .zero)
    backgroundColor = .clear
    isMultipleTouchEnabled = true
    isAccessibilityElement = true
    for type in [UITouch.TouchType.pencil, .indirectPointer] {
      let recognizer = UIHoverGestureRecognizer(target: self, action: #selector(onHover(_:)))
      recognizer.allowedTouchTypes = [NSNumber(value: type.rawValue)]
      recognizer.cancelsTouchesInView = false
      addGestureRecognizer(recognizer)
    }
  }
  required init?(coder: NSCoder) { nil }

  private func sample(_ touch: UITouch, id: Int, event: UIEvent?) -> [String: Any] {
    let point = touch.preciseLocation(in: self)
    let pen = touch.type == .pencil
    let altitude = touch.altitudeAngle
    let azimuth = touch.azimuthAngle(in: self)
    let hasForce = pen || (touch.type == .direct && traitCollection.forceTouchCapability == .available)
    let force: Any = hasForce && touch.maximumPossibleForce > 0
      ? Double(min(1, max(0, touch.force / touch.maximumPossibleForce))) : NSNull()
    return ["pointerId": id, "kind": pen ? "pen" : touch.type == .indirectPointer ? "mouse" : "touch",
      "x": Double(point.x), "y": Double(point.y), "timestampMs": touch.timestamp * 1000,
      "pressure": force,
      "tiltX": pen ? atan2(cos(azimuth) * cos(altitude), sin(altitude)) * 180 / .pi as Any : NSNull(),
      "tiltY": pen ? atan2(sin(azimuth) * cos(altitude), sin(altitude)) * 180 / .pi as Any : NSNull(),
      "buttons": Int(event?.buttonMask.rawValue ?? 0)]
  }

  private func deliver(_ touches: Set<UITouch>, event: UIEvent?, phase: String) {
    for touch in touches {
      let key = ObjectIdentifier(touch)
      if phase == "down" { identifiers[key] = nextIdentifier; nextIdentifier += 1 }
      guard let id = identifiers[key] else { continue }
      let point = sample(touch, id: id, event: event)
      latest[id] = point
      // UIKit's coalesced list includes the current sample. Do not append it twice.
      let actual = phase == "move" ? (event?.coalescedTouches(for: touch) ?? [touch]) : [touch]
      let predicted = phase == "move" ? (event?.predictedTouches(for: touch) ?? []) : []
      if phase == "up" || phase == "cancel" { identifiers.removeValue(forKey: key); latest.removeValue(forKey: id) }
      emitBatch?(["phase": phase, "samples": actual.map { sample($0, id: id, event: event) },
        "predicted": predicted.map { sample($0, id: id, event: event) }])
    }
  }
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) { becomeFirstResponder(); deliver(touches,event:event,phase:"down") }
  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) { deliver(touches,event:event,phase:"move") }
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) { deliver(touches,event:event,phase:"up") }
  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) { deliver(touches,event:event,phase:"cancel") }

  @objc private func onHover(_ recognizer: UIHoverGestureRecognizer) {
    let point = recognizer.location(in: self)
    let isPen = recognizer.allowedTouchTypes.contains(NSNumber(value: UITouch.TouchType.pencil.rawValue))
    let sample: [String: Any] = ["pointerId": isPen ? -1 : -2, "kind": isPen ? "pen" : "mouse",
      "x": Double(point.x), "y": Double(point.y), "timestampMs": ProcessInfo.processInfo.systemUptime * 1000,
      "pressure": NSNull(), "tiltX": NSNull(), "tiltY": NSNull(), "buttons": 0]
    let ended = recognizer.state == .ended || recognizer.state == .cancelled || recognizer.state == .failed
    hover = ended ? nil : sample
    emitBatch?(["phase": ended ? "hover-exit" : "hover", "samples": [sample], "predicted": []])
  }
  private func keys(_ presses: Set<UIPress>, phase: String) {
    for press in presses {
      guard let key = press.key else { continue }
      let code = Int(key.keyCode.rawValue)
      let sample: [String: Any] = ["phase":phase,"key":key.charactersIgnoringModifiers,"code":String(code),
        "shift":key.modifierFlags.contains(.shift),"alt":key.modifierFlags.contains(.alternate),
        "control":key.modifierFlags.contains(.control),"meta":key.modifierFlags.contains(.command),"repeat":phase == "down" && heldKeys[code] != nil]
      if phase == "down" { heldKeys[code] = sample } else { heldKeys.removeValue(forKey: code) }
      emitKey?(sample)
    }
  }
  override func pressesBegan(_ presses: Set<UIPress>, with event: UIPressesEvent?) { keys(presses,phase:"down"); super.pressesBegan(presses,with:event) }
  override func pressesEnded(_ presses: Set<UIPress>, with event: UIPressesEvent?) { keys(presses,phase:"up"); super.pressesEnded(presses,with:event) }
  override func pressesCancelled(_ presses: Set<UIPress>, with event: UIPressesEvent?) { keys(presses,phase:"up"); super.pressesCancelled(presses,with:event) }
  override func didMoveToWindow() { super.didMoveToWindow(); if window == nil { cancelInput() } }
  override func resignFirstResponder() -> Bool { cancelInput(); return super.resignFirstResponder() }
  private func cancelInput() {
    let pending = Array(latest.values)
    latest.removeAll(); identifiers.removeAll()
    for point in pending { emitBatch?(["phase":"cancel","samples":[point],"predicted":[]]) }
    if let point = hover { hover = nil; emitBatch?(["phase":"hover-exit","samples":[point],"predicted":[]]) }
    let keys = Array(heldKeys.values)
    heldKeys.removeAll()
    for var key in keys { key["phase"] = "up"; key["repeat"] = false; emitKey?(key) }
  }
  func close() { cancelInput(); emitBatch = nil; emitKey = nil }
}
