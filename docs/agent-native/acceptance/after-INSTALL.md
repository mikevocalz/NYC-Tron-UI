# Install

Run from the app directory (has package.json, tsconfig.json with `@/*` -> `./src/*`, components.json).

1. components.json must carry the namespace (it did):
   `"registries": { "@nyc-tron": "http://localhost:4875/r/{name}.json" }`
2. Add the items (the tool run used the npm shim; shadcn copies files only):
   `npx -y shadcn@4.23.0 add @nyc-tron/Card @nyc-tron/Button @nyc-tron/TextField @nyc-tron/layout/Stack @nyc-tron/layout/Text -y </dev/null`
   Files land in `src/components/nyc-tron/ui/` (components/*.tsx, components/layout/*, components/styles.ts, tokens.ts).
3. Copy ProfileSettings.tsx into the app, e.g. `src/screens/`.

Still by hand (per the docs, not done here):
- Install peers: react >=19 and react-native >=0.88 (no other peers for these items).
- Tailwind v4 + Uniwind, with an `@source` line for `src/components/nyc-tron` (README section "App-specific Tailwind v4 / Uniwind styling"; I did not read README).
- Define the 13 colour and 2 radius CSS variables (docs/THEME_TOKENS.md) for light and dark in global.css; missing ones paint nothing silently. global.css in the app is empty/unchecked.
