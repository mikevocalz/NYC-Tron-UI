#!/usr/bin/env bash
# Installs the built example beside a short-named app and a long-named probe
# on an AOSP (Launcher3) API 36 emulator, opens All apps in dark mode,
# screenshots with adb screencap and measures the labels. It also pulls the
# emulator's RobotoStatic-Regular.ttf and records its name table and whether
# its advances match the committed table. CI only.
#
#   capture-android.sh <app .apk> <out dir>
set -euo pipefail
apk="$1"
out="$2"
here="$(cd "$(dirname "$0")" && pwd)"
short="Tron"
long="Tron Lab Instruments Demo"
mkdir -p "$out/android-launcher3"
dir="$out/android-launcher3"
work="$RUNNER_TEMP/launcher-android-work"
mkdir -p "$work"
export ANDROID_USER_HOME="$work/android-user"
export ANDROID_AVD_HOME="$ANDROID_USER_HOME/avd"
mkdir -p "$ANDROID_AVD_HOME"
sdk="$ANDROID_HOME/cmdline-tools/latest/bin"
image="system-images;android-36;default;x86_64"
yes | "$sdk/sdkmanager" --licenses > /dev/null || true
"$sdk/sdkmanager" "$image" "emulator" "platform-tools" "build-tools;36.0.0" "platforms;android-36" > "$work/sdkmanager.log"
bt="$ANDROID_HOME/build-tools/36.0.0"
jar="$ANDROID_HOME/platforms/android-36/android.jar"

# Probe apps: a manifest with a label and a launcher activity, no code.
keytool -genkeypair -keystore "$work/probe.keystore" -storepass android -keypass android -alias probe \
  -dname "CN=NYC-Tron launcher probe" -keyalg RSA -keysize 2048 -validity 30 > /dev/null 2>&1
probe() {
  local pkg="$1" label="$2" dest="$3"
  local m="$work/$pkg"
  mkdir -p "$m"
  cat > "$m/AndroidManifest.xml" <<XML
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="$pkg">
  <application android:label="$label" android:hasCode="false">
    <activity android:name="android.app.NativeActivity" android:exported="true">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>
  </application>
</manifest>
XML
  "$bt/aapt2" link --manifest "$m/AndroidManifest.xml" -I "$jar" --min-sdk-version 24 --target-sdk-version 36 -o "$m/unaligned.apk"
  "$bt/zipalign" -f 4 "$m/unaligned.apk" "$m/aligned.apk"
  "$bt/apksigner" sign --ks "$work/probe.keystore" --ks-pass pass:android --out "$dest" "$m/aligned.apk"
}
probe org.nyctron.launcherprobe.short "$short" "$work/short.apk"
probe org.nyctron.launcherprobe.long "$long" "$work/long.apk"

printf 'no\n' | "$sdk/avdmanager" create avd --force -n LauncherCapture -k "$image" -d pixel_6 --path "$ANDROID_AVD_HOME/LauncherCapture.avd"
if [[ -e /dev/kvm ]]; then sudo chmod 666 /dev/kvm; fi
"$ANDROID_HOME/emulator/emulator" -avd LauncherCapture -port 5560 -no-window -no-audio -no-snapshot -gpu swiftshader_indirect -memory 3072 > "$dir/emulator.log" 2>&1 &
emulator_pid=$!
trap 'kill "$emulator_pid" 2>/dev/null || true' EXIT
adb="$ANDROID_HOME/platform-tools/adb"
export ANDROID_SERIAL=emulator-5560
"$adb" wait-for-device
for _ in $(seq 1 120); do
  [ "$("$adb" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && break
  sleep 5
done
sleep 30
for s in window_animation_scale transition_animation_scale animator_duration_scale; do "$adb" shell settings put global "$s" 0; done
"$adb" shell cmd uimode night yes
"$adb" shell getprop ro.build.fingerprint > "$dir/device.txt"
"$adb" shell wm size >> "$dir/device.txt"
"$adb" shell wm density >> "$dir/device.txt"
"$adb" shell cmd package resolve-activity --brief -c android.intent.category.HOME -a android.intent.action.MAIN >> "$dir/device.txt"
cat "$dir/device.txt"
density="$("$adb" shell wm density | tr -d '\r' | awk -F': ' '/Override/{o=$2} /Physical/{p=$2} END{print (o?o:p)}')"

# Install order: short, the example, long. All apps sorts them together.
launcher="$("$bt/aapt2" dump badging "$apk" | sed -n "s/^application-label:'\(.*\)'$/\1/p" | head -1)"
echo "example launcher label: $launcher"
test -n "$launcher"
"$adb" install -r "$work/short.apk"
"$adb" install -r "$apk"
"$adb" install -r "$work/long.apk"
"$adb" shell input keyevent KEYCODE_HOME
sleep 5
"$adb" exec-out screencap -p > "$dir/home.png"

# Open All apps with a swipe up from the workspace, then scroll to the names.
size="$("$adb" shell wm size | tr -d '\r' | awk -F': ' '{print $2}' | tail -1)"
w="${size%x*}"; h="${size#*x}"
"$adb" shell input swipe $((w / 2)) $((h * 85 / 100)) $((w / 2)) $((h * 20 / 100)) 400
sleep 4
found=0
for _ in $(seq 1 8); do
  "$adb" shell uiautomator dump /sdcard/ui.xml > /dev/null 2>&1 || true
  "$adb" pull /sdcard/ui.xml "$dir/allapps.xml" > /dev/null
  if node "$here/android-layout.mjs" "$dir/allapps.xml" "$density" "$short|$launcher|$long" "$dir/layout.json"; then found=1; break; fi
  "$adb" shell input swipe $((w / 2)) $((h * 75 / 100)) $((w / 2)) $((h * 45 / 100)) 600
  sleep 3
done
[ "$found" = 1 ] || { echo "the three labels were never on one All apps screen"; exit 1; }
sleep 2
"$adb" exec-out screencap -p > "$dir/allapps.png"
node "$here/measure-label-ink.mjs" --image "$dir/allapps.png" --icons "$dir/layout.json" --target android-launcher3 \
  --probe "$long" --app "$launcher" --font-size 14 --out "$dir/measurement.json" --crop "$dir/allapps-crop.png"

# The exact font the committed advance widths came from.
mkdir -p "$out/roboto"
"$adb" pull /system/fonts/RobotoStatic-Regular.ttf "$out/roboto/RobotoStatic-Regular.ttf"
python3 -m pip install --quiet fonttools
python3 "$here/roboto-provenance.py" "$out/roboto/RobotoStatic-Regular.ttf" "$here/../fonts/roboto-static-regular.json" "$out/roboto/provenance.json"
