# Agent-native phase 1, step 8: design critique of the docs site

Status: decision 37. The built site was inspected on 2026-11-20 at 1280 px and at a true 390 px. Every blocker and major below was fixed in the generator sources (`tooling/docs/build-site.mjs`, `tooling/docs/site/site.css`, `tooling/docs/site/site.js`). `docs/site/` was regenerated, never edited by hand. `build-site.mjs --check` and `check-docs.mjs` pass. The ten screenshots in `docs/agent-native/screens/` were retaken after the fixes (1280 px at full scale, 390 px at 2x).

## 0. Method and limits

- Served `docs/site/` with `python3 -m http.server` and opened it in Chrome through the claude-in-chrome tool. The 390 px views are an iframe 390 px wide inside a wrapper page kept in the scratchpad, not in the repo. The window cannot go below about 500 px, so the iframe is the only true 390.
- Pages looked at, both widths: home, Button (tier 1, primitive), layout/Stack (tier 1, primitive), forge/inputs/PropertyInspector (tier 1, forge, a failing accessibility status), files/DropZone and data/tree-grid (tier 2, generated), forge/audio/AudioPreview (tier 2, in the 453-page forge category), tokens, install, search with and without a query, and a component URL with an id that does not exist.
- Automated sweep per page at 390 and 1280: horizontal overflow, duplicate ids, interactive target height (44 px at 390, 24 px at 1280), text contrast from computed styles. The contrast sweep ran in all four theme and scheme pairs (Reference light and dark, InFraX light and dark) on 6 pages at both widths, 4,079 text nodes per pair. First run showed 1.18:1 on InFraX light buttons; that was the 120 ms `background-color` transition caught mid-flight in a throttled frame. With transitions off the same pages report no failures.
- Keyboard with real key presses: home (Tab order through 14 stops, skip link with Enter lands on `#main`), a component page (Tab, Enter on Copy, Space on Copy for agent), search (`/` focus, typing, two ArrowDown). Tokens and install were not walked with keys.
- Copy: `navigator.clipboard.writeText` was wrapped to record its argument. Copy wrote `npx shadcn@latest add @nyc-tron/forge/inputs/PropertyInspector` and the live region said "Copied". Copy for agent wrote 1,248 characters: item id, install command, import line, raw page URL, docs and accessibility words, props.
- Search: all 76 queries in `retrieval-queries.json` (`queries` plus `stress`) replayed through the page's own ranking. 71 have an expected item and 68 of those return it in the top 3. Misses: s06 (not found), s20 (Select, rank 14), s25 (HistoryPanel, rank 6). Those are paraphrase misses from the retrieval eval, not page defects. Spot ranks: q01 SegmentedControl 1, q02 DataTable 1, q05 Button 1, q11 ContextMenu 1, q16 TabBar 1, q07 TextField 2, q13 AnchoredPopover 2.
- Both themes were looked at in a browser: Reference dark (all five screens) and light (Button at 390), InFraX dark (a component page, with a focus ring) and InFraX light (tokens, search). The contrast sweep covered all four pairs. The Forge pass only did numbers for one theme.
- Judged against `06-docs-direction.md`, `07-mobbin-references.md`, WCAG 2.1 AA, and the product-decisions rules (nav never 404s, no dead buttons, honest empty states, six states, "no data" distinct from "could not check").
- The screenshot tool draws a mouse cursor into the 1280 images. It is not part of the site.
- Content claims were not changed. No accessibility status, install command or count was edited. One displayed number was corrected, see T2.

## 1. Totals

| Severity | Found | Fixed | Left |
|---|---|---|---|
| Blocker | 1 | 1 | 0 |
| Major | 7 | 7 | 0 |
| Minor | 13 | 6 | 7 (section 8) |

Checks added to `build-site.mjs` so these classes cannot return: duplicate ids per page, and CSS classes that no page or script emits. Both fail the build. The Forge defects checked and absent here: sideways scroll at 390 (scroll width 390 on every page), duplicate ids (0), dead filters (all three search filters and the token filter work), AND-ing every query word (BM25 with OR), invisible focus stops (every stop shows a 2 px ring; no hidden `summary` stop), 17 px selects (44 px), sticky 113 px header (header is static at 390).

## 2. Shell (every page)

What works: skip link first, visible on focus, lands on `#main`; one `h1` per page; 2 px `--color-focus` ring on every stop, including InFraX dark; header controls 44 px; theme and mode survive reload through `localStorage` in `try/catch`; live region present on every page; footer states the tier counts and that accessibility statuses come from reading source.

| # | Sev | What fails | Fix | Before | After |
|---|---|---|---|---|---|
| S1 | Minor, fixed | Pages with a scrolling code block or table gave keyboard users no way to reach the overflow (WCAG 2.1.1). Chrome focuses scrollers by default, Safari does not. | `site.js` adds `tabindex="0"` to a `pre` or `.tw` only when it overflows; tables also get `role="region"` and a label. | 0 focusable scrollers | focusable when they scroll |
| S2 | Minor | First screen at 390 spends 163 px on the header (113) and the Menu button (50). | Left, see section 8. | | |

## 3. Home

First impression: the install command and the caveat that the registry is unverified sit in the first screen, ahead of any claim. Rows are plain title plus sentence, grouped by category, as the Snowflake reference asked. No card grid.

What works: one primary action per area; accessibility status printed as words ("Accessibility: reviewed-fail"); category anchors all resolve; no horizontal scroll.

| # | Sev | Finding | Fix | Before | After |
|---|---|---|---|---|---|
| H1 | Major | Row title links were 18 px tall at 390 and the Menu summary 36 px, against the direction's 44 px floor. 71 targets under 44 px on this page at 390. | `.rows a` is a 44 px flex target (32 px from 1100 px up), `.navbox summary` 44 px, `.pager a` 44 px. | 71 under 44 px | 0 on home, tokens, search; 0 on component pages except inline links inside list items |
| H2 | Minor, fixed | The search field placeholder was cut at 390: "Search by name or what it does, f". | Placeholder is "Name or what it does". The visually hidden label still carries the full sentence. | truncated | whole |

## 4. Component page

First impression: breadcrumb, name, then three badges that say hand-reviewed or generated, the accessibility status in words, and platforms. The install command comes before any prose. Props stack into labelled blocks at 390.

What works: badges carry words, not colour alone; "On this page" at 1280; install command one click from the top; Copy for agent writes the props and the raw URL; Previous and Next stay inside the category; the tokens strip says that it stands in for a live preview.

| # | Sev | Finding | Fix | Before | After |
|---|---|---|---|---|---|
| C1 | Blocker | A component URL with an unknown id (`c.html?id=nope/Nothing`) showed an empty `h1` "Component", a primary Copy button holding an empty command, a Copy for agent button that copied nothing, and an empty nav. Copy then announced "Copied". A dead control with a false confirmation, on the one page type every agent link lands on. | The install box, the registry note and the action row are `hidden` in the shell and shown only after a page renders. The error state sets the `h1` and the title to "No page found" and keeps the site nav and Search link. A general `[hidden]{display:none!important}` stops a layout rule from overriding the attribute. | 2 visible Copy buttons copying "" | both hidden in the error state |
| C2 | Major | Sidebar and menu listed every page in the category. Forge is 453 of 565 pages (80%), so most component pages opened a 453-link list: 470 links and 20,901 px tall in the 390 px menu, 453 rows in the sticky 1280 sidebar. | `site.js` splits a category of more than 40 pages by the folder after the category folder (25 groups for forge: general 12, audio 63, cad 17 and so on). Each group is a `<details>` with a 44 px summary and a count; only the group holding the current page is open. Smaller categories stay flat lists. | 453 rows, 20,901 px | 25 summaries plus 9 open rows, 2,473 px at 390 |
| C3 | Major | The install command was a scrolling `pre`. At 390 `npx shadcn@latest add @nyc-tron/forge/inputs/PropertyInspector` showed as `.../forge/input` with the rest out of view, and the same cut hit every `sh` block in the Install section. | `.install pre code` and `pre code[data-lang="sh"]` wrap (`pre-wrap`, `overflow-wrap:anywhere`). Other code keeps its scroll. | command cut at about 45 characters | whole command on two lines; scroll width equals client width |
| C4 | Minor, fixed | Copy for agent cut the props table at 4,000 characters in the middle of a line. | Cut at the last whole line and append a line with the raw page URL. Checked on `forge/SpreadsheetGrid` (5,055 characters of props). | mid-line cut | whole lines plus a pointer |
| C5 | Minor | Without JavaScript the page body is empty except for a note that points at the raw markdown. | Left, see section 8. | | |

## 5. Tokens

What works: theme and mode toggles re-skin the page live, swatches included; the CSS block and Copy CSS follow the active theme; "no match" and the filter are separate states; the page says that `border` is not used as an input edge. Looked at in Reference dark and InFraX light; the contrast numbers were swept in all four pairs.

| # | Sev | Finding | Fix | Before | After |
|---|---|---|---|---|---|
| T1 | Major | Token names broke mid-word in the colour table: `color.primary` rendered as four lines (`colo` / `r.pr` / `imar` / `y`) because code cells wrapped anywhere inside a 10-column table. | Name and CSS-variable cells do not wrap (`white-space:nowrap`); the table scrolls inside its own box, which is now keyboard-focusable. | 4 lines, 80 px | 1 line, 20 px |
| T2 | Major | The contrast column printed `color.onPrimary` as 1.00 / 1.08. It was measured against `surfaceRaised`, but an on-colour is drawn on its fill, so the number said the button label fails when it passes. A provable error in a displayed figure, not a content claim. | `onPrimary` and `onDanger` are measured against `primary` and `danger` and the cell says so ("5.81 / 7.46 on primary"). Header reads "Contrast (Reference, light / dark)" and a note states the rule. No other value changed. | 1.00 / 1.08 | 5.81 / 7.46 on primary |

## 6. Install

What works: banner first; registry and tarball as two anchors; the command box wraps at 390 after C3; the offline note appears only offline; the install page renders the README section as written.

No new defects beyond C3 and the shared target-size and scroll fixes. The two-column prose-left, command-right layout in the direction is not built (commands run past 100 characters); unchanged from the Forge site's recorded deviation.

## 7. Search

What works: BM25 with OR across words, so a task sentence returns results; three filters, all live; the empty state says what was searched; `/` and Cmd+K focus the field; ArrowDown and ArrowUp move a selection; the no-JavaScript list doubles as a sitemap; scope groups hide while a query ranks results in one list.

| # | Sev | Finding | Fix | Before | After |
|---|---|---|---|---|---|
| Q1 | Major | A query with no real match (`bottom sheet with drag handle`, q03, expected none) returned 36 results with a drag handle first and nothing to say they were weak. A reader or agent cannot tell a hit from filler. This is "no data" shown as data. | Each row of a multi-word query shows "Matches 2 of 4 words". When no row matches every word a line above the list says so. The count and ranking are unchanged. | 36 unlabelled results | 36 results, each labelled; a query where one row matches every word (`context menu`) shows no warning |
| Q2 | Major | A failed Copy (clipboard refused and `execCommand` refused) revealed a selected text block but told a screen reader nothing (WCAG 4.1.3). | `say("Copy failed. The text is selected below...")` on that path. Not exercised in the browser, see section 9. | silent | announced |
| Q3 | Minor, fixed | Row metadata read "Forge. Generated. unverified", missing what "unverified" refers to. | "Accessibility: unverified", the wording home already uses. The longer metadata squeezed the description at 1280, so `.rows .m` is capped at 13 rem. | label missing | present |
| Q4 | Minor, fixed | Arrow-key movement changed a highlight and nothing else. | Each move announces "Result 2 of 11: Context Menu" through the live region. | silent | announced |
| Q5 | Minor, fixed | `.hl`, `.grid2` and `.menu summary` in the CSS matched nothing. | `.hl` now styles the match label; the other two removed. A build check now fails on any unused class. | 3 dead rules | 0 |

## 8. Minors left, with reasons

| # | Item | Reason |
|---|---|---|
| S2 | 163 px of header and Menu before the title at 390 | Header is static, not sticky, so it costs one screen once. Merging search into the Menu would hide the primary route to a component. |
| C5 | Component pages need JavaScript | By design (one `c.html` and one `pages.js`, so the site opens from disk). The `noscript` text names the raw markdown path that works without a script. |
| T3 | Colour table needs a sideways scroll at 1280 to reach the InFraX columns | Ten columns cannot sit in a 72 ch reading column. At 390 the rows stack and show every column. The scrolling box is keyboard-focusable. A split into two tables is an owner choice. |
| Q6 | Search with no query lists all 565 rows with a Copy install button each | It is the no-JavaScript sitemap. Filters and the query narrow it at once. |
| Q7 | Search field uses `aria-activedescendant` without the full combobox and listbox roles | Row links need to stay links. The live announcement in Q4 carries the same information. A full combobox pattern is a rewrite of the result rows. |
| X1 | Header and nav links to `../../llms.txt`, `../../SKILL.md` and `../components/*.md` point outside `docs/site/` | Correct in the repo and in the tarball. They would 404 if only `docs/site/` is hosted. Hosting is DEFER in decision 36. |
| X2 | The Install section of each component page repeats the command already in the box under the title | The text comes from `docs/components/*.md`, the handoff source. Changing it edits content. |

## 9. Not checked

- No screen reader (VoiceOver, NVDA). The live region, `aria-current` and the group `summary` labels are untested by ear.
- Chrome only. Safari and Firefox rendering, `<details>` marker removal and the Georgia-free system stack are untested there.
- The 390 view is an iframe, not a device: touch, the on-screen keyboard and iOS select sheets are untested.
- The Copy failure path (Q2) and the `execCommand` fallback were not exercised; only the clipboard success path ran. The site was served over `http://localhost`, a secure context, so `file://` behaviour was not tested.
- `prefers-reduced-motion` was read from the CSS (`--docs-fast` and `--docs-standard` become 0 ms) and not toggled in the browser. The site has no load animation; the only transitions are 120 ms colour changes and the new chevron rotation.
- Keyboard walk with real keys covered home, a component page and search. Tokens and install were not walked; their tab order was not listed.
- Pressing Enter on a search result was not tested; ArrowDown selection was.
- Forced-colours and print output were not viewed.
- The contrast sweep reads the first opaque background of each text node. It does not replace an axe or Lighthouse run.
