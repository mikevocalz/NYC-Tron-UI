# Single-source icon extraction

The original Forge icons live in Nitro Forge draft PR #21. NYC-Tron
now has a separate source package, @nyc-tron/icons, containing the
authored outline/filled SVG artwork, semantic catalog and state contract.

The source is private and not published or device-certified.

Migration order:
1. Validate NYC-Tron source tests, package exports and isolated package tarball.
2. Test the SVG renderer in real Moyo, NYC-MON and Forge consumer themes.
3. Change Forge's existing icon package into a compatible NYC-Tron import
   only after full acceptance. Do not retain two divergent glyph catalogues.
4. Port the selected/filled native OS and Rive adapters separately.

Missing icons in the semantic inventory have no authored vector paths.
Never invent that the whole catalog is complete.

Until step 3 lands, Nitro Forge's `packages/icons` is a parallel copy, not a
consumer. This package already differs from it: 30 more glyph pairs, a
distinct filled `menu`, a redrawn `move` outline, masked knockouts, no
built-in palette and strict namespaced lookup. Forge's local copy hides
decorative icons from assistive technology; that behavior is now here too. Rive .riv binary assets
and on-device animation are not included. Preserve user-supplied brand colors
rather than forcing any static Forge purple onto other applications.
