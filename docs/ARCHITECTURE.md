# NYC-Tron UI architecture

## Responsibility split

```text
         Every app and Forge suite (authoritative brand/theme/routes)
                              |
                              v
     @nyc-tron/ui/components/{Button,Card,NavigationRail,...}
                              |
                 per-component opt-in imports
                              |
        @nyc-tron/ui/components/forge/{WaveformLane,...}
                              |
               behavior only, NO editor engines
                              |
         Optional consumers install @nitro-forge/{prism,cadence,...}
                              |
                 Rust / Nitro v1 / WASM engines
```

**Dependency direction is one-way: `Nitro Forge -> NYC-Tron UI`, never
`NYC-Tron UI -> Nitro Forge`.** Each app can install one or more Forge
engine packages independently. A standalone wave player can install the
WaveformLane UI with its own audio engine; it should not need `ignition`.

**The shared presentational package cannot import `@acme/theme`** from
NYC-MON or Moyo. Those apps retain independent `@acme/theme` packages.
The names collide intentionally as local monorepo aliases, but their values
differ; NYC-Tron receives semantic classes at the consuming app boundary.

### Tree-shaking and install size

- Basic components have explicit `./components/X` subpath exports.
- The root `@nyc-tron/ui` entry exports only generic UI.
- Forge components each have independent subpaths, not a mega-barrel importing
  every widget. `@expo/ui` is an optional peer used only by two Expo 58
  native controls; `WaveformLane` has no @expo/ui requirement.
- Installing the *npm package* downloads its distribution files; tree-shaking
  controls which modules enter the JS bundle, not the download size. If Forge
  controls become large native SDKs, split them into independently published
  `@nyc-tron/*` packages without changing the ergonomic import API.
- To avoid a duplicate React Native or Nitro runtime, React and RN are peer
  dependencies. Runtime-specific native adapters must use verified version
  matrices. Expo 58/RN 0.88 is **not compatible by default** with Spark
  0.0.2's Expo 55/RN 0.83 native host.
- Packages emit `dist/` with declarations and platform conditions; every
  export targets `dist` (checked by `tooling/verify-packages.mjs`).

### Component API

Every reusable component supplies accessibility semantics and supported slots:

```tsx
<Button
  title="Start lesson"
  className="rounded-none border-[3px] border-ink-950 shadow-card bg-primary"
  labelClassName="text-on-primary font-display"
  onPress={start}
/>
<Card className="rounded-2xl border-0 bg-surface-raised shadow-none">
  ...
</Card>
```

Default Tailwind utility classes and consumer utility classes have equal
specificity: appending `className` does **not** guarantee that a new
`rounded-none` overrides `rounded-control` in generated CSS. Components
therefore expose **`unstyled`** for apps that want a completely different
visual recipe; the app supplies full classes while the component retains
event and accessibility behavior. Native OS controls still accept only
the resources/properties supported by their adapters.

Uniwind/native implementations resolve utilities through the application's
registered theme. App-specific class variants override default presentation
while event handlers/state semantics stay intact. Never use Tailwind class
merging that silently discards an app-defined text size utility.

**Native OS components are different:** WinUI NavigationView, AppKit popups,
SwiftUI pickers and Compose menus require explicit theme-resource adapters for
values supported by the OS. It is not accurate to promise that arbitrary
`clip-path`, CSS filters, shadows and transitions restyle OS controls.

### Platform shell and geometry

| Runtime | Navigation behavior | Target adapter |
| --- | --- | --- |
| Ordinary native phone | Existing authored bottom tabs | React Native / Expo Router |
| Android foldable / dual-screen, including folded cover | Physical RIGHT rail even RTL | Expo Modules 2/WindowManager |
| Native tablet / headset | Physical RIGHT rail | Existing product bridge / Viro |
| Windows desktop | LEFT auto/collapsible drawer | WinUI NavigationView / Fluent |
| macOS desktop | Sidebar, resize/keyboard support | AppKit through Spark |
| Web | Persistent header, compact bottom tabs, no native side rail | Semantic RN-web |
| XR scene | World/head/hand/app panels in meters | Viro / visionOS / Meta/PICO |

`@nyc-tron/core/navigation` declares policy; app or native bridge verifies
hardware identity. `@nyc-tron/core/folds` calculates usable logical
regions from actual reported features without inventing hinge geometry.
`@nyc-tron/core/spatial` validates panel specs; it does not spawn native XR
windows. Master/Detail/Inspector retains each consumer's existing layout owner.

Navigation position and content pane count are independent: a narrow
foldable still has its physical-right navigation rail, while actual content
may collapse to one pane. Preserve active tutor/call/player/editor state across
layout transition using the product's existing Zustand store or engine session.

### Migration order

1. Publish stable base contracts and per-component exports with test coverage.
2. Review and extract existing NYC-MON components one by one (preserve license
   notices), with theme decoupling and before/after snapshots.
3. Migrate Forge reusable controls out of its private `studio-ui` provider
   into this `components/forge` tree; leave stateful document engines in
   `@nitro-forge/*` and keep adapters during transition.
4. Implement native WinUI/AppKit/SwiftUI/Compose adapters separately,
   including native menus, dropdowns, drawers and focus.
5. Validate two genuinely different consumer themes (Moyo and NYC-MON),
   screen reader/RTL/reduced-motion, physical foldable and native desktops.
6. Release signed package builds with semver, npm provenance, source maps and
   screenshots. Do not remove consuming app controls until replacements pass.

## No false platform claims

The only presentational implementations initially authored are RN Views and
select Expo 58 @expo/ui controls; no native WinUI NavigationView is included.
Windows preview and Spark macOS integration require their own adapters before
they can be marked implemented. See ROSTER.
