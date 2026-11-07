# Design prototypes, collaboration and handoff

Reviewed L-08 through L-15.

Prototype connections use the shared native point grip to drop connections into actual frame bounds, plus explicit destination selection. Frame/hotspot geometry changes cancel stale drags. InteractionTriggerEditor exposes supported trigger types, delays, destinations, actions and transition settings. PrototypePreviewPlayer displays the actual host surface and transition clock, with start/pause/back/restart/stop controls. FlowOverview exposes entry points, incoming/outgoing relationships and runtime launch requests.

DevHandoffInspector displays source measurements, typography, assets and revision-bound code hints; native clipboard/export actions remain host requests. CollaborationPresence displays actual host cursors, selections, connectivity and conflict states, with follow controls. CommentPins shares the authoritative CommentsThreadPanel. MultiExportSlices configures format, alpha, trimmed bounds, scale and suffix per slice, batches actual host exports and displays acknowledged outputs.

These controls use original UI code, shared state/gesture owners and explicit host operations. They do not implement a layout/prototype/collaboration/export engine. Validation: combined UI TypeScript build passed. Native pointer, collaboration transport, export artifacts, accessibility and runtime acceptance remain deferred until user review.
