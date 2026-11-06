# Standalone native library interaction contract

App: com.nyctron.instruments.example, library acceptance entry on Expo 58 / React Native 0.88.1. All data is deterministic and in memory; restarting resets the consumer. No production account or document is changed.

| Baseline/action | Required evidence | State effect |
| --- | --- | --- |
| Restart into shell Assets | Search assets visible; controlled text and cursor baseline | New independent demo store |
| Select History then Undo | History-only controls visible; consumer cursor changes from 2 to 1 | Host applies stored snapshot |
| Redo | Cursor returns to 2 | Host restores final snapshot |
| Open Find | Find text and replacement fields visible in native anchored surface | No document edit |
| Replace all with literal text | Host document changes and search results reconcile | One controlled revision change |
| Cancel/dismiss popover | Find trigger remains reachable | No extra edit |

Record native interaction separately on each OS. Browser shared-consumer checks are supporting evidence, not a native verdict. An automation transport failure is an unexecuted action, not a component pass or failure. Required physical devices and other hosts remain unverified.

## Executed checkpoint — November 6, 2026

Both standalone native builds passed: Android API 36 arm64 debug and iOS 27.1 simulator debug. Expo 58.0.23 / React Native 0.88.1 are unchanged. The generated Android manifest retains unspecified orientation and the NYC-Tron FileProvider authority. App configuration still declares `orientation: default`.

The shared browser consumers passed all 25 shell/color checks. Workspace verification passed 754 source tests, builds, type checks, independent exports and all 13 tarballs.

Two iOS regressions each passed twice unchanged. History exercised cursor 2 → 1 → 2 → 0. Native Find exercised the SwiftUI anchored surface, keyboard input, literal `$&` replacement, zero-result reconciliation, closing, and retention of the changed host document. Each first pass began with device-scoped fresh Argent services. The final files use semantic selectors; the Find input-value check deliberately retains the recorded AXRuntime tool because UIKit exposes its editable value there while the projected UIView text omits it. No coordinate fallbacks remain. Captured runner output is in `P19-native-proof.json`.

Run the example with `NYC_TRON_ACCEPTANCE=library pnpm --dir examples/native-instruments start --port 8081 --localhost`, then use Argent to run `.argent/e2e/qa-tron-shell-history-ios-v2.yaml` and `.argent/e2e/qa-tron-native-find-ios.yaml` against the installed app. Ordinary startup continues to load App.tsx. Metro's acceptance rewrite resolves the app entry relative to Expo's monorepo server root.

Local CocoaPods installations lacked `cocoapods/target/pod_target`; a task-isolated clean 1.17.0 copy restored dependency installation. No native source workaround or SDK downgrade was needed.

Android installed and requested its library bundle, but package-manager commands subsequently exceeded the automation timeout. Its History attempt failed at activity resolution before any behavior assertion, and a task-emulator restart was initiated. Android interaction acceptance remains open. No physical-device, VoiceOver/TalkBack narration, Windows/macOS, visionOS, Quest or PICO acceptance is inferred from this checkpoint.
