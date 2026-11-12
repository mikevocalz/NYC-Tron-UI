# App identity: icons and launcher names

Gate T3. Every example app has one 1024 px source icon, a full name and a
short launcher name, and a check that fails when the launcher name is wider
than the label box a launcher gives it. Consumers run the same tools on their
own app from the `@nyc-tron/app-identity` release archive.

## Install the check

`@nyc-tron/app-identity` is one of the release tarballs, installed by URL like
the other packages. It needs Node 24 and nothing else.

```sh
npm install --save-dev https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v<version>/nyc-tron-app-identity-<version>.tgz
npx nyc-tron-launcher-check app.json
npx nyc-tron-derive-icons assets/icon.png --out assets/icon --formats android,web
```

The archive holds two bins, `nyc-tron-launcher-check` and
`nyc-tron-derive-icons`, the label boxes (`dist/launcher-targets.json`), the
Roboto advance-width table and its notice. In this repository the same code
lives in `tooling/app-identity/`; `packages/app-identity` builds the archive
from it.

## Example names and icons

| Example | Full name | Launcher name | Config the label comes from |
| --- | --- | --- | --- |
| `examples/native-instruments` (Expo, iOS and Android) | NYC-Tron Instruments | Tron Lab | `app.json` `expo.name` |
| `examples/macos-appkit/spark` (Spark, macOS) | NYC-Tron AppKit Reference | Tron AppKit | `desktop.config.json` `macos.infoPlist.CFBundleName` (application menu; Finder and Dock show the bundle file name, see below) |
| `packages/windows-fluent/rnw-fabric/example` (RNW, Windows) | NYC-Tron WinUI Reference | Tron WinUI | `app.json` `displayName` |

Before this change the instruments app was "NYC-Tron Instruments Demo". It
measured 162.0 pt on the iOS Home Screen (85 pt box) and 179.1 dp in Launcher3
(63.6 dp box), and both launchers truncated it: "NYC-TronInstr…" and
"NYC-Tro…".

Bundle identifiers, the Android package, the Spark `name` (project and bundle
name) and the RNW `name` (solution, package and process name) are unchanged.
CI jobs and evidence receipts look those up.

`examples/native-feel` and `examples/theme-bridges` are not installable apps
(a typechecked recipe and a README), so they have no icon or launcher name.

Each source is drawn by `tooling/app-identity/render-example-icons.mjs`: a
graphite ground (`#15171C`) and one line glyph in the example's colour, kept
inside the circle every launcher mask leaves visible. The instruments glyph is
a knob arc, AppKit a window with a leading sidebar, WinUI a window with
trailing caption marks.

## Icon formats

`nyc-tron-derive-icons` (`tooling/app-identity/derive-icons.mjs` here) turns
one source into the formats the lanes use. It has no dependencies. Pass
`--formats` with the platforms the app ships on; the default is all four
(`android`, `web`, `macos`, `windows`).

```sh
npx nyc-tron-derive-icons assets/icon.png --out assets/icon --formats android
```

Each example keeps only its own formats: native-instruments `android` (iOS
uses the source directly), Spark `macos`, the RNW example `windows`.

| Output | Used by | Notes |
| --- | --- | --- |
| `assets/icon.png` (the source) | Expo `icon`, `ios.icon` | 1024x1024, opaque, one solid ground colour at the corners |
| `android/adaptive-foreground.png` | Expo `android.adaptiveIcon.foregroundImage` | Source at 72/108 of a transparent 108 dp canvas; set `backgroundColor` to the ground |
| `android/adaptive-monochrome.png` | `android.adaptiveIcon.monochromeImage` | Glyph only, white, for Android 13 themed icons |
| `web/favicon.png` | Expo `web.favicon` | 48 px |
| `macos/AppIcon.icns` | Spark macOS lane | 824 px tile with a 185 px corner on the 1024 grid, 16 to 1024 px |
| `windows/app.ico` | RNW executable | 16, 24, 32, 48, 64, 256 px |
| `windows/Assets/*.png` | RNW MSIX package | Square44x44Logo (scales and unplated target sizes), Square150x150Logo, Wide310x150Logo, StoreLogo, LockScreenLogo, SplashScreen |

The tool refuses a source that is not 1024 px square, has a transparent or
mixed-colour edge, or has a glyph outside the Android safe zone (the 66 dp
circle of the 108 dp canvas, 469.3 px from the centre of the source). It prints
how far the glyph reaches past it. `tooling/tests/app-identity.test.mjs`
re-derives every example and fails if a committed file is stale, comparing
decoded pixels of every PNG, including each image inside the ICNS and ICO.

How each lane picks the icon up:

- **Expo (iOS, Android):** `icon` and `android.adaptiveIcon` in `app.json`;
  prebuild writes the asset catalogue and mipmaps. An Expo app that also
  ships web adds `web.favicon` with the `web` format.
- **Windows (RNW):** `scripts/prepare-host.mjs` copies the derived files over
  the generated project's images and `.ico` files with the same names, after
  `init-windows`. No generated file is edited by hand.
- **macOS (Spark 0.0.2): deferred to T4.** Spark's `desktop.config.json` has
  no icon field, and neither Spark nor `expo-desktop-prebuild-config` 1.1.3
  sets a macOS icon (`CFBundleIconFile` is written empty). An icon plugin would
  turn the example into a Spark custom runtime, which changes how the AppKit
  job builds it. The generated `.icns` stays committed for T4 to wire.

## Launcher names

Declare both names in the app config. Expo:

```json
{
  "expo": {
    "name": "Tron Lab",
    "extra": { "appIdentity": { "fullName": "NYC-Tron Instruments", "launcherName": "Tron Lab" } }
  }
}
```

`expo.name` is what Expo writes to `CFBundleDisplayName` and Android
`app_name`, so it carries the launcher name. Use the full name in store
listings, About screens and window titles. RNW: a top-level `appIdentity`
beside `name` and `displayName`. Spark: `desktop.config.json` allows no extra
keys, so the check reads `appIdentity` from the `app.json` beside it.

### Running the check

```sh
npx nyc-tron-launcher-check path/to/app.json [more configs] [--strict] [--json]
npx nyc-tron-launcher-check --name "Your Name" --platforms ios,android
```

In this repository, `node tooling/app-identity/launcher-label-check.mjs` takes
the same arguments. It accepts an Expo `app.json`, the output of
`npx expo config --json` saved to a file (use this when the app has an
`app.config.js`), a Spark `desktop.config.json` and an RNW `app.json`. Add it
to your CI after installing the archive.

For every launcher the app's platforms reach, it prints PASS with the spare
width, OVERFLOW with the measured width, the box and how far over, FAIL for an
empty or whitespace-only label, or NOT RUN with the reason. It never shortens
the name. Exit codes: `0` all measured targets fit, `1` overflow, an empty
label or a launcher label that differs from `launcherName`, `2` usage error,
`3` only with `--strict`, when a target that applies was NOT RUN.

The deliberately long name fails like this:

```text
OVERFLOW  ios-home                "NYC-Tron Instruments Demo"  162 pt in a 85 pt box: over by 77 pt, system UI font (SF Pro) regular 12 pt, 1 line
OVERFLOW  android-launcher3       "NYC-Tron Instruments Demo"  179.1 dp in a 63.6 dp box: over by 115.5 dp, Roboto regular 14 dp, 1 line
```

How width is measured:

- **Apple targets:** AppKit's system font through `osascript` (JavaScript for
  Automation), which applies the same optical sizing iOS uses for 12 pt text.
  It needs macOS; elsewhere these targets are NOT RUN. "Settings" measures
  46.8 pt; its ink on the simulator is 46.7 pt. A label with a character the
  system font lacks (CJK, emoji, a control character) is NOT RUN: AppKit
  would measure it through font fallback, and that is not proof of what
  SpringBoard draws.
- **Android:** advance widths from `fonts/roboto-static-regular.json`, built
  from the emulator's `RobotoStatic-Regular.ttf` with `build-font-table.mjs`.
  The font's name table declares Apache-2.0 (name IDs 13 and 14); the text is
  in `packages/app-identity/licenses/Roboto-Apache-2.0.txt`. Kerning is not
  applied and no margin is added, so a name that passes by less than about
  2.5 dp is close enough that kerning could decide it.
- The SF Pro and Segoe UI files are not redistributable, so no table for them
  is committed.

## Label boxes per target

`tooling/app-identity/launcher-targets.json` is the record. Only `measured`
targets are enforced. Every row below has a CI capture of the built example
at 89579c9 unless it says otherwise; the images are in
`docs/completion/evidence/t3-app-identity-20261112/` and the full artifacts
are `launcher-captures-*` on the runs named.

| Target | Status | Font | Lines | Box | Run (89579c9) | Capture |
| --- | --- | --- | --- | --- | --- | --- |
| iPhone Home Screen | measured | SF Pro regular 12 pt | 1 | 85.0 pt | 43224655686 | iPhone 17, iOS 26.5: "Tron Lab" 49.0 pt of ink; long probe truncated at 86.3 pt |
| iPad Home Screen | measured | SF Pro regular 12 pt | 1 | 85.0 pt | 43224655686 | iPad Pro 11-inch (M5), iOS 26.5: "Tron Lab" 49.0 pt; long probe truncated at 86.5 pt |
| Android, AOSP Launcher3 | measured | Roboto regular 14 dp | 1 | 63.6 dp | 43224655686 | API 36, 420 dpi: "Tron Lab" 55.2 dp; long probe truncated at 62.1 dp; tiles 82.3 x 120 dp |
| Android, Pixel Launcher | NOT RUN | | | | | Not on the emulator image |
| macOS Launchpad and Dock | NOT RUN (captured) | SF Pro regular 13 pt | 1 | 94.5 pt, not enforced | 43224655812 | macOS 15.8.2: the example shows as "NYCTr…erence" in Launchpad and "NYCTronAppKitReference" in the Dock tooltip |
| macOS menu bar | NOT RUN | | | | 43224655812 | osascript could not activate the example (-600, then -609) |
| Windows Start | NOT RUN (captured) | | 1 | | 43224656120 | "Tron WinUI" under Recommended and in All; no Segoe UI table to measure with |
| Windows taskbar | NOT RUN (captured) | | 1 | no fixed box | 43224656120 | "Tron WinUI" button 113 px wide beside Notepad and Terminal |
| visionOS Home View | NOT RUN (captured) | | 1 | | 43224655686 | Vision Pro, visionOS 26.5: "Tron", "Tron Lab", "Tron Lab Instruments De…" |
| Quest library, PICO library | NOT RUN | | | | | Tier 2 per D6: owner device session |

How the captures are made (CI only, never on a developer machine):

- **iOS, iPadOS, visionOS** (`capture/capture-ios.sh`, job "iOS, iPadOS and
  visionOS launcher captures of the built example" in
  `native-controls-port.yml`): takes the simulator build from the iOS
  installed-tarball job, installs it beside two copies renamed "Tron" and
  "Tron Lab Instruments Demo", pages SpringBoard with an XCUITest that writes
  each icon's frame, screenshots with `simctl io`, and measures label ink
  with `capture/measure-label-ink.mjs`. The px-per-pt scale is the screenshot
  width over the SpringBoard frame width. visionOS gets the same three apps
  and a screenshot only.
- **Android** (`capture/capture-android.sh`): installs the APK from the
  Android installed-tarball job beside two relabelled copies, opens
  Launcher3's all-apps grid, reads frames from `uiautomator dump` and
  measures ink the same way. It also pulls `RobotoStatic-Regular.ttf` from
  the image and checks it against the committed table.
- **macOS** (`capture/capture-macos.sh`, AppKit job, `continue-on-error`):
  copies the built Spark app to `/Applications` beside "Tron" and "Tron
  AppKit Instruments Demo" copies, hovers its Dock icon, pages Launchpad with
  Cmd-Right and filters it by typing "Tron".
- **Windows** (`capture/capture-windows.ps1`, RNW Fabric job,
  `continue-on-error`): opens Start, clicks All, scrolls to the T entries and
  turns taskbar labels on before launching the packaged example.

How the boxes were found:

- **iOS.** Web clips added with Safari's Add to Home Screen use the same
  SpringBoard icon label as apps, so a ladder of names served from a local page
  could be placed without building anything (iOS 27.1, iPhone Duo). Labels up
  to 85.7 pt advance render unchanged. "Probe nnnnnniii" (87.6 pt) is
  tightened to 82.7 pt of ink, "Probe nnnnnnnn" (92.7 pt) loses its space, and
  longer names truncate with 85.0 pt of ink. The check uses 85.0 pt, so a name
  that passes is never tightened. The CI capture of the built app on iOS 26.5
  agrees: "Tron Lab" has 49.0 pt of ink against the 49.4 pt the check
  predicts, and the long probe truncates with 86.3 pt.
- **iPadOS.** "Tron Lab" has the same 49.0 pt of ink, so iPad labels use the
  same 12 pt font. No tightening ladder ran on iPad; the iPhone box is
  enforced, and it is below the 86.5 pt of ink in the truncated iPad label.
- **Android.** The all-apps grid already held a ladder of probe apps. Unshrunk
  labels match Roboto 14 dp to within 4 %. The widest ink of any label is
  167 px (63.6 dp). Launcher3 shrinks labels up to about 69.4 dp ("Messaging",
  "Probe nniiii") before it truncates; the check counts any shrink as
  overflow. In CI "Tron Lab" has 55.2 dp of ink against a predicted 55.3 dp.
- **macOS Launchpad.** The runner's screen is 1024x768 at 1 px per pt.
  Untruncated labels match SF at 13 pt ("Microsoft Edge" 92 px of ink,
  91.9 pt advance). "Google Chrome" (94.5 pt) renders whole and truncated
  labels carry 86 to 98 px of ink, so the box is 94.5 pt. It is recorded, not
  enforced: see the macOS guidance below.

The ink measurement assumes a plain background behind the label. On the
iPhone the "Probe" label sits over a bright band of wallpaper and reads
63.3 pt; the iPad reading (32.5 pt) is the right one. The probe is the
XCUITest host app, not part of the comparison.

Evidence in `docs/completion/evidence/t3-app-identity-20261112/`, each at
89579c9:

- `ios26.5-iphone17-home-crop-89579c9.png`: "Tron", "Tron Lab" and
  "TronLabInstrum…", one line each, icons the same size.
- `ipados26.5-ipadpro11-home-crop-89579c9.png`: the same three on iPad.
- `visionos26.5-home-crop-89579c9.png`: the same three in the Home View.
- `android36-launcher3-allapps-89579c9.png` and its crop: "Tron", "Tron Lab"
  and "Tron Lab …", tiles 82.3 x 120 dp.
- `macos15.8-launchpad-page2-89579c9.png`, `macos15.8-launchpad-search-tron-89579c9.png`,
  `macos15.8-dock-tooltip-89579c9.png`: the example as "NYCTr…erence" beside
  "Tron" and "Tron A…Demo", and its Dock tooltip.
- `winserver2025-start-recommended-89579c9.png`,
  `winserver2025-start-all-apps-89579c9.png`,
  `winserver2025-taskbar-89579c9.png`: "Tron WinUI" in Start and on the
  taskbar.

The earlier iOS 27.1 web-clip captures and the Android probe ladder
(`ios27.1-*.png`, `android36-launcher3-allapps-probes.png`,
`android36-launcher3-allapps-crop-old-name.png`) are where the iOS and
Android boxes came from. They show the old name, not the built app.

## Per-platform guidance

- **iOS and iPadOS:** one line, about 85 pt at 12 pt system font on iPhone.
  Longer names are first tightened, then truncated in the middle of a word. Keep
  a margin; Dynamic Type does not change Home Screen labels, but localisation
  does.
- **Android:** one line in Launcher3, 63.6 dp at 14 dp Roboto on a 420 dpi
  phone. Other launchers and fonts differ (Pixel Launcher was not measured).
- **macOS:** Launchpad and the Dock show the bundle's file name, not
  `CFBundleName`. The CI capture at 89579c9 shows the built Spark example as
  "NYCTr…erence" in Launchpad and "NYCTronAppKitReference" in the Dock
  tooltip, even with `CFBundleName` and `CFBundleDisplayName` set to "Tron
  AppKit". So the macOS rename has not landed: the bundle file name comes from
  the Spark `name`, which CI looks up, and renaming it is deferred to T4 with
  the icon. Until then the macOS rows stay NOT RUN, because enforcing the
  94.5 pt Launchpad box against "Tron AppKit" would pass a name macOS does not
  show. `CFBundleName` does name the application menu; Apple caps it at 15
  characters.
- **Windows:** Start and the taskbar read the package manifest, not
  `app.json`. `init-windows` writes the project name into both
  `DisplayName` fields of `Package.appxmanifest` and into the window title,
  so before 67292ff Start showed "NYCTronWindowsExample". RNW's
  `prepare-host.mjs` now copies `displayName` into the manifest and the
  `AppWindow` title; an app built from the RNW template needs the same edit.
  The taskbar names a button by its window title and sizes it to the label
  until the bar is crowded, so it has no fixed box. Not measured: no Segoe UI
  table is committed.
- **Web:** `web.shortName` becomes the installed PWA label; browsers own that
  box and it is not checked.
- **visionOS:** the iOS build runs unmodified and shows its label on one
  line under the round icon; "Tron Lab Instruments Demo" truncates.
  Not measured (no pt scale in a perspective render). Keep the launcher name
  no longer than one that passes iOS.
- **Quest, PICO:** Tier 2 per D6, owner device session. Keep the launcher
  name no longer than one that passes iOS and Android.

## Design record (§3.3 for the launcher icon and label surfaces)

The §3.3 sequence, run with each skill loaded, is in
[`completion/evidence/t3-app-identity-20261112/SKILLS-3.3.md`](completion/evidence/t3-app-identity-20261112/SKILLS-3.3.md).
User research there is desk notes, not sessions, and is marked not met. The
Mobbin references are saved in the collection linked from that file.
