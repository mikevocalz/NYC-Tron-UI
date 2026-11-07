package com.nyctron.instruments

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord

@OptimizedRecord
data class TronVideoStatusPayload(
  @Field val sourceId:String, @Field val status:String,
  @Field val positionUs:Double, @Field val durationUs:Double,
  @Field val seekToken:String, @Field val error:String
):Record
