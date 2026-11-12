#!/usr/bin/env bash
# Installs the built Spark example in /Applications beside a short-named copy
# and a long-named copy, launches it, and screenshots the Dock and Launchpad
# with screencapture. Element frames come from the Accessibility API through
# System Events when the runner allows it. CI only.
#
#   capture-macos.sh <directory holding the built .app> <bundle id> <out dir>
set -uo pipefail
root="$1"
bundle_id="$2"
out="$3/macos-dock"
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$out"
sw_vers > "$out/os.txt"
app=""
while IFS= read -r candidate; do
  if [ "$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$candidate/Contents/Info.plist" 2>/dev/null)" = "$bundle_id" ]; then
    app="$candidate"; break
  fi
done < <(find "$root" -type d -name '*.app' -not -path '*/node_modules/*' -prune 2>/dev/null)
if [ -z "$app" ]; then echo "NOT RUN: no built .app with bundle id $bundle_id under $root" | tee "$out/status.txt"; exit 1; fi
echo "built app: $app" | tee "$out/status.txt"
/usr/libexec/PlistBuddy -c 'Print' "$app/Contents/Info.plist" > "$out/Info.plist.txt"

install_copy() {
  local name="$1" id="$2"
  local dest="/Applications/$name.app"
  rm -rf "$dest"
  cp -R "$app" "$dest"
  if [ -n "$id" ]; then
    /usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $id" "$dest/Contents/Info.plist"
    /usr/libexec/PlistBuddy -c "Set :CFBundleName $name" "$dest/Contents/Info.plist" || true
    /usr/libexec/PlistBuddy -c "Delete :CFBundleDisplayName" "$dest/Contents/Info.plist" 2>/dev/null || true
    codesign --force --deep --sign - "$dest" > /dev/null 2>&1 || true
  fi
  echo "$dest"
}
example_name="$(basename "$app" .app)"
example="$(install_copy "$example_name" "")"
short="$(install_copy "Tron" org.nyctron.launcherprobe.short)"
long="$(install_copy "Tron AppKit Instruments Demo" org.nyctron.launcherprobe.long)"
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "$example" "$short" "$long" || true

open "$short"; open "$example"; open "$long"
sleep 15
screencapture -x "$out/desktop-with-dock.png" || echo "screencapture failed" >> "$out/status.txt"
osascript -e 'tell application "System Events" to tell process "Dock" to get {name, position, size} of every UI element of list 1' \
  > "$out/dock-ax.txt" 2> "$out/dock-ax.err" || echo "Dock AX query refused: $(cat "$out/dock-ax.err")" >> "$out/status.txt"

# Hover the example's Dock icon so its label tooltip shows, if AX gave frames.
node "$here/macos-dock-hover.mjs" "$out/dock-ax.txt" "$example_name" "$out" || true

if [ -d /System/Applications/Launchpad.app ] || [ -d /Applications/Launchpad.app ]; then
  open -a Launchpad; sleep 6
  screencapture -x "$out/launchpad-page1.png" || true
  for page in 2 3 4; do
    osascript -e 'tell application "System Events" to key code 124' 2>> "$out/launchpad-keys.err" || break
    sleep 2
    screencapture -x "$out/launchpad-page$page.png" || true
  done
  osascript -e 'tell application "System Events" to tell process "Dock" to get {name, position, size} of every UI element of every group of every scroll area of every group of every group of window 1' \
    > "$out/launchpad-ax.txt" 2> "$out/launchpad-ax.err" || true
  osascript -e 'tell application "System Events" to key code 53' 2> /dev/null || true
else
  echo "no Launchpad on this macOS; Apps is part of Spotlight" >> "$out/status.txt"
fi
exit 0
