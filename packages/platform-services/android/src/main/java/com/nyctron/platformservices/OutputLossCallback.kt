package com.nyctron.platformservices

import android.media.AudioDeviceCallback
import android.media.AudioDeviceInfo

/**
 * Reports a headset or Bluetooth output going away, the moment Android would
 * move audio to the speaker. Adding a device never pauses anything.
 */
internal class OutputLossCallback(private val emit: (SessionEventRecord) -> Unit) : AudioDeviceCallback() {
  override fun onAudioDevicesRemoved(removedDevices: Array<out AudioDeviceInfo>) {
    val outputs = removedDevices.filter { it.isSink }
    val reason = when {
      outputs.any { it.type in WIRED } -> "headphones-unplugged"
      outputs.any { it.type in BLUETOOTH } -> "bluetooth-disconnected"
      else -> return
    }
    emit(SessionEvents.of("output-lost", reason = reason))
  }

  private companion object {
    val WIRED = setOf(
      AudioDeviceInfo.TYPE_WIRED_HEADPHONES,
      AudioDeviceInfo.TYPE_WIRED_HEADSET,
      AudioDeviceInfo.TYPE_USB_HEADSET,
    )
    val BLUETOOTH = setOf(
      AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
      AudioDeviceInfo.TYPE_BLUETOOTH_SCO,
      AudioDeviceInfo.TYPE_BLE_HEADSET,
      AudioDeviceInfo.TYPE_BLE_SPEAKER,
    )
  }
}
