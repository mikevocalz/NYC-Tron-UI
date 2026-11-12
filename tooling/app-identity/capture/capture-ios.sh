#!/usr/bin/env bash
# Installs the built example beside a short-named app and a long-named probe
# on an iPhone and an iPad simulator, pages SpringBoard to them with XCUITest,
# screenshots with `simctl io` and measures the labels. CI only.
#
#   capture-ios.sh <Tron Lab .app> <out dir>
set -euo pipefail
app="$1"
out="$2"
here="$(cd "$(dirname "$0")" && pwd)"
launcher="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleDisplayName' "$app/Info.plist")"
short="Tron"
long="Tron Lab Instruments Demo"
mkdir -p "$out"
xcrun simctl list runtimes > "$out/runtimes.txt"
xcodebuild -version > "$out/xcode.txt"

# Short and long probes are copies of the built app with a new id and name.
probe() {
  local name="$1" id="$2" dest="$3"
  rm -rf "$dest"
  cp -R "$app" "$dest"
  /usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $id" "$dest/Info.plist"
  /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName $name" "$dest/Info.plist"
  /usr/libexec/PlistBuddy -c "Set :CFBundleName $name" "$dest/Info.plist" || true
}
work="$RUNNER_TEMP/launcher-ios-work"
mkdir -p "$work"
probe "$short" org.nyctron.launcherprobe.short "$work/Short.app"
probe "$long" org.nyctron.launcherprobe.long "$work/Long.app"

# The XCUITest that pages SpringBoard; its host app shows as "Probe".
(cd "$here/ios" && xcodegen generate --quiet)
xcodebuild build-for-testing -project "$here/ios/LauncherCapture.xcodeproj" -scheme LauncherCaptureUITests \
  -destination 'generic/platform=iOS Simulator' -derivedDataPath "$work/dd" -quiet
xctestrun="$(find "$work/dd/Build/Products" -name '*.xctestrun' -print -quit)"
host="$work/dd/Build/Products/Debug-iphonesimulator/Probe.app"

runtime="$(xcrun simctl list runtimes -j | node -e '
  const r = JSON.parse(require("fs").readFileSync(0, "utf8")).runtimes.filter((x) => x.isAvailable && x.platform === "iOS");
  r.sort((a, b) => a.version.localeCompare(b.version, undefined, { numeric: true }));
  console.log(r.at(-1).identifier)')"
pick() {
  xcrun simctl list runtimes -j | node -e '
    const kind = process.argv[1], runtime = process.argv[2];
    const r = JSON.parse(require("fs").readFileSync(0, "utf8")).runtimes.find((x) => x.identifier === runtime);
    const types = r.supportedDeviceTypes.filter((t) => t.productFamily === kind).map((t) => t.identifier);
    const prefer = kind === "iPhone" ? /iPhone-1[6-9]$|iPhone-2\d$/ : /iPad-Pro-11/;
    console.log(types.find((t) => prefer.test(t)) ?? types.at(-1))' "$1" "$runtime"
}

capture() {
  local kind="$1" target="$2"
  local dir="$out/$target"
  mkdir -p "$dir"
  local type
  type="$(pick "$kind")"
  local udid
  udid="$(xcrun simctl create "Launcher $kind" "$type" "$runtime")"
  echo "$kind: $type on $runtime ($udid)" | tee "$dir/device.txt"
  xcrun simctl boot "$udid"
  xcrun simctl bootstatus "$udid" -b
  xcrun simctl ui "$udid" appearance dark
  sleep 20
  # Install order sets the Home Screen order: Probe, Tron, Tron Lab, long probe.
  xcrun simctl install "$udid" "$host"
  xcrun simctl install "$udid" "$work/Short.app"
  xcrun simctl install "$udid" "$app"
  xcrun simctl install "$udid" "$work/Long.app"
  sleep 10
  TEST_RUNNER_LAUNCHER_NAMES="$short|$launcher|$long|Probe" TEST_RUNNER_LAUNCHER_OUT="$dir" \
    xcodebuild test-without-building -xctestrun "$xctestrun" -destination "id=$udid" \
    -resultBundlePath "$dir/LauncherCapture.xcresult" 2>&1 | tee "$dir/xcodebuild-test.log" | grep -E 'LAUNCHER_ICONS_JSON|error|Test (Case|Suite)' || true
  test -f "$dir/icons.json" || { echo "XCUITest wrote no icons.json for $kind"; return 1; }
  sleep 2
  xcrun simctl io "$udid" screenshot "$dir/home.png"
  node -e '
    const fs = require("fs");
    const [file, platform, png] = process.argv.slice(1);
    const d = JSON.parse(fs.readFileSync(file, "utf8"));
    // PNG IHDR: width is the big-endian uint32 at byte 16.
    const pxWidth = fs.readFileSync(png).readUInt32BE(16);
    const pxPerUnit = pxWidth / d.screenWidth;
    if (!Number.isFinite(pxPerUnit) || pxPerUnit <= 0) throw new Error("cannot derive px per pt from " + png);
    fs.writeFileSync(file.replace("icons.json", "layout.json"), JSON.stringify({ unit: "pt", platform, pxPerUnit, icons: d.icons }, null, 2));
  ' "$dir/icons.json" ios "$dir/home.png"
  node "$here/measure-label-ink.mjs" --image "$dir/home.png" --icons "$dir/layout.json" --target "$target" \
    --probe "$long" --app "$launcher" --font-size 12 --out "$dir/measurement.json" --crop "$dir/home-crop.png"
  xcrun simctl shutdown "$udid" || true
}

status=0
capture iPhone ios-home || status=1
capture iPad ipados-home || status=1

# visionOS: only if this runner has the runtime.
vision="$(xcrun simctl list runtimes -j | node -e '
  const r = JSON.parse(require("fs").readFileSync(0, "utf8")).runtimes.filter((x) => x.isAvailable && /visionOS|xrOS/.test(x.platform + x.name));
  console.log(r.at(-1)?.identifier ?? "")')"
mkdir -p "$out/visionos-home"
if [ -z "$vision" ]; then
  echo "NOT RUN: no visionOS simulator runtime on this runner" | tee "$out/visionos-home/status.txt"
else
  vtype="$(xcrun simctl list runtimes -j | node -e '
    const r = JSON.parse(require("fs").readFileSync(0, "utf8")).runtimes.find((x) => x.identifier === process.argv[1]);
    console.log(r.supportedDeviceTypes.at(-1).identifier)' "$vision")"
  vudid="$(xcrun simctl create "Launcher Vision" "$vtype" "$vision")"
  xcrun simctl boot "$vudid"
  xcrun simctl bootstatus "$vudid" -b
  sleep 30
  if xcrun simctl install "$vudid" "$app" > "$out/visionos-home/install.log" 2>&1; then
    echo "installed $launcher on $vtype ($vision)" | tee "$out/visionos-home/status.txt"
  else
    echo "NOT RUN: simctl install of the iOS simulator build failed on $vtype ($vision)" | tee "$out/visionos-home/status.txt"
  fi
  xcrun simctl io "$vudid" screenshot "$out/visionos-home/home.png" || true
  xcrun simctl shutdown "$vudid" || true
fi
exit $status
