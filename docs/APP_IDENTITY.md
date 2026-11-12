# App identity: icons and launcher names

Gate T3. Every example app has one 1024 px source icon, a full name and a
short launcher name, and a check that fails when the launcher name is wider
than the label box a launcher gives it. Consumers can run the same tools on
their own app.

## Example names and icons

| Example | Full name | Launcher name | Config the label comes from |
| --- | --- | --- | --- |
| `examples/native-instruments` (Expo, iOS and Android) | NYC-Tron Instruments | Tron Lab | `app.json` `expo.name` |
| `examples/macos-appkit/spark` (Spark, macOS) | NYC-Tron AppKit Reference | Tron AppKit | `desktop.config.json` `macos.infoPlist.CFBundleName` |
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

`tooling/app-identity/derive-icons.mjs` turns one source into every format the
lanes use. It has no dependencies.

```sh
node tooling/app-identity/derive-icons.mjs assets/icon.png --out assets/icon
```

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
re-derives every example and fails if a committed file is stale.

How each lane picks the icon up:

- **Expo (iOS, Android, web):** `app.json` fields above; prebuild writes the
  asset catalogue and mipmaps.
- **Windows (RNW):** `scripts/prepare-host.mjs` copies the derived files over
  the generated project's images and `.ico` files with the same names, after
  `init-windows`. No generated file is edited by hand.
- **macOS (Spark 0.0.2): not wired.** Spark's `desktop.config.json` has no
  icon field, and neither Spark nor `expo-desktop-prebuild-config` 1.1.3 sets
  a macOS icon (`CFBundleIconFile` is written empty). An icon plugin would make
  the app a Spark custom runtime, which changes how the AppKit job builds it.
  The `.icns` is ready; wiring it is a T4 decision.

## Launcher names

Declare both names in the app config. Expo:

```json
{
  "expo": {
    "name": "Tron Lab",
    "web": { "name": "NYC-Tron Instruments", "shortName": "Tron Lab" },
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
node tooling/app-identity/launcher-label-check.mjs path/to/app.json [more configs] [--strict] [--json]
node tooling/app-identity/launcher-label-check.mjs --name "Your Name" --platforms ios,android
```

It accepts an Expo `app.json`, the output of `npx expo config --json` saved to
a file (use this when the app has an `app.config.js`), a Spark
`desktop.config.json` and an RNW `app.json`. To run it in your own project,
copy `tooling/app-identity/` from a Tron checkout at the release tag (it needs
only Node 24) and call it from your CI.

For every launcher the app's platforms reach, it prints PASS with the spare
width, OVERFLOW with the measured width, the box and how far over, or NOT RUN
with the reason. It never shortens the name. Exit codes: `0` all measured
targets fit, `1` overflow or a launcher label that differs from `launcherName`,
`2` usage error, `3` only with `--strict`, when a target that applies was NOT
RUN.

The deliberately long name fails like this:

```text
OVERFLOW  ios-home                "NYC-Tron Instruments Demo"  162 pt in a 85 pt box: over by 77 pt, system UI font (SF Pro) regular 12 pt, 1 line
OVERFLOW  android-launcher3       "NYC-Tron Instruments Demo"  179.1 dp in a 63.6 dp box: over by 115.5 dp, Roboto regular 14 dp, 1 line
```

How width is measured:

- **Apple targets:** AppKit's system font through `osascript` (JavaScript for
  Automation), which applies the same optical sizing iOS uses for 12 pt text.
  It needs macOS; elsewhere these targets are NOT RUN. "Settings" measures
  46.8 pt; its ink on the simulator is 46.7 pt.
- **Android:** advance widths from `fonts/roboto-static-regular.json`, built
  from the emulator's `RobotoStatic-Regular.ttf` (Apache-2.0,
  `licenses/Roboto-Apache-2.0.txt`) with `build-font-table.mjs`. Kerning is
  not applied.
- The SF Pro and Segoe UI files are not redistributable, so no table for them
  is committed.

## Label boxes per target

`tooling/app-identity/launcher-targets.json` is the record. Only `measured`
targets are enforced.

| Target | Status | Font | Lines | Box | Measured on |
| --- | --- | --- | --- | --- | --- |
| iPhone Home Screen | measured | system UI font (SF Pro), regular, 12 pt | 1 | 85.0 pt | Simulator "T3 iPhone Duo", iOS 27.1, cover panel; inner panel shows the same truncation |
| iPad Home Screen | NOT RUN | | | | No iPad simulator; disk under 10 GB to create one |
| Android, AOSP Launcher3 | measured | Roboto, regular, 14 dp | 1 | 63.6 dp | AVD ForgeCompletion_API36, Android 16 (API 36), 420 dpi |
| Android, Pixel Launcher | NOT RUN | | | | Not on the installed image |
| macOS Dock, Apps, menu bar | NOT RUN | | | | Spark app not built (disk); the Dock label is a tooltip with no fixed box |
| Windows Start, taskbar | NOT RUN | | | | No Windows machine |
| visionOS Home View | NOT RUN | | | | No visionOS runtime installed |
| Quest library, PICO library | NOT RUN | | | | Hardware; owner session |

How the boxes were found:

- **iOS.** Web clips added with Safari's Add to Home Screen use the same
  SpringBoard icon label as apps, so a ladder of names served from a local page
  could be placed without building anything. Labels up to 85.7 pt advance render
  unchanged. "Probe nnnnnniii" (87.6 pt) is tightened to 82.7 pt of ink,
  "Probe nnnnnnnn" (92.7 pt) loses its space, and longer names truncate with
  85.0 pt of ink. The check uses 85.0 pt, so a name that passes is never
  tightened.
- **Android.** The all-apps grid already held a ladder of probe apps. Unshrunk
  labels match Roboto 14 dp to within 4 %. The widest ink of any label is
  167 px (63.6 dp). Launcher3 shrinks labels up to about 69.4 dp ("Messaging",
  "Probe nniiii") before it truncates; the check counts any shrink as overflow.

Evidence, all in `docs/completion/evidence/t3-app-identity-20261112/`:

- `ios27.1-duo-cover-home-web-clips.png` and the crop
  `ios27.1-duo-cover-crop-rows4-5.png`: "Tron Lab" and the old name
  ("NYC-TronInstr…") side by side with the probe ladder, tiles the same size.
- `ios27.1-duo-inner-home-web-clips.png`: the inner panel, same labels.
- `android36-launcher3-allapps-probes.png` and
  `android36-launcher3-allapps-crop-old-name.png`: the old name as
  "NYC-Tro…" among the probes.

These captures show web clips carrying the derived icon, not the built apps.
No native build of a renamed example was made: free disk was under the 10 GB
limit set for this work. There is no Android capture of "Tron Lab" for the
same reason.

## Per-platform guidance

- **iOS and iPadOS:** one line, about 85 pt at 12 pt system font on iPhone.
  Longer names are first tightened, then truncated in the middle of a word. Keep
  a margin; Dynamic Type does not change Home Screen labels, but localisation
  does.
- **Android:** one line in Launcher3, 63.6 dp at 14 dp Roboto on a 420 dpi
  phone. Other launchers and fonts differ (Pixel Launcher was not measured).
- **macOS:** `CFBundleName` names the menu bar's application menu and the
  Dock tooltip. Apple caps `CFBundleName` at 15 characters; the check does not
  measure macOS yet.
- **Windows:** `displayName` is the Start and taskbar name. Not measured.
- **Web:** `web.shortName` becomes the installed PWA label; browsers own that
  box and it is not checked.
- **visionOS, Quest, PICO:** not measured. Keep the launcher name no longer
  than one that passes iOS and Android.

## Design record (§3.3 for the launcher icon and label surfaces)

Skill files loaded in this session: `argent-device-interact`, `no-ai-slop`.
The `design:*`, `frontend-design` and `engineering:code-review` skill files were
not loaded; the outputs below follow the required outputs listed in the program
prompt. A reviewer may want those passes rerun with the skills.

1. **User research.** Who runs these apps: contributors and consumers who build
   an example to see a Tron component on their own device, usually beside other
   test builds. Where it lost them: the instruments build had no icon (the
   Expo default) and a name both launchers truncated to "NYC-Tro…", so it could
   not be told apart from other NYC-Tron or Forge builds on the same device.
2. **References.** Mobbin, iOS: Trainline's app icon picker (one mark on
   several grounds, one-word labels),
   https://mobbin.com/screens/a0eebc8d-5d4a-4216-bc82-da6174ecdafe; CapCut Home
   Screen shortcuts with two-word names ("Remove BG", "Retouch"),
   https://mobbin.com/screens/32da53ef-eb73-4d60-9b71-9a2f66573e72; Apple Games
   showing an icon with its full name,
   https://mobbin.com/screens/dca39796-171c-4d5f-84ef-5f04da20021e. Structure
   only; no mark was copied.
3. **Design-system audit.** No example had an icon. Names drifted between a
   long display name ("NYC-Tron Instruments Demo"), a camel-case identifier as
   display name ("NYCTronAppKitReference") and a description
   ("NYC-Tron Windows acceptance"). The icon colours live only in
   `render-example-icons.mjs`; no Tron component or token was given a colour,
   because the consuming app owns the theme.
4. **Copy.** Launcher names are "Tron" plus the one word that tells the
   examples apart: Lab, AppKit, WinUI. "Demo" was dropped; every example is a
   demo. Full names keep "NYC-Tron".
5. **Visual direction.** Before: no icons and truncated names (the captures
   above). After: one construction across the three icons, the glyph about
   two thirds of the tile, readable at 16 px (`windows/Assets/...targetsize-16`).
6. **Accessibility.** Glyph against ground, WCAG 1.4.11: amber 8.6:1, cyan
   8.6:1, blue 7.5:1, steel 10.9:1, all above 3:1. The knob's unfilled track
   is 1.7:1 on purpose (it is the empty part of the value); the filled arc and
   pointer carry the form. The three glyphs differ in form, so colour is not
   the only cue. The labels are plain text read by
   VoiceOver and TalkBack.
7. **Critique.** The knob arc keeps a dim track so the value reads at small
   sizes. The two window glyphs differ only in where the detail sits (leading
   sidebar, trailing captions); at 16 px that is still visible but close.
   Launcher masks are OS-owned, so the source is full-bleed and the macOS tile
   carries its own corner.
8. **Handoff.** This file: names, sources, formats, wiring, boxes, edge cases
   (Spark icon not wired; web label not checked; bundle ids unchanged).
9. **Code review.** Requested from an independent reviewer on the PR.
