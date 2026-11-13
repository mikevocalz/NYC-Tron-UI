# P05 blend, alpha and compositing policy

B-11 adds independent LayerBlendAndOpacity and layer-blend-model exports. Host-supplied catalogs name the available blend modes and encoded/linear compositing spaces. Disabled modes/spaces retain their reasons. Alpha can be entered to six decimal places through the existing PrecisionScrubber; straight and premultiplied representations are explicit host requests. No pixel conversion or document-profile assignment occurs inside the control.

One scoped transaction carries the complete policy and an AbortSignal. Changing the document, selected layer, permission or capability catalog retires pending UI work. Old menus close and incomplete alpha drafts cannot write into the next layer. Host failures remain visible and a successful request clears them. Pending admission uses a ref; native/async resources stay outside serialized Zustand state.

Validation passes 855 source tests, UI build/types and native consumer types. Ten final browser cases pass in 7.7 seconds: six-decimal alpha and endpoints, capability filtering, encoded/linear and alpha-policy requests, document/layer/permission replacement, preview cancellation, pending abort, error/recovery, stale menu dismissal and narrow RTL geometry. Policy choices use the existing anchored menu so following content cannot cover their options.

The example applies policy to its controlled document state. It does not establish a production compositor's blend/color accuracy or physical gamut. Native runtime and eight-platform acceptance remain open. Review count is 101 of 341; P05 continues with mask and clipping ownership.

## Alpha representation catalog (1.0.0-rc.2)

Added after 1.0.0-rc.1 for row B-11 (F3 decision, option A). Hosts can pass
`alphaModes` to say which alpha representations their compositor accepts.
Each entry is `{id: 'straight' | 'premultiplied', label, unavailableReason?}`,
the same shape as the `modes` and `spaces` catalogs.

```tsx
// A compositor that stores straight alpha only.
<LayerBlendAndOpacity scope={docId} layerId={layerId} value={value}
  modes={modes} spaces={spaces}
  alphaModes={[{id: 'straight', label: 'Straight alpha'}]}
  onCommit={commitBlendPolicy}/>

// Both listed, Premultiplied shown with the reason it can't be used.
alphaModes={[
  {id: 'straight', label: 'Straight alpha'},
  {id: 'premultiplied', label: 'Premultiplied alpha',
   unavailableReason: 'This compositor stores straight alpha only.'},
]}
```

| Catalog | What renders |
| --- | --- |
| Omitted | The rc.1 menu: Straight alpha and Premultiplied alpha, both available (`defaultAlphaModes`). |
| One entry | The entry's label as plain text under "Layer alpha representation". No menu. |
| Two entries, at least one available | The menu. Unavailable entries are disabled and show their reason as the item description, which is also part of the item's accessible name. Choosing one does not call `onCommit`. |
| Two entries, none available | Plain text: the current label, then "Label: reason" for the other entry. The current entry's reason is in the alert line. |

The current `value.alphaMode` must be in the catalog. If the current entry
has an `unavailableReason`, that reason appears in the alert line and the
opacity scrubber and the blend-mode and space menus are disabled, so the
alpha menu is the one way out. A blend-mode or space problem still disables
the alpha menu, as in rc.1.

Whenever the alpha menu can't show a reason (it is disabled by the host or by
a blend problem, or the row is text) the reasons render as `Label: reason`
lines under the row. The current entry's reason is left out only when the
alert line already shows it. Inside the menu a description is cut to two
lines, so keep reasons short.

Passing `alphaModes` adds it to the control's owner key, as `modes` and
`spaces` are. A changed catalog, or switching between an omitted prop and an
explicit `defaultAlphaModes`, remounts the control and retires its pending
request.

`validateLayerBlend(value, modes, spaces, alphaModes)` throws `RangeError` for
an empty catalog, more than two entries, duplicate or unknown ids, a blank
label or reason, a reason over 1024 characters, or a current value outside
the catalog. The component calls it on every render, so a bad catalog throws
from render.

Write `unavailableReason` as a sentence the user can act on. It is shown and
spoken as written.

Evidence for this change: `packages/ui/tests/layer-blend.test.mjs` (model),
`packages/ui/tests/render/layer-blend.render.test.mjs` (rc.1 parity golden and
catalog cases, shallow render with mocked hosts) and two Chromium cases in
`packages/ui/tests/browser/layer-blend.spec.mjs` against
`fixtures/layer-blend-alpha.tsx`. No native device run covers it.
