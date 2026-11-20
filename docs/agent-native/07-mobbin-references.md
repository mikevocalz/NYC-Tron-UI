# Agent-native phase 1, step 7: Mobbin references for the docs site

Status: references for `06-docs-direction.md`. Cited for structure only. No colour, type, copy, icon or brand from any of them is used; the site takes its look from NYC-Tron's own tokens.

Method. Five `search_screens` calls on the web platform, one per screen, in `standard` mode, 8 results each. I looked at the returned preview images (low resolution) and chose three per screen. Nothing was saved to or created in a Mobbin collection. Links are the canonical screen URLs from the tool results with the tracking query string removed.

What Mobbin holds. It is an index of product screens, not documentation sites. Most hits are docs or API panels inside a product (an editor, a dashboard, an install modal). Only Mintlify's introduction and fal's API tab look like a documentation page, so structure for the home, tokens and search screens comes from adjacent patterns, and each entry says what it is. Where a pattern is weak, section 6 says so.

Limits. Previews were low resolution. Where I name a control I could see it in the preview; I did not read small text beyond what was legible, and I did not open the live products.

## 1. Home

| # | Reference | Link |
|---|---|---|
| 1 | Mintlify, Introduction page in a docs starter | https://mobbin.com/screens/d4ce0aef-c205-432b-8f31-b4267315dc35 |
| 2 | Snowflake, Getting Started with Native Apps | https://mobbin.com/screens/620c1b18-a8ab-453e-a652-1ad8aa1c2749 |
| 3 | Braintrust, Trace your LLM calls quickstart | https://mobbin.com/screens/0137e9e2-ee24-42f9-ad7b-b37f547e441c |

1. Mintlify. Taken: the header carries a search field with a keyboard hint and a theme toggle; the page begins with a title, a one-line summary and a page-level `Copy page` control; the first links are plain rows with a title and one sentence. This is the source of the page-level copy action and the search-in-header. Not taken: the right-hand assistant panel, the green callout banner, the rounded card for each link, the icons on each card.
2. Snowflake. Taken: a left nav, a page title with a single primary button at top right, and content grouped under plain headings (`Build`, `Guides`, `Tooling`) as short title-plus-sentence entries. This is the model for grouping tier 1 rows by category under headings. Not taken: the three-up bordered card grid, the "What's new" strip, the trial banner in the nav, the icon per entry.
3. Braintrust. Taken: the code sits directly on the first screen, in a bordered block with a filename label and a `Docs` link at the right of the label. This supports putting the install command in the first viewport. Not taken: the dark footer bar, the token-bearing environment variable lines, the skip and switch-to-CLI links.

## 2. Component page

| # | Reference | Link |
|---|---|---|
| 1 | fal, model API tab | https://mobbin.com/screens/d7cd6f6e-809b-47ba-9bf4-9c8465771271 |
| 2 | Base44, API documentation | https://mobbin.com/screens/67828c1b-90e1-4e8d-89a1-9e6f6cec99b4 |
| 3 | Subframe, snippet with Preview and Code toggle | https://mobbin.com/screens/21e41149-8a3f-403c-8487-b585f5cfe29e |

1. fal. Taken: a numbered table of contents in a left column that matches the section headings in the main column; package-manager choices shown as a small row of text tabs above a single command; one callout under the command for a migration note. This is the model for the right-hand "On this page" list and for the install command with its manager choices. Not taken: the page-wide tab bar (`Playground`, `API`, `Examples`), the coloured category pills, the language dropdown, the numbered headings (numbering is only used where the content is a sequence, as on the install page).
2. Base44. Taken: a `Copy for LLM` button at the top of an API reference, a `Copy` control on each code block, and a schema table with columns `Field`, `Type`, `Description` where the required marker sits next to the name. This is the nearest real example of serving a page to both readers, and the model for the Props table and for `Copy for agent`. Not taken: the black code blocks, the in-app left nav, the dropdown to pick an entity, the rounded card around every section.
3. Subframe. Taken: a code or snippet block that keeps a labelled header strip above the content with a small mode control at its right edge, and sits on a quiet ground inside a single outline. This is the model for the Example block header and its own copy button. Not taken: the `Preview` mode itself. The site has no renderer, so a preview toggle would promise something the page cannot show (struck in `06-docs-direction.md`, section 2.5).

## 3. Tokens page

| # | Reference | Link |
|---|---|---|
| 1 | Subframe, Theme with named colour scales | https://mobbin.com/screens/4ff42bf9-0e37-4b0c-a29b-f6e7270e2eee |
| 2 | Replit, generated design system overview | https://mobbin.com/screens/8459dad3-b886-444e-94dd-d26fad564348 |
| 3 | Canva, brand guidelines colour section | https://mobbin.com/screens/b53729cd-a239-40de-86b1-257eaaecb158 |

1. Subframe Theme. Taken: each colour is shown with its name and its value printed under it, grouped under a family heading. Confirms that name and value belong together in text, not only as a drawn swatch. Not taken: the round swatches, the horizontal scales of ten steps (the library has 13 semantic roles, not scales), the Import and Export header buttons.
2. Replit design system. Taken: a left list that splits the system into named groups (colour, fonts, layout, actions), which fits the groups on the tokens page (colour, radius, spacing, type, native metrics, icons). Not taken: the in-page component demo panel, the two-up card layout, the product chrome around it.
3. Canva guidelines. Taken: a colour row followed by a contrast check row that shows the same pairs with a pass mark. This is the model for the contrast column the tokens page prints for each colour. Not taken: the full-width saturated blocks, the RGB and CMYK lines, the long colour names.

## 4. Install page

| # | Reference | Link |
|---|---|---|
| 1 | Plausible Analytics, install step | https://mobbin.com/screens/9db62a0b-040d-417e-8160-73571aadeb2d |
| 2 | Subframe, Connect to code panel | https://mobbin.com/screens/75dcec3e-27e2-4df1-829b-fabdfe1408f1 |
| 3 | Higgsfield, MCP and CLI skills steps | https://mobbin.com/screens/8e3fd431-a542-4bc6-b776-8d5c718b854e |

1. Plausible. Taken: a short list of install methods as small labelled buttons above one command box with `Copy` pinned inside the box; a plain "Need help?" line with a docs link under it. This is the model for the Registry and Release tarball choice and for placing `Copy` at the box edge. Not taken: the single-column centred page, the filled "I've installed it" confirmation, the trial banner.
2. Subframe Connect to code. Taken: each step has a short heading, the exact command in its own box with its own copy control, and a one-line note under it saying what the command does. The panel serves agent tools (Claude Code, Cursor), so it is the closest match to the site's agent-facing install paragraph. Not taken: the modal presentation, the collapsed accordion per tool, the icons beside each step.
3. Higgsfield. Taken: install shown as three numbered steps, because the steps are a real sequence, each with a command box and a copy control; a method switch above them. Supports numbered steps on the install page only. Not taken: the dark theme, the lime hero block, the decorative logo cluster, the uppercase headline.

## 5. Search

| # | Reference | Link |
|---|---|---|
| 1 | incident.io, command search | https://mobbin.com/screens/f1b4ccbd-d6f6-4ccb-89b5-3c48d9fd2151 |
| 2 | Mintlify, search with page snippets | https://mobbin.com/screens/7c7ad31f-9dfe-4be7-83d7-6002fe31d4d0 |
| 3 | Replit, command results with one-line descriptions | https://mobbin.com/screens/ac9c17aa-2c99-4334-a69e-e25b84ea4da2 |

1. incident.io. Taken: results grouped under plain group labels, a footer row of keyboard hints (`To navigate`, `To select`), and a highlighted current row. This is the model for grouping by category and for the key-hint footer shown at 1280 px. Not taken: the dialog presentation over a dimmed page (the site uses a page, see `06-docs-direction.md` section 2.5), the severity badges, the action rows that run commands.
2. Mintlify search. Taken: a result row that shows the matched page title, the section name beneath it and a snippet of its text; an `ESC` marker in the field. Not taken: the mixed dashboard and page groups, the icon per row, the dim backdrop.
3. Replit. Taken: a result row is a name followed by a one-line description on the same line. That is the exact shape of `copy.json` entries (title plus a sentence under 140 characters). Not taken: the breadcrumb chip inside the field, the sidebar, the command-style monospace names.

## 6. Where the references are weak

| Screen | Strength | What I used instead and why |
|---|---|---|
| Home | Weak to moderate. Only Mintlify is a documentation landing page, and it is a starter template viewed inside an editor. | Snowflake supplied category grouping and Braintrust the first-viewport code block. The remaining structure (tier 1 rows grouped by `category`, the agent row) comes from `01-user-research.md` and the front matter in `doc-template.md`, not from a reference. |
| Component page | Good for the install, props and copy structure. Weak for the page as a whole, because no result was a component-library page with a live preview. | The preview slot is struck rather than approximated. The token strip is original to this direction and has no reference. |
| Tokens | Moderate. All three are in-product theme or brand screens, none is a code-facing tokens page that prints CSS variable names. | The variable-name and utilities columns, and the `Copy CSS` block, come from the table in `docs/THEME_TOKENS.md`. |
| Install | Good, with the caveat that all three are product onboarding steps, not library docs. | Registry versus tarball content comes from `README.md` and decision 28, not from the references. |
| Search | Good for result structure, but all three are in-product command palettes, not documentation search. | The dedicated page, the query-string state and the no-JavaScript list come from the file:// and decision 36 constraints, not from a reference. |

Two screens, home and tokens, have the weakest evidence. None of the 15 links is invented; each was returned by `search_screens`.

## 7. Reference index

All 15, one line each, for the commit summary: Mintlify d4ce0aef, Snowflake 620c1b18, Braintrust 0137e9e2 (home); fal d7cd6f6e, Base44 67828c1b, Subframe 21e41149 (component); Subframe 4ff42bf9, Replit 8459dad3, Canva b53729cd (tokens); Plausible 9db62a0b, Subframe 75dcec3e, Higgsfield 8e3fd431 (install); incident.io f1b4ccbd, Mintlify 7c7ad31f, Replit ac9c17aa (search).
