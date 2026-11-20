# Installing NYC-Tron UI for ProfileSettings.tsx (empty Expo app)

Source read: the checkout only (README, docs/THEME_TOKENS.md, packages/ui, examples/native-instruments).
Nothing was executed. Items marked UNCLEAR are not settled by the checkout.

## Version problem (UNCLEAR, blocks step 3)

The README install URLs use `v1.0.0` tarballs, but the checkout's package.json files say
`1.0.0-rc.2`, and `packages/ui/package.json` has `"private": true`. The README says
"Nothing is published to npm" and that v1.0.0 URLs "become usable after release".
I could not confirm a release exists. If it does not, you must build tarballs from the
checkout (`pnpm pack:release`, maintainers' command, produces `release-packs/`) and install
those files instead of the URLs. The README warns that `v1.0.0-rc.1` tarballs declare
`react-native-gesture-handler >=3.4.0 <4` and fail with ERESOLVE on the Expo default pin.
rc.2 declares `>=3.3.0 <4`, which the Expo SDK 58 pin satisfies.

## Steps

1. Create the app (README):
   npx create-expo-app@latest my-app --template blank-typescript
   cd my-app

2. Make sure the Expo SDK is 58 (README and docs/SUPPORT.md pin expo 58.0.24, react-native 0.88.1,
   react 19.3.0). `react >=19` and `react-native >=0.88` are required peers of @nyc-tron/ui.
   UNCLEAR: whether `create-expo-app@latest` yields SDK 58 on your date; check `expo` in package.json.

3. Install the two NYC-Tron packages (README; npm 12 needs --allow-remote, do NOT use `npx expo install`):
   npm install --allow-remote=all \
     https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v<v>/nyc-tron-core-<v>.tgz \
     https://github.com/mikevocalz/NYC-Tron-UI/releases/download/v<v>/nyc-tron-ui-<v>.tgz
   (`@nyc-tron/core` is an optional peer of ui and ProfileSettings does not import it;
   the README installs it anyway. Skipping it is probably fine: inferred.)

4. Install the styling stack. The components style only through Tailwind v4 class names resolved
   by Uniwind. These are NOT required by the README's "Hello Button" snippet, but without them
   `className` is ignored and the screen renders unstyled (inferred from Button/Card/TextField
   source, which use className only). Versions are the ones the repo's own example pins:
   npm install tailwindcss@4.3.5 uniwind@1.13.2
   (Uniwind peer range: >=1.12.2 <2. UNCLEAR: Uniwind's own extra peers, such as
   react-native-reanimated or react-native-nitro-modules, are not documented in this checkout.
   Follow Uniwind's install docs; I did not read them.)

5. Create `global.css` at the app root. Tokens must exist or utilities silently produce no style
   (docs/THEME_TOKENS.md). Use your own brand values; these are the doc's neutral reference values:

   @import "tailwindcss";
   @import "uniwind";
   @source "./node_modules/@nyc-tron/ui/dist/components";

   @theme {
     --color-primary: #1f5fd1;
     --color-on-primary: #ffffff;
     --color-surface-raised: #ffffff;
     --color-surface-sunken: #f1f3f6;
     --color-border: #c9ced6;
     --color-text: #15181d;
     --color-text-muted: #5a626e;
     --color-danger: #b42318;
     --color-on-danger: #ffffff;
     --color-accent: #1f7a6d;
     --color-info: #1d5fa8;
     --color-success: #1e7a3c;
     --color-focus: #1f5fd1;
     --radius-control: 8px;
     --radius-card: 12px;
   }

   The `@source` path is inferred: the README says the package ships only `dist/` and to "choose an
   actual path resolvable from the consuming workspace". Dark mode: THEME_TOKENS.md shows a
   `@media (prefers-color-scheme: dark)` block, but says Uniwind takes dark values through its own
   mechanism. UNCLEAR where that goes; skip dark for a first run.

6. Create `metro.config.js` (pattern from examples/native-instruments/metro.config.js, reduced):

   const { getDefaultConfig } = require("expo/metro-config");
   const { withUniwindConfig } = require("uniwind/metro");
   const config = getDefaultConfig(__dirname);
   module.exports = withUniwindConfig(config, {
     cssEntryFile: "./global.css",
     dtsFile: "./uniwind-types.d.ts",
   });

   The example also adds workspace resolver overrides; those are for the monorepo and omitted here.
   UNCLEAR: whether Uniwind needs a babel plugin. The example has no babel config, so I assume not.

7. Import the CSS once at the entry (example does `import './global.css'` in App.tsx). In the template's
   `App.tsx`:
   import "./global.css";
   import ProfileSettings from "./ProfileSettings";
   export default function App() {
     return <ProfileSettings onSave={name => console.log("save", name)} />;
   }
   Copy ProfileSettings.tsx next to App.tsx. If the app uses Expo Router NativeTabs, a new route needs a
   NativeTabs.Trigger on iOS/Android (README).

8. Run: npx expo run:ios  (or run:android). No config plugin is needed for @nyc-tron/ui (README).
   Native projects come from prebuild. Expo Go suitability is UNCLEAR (Uniwind may need native code).

## Not verified
Nothing was installed, bundled or type-checked. Peer `react-native-gesture-handler` is optional and
not used by Button, Card or TextField (checked in their source imports).
