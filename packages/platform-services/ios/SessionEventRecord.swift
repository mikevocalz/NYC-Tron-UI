// One audio session event as JS receives it. Flat on purpose: JS reads it
// into the AudioSessionEvent union (toSessionEvent in src/playback/policy.ts)
// and ignores the fields a type does not use.
import ExpoModulesCore

@Record
struct SessionEventRecord {
  var type: String
  var shouldResume: Bool = false
  var transient: Bool = false
  var canDuck: Bool = false
  var reason: String = ""
}
