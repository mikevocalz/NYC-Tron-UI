package com.nyctron.platformservices

/** Stable JS-readable prefix, without echoing platform messages. */
internal class AudioDeviceFailure(code: String, message: String) : Exception("[$code] $message")
