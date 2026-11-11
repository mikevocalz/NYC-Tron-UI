# Native motion checkpoint

The standalone consumer now measures its motion panes and reserves space for controls and state evidence. Browser-only test-provider buttons no longer consume native pane height. Composition, effect, graph and path examples adapt their list/canvas height to the measured pane. The expression editor separates source, completions, references and diagnostics into bounded panes and keeps Validate/Apply actions reachable. Native text uses theme foregrounds.

The editor exposes Done editing while its native input is focused. An Android regression showed that native blur could close the keyboard while leaving the transient Done state visible. The command now clears focused/caret-request state and blurs its native handle. The recorded keyboard fragment verifies that Done disappears and the source remains unchanged on both platforms. It requires a fresh expression scenario before each invocation.

Select derives a stable list test id from its supplied trigger test id. The consumer uses motion-component and motion-component-list so a semantic scroll-to can scope Graph/Expression to the visible menu frame. This prevents targeting clipped options at the coordinates of underlying controls. No raw points or scroll swipes remain in the saved tests.

| Scenario | Contract | iOS consecutive passes | Android consecutive passes |
| --- | --- | --- | --- |
| Typed graph, 33 steps | Restart baseline; connect time/out to scale/in once; reject duplicate without another commit | 24.9s, 17.8s | 46.3s, 55.1s |
| Expression, 31 steps | Restart baseline; complete ti to time; validate; apply exactly once | 25.9s, 18.9s | 23.4s, 22.4s |
| Keyboard fragment, 11 steps | Return to Source, dismiss editing, retain time, restore Diagnostics | One replay, 4.4s | One replay, 6.3s |

Both standalone scenarios start with launch, establish their in-memory baseline and gate screen transitions with identity/readiness checks. Fresh Argent services were scoped to the tested device before pass 1. The first walkthroughs recorded actions and live checks; the graph's failed identifier check was replaced by the successful recorded label check. Final semantic replays passed unchanged. Original takes remain outside Git in task artifacts. Full outputs, idle warnings and the Android failure before its fix are in [the proof](P11-native-motion-proof.json).

Some idle gates retained small-region-change warnings, especially while the source input was focused; all explicit loaded-text, document, completion and diagnostic checks passed. Android graph pass 2 also had two warnings whose moving region was not separately classified. Post-run inspection showed the loaded graph UI. These runs are not described as warning-free. The task-owned Android APK had previously been speed-compiled after an emulator ART startup issue; unoptimized cold startup remains open.

Verification passed 801 source tests, workspace builds/types/export checks, the 66-row implementation ledger and all 13 validation packs. All 28 affected browser checks passed after the layout/theme changes; the full 542-check suite passed at the motion implementation checkpoint. The final UI validation pack SHA-256 is 43f2b0a1bae25c5e518c3cd17225ad788047c189e5cb5eb6080e0c017297ae19. It is a local validation artifact.

The app's orientation remains default, its established window contract is unchanged, and its reserved-region owner still determines the usable pane. This proves the named controlled native UI paths against fixture providers. All-platform acceptance, physical accessibility/narration, processing engines and the full 341-component program remain open.
