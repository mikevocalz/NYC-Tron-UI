# PDF organization and output

Reviewed K-02, K-10, K-11, K-13 through K-17.

Thumbnail and organizer controls share a virtual page list, native RNGH drag ordering, group assignment and permission checks. Duplicate, rotate, delete and insert operations use document-scoped host callbacks. Deletion requires confirmation and preserves at least one page. Extraction, merge and split validate selected source documents and page ranges before requesting host processing.

Hyperlink editing retains a local draft until Apply and validates web, email and stable page destinations. Comparison displays supplied before/after/difference surfaces. Redaction requires a reviewed plan revision and explicit confirmation before requesting permanent application. Encryption passwords stay in a nonpersisted per-instance store, clear on close/scope change/operation completion, and are excluded from identities and error messages. Clearing references does not guarantee memory zeroization.

Print/export consumes actual host validation and output acknowledgements. Required profile validation must match the configuration revision. PDF rendering, encryption, redaction, comparison and conformance engines remain host-owned; these controls do not fabricate their results.

Button now preserves its minimum touch geometry with optional single-line labels for virtual rows and supports function-valued Pressable styles. Combined UI TypeScript build passed. Runtime, native gesture, engine integration and accessibility acceptance remain deferred until user review.
