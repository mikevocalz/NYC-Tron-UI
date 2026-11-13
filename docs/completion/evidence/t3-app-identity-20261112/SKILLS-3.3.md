# §3.3 sequence for the Tron launcher icon and label surfaces

Surfaces: the launcher icon and the launcher label of the three installable
examples, `Tron Lab` (`examples/native-instruments`), `Tron AppKit`
(superseded: `TronAppKit`; `examples/macos-appkit/spark`) and `Tron WinUI`
(`packages/windows-fluent/rnw-fabric/example`).

This file replaces the hand-written "Design record" that was in
`docs/APP_IDENTITY.md` at 3ae6630. Each skill below was loaded through the Skill
tool on 2026-11-12 and run on these surfaces. Where a step could not produce
its required output, it says NOT MET and why.

| Order | Skill | Status |
| --- | --- | --- |
| 1 | `design:user-research` | Desk notes only. No sessions ran. Not met as research. |
| 2 | Mobbin | Met: 5 references per surface (icon, label), iOS only; saved to a collection and read back on 2026-11-12 |
| 3 | `design:design-system` | Met |
| 4 | `design:ux-copy` | Met; two copy defects fixed |
| 5 | `frontend-design:frontend-design` | Partly met: before and after for the one change; no launcher capture of the built apps |
| 6 | `design:accessibility-review` | Met for what can be checked without a built app; one failure fixed |
| 7 | `design:design-critique` | Met |
| 8 | `design:design-handoff` | Met |
| 9 | `engineering:code-review` | Met: re-check of 81e2170 and final review; two defects fixed |

## 1. `design:user-research`: desk notes, not research

No interviews, usability sessions or surveys ran. The notes below come from
reading the repository, the CI jobs and the launcher captures. Treat them as
hypotheses for the first real session, not findings.

Jobs to be done, one product (NYC-Tron UI examples):

- **Who installs an example:** a Tron contributor, or a consumer evaluating
  Tron, who builds an example to see a component on their own device or in CI.
- **What they already run:** other development builds on the same device,
  often several Expo apps with the default icon and other NYC-Tron or Forge
  builds.
- **Where the path lost them (from the captures, not from users):** the
  instruments app had the Expo default icon and a 162 pt name that iOS cut to
  "NYC-TronInstr…" and Launcher3 cut to "NYC-Tro…". Among other development
  builds it could not be picked out by icon or by name.
- **Questions for a real session:** do people find the example by name or by
  icon; does "Lab" tell them it is the instruments example; do they install
  more than one example at once.

## 2. Mobbin

Collection "NYC-Tron T3 launcher icon and label" (private to the owner's team):
https://mobbin.com/collections/4b66c302-2845-46b8-a93a-0112cbde5f65/mobile/screens

The R2 review counted the icon and the label as two surfaces and found only
one reference (Trainline) that shows either. Eight more were saved on
2026-11-12; the collection reads back 11 iOS screens. Mobbin's search covers
iOS and web only, so there is no Android reference.

Icon surface (tiles of one size and mask):

| App | Screen | What it shows |
| --- | --- | --- |
| Trainline | https://mobbin.com/screens/a0eebc8d-5d4a-4216-bc82-da6174ecdafe | Alternate app icon picker: one mark on several grounds, squircle tiles of one size |
| Locket | https://mobbin.com/screens/1349eeba-781b-44e6-8f87-5d81f4a55710 | "App Icon" picker for the Home Screen: four-column grid of same-size squircles, dark sheet |
| X | https://mobbin.com/screens/699b6440-6a50-4e3e-aabd-d10693d25574 | App icon picker: one glyph on many grounds, three columns, mask and size fixed |
| Slopes | https://mobbin.com/screens/abb70bee-153a-4e6f-8f5c-8ac772600d1d | App Icon picker with a light and dark toggle and a premium section |
| SmartThings | https://mobbin.com/screens/494ba4e7-641d-42c2-a417-4581c5470667 | "Sources & Apps" launcher row: third-party tiles at one rounded-square size, no labels |

Label surface (a short name under a fixed-width tile):

| App | Screen | What it shows |
| --- | --- | --- |
| Trainline | https://mobbin.com/screens/a0eebc8d-5d4a-4216-bc82-da6174ecdafe | One-word labels under each tile ("Original", "Heart", "Light") |
| Strava | https://mobbin.com/screens/fb71e828-3c15-42c6-bf24-679fef28d9dd | Four-column icon grid with centred labels; "Local Legend" and "KOM/QOM" show the column width limit |
| World App | https://mobbin.com/screens/a0fcf1f4-e418-4cae-8791-c6a7879861aa | In-app "Apps" launcher laid out like a Home Screen: icon over a one- or two-word name |
| (Not Boring) Timer | https://mobbin.com/screens/22510345-18c3-4b53-8818-30a88bf7f0a2 | Sibling apps grid on black with short uppercase monospace labels |
| Shopify | https://mobbin.com/screens/f5a198b9-ad50-42d1-b280-12836d97251a | App icon picker cards with a short label under each icon ("Spring '26") |

CapCut (https://mobbin.com/screens/32da53ef-eb73-4d60-9b71-9a2f66573e72,
widgets with the label inside the tile) and Apple Games
(https://mobbin.com/screens/dca39796-171c-4d5f-84ef-5f04da20021e, a splash
with the full name) stay in the collection but count for neither surface.

None shows a real Home Screen or launcher capture; Mobbin had none. The
closest are World App's and SmartThings' in-app launchers. The CI captures
of the built examples cover the real launchers.

Structure only. No mark was copied.

## 3. `design:design-system`: audit

Components reviewed: 3 icons, 3 label configs, 1 renderer. Issues found: 4.

Naming consistency:

| Issue | Where | Recommendation |
| --- | --- | --- |
| Spark `app.json` keeps `expo.name: "NYCTronAppKitReference"` while `desktop.config.json` sets `CFBundleName: "Tron AppKit"` | `examples/macos-appkit/spark/app.json` | Superseded: the Spark `name` is now `TronAppKit` (run 43252017103); see APP_IDENTITY.md |
| RNW `name` is `NYCTronWindowsExample`, full name says "WinUI Reference" | `packages/windows-fluent/rnw-fabric/example/app.json` | Left: `name` is the solution and process name and CI looks it up. Only `displayName` is user-facing |
| Full names: "NYC-Tron Instruments" has no "Reference"; the two desktop ones do | the three `appIdentity` blocks | Acceptable: the instruments app is a component lab, the desktop ones are host references |

Token coverage:

| Category | Defined | Hardcoded |
| --- | --- | --- |
| Colour | 0 tokens | 6 values in `render-example-icons.mjs`: ground `#15171C` (also in `app.json` `backgroundColor`), steel `#C4CAD4`, track (was `#3A3E48`, now `#606677`), amber `#F2A33A`, cyan `#4CC3D9`, blue `#7AA7FF` |
| Stroke | 0 tokens | `W = 64` form, `D = 44` detail; the WinUI caption marks use `D / 2.2`, the only detail stroke that differs |
| Corner | 0 tokens | Window glyph corner 56 (AppKit) and 28 (WinUI); macOS tile 185 on the 1024 grid |

This is acceptable. Tron ships no palette (§8): the colours belong to the
example apps, not to `@nyc-tron/*`, and no Tron component or token was given a
colour. The ground is duplicated in `app.json` by hand; `derive-icons.mjs`
reports the ground it reads, so a mismatch shows up when the icon is redrawn.

Priority actions: none blocking. If the examples gain more icons, move the
six colours into one exported object the renderer and the configs both read.

## 4. `design:ux-copy`

Launcher labels, measured with the check on 2026-11-12:

| Label | iOS Home (85 pt) | Launcher3 (63.6 dp) | Applies to |
| --- | --- | --- | --- |
| Tron Lab | 49.4 pt, 35.6 spare | 55.3 dp, 8.3 spare | iOS, Android |
| Tron AppKit | 66.6 pt | 73.9 dp, over by 10.3 | macOS only |
| Tron WinUI | 62.1 pt | 68.7 dp, over by 5.1 | Windows only |

Recommended copy: keep "Tron Lab", "Tron AppKit", "Tron WinUI". "Tron" plus
one word that names what the example is for. "Demo" stays dropped.

Superseded for the macOS example: Launchpad and the Dock show the Spark `name`
(the bundle file name), which cannot hold a space, so the launcher copy is
"TronAppKit" (CI run 43252017103, b60fddd). "Tron AppKit" remains the
application menu title (`CFBundleName`).

| Option | Copy | Best for |
| --- | --- | --- |
| A (kept) | Tron Lab | The instruments example; short enough for Launcher3 with 8.3 dp spare |
| B | Tron Knobs | Names the content, but the example also shows faders and meters |
| C | Instruments | Clear, but drops the Tron prefix that groups the family on a crowded screen |

Rationale: "Tron Lab" passes both measured launchers with room. The two
desktop names would overflow Launcher3, which does not matter for them today.
If either example ever ships on Android, it needs a shorter label.

Localisation: the labels are product names and are not translated. Launcher3
has 8.3 dp spare for "Tron Lab"; a localised build that adds a word would
overflow.

Findings in the check's own messages:

| Message | Problem | Change |
| --- | --- | --- |
| `android launcher label is "undefined" but appIdentity.launcherName is "X"` | Printed with the correct "no android launcher label" line when a config had no label: one cause, two lines, one of them saying "undefined" | Fixed: the mismatch line is skipped when the label is missing. Test added |
| Identity mismatch | States what and where, not how to fix | Left: the fix (make the two names equal) is obvious from the line |
| `usage:` and `does not exist` | Clear | None |

macOS label (superseded: CI run 43252017103 shows the Spark `name` is the label, and it is now `TronAppKit`; the text below is the earlier prediction): the check read `CFBundleName`
as the macOS label. `CFBundleName` names the application menu. Finder, the
Dock and the Apps grid show the bundle's file name unless the app has a
localised display name, so a built Spark app would most likely show
`NYCTronAppKitReference` there. This is from Apple's display-name rules, not a
capture. It goes to T4 with the icon wiring, and `APP_IDENTITY.md` now says so.

## 5. `frontend-design:frontend-design`: visual direction

Direction: one quiet construction across the family. Graphite ground, one
line glyph per example drawn from the thing it demonstrates (a knob, a
window with a leading sidebar, a window with trailing caption marks), one
accent colour per example and a shared steel for detail. The accent is the
only colour that carries identity; everything else is neutral, which keeps
the icons from claiming a Tron palette.

Changes made in this pass: the knob's unfilled track, from `#3A3E48` (1.7:1)
to `#606677` (3.1:1), and the monochrome mapping that keeps it dim in
themed icons (step 6). Before and after, 1024 px source and 16 px Windows
target, in `instruments-icon-track-before-after.png`.

NOT MET: before and after captures on the launchers themselves. The iOS and
Android captures in this folder show web clips and the old name; no native
build of a renamed example was made (free disk under the 10 GB floor).

## 6. `design:accessibility-review`: WCAG 2.1 AA

Standard: WCAG 2.1 AA. Date: 2026-11-12. Issues found: 1, fixed.

Contrast against the ground `#15171C`, computed with the WCAG relative
luminance formula:

| Element | Colour | Ratio | Required | Pass |
| --- | --- | --- | --- | --- |
| Amber value arc and pointer | `#F2A33A` | 8.60:1 | 3:1 (1.4.11) | yes |
| Cyan AppKit window | `#4CC3D9` | 8.64:1 | 3:1 | yes |
| Blue WinUI window | `#7AA7FF` | 7.51:1 | 3:1 | yes |
| Steel detail | `#C4CAD4` | 10.88:1 | 3:1 | yes |
| Knob track, before | `#3A3E48` | 1.68:1 | 3:1 | **no** |
| Knob track, after | `#606677` | 3.13:1 | 3:1 | yes |

The old record called the 1.7:1 track deliberate. It is part of the knob
graphic, and the 1.4.11 exception covers only decoration. It was raised to
3.13:1, still well under the 8.6:1 arc, so filled and empty still read apart
(amber against track 2.75:1, and they differ in hue).

Screen reader: the launcher label is the accessible name. iOS VoiceOver reads
`CFBundleDisplayName` (from `expo.name`, "Tron Lab"); TalkBack reads the
Android `app_name` ("Tron Lab"); Windows Narrator reads the package
`DisplayName` ("Tron WinUI"). Not tested with a screen reader: no build.

Colour alone: the three glyphs differ in form (round knob, window with a left
rule, window with a top rule), so colour is not the only cue (1.4.1).

Target size, focus order, keyboard: owned by the OS launcher, not by the app.
Not applicable.

Themed and small icons: raising the track also raised it in the Android
monochrome layer, from about 0.37 to 0.76 alpha, so in themed mode the empty
part of the knob nearly matched the filled part. `derive-icons.mjs` now maps
distance from the ground to alpha as `(delta - 40) / 120` instead of
`delta / 120`: strokes 160 or more from the ground stay solid and the track
lands at about 0.43, close to before. The AppKit and WinUI monochrome layers
changed only at anti-aliased edges. At 16 px (Windows
`targetsize-16`) the knob's pointer and inner ring merge; the silhouette
still separates it from the two windows. See step 7.

## 7. `design:design-critique` against §2.2 and §2.3

Overall: a coherent family that reads as one set and stays out of Tron's
theming. The weakest point is the smallest size.

| Finding | Lens | Severity | Change made |
| --- | --- | --- | --- |
| At 16 px the knob's pointer and inner ring blur into one blob | Susan Kare, legibility at small sizes | Moderate | None. The old record said "readable at 16 px"; that overstated it and was removed. A hand-drawn 16 and 24 px variant is the fix if the owner wants one |
| AppKit and WinUI glyphs differ only by where the detail sits; at 16 px the inner rules blur and colour (cyan against blue, 1.15:1 between them) does most of the work | Kare; Collins, product family | Moderate | None. The outer silhouette differs too (corner 56 against 28), which helps at 32 px and up. Noted for the owner |
| Knob track too dim to count as part of the form | Flarup, icon craft | Fixed | Track raised to 3.1:1 (step 6) |
| Windows `altform-unplated` targets are opaque graphite squares, not glyphs on transparency | Microsoft app icon guidance; ustwo, across device classes | Minor | None. A transparent glyph would fall under 3:1 on a light taskbar (amber on white is about 2:1). The opaque tile keeps contrast in both themes. A light-theme variant set is the proper fix |
| Full-bleed source, OS-owned masks; the macOS tile carries its own 185 px corner | Flarup; Pentagram, identity rules | Works | None |
| One construction, one accent per example, steel shared | Collins, a system across a product family | Works | None |
| Dense, quiet, no gradient or highlight | Rasmus Andersson, density for professional tools | Works | None |

§2.5 (Forge direction and radius rule) does not apply: these are Tron
examples, and launcher masks are OS-owned and exempt.

## 8. `design:design-handoff`: spec sheet

Overview: three example apps, each with one source icon and two names.

Layout (on the 1024 px source):

| Item | Value |
| --- | --- |
| Canvas | 1024 x 1024, opaque, solid ground to every edge |
| Safe circle | radius 469.3 px from centre (Android 66 dp of 108 dp); glyph reach 332.5 (Lab), 388 (AppKit), 399.1 (WinUI) |
| Form stroke | 64 px |
| Detail stroke | 44 px (WinUI caption marks 40 px) |
| Knob | value ring radius 300, 270 degree sweep from 135 degrees, value at 68 %; inner ring radius 150 |
| Windows | 600 x 460 box centred, corner 56 (AppKit) or 28 (WinUI) |
| macOS tile | 824 px at (100, 100), corner 185 |

Tokens: see step 3. None are Tron tokens.

States: an app icon has none of its own. Variants the OS asks for: Android
adaptive foreground, Android monochrome (themed), Windows plated and unplated
sizes, macOS `.icns`, web favicon. All derived by `derive-icons.mjs`.

Content:

| Field | Rule |
| --- | --- |
| Launcher name | Must pass every measured target the app runs on; never truncated by the tool |
| Full name | Store listings, About screens, window titles |
| Config source | Expo `expo.name`; RNW `displayName`; Spark `macos.infoPlist.CFBundleName` (menu bar only, see step 4) |

Edge cases:

- Label wider than the box: the check exits 1 with the measured overflow.
- Character missing from the Roboto table: NOT RUN, never PASS.
- Config with no label: one identity error, exit 1.
- Apple targets off macOS: NOT RUN.
- macOS icon and Finder/Dock label: not wired; deferred to T4.
- Web install label: browser-owned, not checked.

Accessibility: the label is the accessible name on every launcher; see step 6.

## 9. `engineering:code-review`

### Re-check of 81e2170

The earlier independent `ecc:code-reviewer` report on 396ecd4 (1 high,
3 medium, 4 low) was not committed or posted on the PR. The 81e2170 message
lists eight fixes; each was checked against the diff and the tests at
3ae6630.

| # | Claimed fix | Diff | Test | Result |
| --- | --- | --- | --- | --- |
| 1 | `.gitignore` no longer hides `assets/icon/macos` and `assets/icon/windows` | `macos/` to `/macos/`, `windows/` to `/windows/` | stale-file test lists every derived file | Fixed. `git check-ignore` finds nothing under `assets/icon` |
| 2 | A character missing from the font table is NOT RUN | `checkLabels` sets NOT RUN with a reason | "a character the font table lacks…" | Fixed |
| 3 | `derive-icons` CLI entry works on Windows paths | `fileURLToPath(import.meta.url) === resolve(argv[1])` | none | **Partly fixed.** Through a symlinked path (macOS `/tmp` is one) the comparison fails, and the CLI exits 0 having written nothing. Fixed here with `realpathSync` on both sides; test added and seen failing without the fix |
| 4 | Spark Windows label uses `name` | `labelFor(p)` | none | Fixed by reading. Untested; the example has no Windows platform |
| 5 | A config with no label is an identity error | `run()` adds "no … launcher label" | none | **Partly fixed.** `identityProblems` also printed `label is "undefined"` for the same config. Fixed here; test added |
| 6 | PNG reader honours `tRNS` for grey and RGB | colour types 0 and 2 | none | Fixed by reading, 8-bit only (the reader rejects other depths) |
| 7 | Tests compare decoded pixels | stale test decodes both | itself | Fixed. ICNS and ICO are no longer compared at all; only their headers are checked in another test |
| 8 | 0.5 pt tolerance for a runner font update | `Math.abs(width - 46.8) <= 0.5` | itself | Fixed |

The 81e2170 change to `run()` also left a comment ("browsers own the install
label…") on the wrong line. Moved back.

### Final review of the surface

Summary: dependency-free tooling with tests that re-derive every icon and
fail on stale output. After the fixes above, no blocking issue.

| # | File | Issue | Severity | Status |
| --- | --- | --- | --- | --- |
| 1 | `derive-icons.mjs` | CLI silent no-op through a symlinked path | High | Fixed |
| 2 | `launcher-label-check.mjs` | Duplicate "undefined" identity line | Low | Fixed |
| 3 | `launcher-label-check.mjs` | Spark macOS label read from `CFBundleName`, which is not the Finder, Dock or Apps label | Medium | Documented; NOT RUN target, T4 |
| 4 | `app-identity.test.mjs` | ICNS and ICO bodies not compared for staleness | Low | Open |
| 5 | `render-example-icons.mjs` | Knob track under 3:1 | Medium (a11y) | Fixed |
| 6 | `derive-icons.mjs` | Monochrome alpha mapping made the brighter track almost solid in themed icons | Low | Fixed |

Verdict: request changes resolved in this pass; ready for an independent
reviewer.

Local runs at the new head: `node --test tooling/tests/app-identity.test.mjs`
17 of 17; `node --test tooling/tests/test-files.test.mjs` 3 of 3. Node
v26.13.0, macOS.
