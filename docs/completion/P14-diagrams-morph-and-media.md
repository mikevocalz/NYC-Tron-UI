# Diagram, morph and embedded media tools

Reviewed J-07, J-10, J-15 and J-16.

ConnectorAndDiagramTools draws document-coordinate straight/elbow connections from actual named object anchors, with direction arrows and labels. Its canvas scales inside the measured pane; edits validate current endpoints and persist through the host. MorphPreview exposes one-to-one object correspondence, scrubbing and actual host-rendered frames/progress, with source-owned playback and cancellation.

MediaInsertInspector composes the actual native media surface, shared in/out handles and playback/fit/gain options, with scoped source replacement and preview. ChartAndTableEditor shares ChartBuilder, the virtual spreadsheet data grid and table-layout owner; it introduces no second chart/table engine or persistence model.

Validation: combined UI TypeScript build passed. Full source/browser/native rendering, diagram interaction, authored transition/morph motion, decoder playback and accessibility acceptance remain deferred until user review. All renderer/player resources and engine operations stay with the consuming host; no synthetic frames or playback clock were introduced.
