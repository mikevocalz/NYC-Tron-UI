---
name: "FrameThrottleModule"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/forge/frame-throttle"
tier: 2
docs: "generated"
platforms: []
category: "forge"
tokens: []
registryDependencies: []
a11yStatus: "unverified"
---

# FrameThrottleModule

## Purpose

<!-- generated:begin purpose source=packages/ui/src/components/forge/frame-throttle.ts -->
Scheduler pair for {@linkcode createFrameThrottle}; defaults to `requestAnimationFrame`.
<!-- generated:end purpose -->

## Install

<!-- generated:begin install source=docs/api-signatures.json,packages/ui/package.json,packages/ui/src/components/forge/frame-throttle.ts -->
- Package: @nyc-tron/ui
- Import: `import { animationFrameScheduler, createFrameThrottle } from "@nyc-tron/ui/components/forge/frame-throttle";`
- Peers: react, react-native
- Requires: none

```sh
npx shadcn@latest add @nyc-tron/forge/frame-throttle
```
<!-- generated:end install -->

## Props

<!-- generated:begin props source=docs/api-signatures.json,packages/ui/src/components/forge/frame-throttle.ts -->
No component props. This module exports functions, types or constants.

### Exports

| Name | Kind | Signature |
|---|---|---|
| `FrameScheduler` | interface | `interface FrameScheduler { request(callback: () => void): unknown; cancel(handle: unknown): void; }` |
| `FrameThrottle` | interface | `interface FrameThrottle<T> { push(value: T): void; flush(): void; cancel(): void; readonly pending: boolean; }` |
| `animationFrameScheduler` | function | `function animationFrameScheduler(): FrameScheduler;` |
| `createFrameThrottle` | function | `function createFrameThrottle<T>(deliver: (value: T) => void, scheduler?: FrameScheduler): FrameThrottle<T>;` |
<!-- generated:end props -->

## Variants

<!-- generated:begin variants source=docs/api-signatures.json -->
none
<!-- generated:end variants -->

## States

<!-- generated:begin states source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end states -->

## A11y

<!-- generated:begin a11y source=packages/ui/src/components/forge/frame-throttle.ts -->
_Not documented._
<!-- generated:end a11y -->

## Example

<!-- generated:begin example source=docs/api-signatures.json -->
_Not documented._
<!-- generated:end example -->

## Do/Don't

<!-- generated:begin dont source=docs/agent-native/doc-template.md -->
_Not documented._
<!-- generated:end dont -->
