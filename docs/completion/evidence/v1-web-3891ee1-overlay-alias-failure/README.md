# AppKit helper: rendered-overlay fixture alias failure

The rendered-overlay workflow at helper `3891ee1788e6722c922ef431c576f507c5591f60` failed while bundling its browser fixture, before browser assertions. The original log identifies actual checkout `8cf0e6fd70c9984c471560e432783e0881f0f63d`.

[Run 42932762692](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42932762692), job 130235313805, reports `Could not resolve "@nyc-tron/core/overlays"` from the UI popover-position module. The isolated browser server source lacks the source alias for that already-existing module. The completed artifact response is empty.

The exact existing correction is a single source-alias line in `packages/expo-controls/tests/browser/server.mjs`:

```js
    "@nyc-tron/core/overlays":resolve(here,"../../../core/src/overlays.ts"),
```

The current helper blob is `4fdde0ddb7c1a3befdc00dc89038d4ea9af7d606`; the existing corrected blob is `2687299e55689f6fca67d7a8904eb85923d2aaa9`. Removing the exact 77-byte added line restores all preimage bytes. The target source exists in the helper tree as blob `00421bd97f041ce69a7b7071a1ba7810d5e68a48`. Root and the independent reviewer verified both complete blobs and digests.

That same corrected server blob is already present in aggregate `65ac627f843fdbc365d7badb5adb4a3e6061c308` and previously passed rendered acceptance on the separately recorded Windows helper revisions. This receipt does not transfer those passes to the failed Mac helper or to a final combined candidate. The exact backport is ready for a subsequent source change; its actual rendered result is recorded separately.

The complete original decoded job log is retained unchanged: **41,617 UTF-8 bytes**, SHA256 `40d6e98a8143fc0c7090d07798fa3c8d25477283be51fe7a3c5a40cbb7efda9b`, Git blob `7cc778dae3bb1186df9da5bc5f2551a60fba1711`. This fixture failure is separate from the [native tooltip-hover conjunction failure](../v1-appkit-3891ee1-tooltip-hover-failure/README.md). It establishes no native tooltip cause or complete desktop acceptance.
