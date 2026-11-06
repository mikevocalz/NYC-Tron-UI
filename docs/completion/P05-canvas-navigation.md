# P05 canvas navigation checkpoint

B-02 has an independent CanvasPanZoom export and pure navigation model. The controlled viewport belongs to the app; previews use an instance Zustand store, while touch ownership, measurement tickets and wheel timers stay in refs. The render callback receives the preview viewport without a second transform or renderer ownership. Scope, revision, geometry, permission and controlled-value changes cancel outstanding work.

RNGH 3.4 pan/pinch hooks recognize native touch input, with explicit JS callbacks and one simultaneous gesture owner. Two contacts combine centroid travel and scale; an app pan tool may enable one-pointer navigation. Third contacts, Escape and stale document contacts cancel without committing. A non-passive web wheel adapter accumulates one burst into one commit. Keyboard and accessibility actions expose fit, actual size, zoom and physical canvas pan without mirroring geometry in RTL. Local usable regions reject gestures beginning over a hinge or reserved pane.

The native example depends on the exact RNGH version and Metro shares that runtime with the component. The browser harness also resolves one RNGH context and defines the standard development flag. Public imports remain isolated from the main UI barrel. CanvasNavigationDemo demonstrates controlled callbacks with a React Native scene and preserves scene identity through navigation; it does not establish GPU rendering.

Validation: UI build and type checks passed, native example TypeScript passed, five pure-model tests passed and nine Chromium browser tests passed. Browser cases verify exact anchored pinch geometry, wheel accumulation, focus retention, scope replacement during wheel and touch input, disabled input, Escape cancellation, a third contact and reserved-hinge input. Native runtime and eight-platform acceptance remain unverified for this new component. A native rebuild is required to include RNGH in the acceptance app.

Review count is 91 of 341. P05 remains in progress.
