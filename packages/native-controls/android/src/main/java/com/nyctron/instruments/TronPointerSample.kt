package com.nyctron.instruments

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord

@OptimizedRecord
data class TronPointerSample(
  @Field val pointerId:Double, @Field val kind:String,
  @Field val x:Double, @Field val y:Double, @Field val timestampMs:Double,
  @Field val pressure:Double?, @Field val tiltX:Double?, @Field val tiltY:Double?,
  @Field val buttons:Int
):Record
