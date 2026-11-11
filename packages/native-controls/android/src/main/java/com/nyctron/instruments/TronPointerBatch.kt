package com.nyctron.instruments

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.types.OptimizedRecord

@OptimizedRecord
data class TronPointerBatch(@Field val phase:String,@Field val samples:List<TronPointerSample>,@Field val predicted:List<TronPointerSample>):Record
