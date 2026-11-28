# Contributing

Add a component, its documentation and evidence in one reviewable change.

## Extend the existing owner

Read AGENTS.md, the public API snapshots and existing component before adding another abstraction. Reusable UI belongs in NYC-Tron; document engines remain in their owning applications. Never import @nitro-forge into Tron.

Use Zustand for component/app state and refs for resources. Keep app-owned semantic tokens and existing platform/window contracts.

## Update the inventory and docs

Add or update the independent package subpath, declarations, meaningful tests, component example and accessibility notes. Regenerate snapshots only while reviewing the API diff. Every public symbol must be classified; a new component must enter the manifest and docs.

Propose a stability label with a reason; the owner confirms it. A stable target needs unit/model, rendered web, installed-tarball iOS/Android, static accessibility and documentation evidence. Do not mark an unrun check passed.

```sh
pnpm build
node tooling/api-surface.mjs
node tooling/api-signatures.mjs
node tooling/library-components.mjs --write
npm --prefix website ci
npm --prefix website run build
npm --prefix website test
```

## Review

Open a draft PR with skill outputs, actual command/CI evidence and independent reviewer findings. Preserve licenses and dated proof. Do not merge or mark ready on the owner’s behalf.
