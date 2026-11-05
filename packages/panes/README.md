# @nyc-tron/panes

Independent, themeable Master/Detail/Inspector host, using
`@nyc-tron/core/pane-plan`. The host preserves mounted child identities
during window resizing, fold/unfold and inspector overlays; it does not own
Expo Router, selected records or media/call/XR sessions.

**Hardware features:** always supply `container` as the actual measured
pane host in window-relative logical units when passing native `features`.
Do not pass the app's whole display bounds to a nested pane.
Features are reported, never guessed. Multiple hinges and zero-width
separating folds are handled by `@nyc-tron/core/folds`.

**Regions from the device:** pass `regions` from `useReservedRegions()` in
`@nyc-tron/reserved-regions` instead of `features`. Division regions become
fold features, and a half-opened separating fold sets `posture` (tabletop or
book) unless you pass `posture`. Camera occlusion regions stay out unless
`includeOcclusions` is set. This package does not import the hook, so a pane
host with no native fold module installs nothing native:

```tsx
import { useReservedRegions } from "@nyc-tron/reserved-regions";

const regions = useReservedRegions();
<AdaptivePaneHost {...panes} container={actualMeasuredPaneWindowRect} regions={regions} />
```

**Navigation:** this is a content-pane package, not a shell. An Android
foldable/tablet/headset keeps its physical-right navigation rail even if
this host renders only one content pane; Windows may use a left native
NavigationView; web has its existing header and compact bottom tabs.

```tsx
import { AdaptivePaneHost } from "@nyc-tron/panes/AdaptivePaneHost";

<AdaptivePaneHost
  master={<LessonList />}
  detail={<LessonDetail />}
  inspector={<LessonInspector />}
  masterConfig={{present:true,minWidth:220,preferredWidth:320}}
  detailConfig={{minWidth:440}}
  inspectorConfig={{minWidth:240,preferredWidth:310}}
  inspectorOpen={inspectorOpen}
  masterOpenOnCompact={showMaster}
  onDismissMaster={hideMaster}
  onDismissInspector={hideInspector}
  container={actualMeasuredPaneWindowRect}
  features={reportedWindowFeatures}
/>
```

**Production gates:** app-level keyboard/focus overlay behavior, native
Android/iOS/Windows/macOS compilation, Surface Duo hardware book/tabletop
and RTL acceptance, and actual XR rendering remain unverified.
