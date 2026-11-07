# Document review and structure

Reviewed H-03, H-07, H-13 through H-16, H-21 and H-22.

RichTextRibbon, list formatting and NavigationOutline now guard document/revision and async requests. Existing list nesting rules, mixed selection state, heading/bookmark/page navigation and host thumbnails remain shared owners. Document comments reuse CommentsThreadPanel with mention choices and collaborator IDs; reply admission rechecks open threads and preserves drafts on failed requests. TrackChangesView renders actual insert/delete/format records and requests individual accept/reject transactions. TableOfContentsEditor exposes heading depth, number/leader/link settings, actual generated entries and explicit update modes.

Shared ReadAloudTransport now scopes voice/rate/skip mutations, keeps stop available and retains screen-reader announcement opt-in. DocumentReadAloudTransport continues to supply paragraph/heading context from actual sentence and word-boundary telemetry. DictationSessionPanel admits native permissions/offline capability, reports supplied recognition status/interim text, provides a Zustand review draft and requests one insertion/undo transaction. Neither control creates a synthetic speech engine.

Validation: combined UI TypeScript build passed. Source/browser/native text, voice, IME, accessibility and document-engine acceptance are deferred until the user's review. New components are original; no external candidate code was copied.
