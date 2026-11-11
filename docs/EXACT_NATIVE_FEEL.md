# Native feel and adaptive content

Michael's direction on November 9, 2026 is to learn from Expo Exact and the
Softwear preview: one authored screen should feel comfortable on each supported
platform, with useful layouts at different sizes and familiar native controls.
This document makes that direction part of NYC-Tron's contribution rules.

## Presentation and behavior

Resolve presentation in this order:

1. The consuming app's explicit, supported presentation choices.
2. The platform control's defaults for anything the app leaves unspecified.
3. NYC-Tron's documented shared fallback where a native implementation is unavailable.

The app owns fonts, palette, radius, density, border geometry and motion.
Keep Tailwind v4 / Uniwind and the existing [semantic tokens](THEME_TOKENS.md)
as that boundary. For a full visual replacement, use the component's `unstyled`
contract and supported slots; the order of competing Tailwind classes does not
establish override priority. Native adapters accept the properties their OS
controls support. Document unsupported customization instead of silently ignoring it.

Leave native appearance unspecified when the person has chosen System. If the
app chooses Light or Dark, pass that choice through the relevant native Host as
well as the app's surrounding surfaces. Changing the surrounding CSS alone does
not change a SwiftUI picker or Compose menu's environment.

Native defaults include interaction: focus, menu dismissal, disabled state,
accessibility names, text scaling, selection and keyboard behavior. Preserve
these when applying a brand. Use small app-selected corner radii and restrained
surfaces in the reference screen; other consumers retain their own design.

## Content follows its available space

Constrain forms and reading content to an app-selected maximum width. Use room
beside them for related content such as a saved-items preview or detail panel.
Related columns wrap when their content minimums no longer fit. A narrow pane
inside a wide desktop window must behave like a narrow pane.

Keep the same child instances while arranging them. Resizing must retain draft
text, selection, scroll intent and focus; product stores and media, call, camera
and XR resources remain above presentation wrappers. Long labels and large text
must be part of the layout inputs and acceptance scenarios. Fixed-height text
rows and clipped actions require a specific product justification.

`ContentFrame` and `AdaptiveColumns` provide ordinary content flow inside an
already safe region. `AdaptivePaneHost`, the fold planner and reserved-region
bridge continue to own hinge-safe Master/Detail/Inspector geometry. A wrapping
row does not detect a hinge or choose a navigation shell.

The existing shell policy remains authoritative:

| Host | Navigation policy |
| --- | --- |
| Ordinary native phone | Authored bottom tabs |
| Verified native foldable, dual-screen, tablet or headset | Physical-right rail, including narrow windows and RTL |
| Windows desktop | Left collapsible drawer through its Windows adapter |
| macOS desktop | Native sidebar through a verified macOS adapter |
| Web | Persistent header; phone-width bottom tabs; content adapts within the page |

Use current container coordinates, actual reported folds, safe areas and keyboard
geometry. The [pinned foldable skill](../AGENTS.md) defines multi-hinge, book,
tabletop and lifecycle handling. Keep known device capability separate from
changing window size. Availability and native validation remain recorded in
[Support](SUPPORT.md) and [Readiness](ROSTER.md).

## What to learn from the source

Exact was reviewed at commit
[`94b8671f`](https://github.com/expo/exact/tree/94b8671f70fe2e25b307a40e7fce66dc27c9f802),
and exact-templates at
[`ece65894`](https://github.com/expo/exact-templates/tree/ece65894bb53305f2d572c17c780f1f770350b95).
These are research references, not runtime dependencies.

| Source evidence | NYC-Tron application | Existing owner |
| --- | --- | --- |
| Exact [presentation precedence](https://github.com/expo/exact/blob/94b8671f70fe2e25b307a40e7fce66dc27c9f802/README.md#3-write-the-web-ship-the-platform) leaves unspecified presentation to the host. | Keep explicit app styling authoritative and native defaults intact. Route appearance choices into native hosts. | `packages/core/src/theme.ts`; `packages/expo-controls/src/components/` |
| Softwear's [screen source](https://github.com/expo/exact-templates/blob/ece65894bb53305f2d572c17c780f1f770350b95/softwear/app/app.contract) constrains overall and media width; product columns wrap with `min-width: 0`. | Supply reusable content-width and wrapping-column primitives with app-owned dimensions. Preserve child identity while arranging them. | `packages/ui/src/components/`; `packages/panes/src/components/AdaptivePaneHost.tsx` |
| Exact's [responsive-columns recipe](https://github.com/expo/exact/blob/94b8671f70fe2e25b307a40e7fce66dc27c9f802/docs/recipes/responsive-columns.md) wraps columns and lets text-relative bases grow with text size. | Size within the actual parent; test large text and narrow embedded containers. Choose text-aware content minimums where needed. | `packages/ui/src/components/`; consumer screen layout |
| The [foldable recipe](https://github.com/expo/exact/blob/94b8671f70fe2e25b307a40e7fce66dc27c9f802/docs/recipes/foldables.md) accounts for segments, reading order, safe edges, keyboard and retained pane instances. | Reuse the existing region and pane contracts, with NYC-Tron's physical-right navigation rule. | `packages/core/src/folds.ts`; `packages/core/src/pane-plan.ts`; `packages/reserved-regions/` |
| Exact's [tabs recipe](https://github.com/expo/exact/blob/94b8671f70fe2e25b307a40e7fce66dc27c9f802/docs/recipes/tabs.md) retains tab stacks, drafts and scroll positions. | Keep the app router and product store authoritative. Test continuity across resize, pane changes and tab changes. | `packages/core/src/navigation.ts`; `packages/panes/`; consumer router/store |
| The [theme recipe](https://github.com/expo/exact/blob/94b8671f70fe2e25b307a40e7fce66dc27c9f802/docs/recipes/theme.md) separates platform semantic roles from brand tokens and checks both appearances. | Map supported tokens into native resources; verify Light, Dark, System and high contrast separately. | `packages/core/src/theme.ts`; `packages/expo-controls/`; consumer theme |
| Exact's [test recipe](https://github.com/expo/exact/blob/94b8671f70fe2e25b307a40e7fce66dc27c9f802/docs/recipes/tests.md) exercises outcomes, failure recovery, appearance and multiple sizes. | Use stable control IDs, actual interactions, layout assertions and inspected screenshots. Keep evidence attached to its host and commit. | `packages/ui/tests/browser/`; `packages/expo-controls/tests/browser/`; existing native workflows |

Exact's README describes a changing pre-1.0 framework with uneven host maturity.
Its startup and development-loop figures are upstream targets and reported
results for its architecture. Establish NYC-Tron's own measured baselines before
setting performance targets. Keep optional controls and engines behind their
existing independent imports; a basic form must not pull in a media engine,
GPU renderer or unrelated instrument.

## Scope of this change

The first implementation adds reusable constrained content and wrapping columns,
an account reference screen, and explicit appearance forwarding in the existing
Expo controls. The account screen demonstrates a capped form beside related
content, then stacks those same children in a narrow container. It provides a
place to check appearance changes and draft continuity.

These additions use the existing React Native, Expo and platform boundaries.
They do not establish new AppKit, WinUI, QNX or XR renderer support. Native
coverage must be recorded from a native run; a browser screenshot demonstrates
the browser build only.

## Use the layout components

Import each component through its own package subpath. This example accepts
stable form and preview children from the consuming screen:

```tsx
import type { ReactNode } from "react";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";

export function AccountLayout({ form, preview }: {
  form: ReactNode;
  preview: ReactNode;
}) {
  return (
    <ContentFrame maxWidth={1024}>
      <AdaptiveColumns gap={32}>
        <AdaptiveColumns.Item minWidth={320} grow={1.5}>
          <ContentFrame maxWidth={560} align="start">
            {form}
          </ContentFrame>
        </AdaptiveColumns.Item>
        <AdaptiveColumns.Item minWidth={280}>
          {preview}
        </AdaptiveColumns.Item>
      </AdaptiveColumns>
    </ContentFrame>
  );
}
```

The numbers here belong to this screen recipe. Choose widths and spacing for
the consuming app's content; the library supplies no universal breakpoints.

| API | Behavior |
| --- | --- |
| `ContentFrame maxWidth` | Required positive finite width in logical layout units. The frame fills its available parent width up to this cap and can shrink with the parent. |
| `ContentFrame align` | `start`, `center` (default), or `end`. Logical auto margins follow the parent's reading direction and work in row and column parents. The app still owns the surrounding RTL direction. |
| `AdaptiveColumns gap` | Required finite, nonnegative spacing between columns and wrapped rows. |
| `AdaptiveColumns.Item minWidth` | Required positive finite preferred width used as the wrapping flex basis. It is not a hard CSS/Yoga minimum: the item has `minWidth: 0` and shrinks to fit a narrower one-column container. |
| `AdaptiveColumns.Item grow` | Nonnegative share of spare row space; default `1`. Set `0` to retain the preferred width when space is available. |
| `style`, `className`, and ordinary View props | Supply app-owned spacing, presentation, accessibility and IDs. Explicit `style` is applied after the layout defaults and can intentionally change them. |

`AdaptiveColumn` is also exported by the `AdaptiveColumns` subpath for consumers
that prefer a named component. Both forms render the same implementation.
CSS/Yoga performs the layout with the existing child tree; these components
store no JavaScript geometry state, read no viewport dimensions and wait for no
measurement callback. For text-heavy columns, the consuming screen can multiply
its preferred basis by the current font scale, as the account recipe does.

See the [account reference instructions](../examples/native-feel/README.md) and
[AccountScreen implementation](../examples/native-feel/AccountScreen.tsx) for a
complete shared screen with a local Zustand draft, validation, save/reset and
appearance selection. It is a recipe to mount in an existing compatible host.

### Forward an explicit native appearance

The affected Expo Host-backed controls accept `colorScheme?: "light" | "dark"`.
Map an app's System choice to `undefined`, then keep its surrounding token scope
in sync. For example, the account screen passes:

```tsx
<NativeDropdown
  label="Default workspace"
  value={workspace}
  options={workspaces}
  onValueChange={setWorkspace}
  colorScheme={appearance === "system" ? undefined : appearance}
/>
```

Here `appearance` is the app's `"system" | "light" | "dark"` preference.
The native adapter forwards the supported scheme to its Expo Host; omitting it
preserves the platform setting. RN content and token-styled web fallbacks still
use the consuming app's theme. This prop does not provide a palette or recolor
the rest of the screen.

## Acceptance for each affected screen

| Exercise | Required result |
| --- | --- |
| Resize the same screen through narrow, intermediate and wide containers | Related content stacks or shares space appropriately; forms stay readable; no horizontal overflow. |
| Type a draft, focus a field, then resize repeatedly | Draft and mounted field identity survive; focus stays usable. |
| Increase text size and use long translated labels | Text wraps; primary actions and dismissal remain reachable. |
| Select Light, Dark and System | Surrounding surfaces and supported native controls receive the intended scheme; System follows the host. |
| Use keyboard, pointer, touch and screen-reader navigation | Controls expose truthful names and state; disabled items stay inactive; menus dismiss and return focus appropriately. |
| Test RTL and actual fold/keyboard geometry | Reading order is correct; controls avoid occlusion; the physical-right rail stays right where required. |
| Reduce motion or interrupt an interaction | Essential feedback and actions remain available; cancellation does not commit a stale edit. |

For each PR, record the exact checks that ran and their results. Separate pure
geometry/source checks, mounted browser checks, native compilation, simulator
interaction and physical-device evidence. Inspect screenshots after interactions
as well as at launch. State remaining native, accessibility and device gaps in
the PR instead of changing the component acceptance ledger without evidence.
