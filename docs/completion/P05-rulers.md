# P05 ruler review

B-03 reuses the existing CanvasRuler owner and independent export. Scope/revision, committed viewport, guide metadata and permissions bound its pointer, keyboard and native accessibility callbacks. Scope/geometry/permission replacement clears in-flight guides and origin edits; callbacks retained by old views cannot write the next document. Instance drafts use Zustand and committed callback guards use refs/layout effects. Units, finite geometry, unique bounded IDs and a 10,000-guide budget are validated. Existing upstream notices remain intact.

The review corrected guide hit-area dimensions: horizontal guides span viewport width and vertical guides span viewport height. Orthogonal clipping uses the matching axis. Rulers smaller than their visible strip no longer create negative lengths.

Validation: UI build, all 18 canvas guide/model source tests and seven Chromium interaction tests passed. The latter include scope replacement and disable during a held drag, no late commit, preview cleanup, exact guide hit-area geometry, keyboard add/remove, Escape, pivot and align behavior. The existing responder adapter is retained for this component; this checkpoint does not claim native runtime or full platform acceptance. Review count is 92 of 341.
