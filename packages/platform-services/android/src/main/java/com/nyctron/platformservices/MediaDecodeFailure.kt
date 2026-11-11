package com.nyctron.platformservices

/** Stable JS-readable prefix, without echoing source paths or platform messages. */
internal class MediaDecodeFailure(code: String, message: String) : Exception("[$code] $message")
