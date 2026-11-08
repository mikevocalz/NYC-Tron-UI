# M1-a macOS spike scaffolding

Throwaway spike artifacts for `docs/completion/M1a-macos-spike.md`. Not part
of any package; nothing here is imported by product code.

- `AppKitProof.swift` — standalone `swiftc` AppKit proof (real NSWindow /
  NSSegmentedControl / NSButton on screen, captured via `screencapture -l`).
- `evidence/` — run log and WindowServer captures from the spike session
  (AppKit proof window; Spark Runner dev window before/after a
  `SegmentedControl` Fast Refresh update).
