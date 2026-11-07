# P04 native overlay checkpoint

The same recorded 28-step scenario passed unchanged twice on iOS (21.0s, 15.2s) and Android (58.8s, 54.1s). Each first pass used fresh device-scoped Argent services. The native consumer imports the public Expo menu/popover exports, resolves the native variants and mounts FocusAndA11yLayer. These are actual SwiftUI menu/popover and Compose menu surfaces hosting the controlled React Native content.

| Contract | Hard evidence |
| --- | --- |
| Deterministic baseline | Launch, Search assets, Native action menu section and empty event list |
| Native OS menu | Rename layer and Locked action visible |
| Exactly one menu action | events is exactly menu:rename after Rename layer |
| Correct popover consumer | Native popover section after selecting Popover |
| Native popover content | Native layer properties visible |
| Exactly one apply and close | Content hidden, events exactly menu:rename and popover:apply, open:false |

Every screen transition has an identity gate and idle readiness. The finished YAML uses semantic text/IDs, including a scoped Select list, with no coordinate targets, fixed sleeps, hardware IDs or positional selectors. The first walkthrough recorded actions and checks; the dead-transport recovery and failed initial wait remain in task artifacts and do not count as acceptance. [Full proof](P04-native-overlays-proof.json) preserves both platform outputs and limitations.

The iOS native menu and popover were visually inspected on the foldable cover. The 260-point popover fits inside the 382-point usable pane, and the OS menu shows the disabled action subdued. Android's two runs establish the named native UI and callback/close behavior; they do not constitute a separate screenshot geometry assertion. iOS retained small-region-change warnings at native dismissal/presentation. The runner does not identify the moving region; loaded controls and exact callback state passed and no loading indicator was observed. Android had no idle warnings in these two runs. Its APK had previously been speed-compiled after an ART issue, so startup timings do not prove unoptimized cold performance.

The preference layer loaded native reduce-motion, screen-reader and contrast values. No screen-reader speech, hardware shortcut delivery, physical-device accessibility, desktop/headset behavior or complete eight-platform acceptance is claimed. Implementation review remains all 30 P04 components / 90 of 341 overall. The program proceeds to P05 canvas/layers.
