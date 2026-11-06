# Native infrastructure integration

The canonical SegmentedControl now supports app-authored native segment and label
styles without CSS interop. Its native layout and 44pt minimum targets no longer
depend on classes. Existing radio semantics and web keyboard behavior remain.
The hardware-key package now ships a SwiftPM manifest preserving its iOS 16.4
floor and module identity; a packaging regression guards that contract.

Document restoration now checks the provider resource, not just its retained
access metadata. Android opens/closes an asset descriptor on Dispatchers.IO and
returns no access for missing, inaccessible or invalid content URIs. iOS checks
file reachability off the main actor and releases its acquired scope on failure.
Official API contracts: [Android ContentResolver](https://developer.android.com/reference/android/content/ContentResolver),
[Foundation URL reachability](https://developer.apple.com/documentation/foundation/url/checkresourceisreachable%28%29).

Forge's native consumer exercises these exact source changes through persisted
patches on alpha.4 tarballs. Fresh iOS/Android native builds pass, including
hardware-key linkage. Injected OS F6/F7/F8 events drive real Rust gain edits,
undo and redo on both simulators. This is simulator key injection, not physical
keyboard proof. Native consent controls enable local tracing and clear it on Off.
iOS explicitly exports a ten-event JSON trace through Save to Files; no automatic
diagnostic sink is enabled. Native missing-file acceptance on both platforms
deletes only a generated fixture and confirms no restored access is returned.

Validation: UI build/types and seven Chromium form cases passed; 727 source tests
passed for the shared UI/manifest change and all 25 platform-service regressions
passed after the provider fix. Swift manifest parsing and real consumer native
compilation passed. Expo-generated manifests retain the original window and
orientation contract; no navigation or XR app configuration was changed.

Captured runtime evidence and binary provenance belong to the companion Forge
completion program, PR63. Physical devices, screen readers and the complete
required host matrix remain separate acceptance gates.
