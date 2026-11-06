# NYC-Tron original icon library

Extracted, single-source icon catalog from the owner's Nitro Forge draft
PR #21, keeping its authored **24px bold outline and filled vector geometry**.
NYC-Tron is the reusable component owner. Nitro Forge, Moyo, NYC-MON and other
apps will consume this package once published/validated.

The package is **intentionally private**, not published to npm yet. This is
a source extraction and typed/public export step, not a claim of completed
Rive assets or physical-device integration.

## Headless catalog (no React Native import)

```ts
import {
  iconGroups, iconIds, searchIcons, getGlyph, resolveIconState,
  riveIconInputs,
} from "@nyc-tron/icons";
```

The catalog contains more proposed semantic icons than have finished vector
artwork. `glyphIds` lists actual authored outline+filled paths only.
`getGlyph` returns `undefined` for missing artwork; **never** silently
substitute a misleading generic icon.

## Native/web renderer (requires React Native SVG)

```tsx
import { TronIcon, TronIconButton } from "@nyc-tron/icons/native";
import { iconColorsFromTheme } from "@nyc-tron/icons/tokens";

const iconColors = iconColorsFromTheme(theme.colors);

<TronIcon name="navigation/home" selected={active} reducedMotion={reducedMotion} {...iconColors} />
<TronIcon name="edit/lock" accessibilityLabel="Locked" {...iconColors} />
<TronIconButton name="file/save" label="Save document"
  onPress={save} selected={saved} {...iconColors}
/>
```

Idle outline; selected filled. The renderer uses SVG paths and an RN
native-driver Animated crossfade and scale; reduced motion stops authored
transitions. `TronIconButton` hit targets are at least 44 logical pixels.

### Color

The package has no palette. `iconColorsFromTheme(colors)` maps
`@nyc-tron/core` theme keys to icon roles (`text` → `color`, `primary` →
`selectedColor`, `textMuted` → `disabledColor`, `accent` → `successColor`,
`danger` → `errorColor`). Any role left unset falls back to `color`, then to
`currentColor`. Knockout detail in filled glyphs is an SVG mask cutout, so
it shows whatever sits behind the icon. There is no surface color prop.
`appearance` is deprecated and has no effect.

### Accessibility

Icons are decorative by default. On iOS and Android the wrapper sets
`accessible={false}`, `accessibilityElementsHidden` and
`importantForAccessibility="no-hide-descendants"`. On web the wrapper and the
SVG carry only `aria-hidden`, and the SVG gets the string attribute
`focusable="false"`: react-native-svg's web build passes every prop to the
DOM `<svg>`, so RN-only props such as `accessible` made React warn. Pass
`accessibilityLabel` for a meaningful standalone icon; it is then exposed as
one image (`accessibilityRole="image"` on native, `role="img"` with
`aria-label` on web). `TronIconButton` requires a `label`, names the button
with it, and keeps its icon decorative.

### Lookup

`getGlyph` and the `name` prop take catalog IDs only (`"navigation/home"`,
listed in `glyphIds`). A bare slug such as `"home"` or an ID in the wrong
category such as `"bogus/home"` returns `undefined` instead of borrowing
artwork. Six glyphs are drawn under a different key than their catalog slug:
`paint/paintbrush`, `edit/cut`, `spreadsheet/sheet`, `file/document-pdf`,
`audio/note` and `ai/ai-sparkle`. The module checks those mappings when it
loads.

The optional `renderRive` function accepts a consumer-owned Rive artboard
adapter with named states; **no compiled `.riv` assets or Rive runtime**
are included yet. No unconditional Rive dependency in basic components.

`TronIcon` aliases the extracted `ForgeIcon` implementation. Nitro Forge
still ships its own `@nitro-forge/icons` copy until it becomes the re-export
shim described in `docs/ICON_MIGRATION.md`; until then the two catalogs can
diverge, and this package is the one to change.

Native OS-specific `WinUI` Segoe Fluent glyphs, Android Compose native
icons, Apple SF Symbols and animated Rive integrations require explicit
platform adapters; a React Native SVG does not automatically become an
OS-native icon. Preserve native system accessibility and the physical
right-rail placement for supported foldables.

## Original source attribution

- User's `mikevocalz/nitro-forge`, draft PR #21,
  branch `feat/forge-icons-rive-universal-suite-2026-11-02`.
- The initial `src/catalog.js`, `src/glyphs.js`, `src/state.js`,
  `src/tokens.js`, `src/ForgeIcon.js`, tests and types were extracted
  from that branch. Subsequent renderer, declaration, test and artwork
  changes are authored in NYC-Tron; Git history records the boundary.
- The `selection/move` outline was redrawn on November 5, 2026: the
  extracted version repeated path segments from Lucide's ISC-licensed
  `move` icon without attribution. A comparison of all 402 paths against
  Lucide found no other whole-segment matches beyond generic one-line
  strokes; Feather, Material and Heroicons were not compared.
- The status of the original author's source license must be independently
  confirmed before any public npm release. No fonts or binary assets copied.

Once consumers import NYC-Tron, Nitro Forge can change its old icon entry
into a compatibility shim that re-exports `@nyc-tron/icons`, but it must
not remove original files until all editor imports and native/web tests pass.

## Navigation and adaptive-device artwork (November 5, 2026)

Thirty additional glyph pairs cover direction arrows/chevrons, overflow,
physical-left/right sidebars, split/grid/list views, external links,
pinning, locks, transfer actions, phone/tablet/desktop/watch, foldable/Duo,
and book/tabletop postures. Each has independently authored outline and
filled geometry. Side and hardware identities remain distinct; this artwork
does not select the app's navigation policy or infer device capabilities.

At this revision there are **77 authored glyph slugs**, compared with
**1,463 proposed semantic IDs**. Because the catalog is namespaced and some
legacy artwork uses standalone slugs, **72 catalog IDs resolve to artwork**.
Those numbers describe different inventories; they are not a completion
percentage. Use `glyphIds` and `getGlyph` to check actual availability.

The batch was inspected as a rendered SVG contact sheet. Source tests verify
semantic registration, distinct outline/filled pairs, SVG command argument
counts and arc flags. Every glyph, not only this batch, must have a filled
variant that differs from its outline. This is source/raster inspection, not physical-device,
OS-native glyph or compiled Rive verification.
