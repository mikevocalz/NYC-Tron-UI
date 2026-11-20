# Acceptance run: NYC-Tron UI

Date: 2026-11-20. One run per condition. The numbers are single measurements and noisy.

## Task given to both agents

Build a "Profile settings" screen: one Card with a TextField for the display name and a Button that saves it, laid out vertically with consistent spacing, using only library components and the library's own token conventions.

## Conditions

| | Before | After |
|---|---|---|
| Information | A plain checkout of `main` as it was before this branch: README, docs/, packages/. No registry, no `llms.txt`. | An empty app, `llms.txt`, and the shadcn CLI (`search`, `view`, `add`) against the built registry. |
| Installs | None (disk). Writes `INSTALL.md` from what it can infer. | One `shadcn add` of Card, Button, TextField, layout/Stack, layout/Text. Wrote 8 files. |

Method: each agent was a fresh subagent. Token, tool-call and duration figures come from the harness's own per-agent usage report, not from the agents. "Total tokens" is the harness's subagent total and includes the agent's system prompt and every tool result it read.

## Measured

| | Before | After | Change |
|---|---|---|---|
| Total subagent tokens | 168,196 | 151,844 | -9.7% |
| Tool calls | 11 | 8 | -3 |
| Wall time | 82 s | 62 s | -20 s |

## What the numbers do not show

- One run per side. A 10% difference on n=1 is inside run-to-run noise, so treat it as "not worse, probably a little cheaper", not as a measured saving.
- The larger difference is in what the agent could establish:
  - Before: used `gap-4` and `p-4` (stock Tailwind scale, not library tokens) and marked them inferred. It could not confirm a release exists at the README's `v1.0.0` install URLs, and listed Uniwind peers and babel setup as unclear.
  - After: used `Stack padding={4} gap={3}` (token keys) and `Text variant="body"`. It verified every prop it used from the docs, installed through the registry, and confirmed all 5 local imports resolve to files on disk. Independently re-checked: 8 installed files exist, 0 unresolved imports, no raw colour or spacing numbers (the one literal, 40, is an application character limit).
- The after agent found a docs defect: page examples imported `@nyc-tron/ui/components/X` while a registry install creates `@/components/nyc-tron/ui/components/X` (decision 49 and the follow-up commit fix it).
- The after agent still lists Uniwind and `global.css` theme wiring as manual steps, because a file copy cannot set up a Tailwind or Uniwind pipeline.

## Limits of this test

- The registry and `llms.txt` were served from localhost with the raw GitHub URLs rewritten to localhost (only change to the content). Live `raw.githubusercontent.com` URLs resolve only after this branch is merged to `main`.
- The shadcn CLI was used, not the MCP server directly. The MCP server wraps the same CLI; its stdio handshake and tool list (7 tools) were verified separately. A subagent cannot attach an MCP server mid-session.
- `npm install` was replaced by a no-op shim (disk). No peer package was installed, nothing was type-checked against React Native, nothing was rendered.
- "No repo access" is enforced by instruction. The transcript was parsed afterwards: 8 tool calls, 0 touching library checkouts or audit files.

## Artefacts

`acceptance-tron/`: `before-ProfileSettings.tsx`, `before-INSTALL.md`, `after-ProfileSettings.tsx`, `after-INSTALL.md`.
