# Vendored @nyc-tron/ui sources (verbatim)

Copied byte-for-byte from `packages/ui/src/components/` in nyc-tron-ui at
commit 8410e435176f396bcb65f04d3202e5bdbd29d507 (branch codex/w4-m1b-spark).
No edits — these files are the real product sources; the Spark host supplies
the runtime (RN 0.83 / Expo 55) and the theme tokens via global.css.

- Button.tsx, SegmentedControl.tsx, Card.tsx, TextField.tsx
- styles.ts (joinClasses)
- forms/choice-keys.ts (keyboard model used by SegmentedControl)

Not ported: Select/TabBar/Toolbar (zustand dependency), all `.native.tsx`
(@expo/ui — iOS/Android only), shell/forge components (heavier deps).
