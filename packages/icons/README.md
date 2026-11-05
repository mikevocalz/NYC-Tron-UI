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

<TronIcon
  name="home"
  selected={active}
  color={theme.colors.foreground}
  selectedColor={theme.colors.primary}
  surfaceColor={theme.colors.surface}
  reducedMotion={reducedMotion}
/>
<TronIconButton name="save" label="Save document"
  onPress={save} selected={saved}
  color={theme.colors.foreground}
/>
```

Idle outline; selected filled. The renderer uses SVG paths, RN native
Animated crossfade/scale and app-supplied semantic colors; hit targets are
at least 44 logical pixels. Reduced-motion stops authored transitions.
The optional `renderRive` function accepts a consumer-owned Rive artboard
adapter with named states; **no compiled `.riv` assets or Rive runtime**
are included yet. No unconditional Rive dependency in basic components.

The shared `TronIcon` aliases the existing ForgeIcon implementation for
migration. There is no second icon visual system.

Native OS-specific `WinUI` Segoe Fluent glyphs, Android Compose native
icons, Apple SF Symbols and animated Rive integrations require explicit
platform adapters; a React Native SVG does not automatically become an
OS-native icon. Preserve native system accessibility and the physical
right-rail placement for supported foldables.

## Original source attribution

- User's `mikevocalz/nitro-forge`, draft PR #21,
  branch `feat/forge-icons-rive-universal-suite-2026-11-02`.
- Authored `src/catalog.js`, `src/glyphs.js`, `src/state.js`,
  `src/tokens.js`, `src/ForgeIcon.js`, tests and types are copied
  as-is for provenance; public package and aliases are NYC-Tron changes.
- The status of the original author's source license must be independently
  confirmed before any public npm release. No fonts or binary assets copied.

Once consumers import NYC-Tron, Nitro Forge can change its old icon entry
into a compatibility shim that re-exports `@nyc-tron/icons`, but it must
not remove original files until all editor imports and native/web tests pass.
