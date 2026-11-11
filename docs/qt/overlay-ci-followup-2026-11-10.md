# Isolated web overlay resolver follow-up

The rendered web overlay workflow on source
`eb1f473d910b0b13854778e60c6e7c41b41ff228` failed before starting any browser
test. [Run 42850172757, job 129948366297](https://github.com/mikevocalz/NYC-Tron-UI/actions/runs/42850172757/job/129948366297)
checked out the PR merge `34ed0569e54b2dee4ba8f7eacef402a86c647ee7` and
reported `Could not resolve "@nyc-tron/core/overlays"` from the UI's
`popover-position.ts`. Its web server exited during esbuild startup. No test
trace or screenshot artifact was produced.

The merged base moved the shared popup geometry into the public core
`./overlays` export. The isolated browser fixture already maps UI imports to
their source, but did not resolve this new core dependency. Its server now maps
that exact public subpath to the actual `packages/core/src/overlays.ts` file.
It bundles the same implementation used by the package; it does not mock the
geometry or leave the import external.

## Verification

A clean copy of the tracked fixture and component sources, with only the
fixture's locked 32 npm dependencies installed, reproduced the original
esbuild failure. With the resolver change, the unchanged server built without
warnings and served both the document and bundle with HTTP 200. The bundle
contains the real core geometry source and has no unresolved core import.

- Local verification used Node 24.22.1; the failed hosted job used Node 24.19.0.
- Bundle size: 1,598,510 bytes.
- Bundle SHA-256: `406c71eda9d4bcfc4a489c742fcace389394a18ca6eab5a5a12c12765c6671a3`.
- Playwright still discovers all 32 existing cases in the two unchanged specs.
- Browser interaction and screenshot acceptance await the hosted run of this
  correction. The local checks establish fixture startup and resolution only.

The correction changes no package implementation, packed artifact, assertion,
visual threshold, workflow, or workflow filter. The packaged Qt/Fabric host
receipts remain bound to the executed `eb1f473` source and archive cohort.
