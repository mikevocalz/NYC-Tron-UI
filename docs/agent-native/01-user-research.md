# Agent-native phase 1, step 1: user research

Status: desk research on the repo at HEAD `0e09d3b` (`1.0.0-rc.2`, branch `agent-native-20261119`). No interviews, telemetry or surveys exist, so nothing here is a user quote or an observed session. Where a claim rests on my judgement instead of a file, it says so.

Sources: the repo audit (`audit/tron.md`, sections 0 to 9) and direct reads of the files cited below. File sizes come from `wc -c`; counts of subpaths, symbols and files come from the audit and were re-checked where marked.

## Method for token estimates

Estimated tokens = bytes / 4. This is a rough rule for English prose and source code. JSON with short keys, long paths and heavy punctuation usually tokenizes worse than 4 bytes per token, so the JSON figures below are probably low. Every token figure in this document is an estimate. No tokenizer was run and no agent session was measured.

## (a) Who consumes the library

Two consumer groups. The second group reaches the library through the first group's session, so most real sessions mix both.

### Human developers

| Situation | What they have | What they need first |
|---|---|---|
| Building an Expo 58 / React Native 0.88 app that uses a few controls | Their own app, Tailwind v4 + Uniwind CSS, an install path that is GitHub Release tarballs, not npm (`AGENTS.md` rule 9, `README.md` "Installing from a release") | Install command, peer list, which theme variables to define |
| Building a studio or editor app (audio, timeline, canvas, spreadsheet) | The 493 files under `packages/ui/src/components/forge` and 55 under `shell` | Which of 556 subpaths to import, and what each one pulls in |
| Targeting a platform other than iOS, Android, web | Three isolated runtime lanes (`docs/SUPPORT.md`): Expo 58, RNW 0.85, Spark/macOS | Whether the lane exists and what is verified |
| Maintainer or contributor to this repo | `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/COMPONENT_OWNERSHIP.md`, the three `.github/agents/*.agent.md` | The ownership rules and the per-component status |

### LLM agents (Claude Code, Cursor, Codex)

All three work from a context window, a file reader and a shell. None of them has the maintainers' background knowledge. What differs by tool is how project instructions are found: Claude Code reads `CLAUDE.md` and skills, Cursor reads `.cursor/rules`, Codex reads `AGENTS.md`. The repo has `AGENTS.md` only (audit section 7: no `llms.txt`, `SKILL.md`, `CLAUDE.md`, `.cursor`, `components.json` or registry file).

| Situation | What the agent sees | Constraint |
|---|---|---|
| Consumer session: the user's app is open, `@nyc-tron/*` is in `node_modules` or not yet installed | `dist/*.d.ts` and `dist/*.js` only. The package `files` field is `["dist", "README.md", ...]` (`packages/ui/package.json`), so no `src`, no `docs/` | It can read type declarations and one 1.4 KB `packages/ui/README.md`. It cannot read `docs/THEME_TOKENS.md`, `docs/SUPPORT.md` or the signature JSON unless it also has the repo or the GitHub web pages |
| Repo session: the agent has a clone (maintainers, forks, agents told to "look at the repo") | All of `docs/`, 3.45 MB of `packages/ui/src` (`git ls-files packages/ui/src | xargs wc -c`), 198 tracked `.md` files | Too much to read; it must search |
| Scaffold session: "make me an app with these screens", no prior knowledge of the library | Whatever the user pastes, plus web search | It will guess component names. There is no list it can fetch cheaply |

The consumer session is the one that matters most for an agent-native registry, and it is the one with the least documentation available, because the published tarball carries almost none of the repo's docs. This follows from the `files` field and from `tooling/pack-release.mjs`; I did not unpack a release tarball to confirm.

## (b) Top 10 tasks, ranked

Ranking is my judgement from the library's shape: how early in a project the task happens, how many sessions will hit it, and how bad a wrong answer is. There is no usage data behind the order. Steps are what an agent can do today given the repo, reconstructed from the files, not observed sessions. Token figures are bytes/4 estimates for reading each file in full.

| # | Task | Steps an agent takes today | Files it must read | Estimated tokens if read in full |
|---|---|---|---|---:|
| 1 | Install the right packages into an Expo app | Find that npm will not work. Read the install section. Build tarball URLs by hand from a pattern. List sibling peers next to each package. Check `react-native-skia`, `@expo/ui`, `zustand` per subpath | `README.md` (sections "Installing from a release", "Add NYC-Tron UI to an Expo app"), `packages/ui/README.md`, `docs/SUPPORT.md` | 4,300 + 350 + 10,300 = about 15,000 |
| 2 | Find which component fits a need ("a dockable inspector panel") | There is no component list with descriptions. Options: scan `docs/COMPONENT_OWNERSHIP.md` (959 lines, one row per component, status not props), or list 556 `exports` keys in `packages/ui/package.json`, or grep `docs/api-surface.json` | `docs/COMPONENT_OWNERSHIP.md` (86,602 B), `docs/api-surface.json` (28,560 B), or `packages/ui/package.json` (152,407 B) | 21,700 / 7,100 / 38,100 |
| 3 | Use a known component correctly (props, variants, slots, `unstyled`) | Open the source file. Props live in the `.tsx`, partly in JSDoc (69 of 416 top-level `components/*.tsx` have no `/**` block at all, my grep). Variants are union types. Slot class props (`labelClassName`, `iconClassName`) are only visible in the interface | The component `.tsx` (Button 3,610 B), or `docs/api-signatures.json` `declarations` entry (but that file is 2.5 MB) | 900 for Button source. A forge file such as `forge/audio/LoudnessMeter.tsx` is 17,358 B, about 4,300 |
| 4 | Theme it: define the CSS variables, switch light and dark, override one control | Read the token doc. Know that a missing variable fails silently (`docs/THEME_TOKENS.md`). Know the `unstyled` + `className` escape hatch. Map `TronTheme` to CSS with `themeCssVariables` | `docs/THEME_TOKENS.md` (9,987 B), `packages/core/src/theme.ts`, README "App-specific Tailwind v4 / Uniwind styling" | 2,500 + core theme source + about 800 |
| 5 | Work out which optional peers a subpath needs | The `packages/ui/README.md` table is the only per-subpath map. Cross-check against source imports | `packages/ui/README.md`, then grep `from "zustand"` etc. | 350, then search |
| 6 | Pick the right implementation for a platform (web, iOS, Android, QNX) | Understand export conditions (`browser`, `react-native`, `qnx`, `marathon`, `default`) and `.native/.web/.shared` file triples. Decide between `@nyc-tron/ui` and `@nyc-tron/expo-controls` for menus, popovers, select | `packages/expo-controls/package.json`, `docs/SUPPORT.md`, `docs/EXACT_NATIVE_FEEL.md` (13,139 B), `docs/qt/component-coverage.json` (2.1 MB) | 10,300 + 3,300 + 528,000 if the Qt file is opened |
| 7 | Compose an adaptive app shell (navigation rail vs tabs, panes, folds) | Learn the shell policy (`AGENTS.md` rule 4), then wire `@nyc-tron/core` navigation, `NavigationShell`, `@nyc-tron/panes` and `@nyc-tron/reserved-regions` | `AGENTS.md` (4,776 B), `docs/ARCHITECTURE.md` (6,928 B), the four package READMEs and sources | 1,200 + 1,700 + package sources |
| 8 | Add a Forge or editor control (audio fader, timeline scrubber, color wheel) | Pick among 63 audio, 59 timeline, 44 color subpaths. Find its internal dependencies (fan-in to `forge/inputs`, `feedback`, `gestures`, `shell`) and the engine boundary (no `@nitro-forge/*` import allowed, `AGENTS.md` rule 1) | `docs/FORGE_COMPONENT_INTEGRATION.md`, the cluster notes (`AUDIO_CLUSTER_2.md`, `TIMELINE_CLUSTER_2.md`, `CANVAS_CLUSTER.md`), component source | not measured per file; each cluster doc is a separate read |
| 9 | Check whether something is supported or verified on a target (Windows, macOS, QNX, Quest) | Read the support policy and the "unverified" statements. Eight required platforms, acceptance not complete (audit section 2) | `docs/SUPPORT.md` (41,104 B), `docs/ROSTER.md` (9,565 B), `docs/completion/library-progress.json` (176,108 B) | 10,300 + 2,400 + 44,000 |
| 10 | Contribute: add or change a component in this repo | Read `AGENTS.md`, follow the external NYC-MON skill it points to, add a subpath export, regenerate `docs/api-*.json`, run `tooling/verify-packages.mjs` | `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/COMPONENT_OWNERSHIP.md`, `tooling/*.mjs` | 1,200 + 1,700 + 21,700 + scripts |

Upgrade from `0.1.0-alpha.4` (`docs/MIGRATION.md`, 2,545 B, about 640 tokens) is the cheapest task on this list and the only one with a doc sized for it. It is left out of the ten because I expect it to be rare after release.

### What the first task looks like today (illustrative, derived from files)

An agent asked to add a loading button to an Expo app reads `README.md` (about 4,300 tokens) for the install path, `packages/ui/README.md` (about 350) for peers, `docs/THEME_TOKENS.md` (about 2,500) for variables, and `Button.tsx` (about 900) for props. That is roughly 8,000 tokens in the best case, and every read except `Button.tsx` is guided by luck: nothing tells the agent to read those three files in that order. In a consumer session the second and third files are not in the tarball, so the agent must fetch them from GitHub.

## (c) Where agents waste tokens today

All figures from the repo. "Tokens" are bytes/4 estimates.

| # | Waste | Evidence | Bytes | Est. tokens |
|---|---|---|---:|---:|
| 1 | The only complete API reference is one huge JSON file | `docs/api-signatures.json`, `format:1`, 556 `ui` subpaths and 3,167 `ui` symbols | 2,521,505 | about 630,000 |
| 1a | Of that, the `declarations` map (3,354 entries) holds the prop shapes | Measured by `JSON.stringify` length in node | 1,435,903 | about 359,000 |
| 1b | The `@nyc-tron/ui` subtree alone | Same method | 497,384 | about 124,000 |
| 2 | A lookup for one component needs two hops: subpath entry (median 646 B) gives a symbol pointer, then a second key in `declarations` gives the shape. Button's subpath entry is 472 B and `ButtonProps` is a separate key | Read in node | 472 + separate entry | small if grepped, unusable if the file is opened |
| 3 | Export discovery by `package.json` | `packages/ui/package.json`, 556 export keys, three conditions each | 152,407 | about 38,100 |
| 4 | README lists the wrong count | `README.md:119` says 551 export keys; `packages/ui/package.json` has 556; `docs/MIGRATION.md:29` also says 551 | | An agent that checks the count loses trust in the doc |
| 5 | README says 15 tarballs in one place and sixteen in another, and the packages table has no `@nyc-tron/macos-appkit` row | Audit section 6 (`README.md:10` vs `README.md:297`, `CHANGELOG.md:5,13`) | | macOS install is found only by reading the install sections |
| 6 | The README install URLs use `v1.0.0` but the packages are `1.0.0-rc.2` | `README.md` "Installing from a release" ("these candidate URLs become usable after release"), `packages/ui/package.json` `version` | | An agent that copies the URL gets a 404 today |
| 7 | Peer table understates zustand | `packages/ui/README.md` lists 9 subpaths for `zustand`; 139 files under `packages/ui/src` import it (re-checked by grep), 24 of them under `components/shell`, and `shell` does not appear in that README | 1,394 | An agent trusts the table and ships a build that fails at runtime. Direction of the error is verified; the exact list of affected subpaths is not |
| 8 | `@expo/ui` peer table lists two subpaths; source also imports it in `forge/color/HsvPicker.tsx` | Audit section 6 | | Same failure mode as 7 |
| 9 | No per-component docs | Audit section 6: no Storybook, MDX or typedoc. `COMPONENT_OWNERSHIP.md` gives status, not props, examples or a11y notes | 86,602 | about 21,700 tokens to learn which components exist, with no usage in them |
| 10 | Prose is scattered across 198 tracked `.md` files, including about 60 phase reports under `docs/completion` | `git ls-files \| grep -c '\.md$'`; audit section 6 | | An agent that searches by keyword lands in evidence logs |
| 11 | Machine-readable metadata is spread across five large files with different ID schemes | `library-progress.json` (176,108 B, IDs like `A-03`), `desktop-support.json` (130,567 B), `qt/component-coverage.json` (2,111,659 B), `baseline-roster.tsv`, `core/src/advanced-catalog.ts` | 2,418,334 for the three JSON files | about 604,000 if all three are opened |
| 12 | `AGENTS.md` sends the agent to a skill in another repository by blob SHA | `AGENTS.md` lines 3 to 5 | | The agent either fails to fetch it or burns calls trying. Maintainer and consumer instructions share one file |
| 13 | Dense code style. Props are on single lines, no spaces after `:` | Audit section 0; `Card.tsx` | | Reading source for props costs more attention than it should; I did not measure the token effect |
| 14 | Spacing and type are inline numbers, not tokens | 1,050 spacing literals and 91 type literals in `ui` (audit section 4) | | An agent copying a component inherits literals; asked to "match the theme" it has no token to cite. Colour is clean (1 hex hit in `ui`) |
| 15 | Platform split by file extension and export condition | Audit section 9, point 3; `files/DropZone.{native,web,shared}` | | One component is three files; reading "the source" is ambiguous |

The 556 subpaths and 3,167 symbols are the root cause behind rows 1 to 3. The root barrel exports five components (`Button`, `Card`, `NavigationRail`, `NavigationShell`, `TextField`), so an agent cannot discover the rest from `import * from "@nyc-tron/ui"` or from autocomplete on the package name. It has to know a subpath string first.

Totals as orders of magnitude (estimates): a single mistaken full read of `api-signatures.json` costs about 630,000 tokens. Reading all three metadata JSON files would cost about 600,000. A disciplined consumer session (README, peers, theme doc, one component) costs about 8,000. The gap between the careful path and the careless path is about two orders of magnitude, and nothing in the repo steers the agent toward the careful path.

## What the agent-native pass should take from this

These follow from (c). They are inputs for later steps, not decisions.

1. A short, fixed-size front door for agents (`llms.txt`, `AGENTS.md` split into consumer and maintainer parts) that names the next file to read for each of the ten tasks above. It must ship in the tarball or live at a stable URL, because consumer sessions cannot see `docs/`.
2. One page per component with props, slots, variants and peers in a fixed template, sized in the hundreds of tokens, so task 3 costs about 500 tokens instead of a search. Decision 11 in `decisions.md` already scopes this in two tiers.
3. A per-item `peerDependencies` and `registryDependencies` listing generated from the compiled import graph, replacing the hand-kept table that is wrong for zustand and `@expo/ui`.
4. Count and version facts generated, not typed, so the 551/556 and 15/sixteen drifts cannot recur.
5. Semantic tokens for spacing and type that keep current values (decisions 6 and 10), so agents can cite a token instead of copying a literal.

## (d) Research gaps

What this document cannot tell you, and what would close each gap.

| Gap | Why desk research cannot answer it | What would answer it |
|---|---|---|
| Real task frequency and order | The ranking in (b) is my judgement | Interviews with the maintainer and the two consuming apps named in the repo (Moyo, NYC-MON); transcripts of agent sessions that used the library |
| How agents behave in a consumer session | I reasoned from the tarball `files` field and did not unpack a release or run an agent against it | Install `rc.2` in a clean Expo app, run Claude Code, Cursor and Codex on the same five prompts, record files read and tokens used |
| True token counts | bytes/4 is a rule of thumb; JSON likely tokenizes worse | Run a real tokenizer over the files, or read usage fields from agent logs |
| Which agent tools the owner's consumers use | Only Claude Code is known from this environment; Cursor and Codex are assumed from the brief | Ask the owner; check the consuming apps for `.cursor`, `CLAUDE.md`, `AGENTS.md` |
| Error rates | I know the README peer table understates zustand, not how often agents hit it | Clean-install smoke runs per subpath (`tooling/consumer-smoke.mjs` is the nearest existing harness; I did not run it) |
| Whether human developers read the docs or the types first | No analytics, no issue tracker data in the clone (shallow clone, no history) | Issue and discussion history from GitHub, download counts for release assets |
| Which components matter most | 556 subpaths, no usage counts | Import counts from the consuming apps; ask the owner which 20 components cover 90 percent of use |
| Whether tarball-only distribution blocks agents | Agents usually expect `npm view` and registry metadata; the effect of tarballs on their success is not measured | Observe an agent attempting the install with no hints |
| Windows, macOS and QNX consumers | Their lanes are isolated and unverified (`docs/SUPPORT.md`); I saw no evidence of who uses them | Owner interview |
| Accessibility needs of consumers | `AGENTS.md` rule 8 lists gates, but I did not review which tasks agents get wrong on a11y | A11y review of generated code from the sessions above |

No survey data, user quotes or session recordings were used or invented for this document.
