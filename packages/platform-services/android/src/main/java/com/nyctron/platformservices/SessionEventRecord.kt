package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/**
 * One audio session event as JS receives it. Flat on purpose: JS reads it
 * into the AudioSessionEvent union (toSessionEvent in src/playback/policy.ts)
 * and ignores the fields a type does not use.
 */
@Record
data class SessionEventRecord(
  val type: String,
  val shouldResume: Boolean,
  val transient: Boolean,
  val canDuck: Boolean,
  val reason: String,
)
