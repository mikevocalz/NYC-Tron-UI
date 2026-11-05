package com.nyctron.platformservices

/** Builds [SessionEventRecord]s with every field set. */
internal object SessionEvents {
  fun of(type: String, transient: Boolean = false, canDuck: Boolean = false, reason: String = "") =
    SessionEventRecord(type = type, shouldResume = false, transient = transient, canDuck = canDuck, reason = reason)
}
