# AppKit helper: rendered-overlay fixture now passes

The exact existing core overlay alias correction passed this helper's rendered-browser lane. [Run 42938339031](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42938339031), job 130253832511, completed successfully with **32 browser tests passed**.

The complete original log identifies actual PR merge `6d6b913c771e49385e5a57c9737b66fbeb07a9a7`, for helper `f157c9bf207f8ceae890e299f9667b56ab78360d`, tree `ac12abeb27d91dcb978492d9aad187c4f198e3b5`. Root and the independent reviewer verified the actual merge's tree and ordered parents, the complete helper tree and the two approved changed paths.

The alias fix is the exact already-reviewed blob `2687299e55689f6fca67d7a8904eb85923d2aaa9` in `packages/expo-controls/tests/browser/server.mjs`. It adds the `@nyc-tron/core/overlays` source alias. Removing its 77-byte line restores the complete preimage. This closes the helper's observed fixture bundling gap from the [3891 failure](../v1-web-3891ee1-overlay-alias-failure/README.md).

The original decoded browser log is retained unchanged: **43,807 UTF-8 bytes**, SHA256 `c54772dea9715a69dbc2968d5d744adc3f2fc375dee8742ce75c5ec1bdbcfdb4`, Git blob `fe15b4c6867c827f84da704092c3123d966bb47b`. Root and the independent reviewer separately retrieved matching complete strings and byte/hash identities.

Artifact 13820060342 reports **280,598 bytes**, SHA256 `b36366551fa4560ab142a2961c3033123b996e6e25a8462dde8b8c9e164c6926`. The original ZIP and PNG members remain unextracted/unviewed; reported artifact identity is distinct from independent byte or visual verification.

This is a rendered-browser result for the exact helper checkout. Native AppKit tooltip/drag acceptance is a separate run and is not established here. Final combined-candidate validation, physical-device evidence and owner-approved distribution remain separate.
