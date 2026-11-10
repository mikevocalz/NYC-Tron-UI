# Qt, React Native and Forge integration

The 341-capability roster already has 332 local implementations and nine pinned
external providers. Reuse those public controls through the RN Qt renderer.
NYC-Tron owns reusable UI; Nitro Forge owns its separately installed engines and
typed adapters. A Qt counterpart is a useful API comparison, not permission to
duplicate either owner.

[The complete component map](component-coverage.md) lists every canonical ID,
its public entry, a Qt counterpart profile, target-selected dependencies and
missing named React Native APIs. [The JSON report](component-coverage.json)
also includes the selected source files, transitive local import paths and
external revisions. It preserves the original roster and its eight-platform
acceptance ledger. QNX and Marathon are assessed separately here.

The [reviewed RN profile](react-native-api.json) pins published commit
`404ad9dab676ce876e8a3e367743111b7d605417` and its 30 named exports. Both target
graphs now classify 282 capabilities as shared-source candidates, 50 as
requiring additional providers and nine as pinned external providers. No
missing named RN imports remain in the selected graphs. Method behavior and
native provider availability still require their own checks.

## What the Qt path uses

The RN-QNX backend supplies the existing Qt Quick/Fabric renderer. Generic
React Native controls such as `View`, `Text`, `Pressable`, `TextInput`, lists,
images and scroll containers remain the public component vocabulary. Complex
editors compose those primitives and call their engine/application interfaces.
The named Qt types in this report describe comparable controls or building
blocks; the report does not assert that an RN `SliderField` creates a QML
`Slider`, or that a spreadsheet control contains a formula engine.

The `@nyc-tron/expo-controls` QNX and Marathon exports select existing shared RN
implementations for supported controls. The platform-specific condition must
be asserted before the generic native condition can select an Apple/Android
entry. The public index and independently imported control entries must remain
import-safe when Expo's mobile providers are absent. See that package's README
for the exact exports, the measured Tooltip implementation and native input
requirements. The source tests distinguish key/hover handling from the host
event delivery that must be exercised in a Qt/Fabric run.

## Requirements beyond source reuse

- Use the matching RN-QNX public entry and target Metro configuration. The
  checked-in API profile records the exact reviewed export set; it does not
  imply that every method/property on each export has complete RN parity.
- Compile the app's existing `className` styling through its configured
  Uniwind/Tailwind pipeline and supply its theme tokens. Static import analysis
  does not validate styles or invent a Qt styling provider.
- Install a compatible native provider when the selected entry imports Gesture
  Handler, Skia, Expo or another optional peer. Optional package metadata means
  unrelated subpaths can omit a peer; it does not make an imported peer optional
  at runtime. A Qt canvas or pointer API does not supply those RN libraries.
- Preserve real input, keyboard focus, accessibility, RTL, fold/hinge and
  window-layout behavior. The upstream RN `I18nManager` fallback provides LTR
  constants when no native manager exists; it does not add native RTL settings.
- Supply the existing callbacks, model, media or Forge engine that gives a
  control its domain behavior. Native binary transport needs a matching Nitro
  runtime, generated class registration and teardown/lifetime validation.
- Validate actual device backends for playback, recording, files, sharing,
  haptics, XR and accessibility. The [upstream Qt QNX support matrix](https://doc.qt.io/qt-6/qnx-support.html)
  has module/backend limits; a custom port requires its own evidence.

Every report row starts with `runtimeAcceptance: unverified` for both targets.
A successful import check, bundle, host test or engine probe records only that
specific result. It cannot promote the entire roster to device acceptance.

## Regenerate and check

After changing a public export, source dependency, counterpart assignment or
the reviewed RN API profile, run:

```sh
node tooling/qt-component-coverage.mjs --write
node tooling/qt-component-coverage.mjs
node --test tooling/tests/qt-component-coverage.test.mjs
```

Check an actual RN-QNX checkout or extracted package before claiming that the
API profile matches an installed consumer:

```sh
node tooling/qt-component-coverage.mjs --check-rn-api /absolute/path/to/PublicAPI.js
```

The verifier rejects missing or renamed canonical rows, unknown counterpart
assignments, unresolved local target imports, stale generated reports and
attempts to turn static analysis into runtime acceptance. The source scanner
excludes type-only imports, follows literal imports/requires and flags computed
imports or namespace RN access for manual review. It does not inspect an
external package's implementation, run native code or replace a Metro consumer
test.

## Packed consumer evidence

[The control continuation](control-behavior-2026-11-10.md) records the current
tested package hashes and boundaries; the [initial validation](validation-2026-11-10.md)
remains historical evidence. To repeat the actual tarball/Metro check with a selected
RN-QNX checkout and a fresh output directory:

```sh
node tooling/qt-component-consumer.mjs /absolute/path/to/release-packs /absolute/path/to/react-native-qnx /absolute/path/to/new-consumer-output
```

This extracts the real core/UI/control tarballs, uses the RN checkout's pinned
peer and toolchain dependencies, bundles every Expo-controls public entry on
both target resolvers and checks the resolved files. The script asserts the
exact patched RN public entry and rejects a mobile Expo provider in either
target graph. It is a bundle gate; it does not execute a Qt surface.
