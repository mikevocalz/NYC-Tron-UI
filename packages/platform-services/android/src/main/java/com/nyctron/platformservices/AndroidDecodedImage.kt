package com.nyctron.platformservices

import android.graphics.Bitmap
import android.graphics.ImageFormat
import android.graphics.Matrix
import android.media.Image
import android.media.MediaFormat
import java.io.File
import kotlin.math.min
import kotlin.math.roundToInt

/** Bounded SDR YUV conversion honoring row/pixel strides, crop, range and rotation. */
internal object AndroidDecodedImage {
  fun write(image: Image, format: MediaFormat, request: FrameRequestRecord, output: File, check: () -> Unit): Pair<Int, Int> {
    if (image.format != ImageFormat.YUV_420_888 || image.planes.size != 3)
      throw MediaDecodeFailure("unsupported-format", "Only flexible 8-bit YUV frames are supported.")
    val transfer = if (format.containsKey(MediaFormat.KEY_COLOR_TRANSFER)) format.getInteger(MediaFormat.KEY_COLOR_TRANSFER) else 0
    if (transfer == MediaFormat.COLOR_TRANSFER_ST2084 || transfer == MediaFormat.COLOR_TRANSFER_HLG)
      throw MediaDecodeFailure("unsupported-format", "HDR requires a color-managed rendering pipeline.")
    val crop = image.cropRect
    val rotation = if (format.containsKey(MediaFormat.KEY_ROTATION)) format.getInteger(MediaFormat.KEY_ROTATION) else 0
    val swapped = rotation % 180 != 0
    val maxWidth = if (swapped) request.maxHeight else request.maxWidth
    val maxHeight = if (swapped) request.maxWidth else request.maxHeight
    val scale = min(1.0, min(maxWidth / crop.width(), maxHeight / crop.height()))
    val width = maxOf(1, (crop.width() * scale).toInt()); val height = maxOf(1, (crop.height() * scale).toInt())
    val pixels = IntArray(width * height)
    val planes = image.planes
    val buffers = planes.map { it.buffer.duplicate() }
    val standard = if (format.containsKey(MediaFormat.KEY_COLOR_STANDARD)) format.getInteger(MediaFormat.KEY_COLOR_STANDARD) else MediaFormat.COLOR_STANDARD_BT601_NTSC
    if (standard !in listOf(0, MediaFormat.COLOR_STANDARD_BT601_NTSC, MediaFormat.COLOR_STANDARD_BT601_PAL, MediaFormat.COLOR_STANDARD_BT709))
      throw MediaDecodeFailure("unsupported-format", "Unsupported video color standard.")
    val full = format.containsKey(MediaFormat.KEY_COLOR_RANGE) && format.getInteger(MediaFormat.KEY_COLOR_RANGE) == MediaFormat.COLOR_RANGE_FULL
    val kr = if (standard == MediaFormat.COLOR_STANDARD_BT709) .2126 else .299
    val kb = if (standard == MediaFormat.COLOR_STANDARD_BT709) .0722 else .114
    fun sample(plane: Int, x: Int, y: Int): Int {
      val buffer = buffers[plane]
      val offset = buffer.position() + y * planes[plane].rowStride + x * planes[plane].pixelStride
      return buffer.get(offset).toInt() and 255
    }
    fun channel(value: Double) = (value * 255).roundToInt().coerceIn(0, 255)
    for (y in 0 until height) {
      check()
      val sy = crop.top + min(crop.height() - 1, (y / scale).toInt())
      for (x in 0 until width) {
        val sx = crop.left + min(crop.width() - 1, (x / scale).toInt())
        val luma = (sample(0, sx, sy) - if (full) 0 else 16).toDouble() / if (full) 255 else 219
        val u = (sample(1, sx / 2, sy / 2) - 128).toDouble() / if (full) 255 else 224
        val v = (sample(2, sx / 2, sy / 2) - 128).toDouble() / if (full) 255 else 224
        val red = luma + 2 * (1 - kr) * v
        val blue = luma + 2 * (1 - kb) * u
        val green = (luma - kr * red - kb * blue) / (1 - kr - kb)
        pixels[y * width + x] = (255 shl 24) or (channel(red) shl 16) or (channel(green) shl 8) or channel(blue)
      }
    }
    val bitmap = Bitmap.createBitmap(pixels, width, height, Bitmap.Config.ARGB_8888)
    var rotated: Bitmap? = null
    try {
      val result = if (rotation % 360 != 0) Bitmap.createBitmap(bitmap, 0, 0, width, height,
        Matrix().apply { postRotate(rotation.toFloat()) }, true).also { rotated = it } else bitmap
      output.outputStream().use { stream ->
        if (!result.compress(Bitmap.CompressFormat.JPEG, 90, stream)) throw MediaDecodeFailure("decode-failed", "Frame encoding failed.")
      }
      return result.width to result.height
    } finally { if (rotated !== bitmap) rotated?.recycle(); bitmap.recycle() }
  }
}
