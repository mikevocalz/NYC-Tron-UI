package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

/**
 * What this build's recognizer reports. `networkPossible` is always true on
 * Android: EXTRA_PREFER_OFFLINE is a hint, and onDeviceOnly=false explicitly
 * allows the network recognizer — which is why the JS consent gate exists.
 */
@Record
data class SpeechProbeRecord(
  val available: Boolean,
  val onDevice: Boolean,
  val networkPossible: Boolean,
)
