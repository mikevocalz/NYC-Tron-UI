# External AppKit ddeb2be pass and subsequent 129bd080 port

The external [AppKit workflow 43017672560, attempt 1](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/43017672560/attempts/1) completed successfully. Its complete original native log reports **18 acceptance checks passed** at actual merge `e074a8bbb133457942b28883b196d581910250ce`. This is historical external evidence; it is not acceptance of the later umbrella port or the reviewed combined candidate.

## Exact source and port

The executed head was `ddeb2be0e07c98183d7aafb1d2a5737207ff0803`, tree `a6001b036034289e94a3ad47708cb8fb0a442283`. Both complete originals print checkout `e074a8bbb133457942b28883b196d581910250ce`; the merge's ordered parents are `ac5d69585a52a6e945dc996ea08030e190574699`, then that external head.

The subsequent port is `129bd0802535ffbe485d0342f948365927082058`, tree `6d3a7bc19629019596cd888b50d20a936b32f5ee`, with sole parent `ac5d69585a52a6e945dc996ea08030e190574699`. Full untruncated tree maps and every directory Git hash were independently checked. Relative to the parent, it changes **31 paths: 13 replacements and 18 additions**, all in the AppKit workflow, API snapshot, example, package or tooling. The other 2,019 parent leaves are unchanged. The target has 2,050 leaves and 284 directories.

[changed-paths.json](changed-paths.json) retains all exact before/after blob IDs and modes. The target equals the executed external tree in every leaf except `packages/expo-controls/tests/browser/server.mjs`: the port preserves base `c2be5512...` while the external branch uses `2687299e...`. The AppKit source itself is byte-identical across those two trees. This does not make their complete trees or workflow results interchangeable.

## Concrete changes relative to reviewed 9a

The production popover blob `a00a810e5c6da2b440a20facd13eae50284647af` differs from reviewed 9a's `9e00e3d966569b5fc2c03dac2432fdfe67548177`. It tries the preferred and opposite vertical edges followed by both horizontal edges, retaining the first whose actual native window frame is contained in the allowed region. A shown popover starts with its previous successful edge. If no candidate fits, the existing rejection path remains. The source also removes previous notification/log diagnostics. The original pass summary does not identify which edge was selected.

External driver `173fb70c01aec0237dafc23d425a6019c00583d9` adds repeated key/activation requests after the existing workspace activation path: up to 20 checks, 50 ms apart, requiring three consecutive visible/key/active holds. This changes fixture actions; it is not solely a diagnostic.

External verifier `f21e9349b35922ad689a2f6320ed651b5557de64` lacks the newer `closeObservation` witness. Its driver uses the older inline private tooltip ivar collection rather than the separately scoped collector in reviewed 9a. The external comment's broad claim that no public accessibility text attribute exists is not independently established here. These differences prevent transferring the external pass to the current, stronger reviewed evidence contract.

## What the originals establish

The source job passed 13 checks. Native preparation passed 16 package tests, the 1-package/15-subpath/33-declaration API snapshot and seven native Foundation/socketpair cases. The native build envelope reports exit 0; the runtime original then reports 18 passed checks and tested archive SHA256 `e3cc82943d01e6b8c6109d78bbbd1ea2bc5c442a93c596e3236b757ca07a9888`.

Source review confirms that this verifier emits its pass summary only after the required CGEvent tooltip-hover and NSDraggingSession/cross-window-transfer gates return passed. That is a control-flow inference supported by the inspected executed source. The raw per-check/permission/session JSON, exact geometry, screenshots and archive members were not inspected.

This folder retains the complete source and native originals, normalized completed metadata, exact 31-path map, the derived original build JSON line and a provenance index. The build transcript's 12,329,950-byte size and SHA256 are producer reports; its contents were not inspected. The evidence/tested/shared ZIP digests and uploader file counts are likewise producer/API metadata.

No historical failure cause, physical-input/hardware, full eight-platform, final fifteen-archive or owner approval follows from this receipt. No source/ref/PR/workflow/host change or rerun was performed. Future narrow reconciliation and current-source validation remain separate.
