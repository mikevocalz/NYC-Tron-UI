---
name: nyc-tron-ui
description: Build React Native and Expo screens with NYC-Tron UI (@nyc-tron/ui). Use when adding, theming or documenting a control from this library, when an app imports @nyc-tron/*, or when asked for a button, select, data table, command palette, dock, inspector or any Forge editor control. Covers finding the right item, installing it, the token rules, and what not to do.
---

# NYC-Tron UI

React Native controls for Expo 58 and React Native 0.88, one import path per component. The library ships no colours: the app defines the theme. Version 1.0.0-rc.2, a release candidate that is not on npm.

Read this file first. Read one component page second, never the whole corpus.

## 1. Find an item

565 documentation pages exist: 64 hand-reviewed (tier 1) and 501 generated from type declarations (tier 2). Each page has the same eight sections: Purpose, Install, Props, Variants, States, A11y, Example, Do/Don't.

| Goal | Command or file |
|---|---|
| Search by what it does | `npx shadcn@latest search @nyc-tron -q "segmented control"` |
| Read one item's registry entry | `npx shadcn@latest view @nyc-tron/SegmentedControl` |
| Read the doc page | `docs/components/<id>.md` in the repo, or `https://raw.githubusercontent.com/mikevocalz/NYC-Tron-UI/main/docs/components/<id>.md` |
| Index of everything (small) | `llms.txt` at the repo root |
| Everything in one file (about 500k tokens, do not read it whole) | `llms-full.txt` |

`<id>` is the path under `components/`, slashes kept: `Button`, `shell/UnitInput`, `forge/audio/LevelMeter`. The same string is the registry item name. The root barrel is `root`. Four support modules from `@nyc-tron/core` are `core/folds`, `core/overlays`, `core/window-chrome`, `core/window-lifecycle`.

Read the page front matter before the body:

- `tier` and `docs`: `1` and `handwritten` were reviewed by a person. `2` and `generated` came from the `.d.ts` and the source. Generated sections say `_Not documented._` when the source gave nothing. That is a gap, not a statement that nothing exists.
- `a11yStatus`: `reviewed-pass`, `reviewed-fail` or `unverified`. The tier 1 values come from reading source, not from rendering. Every tier 2 page is `unverified`: nobody reviewed it. Its `A11y` section lists the accessibility props the source sets. `verified` is reserved for a rendered check and no page has it.
- `platforms`: only what the source states. `[]` means the source names no platform, not that every platform works.
- `tokens`: the theme tokens the source uses today.
- `registryDependencies`: other NYC-Tron items this one imports. `shadcn add` installs them too.

## 2. Install

The registry install is the target path:

```sh
npx shadcn@latest add @nyc-tron/Button
```

It needs the namespace in `components.json`, which this repo already carries:

```json
{ "registries": { "@nyc-tron": "https://raw.githubusercontent.com/mikevocalz/NYC-Tron-UI/main/r/{name}.json" } }
```

The URL uses ref `main`, a moving ref, until the owner cuts a release tag. It resolves only after this branch is merged to `main`; before that, serve the repo from a local HTTP server and point the namespace at it. It is unverified against live raw.githubusercontent.com until a clean Expo app installs from it. If it fails, use the tarball path in `README.md`, section "Installing from a release". That path works today and installs whole packages.

Items that ship native code cannot be added with shadcn, because a registry add copies files and cannot run pod install, gradle, CMake, nitrogen or a WinUI build. `registry-excluded.json` lists them (55 subpaths in 9 packages, for example `@nyc-tron/macos-appkit`, `@nyc-tron/native-controls`, `@nyc-tron/hardware-keys`). Install those from the release tarball and rebuild the native app. The engine facades (cadence, folio, pitch, prism, quill, splice, tally, studio-layout) need the Rust engine and are not registry items.

Peers: `react` (>=19) and `react-native` (>=0.88) are required. Every other peer is optional and only needed by the subpaths that import it: `@nyc-tron/core`, `@expo/ui`, `@tanstack/react-table`, `zustand`, `react-native-gesture-handler`, `expo-linear-gradient`, `expo-drag-drop-content-view`, `uniwind`, `react-native-skia`. The `Peers:` line on each page lists the ones that item imports. Install those with `npx expo install <peer>`.

### Imports

The import path depends on how the item was installed. Import with the subpath, never the barrel, so unused controls stay out of the bundle.

- After a registry install (`npx shadcn@latest add @nyc-tron/Button`), `shadcn add` writes the files into the app and the import points at them. Core modules follow the same pattern under `@/lib/nyc-tron/core`.
- After a tarball install, the import points at the `@nyc-tron/ui` package.

```tsx
import { Button } from "@/components/nyc-tron/ui/components/Button"; // registry install
import { Button } from "@nyc-tron/ui/components/Button"; // tarball install
```

Every page lists both under "Registry install" and "Tarball install", and every Example block uses the registry form. A registry install does not create the `@nyc-tron/ui` package, so an Example copied into a registry-installed app works as written. In a tarball-installed app, replace the prefix `@/components/nyc-tron/ui` with `@nyc-tron/ui` (and `@/lib/nyc-tron/core` with `@nyc-tron/core`).

## 3. Prerequisites

1. Tailwind v4 with Uniwind, and an `@source` line pointing at the installed components, as in `README.md`, section "App-specific Tailwind v4 / Uniwind styling".
2. The app's theme CSS defines the variables in `docs/THEME_TOKENS.md`, for light and dark. A missing variable does not fail the build. The utility silently paints nothing, so text can render black on a dark surface.

| Required | Optional |
|---|---|
| `--color-primary`, `--color-on-primary`, `--color-surface-raised`, `--color-surface-sunken`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-focus` | `--color-danger`, `--color-on-danger`, `--color-accent`, `--color-info`, `--color-success` |

Plus `--radius-control` and `--radius-card`. That is 13 colours and 2 radii. Define the optional five for any screen that shows errors, banners or Forge controls.

No component throws for a missing provider. `theme/NightScope` scopes a named scheme to a subtree. `shell/FocusAndA11yLayer` supplies reduce-motion, screen-reader and high-contrast state to the shell items that read it.

## 4. Token rules

- Use a token name, never a literal. No `#1f5fd1`, no `padding: 8`, no `borderRadius: 12` in app or library code.
- Colour: Tailwind utilities over the 13 variables (`bg-primary`, `text-text-muted`, `border-border`, `ring-focus`). Never a hex value.
- Radius: `rounded-control` for controls, `rounded-card` for cards. Both follow the theme.
- Spacing keys are multiples of one 4px unit: `space[2]` is 8px, `space[1.5]` is 6px, `space[4]` is 16px. Write half steps in bracket form: `space.1.5` is a syntax error. The scale keys are unit multiples, so `space[1]` is 4px while `border[1]` is 1px and `radius[4]` is 4px: each table has its own keys. The closed scale is `0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4`. Do not invent `space[5]` or `space[2.25]`.
- A value that is not on the scale is a named, component-scoped token with the same value (`<Component>.radius.11`, `<Component>.space.5`), listed in `docs/agent-native/tokens.json`. Do not round it to the nearest step. Rounding changes pixels.
- The full inventory, with values and status (`existing`, `proposed`, `proposed-scoped`), is `docs/agent-native/tokens.json`. The literal-to-token map is `docs/agent-native/tokens.map.json`. `docs/agent-native/audit-literals.mjs` counts the literals still in `packages/`.
- Tokens that are `proposed` name steps the closed scale adds. The module that exports them, `packages/core/src/tokens.ts`, is new in this release candidate and not yet in the `@nyc-tron/core` export map. Check `packages/core/package.json` before importing `@nyc-tron/core/tokens`.

## 5. Layout primitives

Stack, Row, Spacer, Divider and Text live in `packages/ui/src/components/layout/`, one subpath each, for example `@nyc-tron/ui/components/layout/Stack`. Their spacing props take token keys, not pixels: `gap={2}` is 8 px. `Text` has two variants, `body` and `caption`, and a `tone` for the theme colours; it sets no weight and no font family. `Divider` sets no `accessibilityRole`. `layout/ContentFrame` (width cap and alignment) and `layout/AdaptiveColumns` (wrapping columns) set no spacing. Add one with `npx shadcn@latest add @nyc-tron/layout/Stack`.

## 6. The six states

The library draws a state only when a prop asks for it. Everything else is the app's job.

| State | What the library gives you | What you write |
|---|---|---|
| Default | The component with its default props | Nothing |
| Loading | `Button` `loading` (spinner, disables the control, sets busy). Most others have no loading prop | A skeleton or spinner around the rest |
| Error | `feedback/ErrorMessage`, `feedback/Banner`, `TextField` `errorText`, `Select` error text | The message copy: say what failed and how to fix it |
| Empty | `feedback/EmptyState`, `DataTable` empty text, `KeyValueList` empty-value text | An action that leaves the empty state |
| Success | `feedback/Banner` success tone, `shell/ToastAndProgress` | The confirmation wording, matching the button that caused it |
| Offline | Nothing | Detect it, disable network actions, and say why |

Each item page lists its real states in the `States` section. Use those names, not guesses.

## 7. Accessibility facts to carry into your code

- Statuses are source reads. Nothing was rendered and no screen reader was run. Do not tell a user a component is accessible because its page says `reviewed-pass`.
- 21 of 64 hand-reviewed items are `reviewed-fail`. The common ones: a field border at 1.42/1.75:1 on its surface (finding F03) and a selected tint at 1.15/1.2:1 (F04). Both are under the 3:1 that WCAG 1.4.11 asks for. Read the page `A11y` section before shipping an item with `reviewed-fail`.
- Touch targets use 44 as the minimum. 44pt meets Apple. It is 4dp under Android's 48dp guideline (finding F08, 41 items). WCAG 2.1 AA has no target-size criterion, so this is a guideline finding.
- Icons: 47 glyphs are drawn and 42 of 1,463 catalog ids resolve to one. An unresolved icon name renders nothing. Check the glyph exists before using a name.

## 8. What not to do

- Do not hand-edit text between `<!-- generated:begin -->` and `<!-- generated:end -->` in a page. Change the source and run `node tooling/docs/build-docs.mjs`. To write a generated page by hand, change its front matter to `docs: "handwritten"` and remove the markers.
- Do not edit `registry.json`, `r/*.json` or `registry-excluded.json`. `node tooling/registry/build-registry.mjs` writes them.
- Do not import from `@nitro-forge/*` inside this repo (`AGENTS.md`, rule 1). Do not import a barrel to reach one control.
- Do not put a colour, a spacing number or a radius number in a component. Use the tokens in section 4.
- Do not claim a platform works because a page lists none. Do not claim Windows, macOS or QNX behaviour from a React Native View.
- Do not use an example as a render check. Examples are type-checked, not rendered.

## 9. Verify your change

```sh
node tooling/docs/check-docs.mjs          # page structure, front matter, props parity, tokens, links
node tooling/docs/build-docs.mjs --check  # pages match source
node tooling/docs/build-llms.mjs --check  # llms.txt and llms-full.txt match the pages
```

The page format and its 12 CI checks are in `docs/agent-native/doc-template.md`. Platform targets for installed files (`@components/nyc-tron/ui`, `@lib/nyc-tron/core`) are in `docs/agent-native/components-contract.md`, because `components.json` rejects unknown keys.
