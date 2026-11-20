# Agent-native phase 1, step 2: design-system token audit

Status: audit and proposal. Nothing in `packages/` changed and the codemod has not run. Repo HEAD `d7c1101` on `agent-native-20261119` (parent `0e09d3b`, `1.0.0-rc.2`).

Binding decisions from `decisions.md`: 6 (tokenize hardcoded values in `packages/*`, value-preserving), 9 (layout primitives are built in NYC-Tron first, Forge reuses them), 10 (closed scale, no snapping, off-scale values become named component-scoped tokens with identical values).

Every count below comes from one script, `docs/agent-native/audit-literals.mjs`, run at HEAD. `docs/agent-native/build-tokens.mjs` turns its output into `tokens.json`, `tokens.map.json` and the histogram tables in this file. Rerun both and the numbers reproduce:

```sh
node docs/agent-native/audit-literals.mjs > /tmp/lit.json
node docs/agent-native/build-tokens.mjs /tmp/lit.json docs/agent-native /tmp/frag.json
```

## 1. Token inventory

### 1.1 Colour and radius (the CSS contract)

Source: `packages/core/src/theme.ts` (`TRON_THEME_TOKENS`), `docs/THEME_TOKENS.md`. The library ships no palette. The values below are the neutral reference block in `THEME_TOKENS.md`, not a brand.

| TS key (`TronTheme.colors`) | CSS variable | Required | Tailwind utilities in use | Reference light | Reference dark |
|---|---|:---:|---|---|---|
| `primary` | `--color-primary` | yes | `bg-primary`, `bg-primary/10`, `border-primary`, `text-primary` | `#1f5fd1` | `#7aa7ff` |
| `onPrimary` | `--color-on-primary` | yes | `text-on-primary`, `bg-on-primary` | `#ffffff` | `#0b1730` |
| `surfaceRaised` | `--color-surface-raised` | yes | `bg-surface-raised` | `#ffffff` | `#1b1f26` |
| `surfaceSunken` | `--color-surface-sunken` | yes | `bg-surface-sunken` | `#f1f3f6` | `#12151a` |
| `border` | `--color-border` | yes | `border-border` | `#c9ced6` | `#39404b` |
| `text` | `--color-text` | yes | `text-text`, `bg-text` | `#15181d` | `#e8ebf0` |
| `textMuted` | `--color-text-muted` | yes | `text-text-muted`, `border-text-muted`, `bg-text-muted` | `#5a626e` | `#a3abb7` |
| `focus` | `--color-focus` | yes | `ring-focus`, `border-focus` | `#1f5fd1` | `#7aa7ff` |
| `danger` | `--color-danger` | no | `bg-danger`, `border-danger`, `text-danger` | `#b42318` | `#ff8a80` |
| `onDanger` | `--color-on-danger` | no | `text-on-danger` | `#ffffff` | `#2b0703` |
| `accent` | `--color-accent` | no | `bg-accent`, `bg-accent/10`, `border-accent`, `text-accent` | `#1f7a6d` | `#5fd0bf` |
| `info` | `--color-info` | no | `bg-info`, `bg-info/10`, `border-info`, `text-info` | `#1d5fa8` | `#8ab8ff` |
| `success` | `--color-success` | no | `bg-success`, `bg-success/10`, `border-success`, `text-success` | `#1e7a3c` | `#6fd08c` |

| TS key (`TronTheme.shape`) | CSS variable | Utility | Reference | InFraX preset |
|---|---|---|---|---|
| `controlRadius` | `--radius-control` | `rounded-control` (295 uses) | `8px` | `4` |
| `cardRadius` | `--radius-card` | `rounded-card` (40 uses) | `12px` | `6` |

That is 13 colours and 2 radii. The reference and InFraX columns differ, which matters in section 4: an inline `borderRadius: 8` is not the same thing as `--radius-control`.

### 1.2 Native-only metrics and everything else

| Token | Value (InFraX preset) | Where it lives | Who reads it |
|---|---|---|---|
| `shape.borderWidth` | `1` | `theme.ts`, no CSS variable | no component (grep) |
| `density` | `"comfortable"`, allowed `"comfortable" \| "compact" \| "touch"` | `theme.ts` | no component (grep) |
| `motion.fastMs` | `120` | `theme.ts` | `theme.ts` and `presets/infrax.ts` only |
| `motion.standardMs` | `240` | `theme.ts` | `theme.ts` and `presets/infrax.ts` only |
| `iconSizes` | `xs 12, sm 16, toolbar 20, default 24, touch 28, feature 32, hero 48` | `packages/icons/src/tokens.js` | `@nyc-tron/icons` |
| `iconStroke` | `size 24, width 2.35, cap round, join round` | same | same |
| `iconMotion` | `hoverMs 120, pressMs 110, selectMs 225, deselectMs 175, successMs 320, errorMs 240, loadingMs 850, pressScale 0.9, selectedScale 1.075` | same | `ForgeIcon.js` (3 `Animated` calls) |
| `iconColorTokens` | `color:text, selectedColor:primary, disabledColor:textMuted, successColor:accent, errorColor:danger` | same | `iconColorsFromTheme` |

Not found anywhere in the repo as a token: spacing, font size, line height, letter spacing, elevation/shadow, opacity, scrim, touch-target size. Tailwind default classes stand in for some of them (`gap-2`, `text-sm`, `shadow-md`) and the consumer's Tailwind config owns those values.

`tokens.json` has 101 entries: 13 colours, 2 radii, 4 native metrics (`borderWidth`, `density`, `fastMs`, `standardMs`), 17 icon values, and 65 proposed entries from section 4.

## 2. Naming inconsistencies

Each item is verified against the files named.

1. **Radius word order flips between layers.** CSS `--radius-control`, TS `shape.controlRadius`. The deprecated `shape.surfaceRadius` adds a third pattern.
2. **Stuttering utilities.** `--color-text` and `--color-border` produce `text-text` and `border-border`. `border-border` appears 305 times in `packages/ui/src`.
3. **Five deprecated aliases are still live.** `colors.surface`, `foreground`, `muted`, `background` and `shape.surfaceRadius`. `validateTheme()` re-emits all four colour aliases on every validated theme, so they spread into consumers' objects. `background` maps to `surfaceSunken` although `theme.ts` notes no component reads a page background.
4. **Required versus optional is split 8 and 5, but the docs say "13 colours".** `danger`, `onDanger`, `accent`, `info`, `success` are optional, and a theme that omits them leaves recipes unstyled without an error.
5. **`iconColorTokens.successColor` points at `accent`, not `success`.** `success` exists in the theme since 2026-11-05. Unverified whether this is deliberate. It changes the colour of a success icon, so it is an owner call, not something a value-preserving pass touches.
6. **Motion naming and use.** `motion.fastMs` and `motion.standardMs` (InFraX 120 and 240) are unread by any component. `iconMotion` has seven separate ms values with a `Ms` suffix of its own. Two motion vocabularies, one of them dead.
7. **Units are implicit in TS and explicit in CSS.** TS radii are bare numbers, `themeCssVariables` appends `px`. Native adapters take the bare number.
8. **Two shadow mechanisms.** 8 Tailwind default shadow classes (`shadow` 4, `shadow-md` 3, `shadow-lg` 1, regex count including comments) and 2 inline `boxShadow` strings. The first set takes its value from the consumer's Tailwind config, the second is fixed.
9. **Three ways to write one touch target.** `minWidth/minHeight: 44` (152 literals), `min-h-11` (35) and `min-w-11` (20), plus `minHeight:44` in a test assertion. Same 44.
10. **Spacing exists in two unconnected systems.** 254 Tailwind class strings (`gap-2` 59, `px-3` 35, `gap-1` 27, `gap-3` 24) and 1,109 inline numbers. Tailwind v4 spacing is `--spacing` times n and the consumer owns it, so `gap-2` and `gap: 8` agree only while that variable stays at its 4px default.
11. **Disabled looks differ.** Opacity for a disabled control is 0.45 in 51 literals, 0.5 in 21, 0.4 in 14, 0.55 in 4, 0.52 in 1. Section 4 preserves all of them.
12. **Docs drift.** `examples/theme-bridges/README.md` uses `border-border-strong`, `shadow-card`, `font-display`, none of which are in `THEME_TOKENS.md`. `contracts.test.mjs` accepts only the token classes in its hand-written `tokenClass` regex and in `THEME_TOKENS.md`, so a new colour token needs an edit in both places.
13. **The contract test guards less than it appears to.** It fails on quoted hex in `packages/ui/src/components` and on undocumented colour or radius classes. It does not look at `rgba()`, spacing, radius numbers, font sizes, or any package other than `ui`. That is why `ui` has 1,301 numeric style literals in scope and a green test run.

## 3. Hardcoded literals

Scope: `git ls-files packages`, files ending `ts tsx js jsx mjs qml swift kt java m mm cpp h`, excluding `/tests/`, `.test.`, `.d.ts`, `/dist/`, `/node_modules/`, `/generated/`, `/licenses/`, `/third-party/`. 1,018 files. This is the file set of `audit_hc.sh`.

### 3.1 Counts by category

Command for every row is `node docs/agent-native/audit-literals.mjs`. The regular expressions are the `cats` object at the top of that file. A literal counts when a numeric value follows the property and no operator or identifier continues it (`gap: 8 * x` is not counted, `-2 * hold` is not counted).

| Category | Property regex (value is a bare number) | All packages | `ui` only |
|---|---|---:|---:|
| Spacing | `padding*`, `margin*`, `gap`, `rowGap`, `columnGap`, including `Start`/`End` and negatives | 1,109 | 1,080 |
| Radius | `borderRadius`, `border{Top,Bottom}{Left,Right,Start,End}Radius` | 131 | 130 |
| Font size | `fontSize` | 74 | 73 |
| Line height | `lineHeight` | 18 | 18 |
| Letter spacing | `letterSpacing` | 0 | 0 |
| Duration | `duration`, `durationMs`, `delay`, `delayMs`, `timeout` followed by `:` or `=` and an integer | 2 | 0 |
| `rgba()`/`hsla()` with numeric first argument | `\b(rgba?\|hsla?)\(\s*[0-9]` | 7 | 5 |
| Hex colour text (any language) | `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` | 34 | 1 |
| Android colour constants (`.kt`) | `Color(0xFFrrggbb)` and `"#rrggbb"` | 10 | 0 |
| Tailwind arbitrary values | `(p\|px\|py\|m\|mx\|my\|gap\|w\|h\|text\|rounded)-[Npx]` | 2 | 2 |

Beyond the categories the task named, the same pass found three more value-preserving targets:

| Category | All packages | `ui` only |
|---|---:|---:|
| Border width (`borderWidth`, `border{Top,Bottom,Left,Right}Width`) | 121 | 118 |
| Opacity (numeric literals other than 0 and 1 inside an `opacity:` expression) | 119 | 116 |
| `minWidth`/`minHeight` (336 literals, of which `44` is 152) | 336 | 316 |

Reconciliation with the earlier audit (`audit/tron.md` section 4), which reported 1,050 spacing, 130 radius, 91 type in `ui` (1,271 total, the "about 1,270" in decision 10):

- Spacing 1,050 + 16 negative literals (the old regex had no minus sign) + 16 `paddingStart/End` and `marginStart/End` (not in the old property list) - 2 (`marginBottom: -2 * hold`, an expression, now excluded) = 1,080.
- Type 91 = 73 `fontSize` + 18 `lineHeight`. Unchanged.
- `ui` total in scope: 1,080 + 130 + 91 = 1,301. Other packages add 29 spacing (`expo-controls` 9, `windows-fluent` 15, `native-navigation` 4, `native-charts` 1), 1 radius and 1 font size (`native-navigation`). The old audit counted 10 in `expo-controls`; the script counts 9 and I did not chase the tenth.

The hex and `rgba` counts of the old audit stand with these edits: `ui` has 5 `rgba()` literals, not 8, because three of the old 8 are template strings in `slide-model.ts:52` and `vector-types.ts:148,150` that format document colours at runtime. They are data, not theme, and stay out. The single `ui` hex hit is the example in a doc comment at `vector-types.ts:152`. The 28 hex values in `core/src/presets/infrax.ts` are the preset itself, the 29th core hit is `"#111"` in a comment in `theme.ts:66`. Real hex colour literals in component code: 0. Native: 4 distinct Android values in 10 literals across `TronChartView.kt`, `TronArcKnobView.kt`, `TronXYPadView.kt`: `#8b5cf6` (5), `#f5f5f7` (2), `#13131a` (2), `#8a8a99` (1).

The `rgba()` literals, exactly:

| Literal | Count | File |
|---|---:|---|
| `rgba(0,0,0,0.5)` | 1 | `ui/.../forge/devices/DevicePairingDialog.tsx:158` (modal scrim) |
| `rgba(0,0,0,0.25)` | 2 | `ui/.../navigation/CollapsibleDrawer.tsx:131` (scrim), `ui/.../forge/layers/CanvasCompareView.tsx:188` (inside `boxShadow`) |
| `rgba(0,0,0,0.18)` | 2 | `panes/.../AdaptivePaneHost.tsx:185` (scrim), `ui/.../forge/layers/CanvasCompareView.tsx:217` (inside `boxShadow`) |
| `rgba(0,0,0,0.12)` | 1 | `panes/.../AdaptivePaneHost.tsx:160` (close button fill) |
| `rgba(80,180,255,0.5)` | 1 | `ui/.../forge/photo/PhotoBrushSurface.tsx:31` (brush preview) |

Duration: `ui` has no style duration literal. The 2 hits are `duration=0` in Kotlin (`AndroidMediaDecoder.kt`). `setTimeout` appears in 12 files across packages, one of them `setTimeout(callback,16)` in `forge/frame-throttle.ts`, a frame budget and not a motion duration. `Animated.timing` and `.spring` exist only in `packages/icons/src/ForgeIcon.js` and read `iconMotion`. Motion in components is Tailwind (`transition` 41, `transition-none` 7, `ease-*` 10) plus `motion-reduce` classes.

By package (non-zero cells only):

| Package | spacing | radius | font | line h | hex | rgba | android | border w | opacity | min size |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| ui | 1,080 | 130 | 73 | 18 | 1 | 5 | 0 | 118 | 116 | 316 |
| windows-fluent | 15 | | | | | | | | | |
| expo-controls | 9 | | | | | | | | 2 | 12 |
| native-navigation | 4 | 1 | 1 | | | | | | | 4 |
| native-charts | 1 | | | | | | 2 | 1 | | |
| native-controls | | | | | 4 | | 8 | | | |
| core | | | | | 29 | | | 2 | | |
| panes | | | | | | 2 | | | | 2 |
| icons | | | | | | | | | 1 | 2 |

`platform-services` has only the 2 Kotlin `duration=0` hits. (`native-controls` hex 4 are the same Kotlin strings counted again in the Android column. The hex column counts `#rrggbb` text anywhere, the Android column counts Kotlin colour constants in both forms. Do not add the two.)

### 3.2 Worst files

Ranked by in-scope literals: spacing + radius + font + line height + hex + `rgba()` + duration. Same files as the earlier audit, with exact counts.

| # | In-scope literals | File | Breakdown |
|---:|---:|---|---|
| 1 | 40 | `ui/.../forge/audio/LoudnessMeter.tsx` | spacing 18, font size 19, radius 2, line height 1 |
| 2 | 28 | `core/src/presets/infrax.ts` | hex 28 (intentional preset data) |
| 3 | 23 | `ui/.../forge/audio/BusAndRoutingMatrix.tsx` | spacing 21, radius 2 |
| 4 | 21 | `ui/.../forge/audio/EQFrequencyGraph.tsx` | spacing 11, font 5, line height 5 |
| 5 | 21 | `ui/.../forge/audio/PluginPresetBrowser.tsx` | spacing 18, radius 2, font 1 |
| 6 | 21 | `ui/.../shell/KeyboardShortcutHUD.tsx` | spacing 21 |
| 7 | 19 | `ui/.../forge/layers/LayerStack.tsx` | spacing 10, radius 6, font 3 |
| 8 | 18 | `ui/.../forge/audio/InsertEffectRack.tsx` | spacing 15, radius 3 |
| 9 | 17 | `ui/.../forge/layers/ArtboardNavigator.tsx` | spacing 13, radius 4 |
| 10 | 17 | `ui/.../forge/midi/MIDIVelocityLane.tsx` | spacing 13, radius 4 |
| 11 | 16 | `ui/.../forge/audio/DynamicsTransferGraph.tsx` | spacing 6, font 5, line height 5 |
| 12 | 15 | `ui/.../forge/ink/InkToolbar.tsx` | spacing 6, radius 5, font 4 |

`LoudnessMeter.tsx` carries 19 of the 74 font-size literals in the repo, including the only 30 px size in the repo. Of the 12 files, 10 are inside `forge/`, which holds 493 of the 624 `ui` files.

### 3.3 Histograms of distinct values

"All pkgs" and "ui only" are literal counts. "Files" is the number of distinct files containing the value. "On scale" is the outcome of the rule in section 4.1. Rows are sorted by value so adjacent values read as a ladder.

#### Spacing (1,109 literals, 27 distinct)

The seven most common values (8, 6, 4, 12, 2, 10, 16) cover 1,053 literals, 95%. By property family: `gap` 723 literals (8: 324, 6: 156, 4: 108, 12: 50, 2: 32, 10: 23, 16: 11), horizontal padding 147 (12: 38, 8: 26, 4: 23, 6: 16, 10: 14, 16: 11), `padding` 109 (8: 43, 16: 21, 12: 14, 4: 11), vertical padding 93 (8: 26, 4: 18, 6: 18, 12: 8), margin 37 (4: 10, -2: 4).

| literal | all pkgs | ui only | files | on scale | token |
|---:|---:|---:|---:|:---:|---|
| -22 | 3 | 3 | 2 | no |  |
| -12 | 3 | 3 | 2 | yes | `-space.3` |
| -10 | 1 | 1 | 1 | yes | `-space.2.5` |
| -4 | 2 | 2 | 2 | yes | `-space.1` |
| -2 | 4 | 4 | 4 | yes | `-space.0.5` |
| -1.5 | 1 | 1 | 1 | no |  |
| 0 | 6 | 6 | 5 | yes | `space.0` |
| 1 | 4 | 4 | 3 | yes | `space.0.25` |
| 1.5 | 1 | 1 | 1 | no |  |
| 2 | 55 | 55 | 39 | yes | `space.0.5` |
| 3 | 12 | 12 | 11 | yes | `space.0.75` |
| 4 | 170 | 167 | 104 | yes | `space.1` |
| 5 | 1 | 1 | 1 | no |  |
| 6 | 195 | 193 | 109 | yes | `space.1.5` |
| 7 | 2 | 2 | 2 | no |  |
| 8 | 422 | 415 | 249 | yes | `space.2` |
| 9 | 1 | 1 | 1 | no |  |
| 10 | 51 | 48 | 38 | yes | `space.2.5` |
| 11 | 1 | 1 | 1 | no |  |
| 12 | 110 | 103 | 65 | yes | `space.3` |
| 14 | 7 | 7 | 7 | yes | `space.3.5` |
| 16 | 50 | 45 | 27 | yes | `space.4` |
| 20 | 1 | 1 | 1 | no |  |
| 22 | 1 | 1 | 1 | no |  |
| 24 | 2 | 0 | 2 | no |  |
| 32 | 1 | 1 | 1 | no |  |
| 44 | 2 | 2 | 1 | no |  |

#### Radius (131 literals, 20 distinct)

`8` and `12` appear 3 and 4 times, `9999` once (a pill, in `NativeNavigationRail.web.tsx`). The distribution is flat at the low end: 1 to 7 px account for 100 of 131.

| literal | all pkgs | ui only | files | on scale | token |
|---:|---:|---:|---:|:---:|---|
| 1 | 36 | 36 | 17 | yes | `radius.1` |
| 2 | 17 | 17 | 13 | yes | `radius.2` |
| 2.5 | 1 | 1 | 1 | no |  |
| 3 | 16 | 16 | 10 | yes | `radius.3` |
| 3.5 | 1 | 1 | 1 | no |  |
| 4 | 11 | 11 | 10 | yes | `radius.4` |
| 5 | 9 | 9 | 8 | yes | `radius.5` |
| 6 | 7 | 7 | 7 | yes | `radius.6` |
| 7 | 4 | 4 | 3 | yes | `radius.7` |
| 8 | 3 | 3 | 3 | yes | `radius.8` |
| 9 | 6 | 6 | 6 | yes | `radius.9` |
| 10 | 4 | 4 | 4 | yes | `radius.10` |
| 11 | 2 | 2 | 2 | no |  |
| 12 | 4 | 4 | 4 | yes | `radius.12` |
| 13 | 1 | 1 | 1 | no |  |
| 14 | 4 | 4 | 4 | yes | `radius.14` |
| 15 | 1 | 1 | 1 | no |  |
| 17 | 2 | 2 | 2 | no |  |
| 22 | 1 | 1 | 1 | no |  |
| 9999 | 1 | 0 | 1 | yes | `radius.full` |

#### Font size (74 literals, 14 distinct)

| literal | all pkgs | ui only | files | on scale | token |
|---:|---:|---:|---:|:---:|---|
| 9 | 1 | 1 | 1 | no |  |
| 10 | 4 | 4 | 3 | yes | `font.10` |
| 11 | 18 | 18 | 7 | yes | `font.11` |
| 12 | 18 | 18 | 9 | yes | `font.12` |
| 13 | 11 | 11 | 7 | yes | `font.13` |
| 14 | 6 | 6 | 2 | yes | `font.14` |
| 15 | 3 | 3 | 3 | yes | `font.15` |
| 16 | 3 | 3 | 3 | yes | `font.16` |
| 17 | 3 | 3 | 2 | yes | `font.17` |
| 18 | 2 | 2 | 2 | no |  |
| 20 | 1 | 0 | 1 | no |  |
| 22 | 1 | 1 | 1 | no |  |
| 24 | 2 | 2 | 2 | no |  |
| 30 | 1 | 1 | 1 | no |  |

#### Line height (18 literals, 7 distinct)

| literal | all pkgs | ui only | files | on scale | token |
|---:|---:|---:|---:|:---:|---|
| 12 | 1 | 1 | 1 | no |  |
| 14 | 7 | 7 | 3 | yes | `leading.14` |
| 16 | 6 | 6 | 4 | yes | `leading.16` |
| 20 | 1 | 1 | 1 | no |  |
| 21 | 1 | 1 | 1 | no |  |
| 25 | 1 | 1 | 1 | no |  |
| 34 | 1 | 1 | 1 | no |  |

#### Border width (121 literals, 12 distinct)

| literal | all pkgs | ui only | files | on scale | token |
|---:|---:|---:|---:|:---:|---|
| 0 | 3 | 3 | 3 | yes | `border.0` |
| 1 | 21 | 18 | 13 | yes | `border.1` |
| 1.5 | 26 | 26 | 14 | yes | `border.1_5` |
| 2 | 43 | 43 | 31 | yes | `border.2` |
| 3 | 9 | 9 | 6 | yes | `border.3` |
| 4 | 7 | 7 | 6 | yes | `border.4` |
| 5 | 2 | 2 | 1 | no |  |
| 6 | 2 | 2 | 1 | no |  |
| 7 | 2 | 2 | 1 | no |  |
| 8 | 3 | 3 | 2 | yes | `border.8` |
| 9 | 2 | 2 | 1 | no |  |
| 13 | 1 | 1 | 1 | no |  |

#### Opacity (119 literals, 11 distinct)

| literal | all pkgs | ui only | files | on scale | token |
|---:|---:|---:|---:|:---:|---|
| 0.3 | 4 | 4 | 3 | yes | `opacity.0_3` |
| 0.35 | 5 | 5 | 4 | yes | `opacity.0_35` |
| 0.4 | 14 | 13 | 13 | yes | `opacity.0_4` |
| 0.45 | 51 | 51 | 33 | yes | `opacity.0_45` |
| 0.5 | 21 | 20 | 20 | yes | `opacity.0_5` |
| 0.52 | 1 | 0 | 1 | no |  |
| 0.55 | 4 | 4 | 4 | yes | `opacity.0_55` |
| 0.6 | 10 | 10 | 8 | yes | `opacity.0_6` |
| 0.7 | 4 | 4 | 3 | yes | `opacity.0_7` |
| 0.85 | 1 | 1 | 1 | no |  |
| 0.9 | 4 | 4 | 3 | yes | `opacity.0_9` |

## 4. Proposed closed scale

Hard constraint, decision 10: no visual change. Every literal equal to a scale step maps to it. Every other literal becomes a named component-scoped token with the same value. Nothing is snapped. The scale is chosen from the histograms above to keep that off-scale list short.

### 4.1 Rule for choosing steps

A value is a step when it occurs at least 3 times in at least 2 files. Negative spacing reuses the positive step (`-space[1]`), so it is free when the positive exists. Exceptions: `radius.full` (9999, 1 use) is kept because a pill radius is a role, not a measurement.

The rule is one line and the script applies it, so changing the threshold regenerates everything. The trade-off between threshold and off-scale count, as `steps / literals left off scale`:

| Category (total) | n>=2 | n>=3, f>=2 (proposed) | n>=4, f>=3 | n>=5, f>=3 | n>=8, f>=4 |
|---|---|---|---|---|---|
| Space (1109) | 14 steps, 11 off | 11 steps, 17 off | 11 steps, 17 off | 10 steps, 21 off | 8 steps, 34 off |
| Radius (131) | 14 steps, 6 off | 12 steps, 10 off | 11 steps, 13 off | 7 steps, 29 off | 5 steps, 42 off |
| Font size (74) | 10 steps, 4 off | 8 steps, 8 off | 4 steps, 23 off | 3 steps, 27 off | 3 steps, 27 off |
| Line height (18) | 2 steps, 5 off | 2 steps, 5 off | 2 steps, 5 off | 2 steps, 5 off | 0 steps, 18 off |
| Border width (121) | 11 steps, 1 off | 7 steps, 9 off | 5 steps, 15 off | 5 steps, 15 off | 4 steps, 22 off |
| Opacity (119) | 9 steps, 2 off | 9 steps, 2 off | 9 steps, 2 off | 5 steps, 18 off | 4 steps, 23 off |

Reading it: spacing gives the same 17 off-scale literals at n>=3 and n>=4. Font size jumps from 8 to 23 off-scale at n>=4, because `14` (6 uses in 2 files) and `15`, `16`, `17` (3 each) drop out. Radius and border width lose a few literals per step; border width keeps `0` and `8` (3 uses each) only under the n>=3 rule. Radius counts exclude `9999`, which the proposal adds back as `radius.full` (13 steps).

### 4.2 Scale

Spacing keys are unit multiples (decision 14): `space[n]` is `n x 4px`, so `space[2]` is 8px, `space[1.5]` is 6px, `space[0.25]` is 1px. This is Tailwind's numbering, and the unit is a single constant (`SPACE_UNIT = 4` in `build-tokens.mjs` and the future `tokens.ts`), so a density change scales the unit and the names stay true. Radius, font, leading, border and opacity keep value-based keys (`radius[4]`, `font[12]`, `opacity[45]`) and `radius.full`. The meaning lives in the semantic roles in 4.3. A step missing from the table is a compile error, which is the enforcement.

| Scale | Export | Steps (px unless noted) | Literals on scale | Left off scale |
|---|---|---|---:|---:|
| Space (unit 4px) | `space` | keys 0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4 = 0, 1, 2, 3, 4, 6, 8, 10, 12, 14, 16 px (and negatives -0.5, -3, -1, -2.5 = -2, -12, -4, -10 px) | 1092 | 17 |
| Radius | `radius` | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 9999 (9999 is `radius.full`) | 122 | 9 |
| Font size | `font` | 10, 11, 12, 13, 14, 15, 16, 17 | 66 | 8 |
| Line height | `leading` | 14, 16 | 13 | 5 |
| Border width | `border` | 0, 1, 1.5, 2, 3, 4, 8 | 112 | 9 |
| Opacity | `opacity` | percent keys 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.7, 0.9 (`opacity[45]` is `0.45`) | 117 | 2 |
| Scrim | `scrim` | black at alpha percent 12, 18, 25, 50 | 4 | 0 |
| Elevation | `elevation` | `0` (none), `1` = `0 1px 3px rgba(0,0,0,0.25)`, `2` = `0 4px 12px rgba(0,0,0,0.18)` | 2 | 0 |
| Touch target | `size.touch` | 44 | 152 | 0 |
| Motion | `duration` | `fast` = `motion.fastMs`, `standard` = `motion.standardMs` | 0 | 0 |

Totals across space, radius, font, line height, border width and opacity: 1,522 of 1,572 literals land on a step, 50 do not (3.2%), in 37 distinct values. Colour roles and motion add nothing off scale.

Motion is the one scale with no literals to size it. Components have no duration literal, so `duration.fast` and `duration.standard` alias the two theme metrics that nothing reads today. The proposal leaves `iconMotion` where it is and does not invent step values. Wiring `Tooltip`, `Banner` or the Tailwind `transition` classes to these is new behaviour and falls outside decision 10.

Colour roles stay as the 13 CSS variables. Scrim and elevation are TS constants with the current literal as the value, not new required CSS variables, because a required variable that a consumer's theme lacks silently renders nothing (`THEME_TOKENS.md`). An optional override can be added later as `var(--color-scrim, rgba(0,0,0,0.5))`.

### 4.3 Semantic roles (new code only)

The codemod never emits these. They exist so a new component, or an agent, picks a role instead of a number. Each role names the modal value for its job in the existing code.

| Role | Maps to | Evidence |
|---|---|---|
| `gap.tight` / `gap.default` / `gap.loose` | `space[1]` / `space[2]` / `space[3]` | gap modes: 8 (324 of 723), 6 (156), 4 (108), 12 (50) |
| `gap.related` | `space[1.5]` | second most used gap |
| `inset.control` (horizontal) | `space[3]` | horizontal padding mode 12 (38 of 147) |
| `inset.compact` (vertical) | `space[2]` | vertical padding mode 8 (26 of 93) |
| `inset.panel` | `space[4]` | `padding: 16` 21 of 109, second after 8 |
| `radius.control`, `radius.card` | stay the CSS variables | consumer-defined (InFraX 4 and 6) |
| `radius.pill` | `radius.full` | 9999 |
| `text.caption` | `text-xs text-text-muted` | 63 uses |
| `text.body` | `text-sm text-text` | 26 uses |
| `text.bodyMuted` | `text-sm text-text-muted` | 40 uses |
| `text.label` | `text-sm font-semibold` | 26 uses |
| `text.title` | `text-lg font-semibold` | 10 uses |
| `text.dense` | `font[11]`, `font[12]`, `font[13]` | inline 11 (18), 12 (18), 13 (11) in Forge editors |
| `state.disabled` | `opacity[45]` | 51 of 119 opacity literals |
| `scrim.modal` / `scrim.drawer` | `scrim[50]` / `scrim[25]` | `DevicePairingDialog`, `CollapsibleDrawer` |
| `size.touch` | 44 | 152 literals, also `min-h-11` and `min-w-11` |

The role names are my proposal. The values come from the counts in the Evidence column; no existing code uses the role names.

### 4.4 Off-scale, value preserved

Each row becomes a token scoped to the file that uses it, in a sibling `<Component>.tokens.ts` that is not exported from `package.json`. The token name pattern is `<Component>.<scale>.<value>`, with `n` for a minus sign and `_` for a decimal point. The same value in two files gets two scoped tokens, one per file, so deleting a component never strands another's value. `tokens.map.json` lists the exact files per value.

**Space** (17 literals, 12 distinct)

| literal | count | files | component-scoped token pattern |
|---:|---:|---:|---|
| -22 | 3 | 2 | `<Component>.space.n5_5` |
| 7 | 2 | 2 | `<Component>.space.1_75` |
| 24 | 2 | 2 | `<Component>.space.6` |
| 44 | 2 | 1 | `<Component>.space.11` |
| -1.5 | 1 | 1 | `<Component>.space.n0_375` |
| 1.5 | 1 | 1 | `<Component>.space.0_375` |
| 5 | 1 | 1 | `<Component>.space.1_25` |
| 9 | 1 | 1 | `<Component>.space.2_25` |
| 11 | 1 | 1 | `<Component>.space.2_75` |
| 20 | 1 | 1 | `<Component>.space.5` |
| 22 | 1 | 1 | `<Component>.space.5_5` |
| 32 | 1 | 1 | `<Component>.space.8` |

**Radius** (9 literals, 7 distinct)

| literal | count | files | component-scoped token pattern |
|---:|---:|---:|---|
| 11 | 2 | 2 | `<Component>.radius.11` |
| 17 | 2 | 2 | `<Component>.radius.17` |
| 2.5 | 1 | 1 | `<Component>.radius.2_5` |
| 3.5 | 1 | 1 | `<Component>.radius.3_5` |
| 13 | 1 | 1 | `<Component>.radius.13` |
| 15 | 1 | 1 | `<Component>.radius.15` |
| 22 | 1 | 1 | `<Component>.radius.22` |

**Font size** (8 literals, 6 distinct)

| literal | count | files | component-scoped token pattern |
|---:|---:|---:|---|
| 18 | 2 | 2 | `<Component>.font.18` |
| 24 | 2 | 2 | `<Component>.font.24` |
| 9 | 1 | 1 | `<Component>.font.9` |
| 20 | 1 | 1 | `<Component>.font.20` |
| 22 | 1 | 1 | `<Component>.font.22` |
| 30 | 1 | 1 | `<Component>.font.30` |

**Line height** (5 literals, 5 distinct)

| literal | count | files | component-scoped token pattern |
|---:|---:|---:|---|
| 12 | 1 | 1 | `<Component>.leading.12` |
| 20 | 1 | 1 | `<Component>.leading.20` |
| 21 | 1 | 1 | `<Component>.leading.21` |
| 25 | 1 | 1 | `<Component>.leading.25` |
| 34 | 1 | 1 | `<Component>.leading.34` |

**Border width** (9 literals, 5 distinct)

| literal | count | files | component-scoped token pattern |
|---:|---:|---:|---|
| 5 | 2 | 1 | `<Component>.border.5` |
| 6 | 2 | 1 | `<Component>.border.6` |
| 7 | 2 | 1 | `<Component>.border.7` |
| 9 | 2 | 1 | `<Component>.border.9` |
| 13 | 1 | 1 | `<Component>.border.13` |

**Opacity** (2 literals, 2 distinct)

| literal | count | files | component-scoped token pattern |
|---:|---:|---:|---|
| 0.52 | 1 | 1 | `<Component>.opacity.0_52` |
| 0.85 | 1 | 1 | `<Component>.opacity.0_85` |

Components that gain the most scoped tokens (distinct values across the six scales): `RangeSlider` 3, `InkToolbar` 3, `PrecisionScrubber` 2, `LayerThumbnail` 2, `ColorDropCanvasTarget` 2, `CanvasRuler` 2, `LoudnessMeter` 2, `TransitionPresetBrowser` 2, `TrackHeaders` 2.

The `PhotoBrushSurface.tsx` colour `rgba(80,180,255,0.5)` becomes `PhotoBrushSurface.color.brushPreview`. The four Android values become constants in one new Kotlin object, `TronNativeDefaults` (`accent` `#8b5cf6`, `knobText` `#f5f5f7`, `padSurface` `#13131a`, `chartAxis` `#8a8a99`), with the same ARGB values, and the two `"#8B5CF6"` strings and three `Color(0xFF8B5CF6)` calls read the constant. Kotlin is outside the ts-morph pass and gets a small separate edit.

Decision 5 (colour drift between icon and studio accents) is untouched. Nothing here compares or merges colours.

### 4.5 What the scale deliberately does not do

- **No mapping of `borderRadius: 8` to `radius.control` or `12` to `radius.card`.** Those two are consumer variables and InFraX sets them to 4 and 6, so the mapping would change pixels for any themed app. The 3 literals of 8 and 4 of 12 stay primitives.
- **No Tailwind class rewrite.** The 254 spacing classes and 277 `text-xs/sm/base/lg/xl` classes already take their values from the consumer's Tailwind config, and the contract test guards only the colour ones.
- **No width, height or `size` literals.** There are 723 `width|height|size` numeric literals in `ui` (`width:0` 59, `height:12` 28, `height:44` 27, `width:44` 25). They describe geometry of meters, graphs and handles, not a rhythm, and tokenizing them would add noise. `44` is the exception, covered by `size.touch`.
- **No unification.** `0.45`, `0.5` and `0.4` stay three steps, the radius ladder stays 13 steps wide. Collapsing either changes pixels and is the owner's later design call, same as decision 10's DEFER.

### 4.6 How Nitro Forge extends it

NYC-Tron owns `@nyc-tron/core/tokens` (proposed subpath: pure TS, no React, in the package that already has no peers). Forge declares `registryDependencies: ["@nyc-tron/tokens"]` and imports the same constants. Forge may add scoped tokens in its own namespace (`forge.<component>.space.7`). It may not add a step to `space`, `radius`, `font`, `leading`, `border` or `opacity`. A new step is a PR to Tron that regenerates `tokens.json`. That keeps the scale closed for both repos and lets the CI gate in section 7 run in each.

## 5. Layout and type primitives

Decision 9 says build them in NYC-Tron first, confirm after this audit. The evidence says build.

### 5.1 What exists

| Primitive | Exists under another name? | Evidence |
|---|---|---|
| Stack, Row, Column | No. Layout is hand-rolled in every component. | 1,657 `<View` tags, 284 inline `flexDirection: "row"`, 43 `flex-row` classes, 1 inline `column` (the default), 1 `flex-col`. No file named `Stack*`, `Row*`, `Column*` in `ui`, `expo-controls` or `panes`. |
| Spacer | No | `gap` is used instead, 723 literals. No file or export. |
| Divider / Separator | No | 305 `border-border` classes, 103 `border-t/b/l/r` classes, plus 61 one-pixel `View`s (`height:1` 29, `width:1` 32, not all dividers). Components that need one draw it inline. |
| Text variants / Heading / Label / Caption | No | 931 `<Text` tags. 77 inline `fontSize` styles. Repeating class combos: `text-text-muted text-xs` 63, `text-text-muted text-sm` 40, `text-text text-sm` 26, `text-sm font-semibold` 26, `text-xs font-semibold` 10, `text-lg font-semibold` 10, `text-danger text-xs` 9. |
| Layout containers | Yes, two | `components/layout/ContentFrame` (max-width, align) and `components/layout/AdaptiveColumns` (+ `.Item`). Neither sets spacing. The doc comment on `ContentFrame` says "The app owns spacing, surfaces and type". |
| Property row, field group, card, list, toolbar | Yes | `shell/PropertyRow`, `FieldGroup`, `Card`, `List`, `Toolbar`. They fix their own padding and gap. |

I grepped the 556 `exports` keys in `packages/ui/package.json` for `Divider|Separator|Spacer|Stack|Row|Heading|Caption|Label|Typography`. The only name matches are `PropertyRow`, `TypographyInspector` (a Forge document panel), `CaptionWordTimingHandles` and `AutoCaptionTranscriptTimeline`, none of which are primitives.

### 5.2 Proposed API

Wrappers over `View` and `Text` only, in `packages/ui`, one subpath each (`AGENTS.md` per-component subpath rule). Props take token keys, not numbers, so a raw `gap={9}` fails to compile. `style` stays last, `className` and `unstyled` follow the existing conventions (`joinClasses`). No new colour, no new behaviour.

```ts
type Space  = keyof typeof space;          // 0 | 0.25 | 0.5 | 0.75 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4  (x 4px)
type Radius = keyof typeof radius;
type Font   = keyof typeof font;

interface StackProps extends ViewProps {
  gap?: Space;                                // default 2 (8px)
  padding?: Space; paddingX?: Space; paddingY?: Space;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  className?: string; unstyled?: boolean;
}
<Stack />    // flexDirection "column"
<Row />      // same props, flexDirection "row" (logical start/end, RTL-safe like ContentFrame)

<Spacer size={Space} />   // fixed gap on the parent's main axis
<Spacer flex />           // flexGrow 1, no size

interface DividerProps extends ViewProps {
  orientation?: "horizontal" | "vertical";    // default "horizontal"
  inset?: Space;                              // margin on the cross axis
}
// 1 px (`border[1]`), colour via the existing `bg-border` token. Role "none" for screen readers.

interface TextProps extends RNTextProps {
  variant?: "body" | "bodyMuted" | "caption" | "label" | "title" | "error";
  size?: Font;                                // overrides variant size, for dense Forge editors
  tone?: "text" | "muted" | "danger" | "primary" | "accent" | "info" | "success" | "onPrimary";
  className?: string; unstyled?: boolean;
}
```

Variant to class map, all existing classes: `body` = `text-sm text-text`, `bodyMuted` = `text-sm text-text-muted`, `caption` = `text-xs text-text-muted`, `label` = `text-sm font-semibold text-text`, `title` = `text-lg font-semibold text-text`, `error` = `text-xs text-danger`. The six combinations account for 174 of the 931 `<Text` tags in the class orders counted (other orderings exist), so adoption can start there.

What this does not do: the codemod does not replace existing `<View style={{flexDirection:"row",gap:8}}>` with `<Row gap={2}>`. That edits the element tree rather than a value, so it is a separate, opt-in change per component and outside decision 10. New components use the primitives from day one, and the 556 existing subpaths migrate when a maintainer touches them.

Forge consumption: `@nyc-tron/ui/components/layout/Stack` and siblings plus `@nyc-tron/core/tokens`, declared as `registryDependencies`. Forge has none of these today (decision 9).

## 6. Machine-readable files

- `docs/agent-native/tokens.json`: 101 tokens. Fields `name`, `category`, `value`, `source`, `status` (`existing`, `proposed`, `proposed-scoped`), plus `cssVariable`, `required`, `occurrences`, `files` where they apply. Component-scoped tokens are listed by pattern in the map, not one by one, since their count depends on the rule threshold.
- `docs/agent-native/tokens.map.json`: per category, the literal to token map. `onScale` has `{token, occurrences, files}` per literal, with negatives mapped to `-space.N`. `offScale` has `{occurrences, files, tokenPattern, byFile}` per literal, where `byFile` is the exact per-file count the codemod must reproduce.
- `docs/agent-native/audit-literals.mjs` and `build-tokens.mjs`: the two generators. Neither installs anything. They need Node and git only.

## 7. Codemod plan

Not run. No dependency was installed here (disk 4.7 GB free), so the tool choice below is untested against this repo's TypeScript 7.

### 7.1 Tool

ts-morph. The rewrite is syntactic, but it needs import insertion, sibling-file creation and edits that keep the repo's compact formatting. ts-morph replaces one node's text and leaves everything around it alone, and it bundles its own compiler, so it does not care that the repo is on TypeScript 7. jscodeshift with the `tsx` parser works for the same job and is the fallback if ts-morph refuses a file. It is a root `devDependency`, added in the PR that introduces the codemod.

### 7.2 What it rewrites

A `PropertyAssignment` whose name is in the category's property set and whose initializer is a numeric literal, or a unary minus on one, inside an object literal that is a style: a JSX `style` attribute (object or array element), a `StyleSheet.create` argument, or a variable typed `ViewStyle`, `TextStyle` or `ImageStyle`. Anywhere else (a `gap` in a layout-model object, a `padding` argument default) it only reports, because a regex count cannot tell the two apart. The script's 1,109 is an upper bound. The codemod's own count is authoritative and goes in its report.

| Before | After | Import added |
|---|---|---|
| `gap: 8` | `gap: space[2]` | `space` from `@nyc-tron/core/tokens` |
| `marginTop: -2` | `marginTop: -space[0.5]` | same |
| `borderRadius: 9999` | `borderRadius: radius.full` | `radius` |
| `fontSize: 12` | `fontSize: font[12]` | `font` |
| `lineHeight: 14` | `lineHeight: leading[14]` | `leading` |
| `borderWidth: 1.5` | `borderWidth: border[1.5]` | `border` |
| `opacity: disabled ? 0.45 : 1` | `opacity: disabled ? opacity[45] : 1` | `opacity` |
| `backgroundColor: "rgba(0,0,0,0.5)"` | `backgroundColor: scrim[50]` | `scrim` |
| `boxShadow: "0 1px 3px rgba(0,0,0,0.25)"` | `boxShadow: elevation[1]` | `elevation` |
| `minHeight: 44` | `minHeight: size.touch` | `size` |
| `gap: 7` (off scale) | `gap: tokens.space1_75` | `tokens` from `./Foo.tokens` |

Skipped and reported, never guessed: any initializer that is not a plain number (`gap: GAP`, `gap: 8 * scale`, `marginLeft: -2 * hold`), template literals, values in `.test` files, `.d.ts`, and files outside `packages/*/src`. Tailwind class strings are left alone.

Off-scale values go to `<Name>.tokens.ts` next to the source file (one per base name, so `Foo.native.tsx` and `Foo.web.tsx` share `Foo.tokens.ts`). It exports `const tokens = { space1_75: 7, spaceN5_5: -22 } as const`. The file is not in `package.json` `exports`, so the 556-subpath public surface does not change. `tooling/api-surface.mjs` and `api-signatures.mjs` run in `pnpm verify` and must show no diff, which is itself a check.

### 7.3 Proof of zero visual change

Screenshot diffing 556 components is not feasible, so the proof is compile-time and structural, with a runtime layer where the repo already has a browser harness.

1. **AST equivalence, per file, mandatory.** For each changed file the verifier loads the original from git (`git show <base>:<path>`) and the rewritten file, then constant-folds the rewritten one: every `space[2]`, `-space[0.5]`, `radius.full`, `scrim[50]`, `elevation[1]` and `tokens.space1_75` is replaced by the value in `tokens.json` or the sibling tokens file, and the token imports are dropped. The two files are then printed with a fixed formatter and compared as text. Any difference fails. This is a proof, not a sample: if the folded AST equals the original AST, the emitted style objects are identical for every render, in every state, on every platform, because the only edits were literals replaced by constants with the same value.
2. **Resolved style snapshot.** The same check at the data level: for each rewritten node the codemod records `{file, line, property, before, after}`. The verifier evaluates `after` against the token tables and asserts `before === after` with strict equality (so `0.45 !== 0.5`, `-0 !== 0`). The record also feeds `tokens.map.json`: the per-file counts in `offScale.byFile` and the totals per literal must match the record exactly. A mismatch in either direction (a literal the map expects but the codemod missed, or the reverse) fails.
3. **Token table integrity.** `tokens.json` entries are generated from the literal histogram, and a test asserts each table in `packages/core/src/tokens.ts` equals them (`space[2] === 8`, `opacity[45] === 0.45`, `elevation[1] === "0 1px 3px rgba(0,0,0,0.25)"`). This catches a typo in the one place a value is typed by hand.
4. **Runtime, where it exists.** `.github/workflows/ui-browser.yml` and `packages/ui/tests/browser/` exist. I did not read what they cover. If they mount components, add `getComputedStyle` snapshots of the touched components before and after and compare. If not, layers 1 to 3 stand alone. Do not claim runtime verification for the 556 subpaths unless layer 4 actually mounts them.
5. **Kotlin.** The four Android constants are checked by a script that parses `TronNativeDefaults.kt` and the old call sites from git and compares ARGB values.

The report separates what was proven (1 to 3, 5) from what was run in a browser (4), as `AGENTS.md` rule 10 requires.

### 7.4 CI

New `tooling/tokens-gate.mjs`, called from `ci.yml` next to the existing `verify` steps. It has three modes.

| Mode | Runs on | Fails when |
|---|---|---|
| `--check-sync` | every PR | `tokens.json` or `tokens.map.json` differs from a fresh `build-tokens.mjs` run, or `packages/core/src/tokens.ts` disagrees with `tokens.json` |
| `--ratchet` | every PR, after migration | the count of raw numeric style literals in `packages/*/src` (properties in 3.1, outside `*.tokens.ts` and the token modules) exceeds the committed baseline. After the migration the baseline is 0 for the in-scope categories. A new `gap: 9` must become a scoped token in the same PR |
| `--prove <base-ref>` | migration PRs only | any changed file fails the AST equivalence or resolved-snapshot check in 7.3 |

`contracts.test.mjs` gains two assertions: no `rgba(` or `hsla(` literal with a numeric first argument in `packages/*/src` outside token files, and every token class used in a component is in `THEME_TOKENS.md` (existing) plus every export of `tokens.ts` is listed in `tokens.json` (new).

The gate scopes to `packages/` only, per decision 7. `apps/*` is not scanned.

### 7.5 Rollout

1. Land `packages/core/src/tokens.ts`, its `./tokens` export, the tests, `tokens.json`, and the gate in `--check-sync` mode. No component changes.
2. Run the codemod in dry-run on the whole repo and attach the report (rewrites, skips by reason, scoped tokens by file). The owner reviews the off-scale list before anything is written.
3. Apply by directory, one PR each: root components, `data`, `shell`, `navigation`, `feedback`, then `forge/*` by cluster (audio, timeline, color, canvas, ...), then the other packages. Each PR runs `--prove`. Reviewable diffs are a few dozen files, mechanical, and the proof is attached.
4. Switch `--ratchet` on with baseline 0 once the last directory lands.
5. Native Kotlin constants and primitives (`Stack`, `Row`, `Spacer`, `Divider`, `Text`) are separate PRs. The primitives PR is independent of the codemod.

## 8. Decisions applied

The owner recorded decisions 12 to 19 in `decisions.md`. How each one shows up here:

| Row | Decision | Applied in this document |
|---:|---|---|
| 12 | Extra literal categories (border width, opacity, touch target, scrims and shadows, Android constants) | BUILD. In 3.1 and 4.2 |
| 13 | Step threshold n>=3 in f>=2 files | BUILD as proposed. 1,522 of 1,572 on a step, 50 off-scale in 44 file-scoped tokens (4.1, 4.4). Retuning waits for the owner's review of the 4.4 list |
| 14 | Unit-multiple spacing keys | BUILD. `space[n]` is n x 4px with half steps (`space[1.5]` = 6px). Applied to `tokens.json`, `tokens.map.json`, 4.2 to 4.4, 5.2 and 7. Radius, type and colour keep their names |
| 15 | New additive API: `@nyc-tron/core/tokens` plus Stack, Row, Spacer, Divider, Text | BUILD. Section 5. It needs a version decision from the owner, since it adds public subpaths to an `rc.2` package |
| 19 | Codemod runs in CI | BUILD. Section 7 runs on a GitHub Actions runner, not on this laptop |

Deferred, owner follow-ups:

- **Row 16.** `iconColorTokens.successColor` maps to `accent` where `success` exists. Possible bug. Fixing it changes pixels.
- **Row 17.** `motion.fastMs` and `standardMs` are read by nothing. They stay documented as unused. `duration.fast` and `duration.standard` in 4.2 alias them and wire nothing.
- **Row 18.** Disabled opacity takes five values (0.4, 0.45, 0.5, 0.52, 0.55). All five stay as steps or scoped tokens. Unifying changes pixels.

Still open, not covered by rows 12 to 19: whether `radius` literals 8 and 12 stay primitives (recommended, because InFraX sets `--radius-control` and `--radius-card` to 4 and 6), and collapsing the radius ladder or the 10/12/14 spacing steps later.

## 9. Not done and not verified

- No codemod run, no component edited, no test executed. `pnpm install` was not run.
- The 556 subpaths were grepped by name, not opened.
- Whether `packages/ui/tests/browser` mounts components is unread.
- Swift sources were searched for colour literals (`Color(red`, `UIColor(red`, `#colorLiteral`) with no hits. `TronDisplayP3DiscView.swift` computes its colours. Swift spacing and font literals were not scanned.
- The Tailwind class counts use a regular expression over source text and include comments and strings, so `rounded`, `shadow` and `transition` hits are upper bounds.
- `iconMotion` values are listed from `tokens.js` and not checked against rendered durations.
