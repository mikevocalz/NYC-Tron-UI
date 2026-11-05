package com.nyctron.reservedregions

import io.github.expo.modules.v2.Record

/**
 * One region as JS receives it, in dp, window-relative. Mirrors `ReservedRegion`
 * in @nyc-tron/core/folds. The four nullable fields are
 * FoldingFeature metadata that UIKit regions do not carry.
 */
@Record
data class ReservedRegionRecord(
  val kind: String,
  val x: Double,
  val y: Double,
  val width: Double,
  val height: Double,
  val margins: RegionMarginsRecord,
  val active: Boolean,
  val orientation: String?,
  val state: String?,
  val occlusionType: String?,
  val separating: Boolean?,
)
