# T2 transport compatibility follow-up

Source revision: `a881183500aed20c89cedcf9be200d06dbf5dc7f`.
Recorded 2026-11-13. This is a local Node contract-test result, not native or
browser acceptance. No component acceptance or owner-approval record changed.

## Reproduce and diagnose

The transport regression uses the `observed` and `fixture` implementation from
`v1.0.0-rc.1`'s `isolated-tests/window-controller.test.mjs`, blob
`4fe8ddd33258254b78e4eb06f6df6fd16e1a2dc6`. Its wire reports omit `titleBar` and
its transport has no `setTitleBar`. The copied fixture keeps those reports
unchanged. On the previous source at `69a0c13`, connection rejected with
`Invalid native window observation: main (open) title bar null`.

The optional transport method alone did not preserve compatibility: the parser
required the new snapshot field before the host could return its unsupported
customization error. The earlier test removed the method from a new-format
fixture and therefore missed the connection failure.

## Contract and fix

`WindowsDesktopTransport.setTitleBar` stays optional. A host connected without
that method accepts an absent `titleBar` as the standard system frame, with
zero content insets. It rejects customization as unsupported without changing
the window. This compatibility choice is captured once per connection and
applies to connection events, commands and layout restoration. A modern
transport must still report its title bar; malformed present values and invalid
geometry still reject. The parser's compatibility argument is internal to the
package and is not a public package export.

Examples exercised by the regression:

```ts
const host = await connectWindowsWindowHost(rc1Transport, options);
await host.minimize("main");
await host.restore("main");
try { await host.setTitleBar("main", "extended"); }
catch (error) { /* unsupported; the existing window is unchanged */ }
await host.dispose();
```

`WindowTitleBar` now keeps its close-veto announcement flag in a vanilla
Zustand store memoized per controller instance and subscribes with a selector.
The store contains only a boolean. The controller remains outside serialized
state. This replaces the shared WeakMap/listener store and changes no visual
geometry, app window dimensions, native resource ownership or public signature.

## Executed check

Node `v26.13.0`: **44 passed, 0 failed, 0 skipped**. Original output is in
[`node-tests.log`](node-tests.log).

To stay within the disk floor, no dependencies were installed. Node's
`stripTypeScriptTypes` generated temporary, ignored `dist/*.js` for core's
`window-lifecycle`, `window-chrome` and `folds`, and the Windows package's
`window-controller`, `window-protocol`, `native-drag-controller`,
`navigation-binding` and `window-chrome`. Relative `.ts` extensions were
rewritten to `.js`; a local `node_modules/@nyc-tron/core` symlink resolved the
existing package manifest. These emitted files were not committed and this
step is not TypeScript type checking.

```sh
node --test \
  packages/windows-fluent/rnw-fabric/isolated-tests/window-controller.test.mjs \
  packages/windows-fluent/rnw-fabric/isolated-tests/window-chrome.test.mjs \
  packages/core/tests/window-chrome.test.mjs
```

The regression exercises early connection events, open, move, focus, minimize,
restore, layout replay, refresh, streamed snapshots, close veto/proceed and
subscription cleanup with the unchanged rc.1 wire format. It also checks
unsupported customization leaves the snapshot untouched, returned defaults
are frozen, malformed legacy reports reject, and modern omissions reject.

## Skills and validation limits

Read: pinned NYC-MON foldable-layout skill (`d60f539b`), NYC-MON no-ai-slop,
Margelo api-design, React Native best practices and `EXACT_NATIVE_FEEL.md`.
API-design output is the contract and example above; the existing controller,
registry and protocol validator remain the owners. Navigation and pane policies
are unchanged. Official Zustand `src/react.ts` and `src/vanilla.ts` were checked
for `useStore` selectors and vanilla `createStore` semantics.

No native code, dependency, native module spec or workflow changed, so no
generator or native ownership change was required. No optimization was made
and no performance measurement is claimed. The `engineering:debug` skill was
not available in this environment; the reproduction, diagnosis and result are
recorded directly above.

NOT RUN locally: TypeScript build/typecheck, API snapshot checks, mounted
browser announcement behavior, native compilation, simulator interaction and
hardware accessibility. The normal CI jobs must pass at the pushed head, and
R1 must review that head independently before merge.
