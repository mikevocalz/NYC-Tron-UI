# Agent-native phase 1, step 6: docs site design direction

Status: direction only. No generator, CSS or JS exists yet and nothing under `packages/` changed. Repo base `d7c1101` on `agent-native-20261119`.

Binding decisions from `decisions.md`: 11 (two doc tiers), 14 (unit-multiple spacing names), 28 (registry served from raw GitHub URLs), 29 (install command `npx shadcn@latest add @nyc-tron/<item>`), 35 (icon wording), 36 (static, dependency-free site per library under `docs/site/`, five screens, openable from disk, hosting DEFER), 37 (critique runs after the site exists).

Inputs read: `docs/THEME_TOKENS.md`, `packages/core/src/theme.ts`, `packages/core/src/presets/infrax.ts`, `docs/agent-native/tokens.json`, `02-design-system.md`, `01-user-research.md`, `doc-template.md`, `04-ux-copy.md`. Structure references are in `07-mobbin-references.md` and were pulled before this file was finalized. Each screen below says which reference shaped it.

## 1. Subject, audience, job

Subject: the documentation site for `@nyc-tron/ui`, a React Native control library with 13 semantic colour variables, 2 radii and a closed spacing scale (`02-design-system.md` section 1).

Readers, in the order `01-user-research.md` ranks them: a developer in an Expo app who needs to pick and install a control, and an LLM agent in a consumer session that can reach only a URL and a terminal. Both need the same four facts per component: what it is, the install command, the props, a type-checked example.

Job: get either reader from "I need a segmented control" to a pasted install command and an import line without opening a second page.

## 2. Direction

The site wears the library's own contract. Its CSS defines the same 13 `--color-*` variables and 2 `--radius-*` variables that components read (`THEME_TOKENS.md`), and every surface in the site reads them through those names. A theme control swaps the variable block, so the whole site, including the swatches on the tokens page, re-skins live. That is the one memorable thing. It proves the contract on the site that documents it, and it costs a 13-line CSS block per theme, not a component.

Everything else stays quiet: a dense reading column, hard-edged tables, no illustration, no gradient.

### 2.1 Colour

No new palette. The site ships two themes whose values already exist in the repo, each in light and dark. A theme is exactly the 13 colour variables plus the 2 radii.

| Theme | Source | Primary | Accent | Surface raised / sunken | Border | Radii (control / card) |
|---|---|---|---|---|---|---|
| Reference (default) | `THEME_TOKENS.md` reference block | `#1f5fd1` / dark `#7aa7ff` | `#1f7a6d` / dark `#5fd0bf` | `#ffffff` `#f1f3f6` / dark `#1b1f26` `#12151a` | `#c9ced6` / dark `#39404b` | 8 / 12 |
| InFraX | `presets/infrax.ts` `INFRAX_THEME`, `INFRAX_DARK_THEME` | `#f37021` | light `#b04d0c`, dark `#f37021` | `#ffffff` `#f8fafc` / dark `#071b2e` `#000d1a` | `#dbe3eb` / dark `#21384a` | 4 / 6 |

Default is Reference, because `THEME_TOKENS.md` says those values are neutral and not a brand. Light or dark follows `prefers-color-scheme` until the reader picks one. InFraX is the only second theme: it is the one other fully specified palette in the repo, and it differs in hue and radius, which is what a theme switch needs to show. No third theme is invented.

Roles on the site, all through the existing variables:

| Role | Variable |
|---|---|
| Page and code-block ground | `--color-surface-sunken` (code blocks, table headers, search field), `--color-surface-raised` (reading column) |
| Body text | `--color-text` |
| Labels, row hints, table secondary text | `--color-text-muted` |
| Links, the single primary button, current-page marker in the nav | `--color-primary` on `--color-on-primary` |
| Dividers | `--color-border` |
| Keyboard focus | `--color-focus`, 2px ring with 2px offset |
| Status marks (generated badge, errors, success) | `--color-info`, `--color-danger`, `--color-success`; `--color-accent` marks only the "hand-reviewed" tier 1 badge |

One rule from `THEME_TOKENS.md` binds the site: `border` is 1.58:1 against both surfaces, below the 3:1 that WCAG 1.4.11 asks when a border is the only edge of an input. The search field and the filter field therefore draw their edge with `--color-text-muted`, and `--color-border` is used for dividers only. The site must not claim `--color-border` as an input edge.

### 2.2 Type

The library ships no font tokens (`02-design-system.md` section 1.2: font size, line height and family are not tokens; Tailwind defaults stand in). The site uses the system sans and system mono stacks (`ui-sans-serif, system-ui, sans-serif` and `ui-monospace, "SF Mono", Menlo, monospace`). It loads no font file, which keeps the page openable from disk and offline. This is a decision, not a gap: a web font would be one more file the generator has to ship and verify, and the library has no brand typeface to match.

Sizes come from the proposed closed font scale where one exists (`font.11` to `font.17`, `02-design-system.md` section 4). Two sizes the scale lacks, 24 and 30, appear once each in the repo as off-scale literals, so the site names them `--docs-text-24` and `--docs-text-30` and says in the CSS comment that they are site-scoped.

| Use | Size / line height | Weight |
|---|---|---|
| Page title | 30 / 36, `--docs-text-30` | 600 |
| Section heading (`##`) | 24 / 30, `--docs-text-24` | 600 |
| Subsection (`###`), nav group label | 17 / 24, `font.17` | 600 |
| Body | 15 / 24, `font.15` | 400 |
| Tables, code, nav items | 13 / 20, `font.13` | 400 |
| Badges, captions, key hints | 12 / 16, `font.12` | 500 |

Sentence case everywhere, no all-caps labels, no letter spacing (the repo has 0 `letterSpacing` literals). Reading column is capped at 72ch for prose. Tables and code are exempt and scroll inside their own box.

### 2.3 Shape, spacing, density

- Radius: `--radius-control` on buttons, fields, badges, code-block copy button. `--radius-card` on code blocks, callouts and the install box only. Nothing else gets a radius. Tables have square corners inside a `--radius-card` outer clip.
- Spacing: multiples of one `--docs-unit` of 4px, using the proposed names `space.1` (4), `space.2` (8), `space.3` (12), `space.4` (16). Those four cover the dominant literals in the repo (`gap` 8: 324, 6: 156, 4: 108, 12: 50, 16: 11). Block spacing in the reading column is 24 and 32 (`--docs-space-6`, `--docs-space-8`), site-scoped for the same reason as the type sizes.
- Touch target: 44px minimum for every control, the library's own value (152 literals of 44 in `packages/ui`). Controls are 44px tall at 390 px. At 1280 px, table rows and nav items may be 36px because a pointer is in use, and focus rings still show.
- Density: the site renders the library's `density: "comfortable"`. It does not implement `compact` or `touch`.
- Motion: `motion.fastMs` 120 for hover and focus colour changes, `motion.standardMs` 240 for the theme swap and the mobile nav disclosure. Nothing animates on load. `prefers-reduced-motion` sets both to 0.
- Icons: none in v1. Glyph buttons are replaced by words (`Copy`, `Search`, `Menu`), which are also what a screen reader says. The icon package has 47 drawn glyphs (decision 35) and the site has no build-time path to inline SVG without adding a dependency.

### 2.4 Layout concept

Left-aligned throughout. No centred hero.

```
1280 px                                              390 px
+------+---------------------------+--------+        +--------------------+
| nav  | reading column (<=72ch)   | on     |        | Menu   [search]  T |
| 240  | title                     | this   |        +--------------------+
|      | install box  [Copy]       | page   |        | title              |
|      | sections                  | 200    |        | install box [Copy] |
|      |                           |        |        | sections (1 col)   |
+------+---------------------------+--------+        +--------------------+
 header row above all three: wordmark, search field, theme control, version
```

At 1280 the page is three columns with the middle one fixed to the reading measure and the outer two sticky. At 390 it is one column; the nav becomes a `<details>` disclosure under the header, and "On this page" is dropped because the headings are short and the eight sections are fixed by `doc-template.md` section 1.

### 2.5 Review of this plan against the brief

First draft, and what changed after pulling references and checking the constraints:

1. A command palette dialog for search, as in three of the references. Changed to a dedicated `search.html`. A dialog needs the index on every page, which is about 110 KB repeated 400 times, or a second JS file and a `fetch` that fails on `file://`. A page holds the index once. The grouped result rows and the keyboard-hint footer are kept.
2. Index as `search-index.json` fetched by JS. Changed: browsers block `fetch` of a sibling file under `file://`, and decision 36 requires the site to open from disk. The index is inlined into `search.html` in a `<script type="application/json">`. The site still has exactly one CSS file and one JS file.
3. A live component preview on each component page. Struck. The components are React Native; a static site with no dependencies cannot render them, and a screenshot pipeline needs a simulator. The component page shows the type-checked example, the props table and the token swatches that component uses, and says so. Condition to return: a renderer or a screenshot set exists.
4. A persistent install strip on all five screens. Cut back to home, component and install. On tokens and search it competed with the one primary action.
5. A third theme to make the switch look richer. Cut. Only palettes that exist in the repo are shown.
6. Syntax highlighting. Deferred. It needs a tokenizer; v1 prints code in mono on `--color-surface-sunken`. The decision comment lives in `site.css`.

The first draft also drifted toward the generic docs layout: pale ground, rounded cards for every component, a gradient hero. The reference pass and the library's own tokens removed all three. There is no card grid of components. The home page lists them as dense rows.

## 3. Cross-cutting requirements

### 3.1 Both readers, one source

| Requirement | Mechanism |
|---|---|
| Raw markdown at a predictable URL | Every component page `c/<item>.html` has a sibling `c/<item>.md` that is the doc page source byte for byte (front matter plus the eight sections of `doc-template.md`). `<item>` keeps path separators, so `shell/UnitInput` is `c/shell/UnitInput.md`. The HTML page carries `<link rel="alternate" type="text/markdown" href="UnitInput.md">`. |
| Site index for agents | `llms.txt` at the site root. One line per item: id, title, description from `copy.json` / `tier2-copy.json`, raw `.md` path, tier. Plus a top block with the install command pattern and the token contract URL. Decision 35 requires the icon wording fix to appear here. |
| Visible install command | A bordered box under the page title on home, component and install pages. Monospace, never an image, text selectable, with a `Copy` button. |
| Copy for agent | A secondary button on the component page. It copies a block built at generation time: the item id, the install command, the import line, the `.md` URL and the page's Props table. It is plain text, no markup. |
| Machine facts as text | Tier, `docs: generated` or `handwritten`, `a11yStatus`, `platforms` print in the page header as words (`Generated page`, `Accessibility: declared`), not only as colour. A generated page says that it is generated, because decision 11 requires it. |
| Same words | Titles and descriptions on every list row are the `copy.json` strings. The site writes no copy of its own for items. |
| Stable anchors | Each `##` heading gets the id of its lowercase name (`#props`, `#a11y`, `#example`, `#do-dont`). |
| No JS needed to read | Every page is complete HTML. JS adds copy, theme control, the mobile nav toggle and search ranking. |

### 3.2 Generator contract

`node docs/site/build.mjs` (new file, Node built-ins only, no `package.json` dependency) reads `docs/agent-native/tokens.json`, `tier1.json`, `copy.json`, `tier2-copy.json`, `docs/api-signatures.json` and the component doc pages, and writes:

```
docs/site/
  index.html          home
  tokens.html
  install.html
  search.html         carries the inlined index
  c/<item>.html       one per page
  c/<item>.md         copied source
  llms.txt
  assets/site.css     one file
  assets/site.js      one file
```

- All links are relative; the generator computes the `../` prefix from the depth of the item id. No absolute path, no origin, no service worker.
- Markdown is rendered by a built-in subset renderer. The doc template fixes the input: ATX headings, paragraphs, pipe tables, fenced code with an info string, bullet lists, inline code, bold, links. Anything else fails the build.
- Budgets, checked by the generator and failing the build when exceeded: `site.css` 24 KB, `site.js` 10 KB (unminified source; no minifier), any component page 60 KB, `search.html` 400 KB.
- Counts such as the number of items or tier 1 pages are read at build time from `tier1.json` and the copy files. They are never typed into a template. The doc template says 386 subpaths export a component while the copy files list 556 items; the generator prints both and the site shows the number of pages it actually emitted.
- `site.js` does five things: copy buttons, theme control, mobile nav toggle, search ranking (the same BM25 as `retrieval-eval.mjs`, so what the site ranks matches what the retrieval eval measured), and online/offline notices. Every one is guarded by feature checks. Failure of the script leaves a readable site.
- The theme control writes `data-theme` on `<html>` and remembers the choice in `localStorage` inside `try/catch`, because `localStorage` can throw on `file://` in some browsers. Without storage the choice lasts for the visit.
- Clipboard: `navigator.clipboard.writeText` first, then a hidden `textarea` with `execCommand("copy")`, then a visible state `Press Cmd+C or Ctrl+C` with the text pre-selected. All three are needed because `file://` is not a secure context everywhere.

### 3.3 Accessibility floor

Skip link to `#main`. Landmarks: `header`, `nav`, `main`, `footer`. One `h1`. Visible focus ring from `--color-focus`. The copy confirmation goes through an `aria-live="polite"` region and changes the button text to `Copied`, back after 2 seconds. Tables use `<th scope>`. Colour is never the only carrier of tier, status or error. Text pairs inherit the 5.5:1 light and 6.9:1 dark floor stated in `THEME_TOKENS.md` for the reference theme. The InFraX pairs are the ones its own header comment checks (navy on orange 6.67:1); `contrast.mjs` runs over both themes in the generator and fails the build under 4.5:1 for text and 3:1 for focus and the input edge. `a11y-status.json` is where the component rows get their `a11yStatus`; the site displays it and never upgrades it.

### 3.4 State vocabulary

Per `product-decisions`: every screen designs default, loading, error, empty, success and offline. "Nothing matched" and "could not check" are different sentences. A static site has few real loading states, so those that exist are named, and those that cannot occur are marked `n/a` with the reason, not drawn.

### 3.5 What the site does not claim

- No install command is shown as working for engine-facade items (`cadence`, `folio`, `pitch`, `prism`, `quill`, `splice`, `tally`, `studio-layout`). Decision 3 and 30 defer their registry items. Their pages show the import line and the sentence `Not in the registry yet. It needs the Rust engine, which ships as a GitHub release tarball.`
- Decision 28 says the CLI's acceptance of the raw content type is verified in phase 2. Until that step passes, the install box carries the line `Registry install is unverified until phase 2.` The generator reads a single flag, `registryVerified`, from a small JSON file in `docs/site/`, and drops the line when it is true.
- The raw GitHub registry URL is shown only where an agent needs it (the install page). The site never fetches it.

## 4. Screens

### 4.1 Home (`index.html`)

Reference shape: `07-mobbin-references.md` home references (Mintlify introduction, Snowflake landing, Braintrust quickstart).

Purpose. Tell a first-time reader what the library is and let them find a component within one action.

Primary action. Search. The field is the first focusable element in `main` and is autofocused only on pointer devices at 1280 px, never at 390 px, where autofocus raises the keyboard over the content.

Content blocks, in order:

1. Header row: wordmark `NYC-Tron`, header search field (form with `action="search.html"`, `method="get"`), theme control, version read from `packages/ui/package.json` at build time.
2. One-sentence statement from `README.md`'s own opening line, quoted by the generator. Under it the search field (large) and the install box with a real tier 1 item, `npx shadcn@latest add @nyc-tron/Button`, plus the registry-unverified line while the flag is false.
3. Agent row: three text links, `llms.txt`, `c/Button.md` as the example of a raw page, and `Copy for agent`, which copies the `llms.txt` URL and one instruction line.
4. Tier 1 list. Rows, not cards: title (link), description, category word, one row per tier 1 item, grouped by `category` from the front matter (`primitive`, `input`, `display`, `feedback`, `navigation`, `overlay`, `layout`, `data`, `shell`, `forge`). Group heading is sentence case. Count in each heading is computed.
5. Tier 2 note and link: `{n} more pages are generated from the type declarations. Browse them in search.` A link to `search.html?tier=2`.
6. Footer: tokens, install, source repository, release version, and the sentence about generated pages.

States.

| State | Behaviour |
|---|---|
| Default | As above. |
| Loading | `n/a`. Page is complete HTML. The header search is a plain form and works before any script. |
| Empty | `n/a` for the build. If the generator finds zero tier 1 rows it fails instead of emitting an empty list. |
| Error | `n/a` at runtime. A build error stops the generator with the file and line. |
| Success | After `Copy`, button text `Copied` for 2 seconds. |
| Offline | Page reads from disk or cache. Copy still works. The registry-unverified line is the only network-dependent claim, so no offline banner on home. |

Responsive.

| Width | Layout |
|---|---|
| 390 | One column. Header: wordmark, `Menu` disclosure, theme control; the search field is a full-width row below it, 44px tall. Install box scrolls horizontally inside itself, with the `Copy` button above it so the button is never off-screen. Tier 1 rows stack: title, then description at 13px, then category word. Group headings stay in flow. |
| 1280 | Nav column 240 (category jump list), reading column 720, no right rail on home. Install box and search field sit side by side only if both fit in 720; otherwise stacked. Tier 1 rows are two columns (title and description, category right-aligned) with 36px row height. |

Human and LLM. A human reads the row list. An agent reads the same list from `llms.txt`, which is linked in the agent row and in `<link rel="alternate">`.

### 4.2 Component page (`c/<item>.html`)

Reference shape: fal API page, Base44 API reference, Subframe snippet block.

Purpose. Give everything needed to use one component, in the fixed order of `doc-template.md`.

Primary action. Copy the install command.

Content blocks, in order:

1. Breadcrumb: `Components / <category> / <name>`.
2. `h1` name, then the header facts as words: `Hand-reviewed` or `Generated page`, `Accessibility: declared`, platforms or `Platforms: not stated in source`.
3. Install box: `npx shadcn@latest add @nyc-tron/<item>` with `Copy`. Under it, secondary buttons `Copy for agent` and `View as markdown` (a link to the `.md`).
4. The eight sections from the doc page in template order: Purpose, Install (the four-line block from the template, which stays), Props, Variants, States, A11y, Example, Do/Don't. `Props` renders as a table. `Example` renders as a code block with a copy button of its own.
5. Token strip: the tokens named in front matter as a row of small swatches with their variable names, coloured by the active theme. Tokens not in `tokens.json` are listed as text. This block is the site's stand-in for a live preview.
6. Related: `registryDependencies` as links to their pages.
7. Footer prev and next within the category.

States.

| State | Behaviour |
|---|---|
| Default | As above. |
| Loading | `n/a`. Static HTML. |
| Empty | A tier 2 section holding `_Not documented._` renders the placeholder as a muted sentence plus the line `This page is generated. Edit the source and set docs to handwritten to add this section.` with a link to the source file path. It is a live exit, not a dead end. |
| Error | Two cases. Example fails type-check: this is a CI failure, the page is not emitted (`doc-template.md` section 3). Clipboard unavailable: the fallback in 3.2 shows `Press Cmd+C or Ctrl+C` with the text selected. |
| Success | `Copied` in the button and in the live region. |
| Offline | Page stays readable. The install box gets a line `You are offline. The install command needs a connection.` when `navigator.onLine` is false, and the line is removed on the `online` event. |

Deferred-item variant (engine facades, decision 30). The install box is replaced by the sentence in 3.5 and the import line. No copy-install button. The disabled reason is visible text.

Responsive.

| Width | Layout |
|---|---|
| 390 | One column. Install box and its `Copy` stack above the code. Secondary buttons wrap to a second row. Props table becomes stacked rows: each prop is a block with `Name`, `Type`, `Default`, `Required` as label and value lines (generated with `data-label` attributes and CSS only). Code blocks scroll horizontally inside the block. No right rail. Nav is in the `Menu` disclosure. |
| 1280 | Three columns: category nav 240, reading column 720, "On this page" 200 sticky listing the eight section anchors. Props stays a real table with fixed column order from the template. Token strip is one row. |

Human and LLM. The page and `c/<item>.md` carry the same content. The `Copy for agent` block is smaller than the full page, for agents with a small budget. `01-user-research.md` estimates that reading whole files is the cost agents pay today; this page lets them take only Props and Example.

### 4.3 Tokens page (`tokens.html`)

Reference shape: Subframe theme page, Replit design-system overview, Canva guideline page.

Purpose. Show the theme contract: the variables an app must define, their values, and where they come from.

Primary action. Copy the `@theme` CSS block for the active theme.

Content blocks, in order:

1. `h1` `Theme tokens`. One sentence from `THEME_TOKENS.md`: components ship no colours; the consuming app defines the variables.
2. Theme control (Reference or InFraX, light or dark) and the `Copy CSS` button. The copied text is the `@theme` block for the active theme, 13 colours and 2 radii, in the format of `THEME_TOKENS.md`.
3. Colour table: one row per colour token. Columns: swatch, name (`color.primary`), CSS variable, utilities in use, light value, dark value, contrast against `surfaceRaised`. Required versus optional is a word (`required`, `optional`), because 5 of the 13 are optional and a missing one fails silently (`02-design-system.md` section 2, item 4).
4. Radius, spacing, type: tables from `tokens.json`.
5. Native-only metrics and icon values.
6. Status key: `existing` (in the repo today) and `proposed` (a step from the closed scale that the codemod would add). Each proposed row says so in words.
7. Source line per group: `packages/core/src/theme.ts`, `docs/THEME_TOKENS.md`.

States.

| State | Behaviour |
|---|---|
| Default | All groups expanded in the order above. |
| Loading | `n/a`. Static HTML. |
| Empty | A filter field narrows rows by name. Zero rows shows `No token matches "{q}". Clear the filter to see all {n}.` with a `Clear filter` button. |
| Error | If a theme variable is missing from `tokens.json` for the active theme the generator fails. At runtime the only error is clipboard failure, handled as in 3.2. |
| Success | `Copied` on the CSS button. Theme control shows its new value with `aria-pressed`. |
| Offline | Fully usable. No network dependency. |

Responsive.

| Width | Layout |
|---|---|
| 390 | Tables become stacked rows with the swatch first. Contrast and the utilities list sit under the value lines. Theme control is a four-segment row, each segment 44px. `Copy CSS` is full width under it. |
| 1280 | Colour table shows all columns. Right rail lists the groups. Swatches 24px square with `--radius-control`. |

Human and LLM. A human sees colour. An agent reads the same table as text, since values and variable names are in cells, not drawn. A raw page `tokens.md` is generated beside `tokens.html` from the same data, with the same predictable-path rule.

### 4.4 Install page (`install.html`)

Reference shape: Plausible install step, Subframe connect-to-code panel, Higgsfield MCP steps.

Purpose. Get the library into an Expo app, including the parts that are not a single command.

Primary action. Copy the add command for the first component.

Content blocks, in order:

1. `h1` `Install`.
2. Method tabs (links, not script tabs): `Registry (shadcn CLI)` and `Release tarball`. The default is the registry once `registryVerified` is true, and the tarball before. Each method is a section with an anchor, so a tab press is a normal page navigation to `#registry` or `#tarball`.
3. Registry: the add command, a sentence on what it writes, the raw URL pattern from decision 28 (`raw.githubusercontent.com/<owner>/<repo>/<tag>/r/{name}.json`) pinned to a release tag, and the unverified line while it applies.
4. Release tarball: the steps from `README.md` "Installing from a release" copied by the generator. Not rewritten.
5. Peers and theme: the peer list from `packages/ui/package.json`, then a link to `tokens.html` for the 13 variables. The sentence from `THEME_TOKENS.md`: a missing variable does not fail the build.
6. For agents: `llms.txt`, a one-paragraph instruction an agent can paste into its own context, and the `Copy for agent` button.
7. Verify: the one command that proves the install, from `README.md`; the generator omits the block if the README has none.

States.

| State | Behaviour |
|---|---|
| Default | Registry or tarball first, per the flag. |
| Loading | `n/a`. |
| Empty | `n/a`. Sections come from source files; a missing README section fails the build. |
| Error | A step cannot succeed from the site (registry unverified): shown as text under the command, not as a disabled button. Clipboard failure as in 3.2. |
| Success | `Copied`. |
| Offline | A banner at the top of the page when `navigator.onLine` is false: `You are offline. Both install methods download from GitHub, so they need a connection. Everything on this page stays readable.` |

Responsive.

| Width | Layout |
|---|---|
| 390 | Single column. Method links are two 44px buttons side by side. Each command sits in its own box with `Copy` above it. Steps are an ordered list, because install steps are a real sequence (numbering is information here, unlike on the other screens). |
| 1280 | Reading column 720 with the method links above the first command. Right rail lists the section anchors. |

Human and LLM. The agent paragraph and `llms.txt` exist so an agent in a clean consumer session can install without reading the repo, which `01-user-research.md` names as the least documented situation.

### 4.5 Search (`search.html`)

Reference shape: incident.io, Mintlify and Replit result lists.

Purpose. Find an item by what it does, by name or by category.

Primary action. Open the top result (Enter on the field, or tap a row).

Content blocks, in order:

1. `h1` `Search` and the field, 44px, edge `--color-text-muted`, label `Search components`.
2. Filter row: tier (`All`, `Hand-reviewed`, `Generated`), category select, platform select. Filters are plain controls whose state is written to the query string.
3. Result count and the result list. Each row: title, description from copy, category, tier word, a `Copy install` button. Rows are grouped by category in the order of the home page. Within a group, rank by BM25.
4. Footer of the list: key hints `Up Down move`, `Enter open`, `/ focus search`, shown at 1280 px only.

Without JavaScript, the page lists all items grouped by category with the same rows, and the form submit reloads with `?q=` and shows the unranked list with a note `Ranking needs JavaScript.` This is the fallback for a reader or crawler without script.

State in the URL: `?q=`, `?tier=`, `?category=`, `?platform=`, so a search is shareable and back-button safe.

States.

| State | Behaviour |
|---|---|
| Default | Empty query shows the grouped list, all items, tier 1 first within a group. |
| Loading | The index sits in the page, so ranking is synchronous. If ranking takes longer than 100 ms (the build records the index size), the list dims and the count reads `Searching`. Expected to be rare at about 560 items. |
| Empty | `No match for "{q}". Try a component name or what it does, for example "segmented control" or "context menu". Clear filters` with a button that clears them. Distinct from the error state. |
| Error | The inlined index fails to parse: `Search could not read its index. The list below is unranked.` and the grouped list from the no-JS fallback is shown. Never the empty sentence. |
| Success | `n/a`; opening a result is navigation. |
| Offline | Fully usable. |

Responsive.

| Width | Layout |
|---|---|
| 390 | Field full width. Filters collapse behind a `Filters` disclosure, closed by default, showing the count of active filters in its label. Rows stack title, description, category and tier. `Copy install` is a 44px button on its own line. No key hints. |
| 1280 | Field and filters on one row. Rows are two columns. Up and Down keys move a visible selection with `aria-activedescendant`, Enter opens it, `/` and Cmd+K focus the field. |

Human and LLM. Ranking uses the same scorer and the same title and description fields as `retrieval-eval.mjs`, so the retrieval numbers in `04-ux-copy.md` describe what this page does. An agent that cannot run the page can read the same list from `llms.txt`.

## 5. Open items for the owner and later steps

1. `registryVerified` stays false until phase 2 checks that the shadcn CLI accepts the raw content type (decision 28). The install box wording depends on it.
2. The doc template's `Install` section has no command (written before decision 29). The generator adds the command in the page header and leaves the four-line block alone. The template should say so when someone next edits it.
3. Component previews are struck, not deferred indefinitely: they return when a renderer or screenshot set exists.
4. Syntax highlighting is deferred. It needs a tokenizer for `tsx` and `css`.
5. Hosting stays DEFER (decision 36). Every link is relative so any host works.
6. Step 8 (design-critique, decision 37) runs on screenshots of the emitted site, at 390 and 1280, in both themes.
