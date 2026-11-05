# NYC-Tron UI workstream roster and handoff

Custom GitHub Copilot agent profiles are installed in
`.github/agents/`: `nyc-tron-native-platform`,
`nyc-tron-foldable-spatial`, `nyc-tron-component-system`.
These are **role definitions**, not evidence that an external agent
was assigned or completed a task. A reviewer or issue assignee must
explicitly launch a supported GitHub agent session before calling it
active. This ChatGPT session has no standalone subagent-spawn tool.

## Shared implementation boundaries

| Lane | Owns | Does not own | Evidence required |
| --- | --- | --- | --- |
| Native platform | WinUI/AppKit/SwiftUI/Compose renderer and native a11y | App routes, product colors, Rust editor engine | Actual native build, focused keyboard/screen reader tests |
| Foldable/spatial | Normalized usable geometry, pane/inspector lifecycles, actual XR panel contracts | Hardcoded screen widths, duplicate maps or game sessions | Geometry tests + Surface Duo/headset runtime |
| Component extraction | Generic and Forge components, themed slots, package exports | Tally/Cadence/Prism documents, a new theme for every app | TypeScript, source, package, consumer tests |

## Source branch status

- NYC-Tron PR #1: base independent themeable UI and Forge controls.
- NYC-Tron PR #2: specialized professional controls and spatial graph.
- NYC-Tron PR #3: InFraX theme preset, stacked on #2.
- NYC-Tron PR #8: Expo SwiftUI/Compose ArcKnob/XYPad, stacked on #2.
- NYC-Tron PR #9: this new adaptive pane and collapsible drawer work,
  stacked on #1 for modular review. **RN drawer is not WinUI 3**.
- Nitro Forge PR #38: single-source UI ownership contract.
- Nitro Forge PR #39: Tally Rust/NYC-Tron grid adapter.

## Next native acceptance

The portable NavigationDrawer can be adopted after app-level screenshots
and native parity review; Windows requires a distinct RNW+WinUI 3 Fabric
native component package with a verified compatible host. RNW 0.85
targets RN 0.85, versus the Expo 58 mobile package's RN 0.88.
No silent peer upgrades or Vercel deployment.

## Source references

- https://microsoft.github.io/react-native-windows/docs/native-platform-components/
- https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/navigationview
- https://devblogs.microsoft.com/react-native/react-native-windows-v0-85-is-here/
- Original foldable skill: `mikevocalz/nyc-mon/skills/mikevocalz-foldable-layouts/SKILL.md`.
