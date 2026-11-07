# Graph interaction source correction

PatchGraph no longer keeps uncommitted positions after release. Only an active drag previews a position; the controlled nodes remain authoritative on completion, rejection or a different incoming source position. This avoids displaying a failed host edit as accepted geometry.

The component owns ephemeral positions, cable selection and error state in its per-instance vanilla Zustand store with selectors. A separate geometry/source boundary invalidates drag admission, stale request outcomes and previews. Removed or retyped output ports no longer remain selected as usable cable sources. Promise rejection is consumed and shown by the component ErrorMessage/optional onInteractionError callback; host-owned action failures continue through the existing parent error surface. Later requests, geometry changes and unmount suppress older async errors.

NodeGraphCanvas and NodeGraphEditor now pass interactionBoundary instead of changing PatchGraph keys on zoom, pan, resize or pending admission. PatchNode keys remain the stable node IDs. Gesture cancellation uses the explicit boundary and preserves native view identity. Motion graph mutation handlers return their actual action result instead of discarding it. Selection, viewport, authoritative graph evaluation and native resources remain host-owned.

Applied the project foldable layout, React Native/gesture and no-ai-slop guidance. This correction retains the existing createCanvasResponder adapter; it does not add a second gesture or renderer stack. It changes no app window contract, platform config, dependency or released export activation.

Validation: 9 focused node tests passed across patch-interaction, patch-graph and motion-node-graph. They cover rejected callbacks, stale/closed async outcomes, authoritative mismatch, dangling port selection, scale math and structural prevention of geometry-key remounts, alongside actual typed graph policy/math. UI TypeScript and slots TypeScript passed. Diff whitespace check passed. These are source checks; device focus behavior, browser interactions and native acceptance were not exercised here.
