# Qt correspondence and packaged controls validation — 2026-11-10

## Sources and scope

Initial NYC-Tron base: `fe397c02bab746ef4ecbcae0cf9d42176a2e53df`.
Final validation includes the current upstream base
`7aec1ec1f2feca483c11f3605929e6f526133bca`; its core/UI/media changes were
rebuilt, repacked and tested before repeating both actual Metro consumers.
RN-QNX public-entry/resolver candidate:
`d74bd9be10e90e09f532574ec3ce9207debddc5b`.
The RN public entry's SHA-256 is
`c04c4541d8d1020246b47f72c8d4827b0ff1ff37954a1352b9369a78c81c4357`.

The existing 341-capability roster retains its 332 local and nine pinned
external owners. No canonical name, implementation requirement or original
platform acceptance record was changed. The generated report describes
conceptual Qt counterparts and actual local source dependencies. It does not
replace a Forge engine, install a native provider or declare target acceptance.

The runtime changes route eight existing controls through shared RN entries on
QNX and Marathon. Their root and leaf imports avoid the mobile Expo providers.
Tooltip remains import-safe and explicitly unsupported when rendered. The
generic root uses the shared dropdown, while explicit browser/mobile entries
retain their existing platform route. The added `Select.labelClassName` prop
preserves the dropdown's existing caption-styling contract.

## Observed checks

| Check | Result | Boundary |
| --- | --- | --- |
| Full JavaScript suite after review fixes | 1,192 passed | Includes ten coverage-checker tests and 32 Expo-controls tests. Local JavaScript evidence only. |
| UI and Expo-controls type checks | Passed | Public prop/type compatibility. |
| Fresh package builds | 13 passed | TypeScript outputs were built in the isolated worktree. |
| API surface | 617 subpaths passed | Existing public subpaths retained. |
| API signature gate | 3,306 declarations passed | Reviewed target conditions, default root and additive caption prop. |
| Package verification | 617 exports / 751 ESM files passed | Existing optional-peer isolation gate unchanged. |
| Tarball checks | 13 archives passed | Compiled exports, licenses/notices and workspace references checked. No release was published. |
| Canonical component verifier | 341 passed | 332 local / nine external / zero accepted with all original platform proofs. |
| RN API profile | 28 exact names and source hash passed | Names alone do not establish method-level or native-provider parity. |
| Packed QNX Metro consumer | 1,867,292 bytes; zero warnings | Actual extracted control packages and patched target resolver. |
| Packed Marathon Metro consumer | 1,867,304 bytes; zero warnings | Actual extracted control packages and patched target resolver. |
| Qt/Fabric render and physical device interaction | Not run | Keyboard, accessibility, RTL, input, focus and lifecycle acceptance remain unverified. |

The initial complete-suite run had one environment setup failure: the isolated
example lacked its already-declared Expo dependency. Linking the existing
installed dependency into that example resolved its three Graphite-config
tests. No source gate or dependency declaration was weakened.

The packed consumer used Node 24.22.1, React Native 0.88.1 and Metro 0.87.1.
Only React/RN/Zustand peer/toolchain dependencies were provisioned from the
selected RN checkout; the NYC-Tron packages were fresh extracted tarballs.
Every root/leaf entry resolved to the intended shared implementation or the
explicit unavailable Tooltip function. No selected control loaded `expo` or
`@expo/ui`. The probe bundles retain references to every imported control; it
does not execute React Native initialization or render them in Node.

Exact archive and bundle hashes, selected control files and evidence boundaries
are recorded in [packed-consumer-receipt.json](packed-consumer-receipt.json).

## Review corrections

Independent source review checked the entire canonical map and found two
resolver cases worth protecting. Explicit relative filenames now win over
platform suffixes; only extensionless imports try target/native variants.
Import and require edges now select their corresponding package condition
instead of asserting both. Regression tests cover both cases. The fixes leave
all current component counts unchanged.

Hosted Windows CI then exposed LF/CRLF differences in generated report
comparisons. The verifier now accepts those checkout line endings while still
rejecting changed counts, trailing whitespace, removed final newlines and
missing files. The full local suite passes with that regression included.
Reviewed API source hashes and packed artifact hashes remain exact.

The map now compares surround panning to Qt Spatial Audio and links its
backend limit to the Qt QNX matrix. Audio and PDF profiles link their platform
qualification directly to that matrix. Each counterpart describes existing
Qt APIs without asserting that an RN composition instantiates them.

## Current source counts

| Classification | QNX | Marathon |
| --- | ---: | ---: |
| Shared source candidate: no missing named RN API or additional provider found | 266 | 266 |
| Missing named RN API | 17 | 17 |
| Additional native/package provider required | 49 | 49 |
| Pinned external provider | 9 | 9 |
| Runtime accepted by this work | 0 | 0 |

The missing named imports are `AccessibilityInfo` in 16 transitive component
graphs and `BackHandler` in one. Extra peer counts overlap: 38 rows reach
Gesture Handler and five reach Skia; other rows reach Expo-backed controls or
services. The conservative scan of all declared source variants remains 283
React/RN/Zustand-only rows and 49 rows with additional dependencies.

These figures describe source reachability. App styling/theme compilation,
engine callbacks, method semantics, input and native services still need their
own tests. Every QNX/Marathon row retains `runtimeAcceptance: unverified`.

## Reproduction

```sh
node tooling/run-tests.mjs
node tooling/verify-component-program.mjs
node tooling/api-surface.mjs
node tooling/api-signatures.mjs
node tooling/verify-packages.mjs
node tooling/qt-component-coverage.mjs
node tooling/qt-component-coverage.mjs --check-rn-api /absolute/path/to/react-native-qnx/packages/react-native-qnx/Libraries/ReactNative/PublicAPI.js
node tooling/qt-component-consumer.mjs /absolute/path/to/release-packs /absolute/path/to/react-native-qnx /absolute/path/to/new-output
```

Repository guidance applied: the pinned foldable-layout skill
`d60f539b263863027ec7593ffaea38304ad1e5d8`, the plain-writing skill
`e2008aa08d688846b0373b83d7c3d33b85eaabdd`, and the repository's exact-native-feel
rules. Existing React state, app-owned tokens and public contracts remain the
control owners. Native/runtime acceptance remains separate from source and
JavaScript test evidence.
