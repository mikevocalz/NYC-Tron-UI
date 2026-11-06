# Color management controls

Implements reusable UI for C-07, C-08, C-09, C-10, C-14, C-15 and C-25. Every control and the shared types have independent `@nyc-tron/ui/components/forge/color/...` exports. The rendered consumer imports these built exports without Forge.

PrintColorChannels edits CMYK percentages with an explicit profile ID and alpha. WideGamutChannels retains floating-point channels, negative values and values above one; its range is configurable. Neither control converts between profiles or truncates into RGB bytes.

ColorSpaceChooser requests a profile change from application-provided choices. GamutWarning displays actual engine-produced counts, with unknown measurement distinct from an in-gamut result. ThemeColorReferences binds stable token identities and exposes an explicit detach action. SpotAndGlobalColorEditor edits a host-controlled draft, tint, type and sRGB alternate preview, then invokes one cancellable save operation; failures remain visible. SoftProofControls preserves the rendering intent and output simulation settings and requires a selected profile before enabling proofing.

The host remains responsible for ICC/profile loading, conversion, ink separations, proof rendering, gamut measurement, document transactions and stale-revision rejection. These UI contracts do not assert those engine operations are implemented.

Validation covers profile identity, invalid channel ranges, floating HDR values, measured gamut bounds, named color definitions and proof-profile requirements. Browser interaction checks cover actual host state changes, explicit save and failure handling, reference binding/detachment, profile selection and proof settings, plus 320-pixel LTR/RTL hosts. Native interaction, screen readers, desktop/XR and physical-device acceptance remain unverified for these new controls.
