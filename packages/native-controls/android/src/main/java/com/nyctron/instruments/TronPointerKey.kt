package com.nyctron.instruments

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord

@OptimizedRecord
data class TronPointerKey(
  @Field val phase:String,@Field val key:String,@Field val code:String,
  @Field val shift:Boolean,@Field val alt:Boolean,@Field val control:Boolean,
  @Field val meta:Boolean,@Field val repeat:Boolean
):Record
