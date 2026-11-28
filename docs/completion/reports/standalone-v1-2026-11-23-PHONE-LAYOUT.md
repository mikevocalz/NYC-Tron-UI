# Kitchen rail fixture phone layout

Status: app-layout fix candidate; native recheck remains separate. No library
API, navigation policy, app window/orientation, native configuration or owner
approval changes. The Android flow's separate semantic scroll-target fix is
preserved; this patch does not modify native-flow.mjs.

## Observed issue and design decision

The Android failure artifact's hierarchy records `rail-demo` at
`[37,615][245,616]` and `rail-result` at `[261,615][283,616]`. The expanded rail
occupied 208 pixels while the status received only 22. Both were vertically
clipped during that failed interaction. These are two distinct concerns: the
flow must seek an actual visible action, and the fixture must leave its status
and instructions readable when fully visible. This patch addresses the layout.

The original forced row is now an intrinsically wrapping row. The rail retains
its own width; the status keeps a 160-unit minimum and grows within its line.
The expanded 208-unit rail, 16-unit gap and minimum status need 384 container
units to share a row. Below that available measure, status moves underneath.
No viewport/device-family guess is introduced: a narrow pane on a wide window
wraps too. The same mounted views, selection, draft, live region and actions are
retained.

## Skill application and handoff

The [existing T5 design output](standalone-v1-2026-11-22-KITCHEN.md) supplies the
three developer profiles, semantic theme audit, visual rationale and viewed
Base/TextNow grouped-settings references for this same catalog template. This
follow-up creates no new screen and claims no new interviews or Mobbin research.

In the required sequence: user-research keeps the consumer's task of reading a
selected state beside its controls; design-system preserves app-owned tokens;
ux-copy preserves the explicit selected/disabled instructions; frontend-design
uses container-driven wrapping; the existing template references remain scoped
to grouping; design-critique identifies the 22-pixel status as a material
readability defect; accessibility-review checks readable reflow, contained text
and retained state; design-handoff specifies the exact measures below;
independent code review remains a separate approval of these frozen files.

| Handoff item | Specification and actual web measurement |
| --- | --- |
| Layout | `flex-row flex-wrap gap-4 items-start`; status `min-w-40 flex-1 gap-2`. No authored viewport breakpoint. |
| Expanded 320px viewport | Rail 208 × 164; status 246 × 104 underneath, at x=37 and y=596 after rail y=416. Selected state occupies one text line. |
| Collapsed 320px viewport | Rail 64 × 164; status 166 × 152 beside it. Selection remains Editor. |
| Wide 1100px viewport | Expanded rail 208 × 164; status 702 × 56 beside it. |
| Narrow pane within wide viewport | With the fixture container constrained to 248px on a 1100px viewport, status wraps underneath at width 248. |
| Tokens and semantics | Existing gap/text/color recipes, polite live region, action names and DOM/native source order unchanged. No truncation or new animation. |

The generated fixture screenshot was visually inspected: the selected label is
unbroken, instructions wrap into readable lines, and the selected/disabled rail
states remain visible. Full manual screen-reader speech and native font scaling
are not inferred from this image.

## Actual fresh-consumer validation

Core/UI were freshly built and packed from source base `f0dd6ddf`, then installed
into a **new** standalone consumer. No earlier consumer or installed UI package
was copied. The new rc.3 UI archive SHA256 is
`4e58b673dfd93b7e9347240e818c592680eb480ae2f4bcb711af12a85bcf7b51`;
core is `5aa8b5abb48df5e7bfbef28cf5676d37f453511c874d2c3f1ee735e0008211d6`.
The installed package identities, archive digests and npm integrity were checked.
The consumer has `sourceDirty: true`: these are development checks, not eligible
release-candidate evidence.

The actual exported app passed **106 browser assertions**: the existing 84 plus
22 responsive checks across direct/root imports. Checks cover expanded/collapsed
320px geometry, one-line selected text, instruction containment, wide layout,
a narrow pane inside a wide viewport, retained selection/draft, all existing
component states and actual light/dark palettes. Four existing rendered axe
WCAG-tagged cases have zero violations; no complete WCAG or native speech claim
is made. Consumer TypeScript, 14 focused source/release guards, syntax and
whitespace checks passed.

`web-results.json` records actual bounds as `layoutCases`; passing receipts bind
their assertion counts, result bytes and six screenshots. The two added images
are `kitchen-direct-rail-expanded-320.png` and
`kitchen-root-rail-expanded-320.png` in the kitchen web proof artifact. The exact
fixed export is also served separately for the lead's Argent browser inspection.
No local native-device action or native runtime pass is claimed by this writer.
