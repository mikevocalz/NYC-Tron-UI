package com.nyctron.charts

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord

@OptimizedRecord
data class TronChartSeries(
  @Field val id: String = "",
  @Field val label: String = "",
  @Field val color: String = "",
  @Field val points: List<TronChartPoint> = emptyList()
) : Record
