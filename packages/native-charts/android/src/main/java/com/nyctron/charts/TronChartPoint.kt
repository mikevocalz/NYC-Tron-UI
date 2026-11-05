package com.nyctron.charts

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord

@OptimizedRecord
data class TronChartPoint(
  @Field val x: Double = 0.0,
  @Field val y: Double = 0.0
) : Record
