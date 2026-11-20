# Component doc template (fixed)

Status: phase 1 step 3. Binds decision 11 (two tiers). Later generators write to this template and CI validates against it. A page that does not match is a CI failure; the template is not advisory.

Scope: one page per `@nyc-tron/ui` subpath that exports a PascalCase function or const (386 of 556 subpaths today). The 59 tier 1 items are listed in `tier1.json`, produced by `node docs/agent-native/tier1.mjs`. All other component subpaths are tier 2. Subpaths with no component export (models, hooks, helpers) get no page.

## 1. File shape

A page is, in this order and with nothing else at top level:

1. Front matter (section 2).
2. One line `# {name}` where `{name}` equals the front-matter `name`.
3. The eight sections of section 3, each as `## {Section}` exactly once, in this order: `Purpose`, `Install`, `Props`, `Variants`, `States`, `A11y`, `Example`, `Do/Don't`.

Headings use ATX style. No other `##` headings. `###` and below are allowed inside a section. A component file that exports several components (for example `NavigationRail` and `NavigationShell`, or `office-controls` with 11 exports) is one page; `name` is the first export in source order that the root barrel or `tier1.json` lists, and the other exports get `###` headings inside `Props`.

## 2. Front matter

Delimited by lines that are exactly `---`. Contents are a restricted YAML subset: one `key: value` per line, keys in the order below, no comments, no nesting, no anchors. Strings are double-quoted. Arrays are flow style on one line: `[]`, `["a", "b"]`. Integers are bare. No other keys are allowed.

| Key | Type | Rule |
|---|---|---|
| `name` | string | PascalCase export name. Matches `^[A-Z][A-Za-z0-9]*$`. |
| `namespace` | string | `"@nyc-tron"`. The registry namespace. Fixed for now. |
| `subpath` | string | The import specifier, `@nyc-tron/ui/components/...`, or `@nyc-tron/ui` for a root-barrel-only item. It must be a key of `packages["@nyc-tron/ui"]` in `docs/api-signatures.json` (prefixed with the package name). |
| `tier` | integer | `1` or `2`. Must equal the item's tier in `tier1.json` (listed means 1). |
| `docs` | string | `"handwritten"` or `"generated"`. Tier 1 must be `handwritten`. Tier 2 must be `generated` until a person edits it, at which point they change this to `handwritten` and the generator stops touching the file. |
| `platforms` | array | Subset of `["ios", "android", "web", "windows", "macos", "qnx"]`, sorted in that order, from the source: a `Platform.OS` branch, a `.native`/`.web`/`.shared` sibling, or an `exports` condition (`browser`, `react-native`, `qnx`). `[]` means the source states no platform. It does not mean "all". |
| `category` | string | One of `primitive`, `input`, `display`, `feedback`, `navigation`, `overlay`, `layout`, `data`, `shell`, `forge`. Tier 1 is set by hand. Tier 2 is set by directory: `forge/*` is `forge`, `shell/*` is `shell`, `layout/*` is `layout`, `overlays/*` is `overlay`, `feedback/*` is `feedback`, `data/*` is `data`, `navigation/*` is `navigation`, anything else `primitive`. |
| `tokens` | array | Sorted, unique token names from `tokens.json` that the source uses, found by `token-use.mjs`. Colour tokens are `color.x`. Component-scoped off-scale tokens are written `<Component>.radius.11` as the map prints them. `[]` if none. Every entry must exist in `tokens.json` or match a `tokenPattern` in `tokens.map.json`. |
| `registryDependencies` | array | `"@nyc-tron/<item>"` for every other NYC-Tron component the source imports, where `<item>` is the export key after `./components/` with path separators kept (`Button`, `shell/UnitInput`). Sorted, unique, no self reference. Each `<item>` must resolve to a page. Non-component imports (models, hooks) are not listed. |
| `a11yStatus` | string | `"verified"`, `"declared"` or `"unverified"`. `declared`: the source sets `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `role` or an `aria-*` prop. `unverified`: it sets none. `verified`: tier 1 only, and the `A11y` section has a line `Evidence: <repo path>` where the path exists. A generator never writes `verified`. |

Example (values for Button, from the source at HEAD):

```yaml
---
name: "Button"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/components/Button"
tier: 1
docs: "handwritten"
platforms: []
category: "primitive"
tokens: ["color.border", "color.danger", "color.focus", "color.onDanger", "color.onPrimary", "color.primary", "color.surfaceRaised", "color.text", "radius.control"]
registryDependencies: []
a11yStatus: "declared"
---
```

Front-matter regex per line: `^(name|namespace|subpath|tier|docs|platforms|category|tokens|registryDependencies|a11yStatus): (.+)$`.

## 3. Sections

Every section is present in every page. Tier 2 may fill a section from generated content or from the placeholder line `_Not documented._`, as the table says. Tier 1 may not use the placeholder.

| Section | Content rule | Tier 1 | Tier 2 generation source |
|---|---|---|---|
| `Purpose` | One to three sentences: what the component is for, in the code's own terms. No marketing wording. | Handwritten. | First sentence of the component's leading `/** */` comment in source, else the placeholder. `api-signatures.json` has no comments, so this reads the source file. |
| `Install` | Four labelled lines, in order: `Package: @nyc-tron/ui`, `Import: <import statement>`, `Peers: <list or none>`, `Requires: <registryDependencies or none>`. No install command: the distribution step is not settled (GitHub Release tarballs, see README). | Handwritten, same four lines. | Fully generated. `Import` from `subpath` and the symbols in `api-signatures.json`. `Peers` is every `peerDependencies` key of `packages/ui/package.json` that the source imports directly (`react` and `react-native` are always listed). `Requires` echoes `registryDependencies`. |
| `Props` | A table with columns exactly `Name \| Type \| Default \| Required \| Description`, one row per prop of the component's props interface. A line `Extends: ...` before the table when the interface extends or omits another type. Inherited props are not enumerated. | Handwritten. Name, Type and Required must equal the generated rows (parity check, section 5). Default and Description are filled by hand. | Generated from `declarations["<pkg path>#<Name>Props"].signatures` in `api-signatures.json`: parse the interface members. `Required` is `yes` unless the member has `?`. `Default` is `not recorded` (the `.d.ts` carries no defaults). `Description` is the member's source `/** */` text, else empty. |
| `Variants` | One `###` per union-typed prop that selects an appearance or size, then a table `Value \| Effect`. Or the single line `none`. | Handwritten, effect per value taken from the code. | Generated for string-literal unions whose type alias name ends in `Variant`, `Size`, `Tone`, `Kind` or `Mode`: the values only, `Effect` empty. Else `none`. |
| `States` | A table `State \| How it is set \| What the code does`. Only states that exist in code. | Handwritten. | Generated as `State \| How it is set` for props named `disabled`, `loading`, `selected`, `checked`, `expanded`, `invalid`, `error`, `readOnly`, `pressed`, `active`, `busy` that appear in `Props`. Third column left out. If none, the placeholder. |
| `A11y` | Bullets: role, label rule, state props, keyboard handling, focus handling, minimum target size, each only if the code does it. A line `Evidence: <path>` when `a11yStatus` is `verified`. | Handwritten. | Generated bullet list of the accessibility props found in source (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityHint`, `role`, `aria-*`), with the literal value when it is a string literal. If none found, the placeholder. |
| `Example` | One fenced block `` ```tsx example=<name> ``. The block is a complete module that imports from the real specifier and type-checks. | Handwritten, type-checked in CI. | Generated only when every required prop has a constructible value: `string` as `""`, `number` as `0`, `boolean` as `false`, a function type as `() => {}`, a string-literal union as its first member, `ReactNode` as `null`. Any other required type gives the placeholder. A generated example is type-checked like a handwritten one; if it fails, CI fails the generator, not the page. |
| `Do/Don't` | Two lists, `Do` then `Don't`, at least two bullets each. Each bullet names the prop, state or token it relies on. | Handwritten. Every bullet must be backed by a prop, state or constraint on the same page. | Placeholder only. No generation. |

Placeholder line, exact text: `_Not documented._`

## 4. Generated regions

In a page with `docs: "generated"`, each generated section body sits between markers on their own lines:

```
<!-- generated:begin {section} source={file}[,{file}] -->
...
<!-- generated:end {section} -->
```

`{section}` is the lowercase section name (`purpose`, `install`, `props`, `variants`, `states`, `a11y`, `example`, `dont` for `Do/Don't`). A section that holds only the placeholder carries the markers too. Rules:

- A generated page has markers around every section body. Text outside the markers, apart from the front matter, the `# name` line and the `##` headings, is a CI failure. This is how CI tells a person's edit from generator output.
- The generator rewrites only between markers and rewrites them whole.
- A `handwritten` page has no markers. CI fails if one appears.
- `source=` lists repo-relative paths. `docs/api-signatures.json` is always one of them for `props`, `variants`, `states` and `install`.

## 5. CI checks

Each check is a pure function of the repo and the page.

1. Page exists for every item the rule produces: every `@nyc-tron/ui` subpath whose source exports a PascalCase function or const. Count equals `tier1.counts.componentSubpaths`.
2. Front matter has exactly the ten keys, in order, each matching its rule. `tier` equals the item's tier in `tier1.json`. `name` equals the `# name` line.
3. Headings are the eight sections, in order, once each, no other `##`.
4. `tier: 1` implies `docs: "handwritten"`, no markers, no placeholder line.
5. `tier: 2` and `docs: "generated"` implies markers around every section body and nothing else outside them.
6. `subpath` is a key of `api-signatures.json`; every `tokens` entry is in `tokens.json` or matches a `tokenPattern`; every `registryDependencies` item resolves to a page.
7. `platforms` and `category` are within their enums.
8. Props parity: the Name, Type and Required columns equal the table the tier 2 generator would produce for that subpath. Tier 1 `Default` and `Description` are free.
9. Every `Example` block parses, has `example=<name>`, and passes `tsc --noEmit` with the repo's `tsconfig.base.json` and `@nyc-tron/*` mapped to `packages/*/src`.
10. `a11yStatus: "verified"` requires an existing `Evidence:` path. `declared` or `unverified` must agree with the source scan.
11. Tier 1 `Do/Don't` has at least two bullets under each of `Do` and `Don't`.
12. A page that says `UNVERIFIED` in any section is allowed; the count is reported, not gated.

Check 8 is why a tier 1 page cannot drift from the types without CI noticing. Checks 1 to 7 and 9 to 11 need Node and `tsc` only. Nothing here installs a package.

## 6. What this template does not decide

- Where pages are written. The generator step picks the path; checks read `subpath` and `name`, not the file name.
- The registry item id format a shadcn-style registry will use. `registryDependencies` uses the export-key form above. A later step may map it, and check 6 then changes with it.
- Token wiring. `tokens` lists what the source uses today, by the token each literal maps to under `tokens.map.json`. It does not claim the codemod has run.
- Docs for packages other than `@nyc-tron/ui`. They are not tiered in this step.
