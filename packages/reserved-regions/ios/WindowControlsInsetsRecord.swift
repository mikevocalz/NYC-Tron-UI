// Space that iPadOS window controls (close, minimize, tile) take from the
// window's top corner, as the record JS receives. Logical points. Leading and
// trailing follow the layout direction; height is how far down the controls
// reach. All zero when the window is full screen or the OS has no controls.
import ExpoModulesCore

@Record
struct WindowControlsInsetsRecord {
  var leading: Double
  var trailing: Double
  var height: Double
}
