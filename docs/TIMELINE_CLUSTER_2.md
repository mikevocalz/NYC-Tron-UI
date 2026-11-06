# Timeline cluster 2 — local source completion

This branch extends the alpha.3 source with ten controlled timeline controls and ModeEdgeHandles. Each component/model has an independent package export. No new release was published, and alpha.3 consumers still use the existing release.

The cluster covers shuttle intent, stored loop ranges, track flags/rename/reorder, slip/slide/roll/ripple, insert/overwrite placement, transitions, markers, grouped track stacks, transition presets and batch edits. Selection, playhead, playback, looping and undo ownership stay with the consuming host. Track effects, decoding, video compositing, rendered transition previews and keyframed speed remain outside this cluster.

Track and marker text commits are deduplicated while the host response is pending. Enter followed by blur cannot create duplicate engine writes; Escape discards a marker draft. The shuttle clears a held K when focus leaves. Compact track settings keep the timeline usable at phone width without changing application navigation or window configuration.

## Verification

- `pnpm test`: 544 source/model/render tests pass.
- `pnpm build` and `pnpm typecheck`: all workspace packages pass.
- `node tooling/verify-packages.mjs`: 275 conditional exports and 357 ESM files checked.
- `node tooling/pack-release.mjs <local-output-directory>`: all 13 local package tarballs pass packing checks. These are unpublished artifacts based on the alpha.3 version labels, not new published alpha.3 assets.
- `npm test` in `packages/ui/tests/browser`: all 254 Chromium checks pass. The new cluster has nine interaction tests and five capture cases producing 13 captures.
- Reviewed light/dark phone/tablet resting, roll/marker and cut/reorder captures plus RTL. They are under `packages/ui/tests/browser/shots/timeline2-*.png`. No page overflow was found in LTR/RTL compact settings tests.
- Forge's separate source contract checks the actual built declarations for track headers/stack, edit modes, transitions/presets, markers, loops and batches. Its 25 Splice tests run real Rust via nf-cli, including bound callback ownership and rejection atomicity.

The browser host is a Zustand engine stand-in. It is not a native player or Rust execution. Native compilation, device, keyboard hardware, VoiceOver/TalkBack and foldable acceptance were not performed for this phase. No navigation, orientation, manifest or app-window contracts changed.

Guidance reused: the repository AGENTS.md, NYC-MON's pinned mikevocalz-foldable-layouts skill, existing timeline models, value gestures and pointer cancellation, canonical SegmentedControl/Button/TextField, and source license notices.
