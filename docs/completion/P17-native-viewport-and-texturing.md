# Native viewport and texturing controls

Reviewed M-01 through M-09.

Native3DViewport sends actual native RNGH orbit/pan/pinch samples to the host camera and requests ray picks against its supplied surface. Scope, geometry and permission changes cancel active interactions. Orientation controls expose standard views, projection and fit. TransformGizmo3D combines a projected native grip with axis/space/mode selection and the existing numeric 3D inspector. Camera revision changes invalidate projected drags.

UVEditor shares the point editor for an explicitly bounded active tile selection, with island selection, seam requests, native model selection preview and packing. TextureSetPanel exposes actual PBR channels, previews and replacement/visibility requests. PBRMaterialInspector edits material parameters against a source-backed preview.

TextureBrush3D requires a native/JSI surface-projection adapter returning mesh/triangle/barycentric/UV/world hits, including null misses. It streams measured stylus pressure and cancel/end events. The host owns seam continuation and texture writes. Mask/generator/fill parameters and BakingMapPanel request actual host computation and display source output records. No engine, material render, surface projection or baked map is synthesized by the UI.

Validation: combined UI TypeScript build passed. Native rendering, projection, stylus, GPU, UV packing, baking, accessibility and performance acceptance remain deferred until user review.
