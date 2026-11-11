# P05 blend, alpha and compositing policy

B-11 adds independent LayerBlendAndOpacity and layer-blend-model exports. Host-supplied catalogs name the available blend modes and encoded/linear compositing spaces. Disabled modes/spaces retain their reasons. Alpha can be entered to six decimal places through the existing PrecisionScrubber; straight and premultiplied representations are explicit host requests. No pixel conversion or document-profile assignment occurs inside the control.

One scoped transaction carries the complete policy and an AbortSignal. Changing the document, selected layer, permission or capability catalog retires pending UI work. Old menus close and incomplete alpha drafts cannot write into the next layer. Host failures remain visible and a successful request clears them. Pending admission uses a ref; native/async resources stay outside serialized Zustand state.

Validation passes 855 source tests, UI build/types and native consumer types. Ten final browser cases pass in 7.7 seconds: six-decimal alpha and endpoints, capability filtering, encoded/linear and alpha-policy requests, document/layer/permission replacement, preview cancellation, pending abort, error/recovery, stale menu dismissal and narrow RTL geometry. Policy choices use the existing anchored menu so following content cannot cover their options.

The example applies policy to its controlled document state. It does not establish a production compositor's blend/color accuracy or physical gamut. Native runtime and eight-platform acceptance remain open. Review count is 101 of 341; P05 continues with mask and clipping ownership.
