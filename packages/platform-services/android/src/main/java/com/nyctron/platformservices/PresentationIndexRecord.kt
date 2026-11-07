package com.nyctron.platformservices

import io.github.expo.modules.v2.Record

@Record
data class PresentationIndexRecord(val durationUs: Double, val timesUs: List<Double>)
