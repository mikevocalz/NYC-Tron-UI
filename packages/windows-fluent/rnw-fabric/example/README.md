# Windows consumer acceptance app

This isolated React Native Windows 0.85 app consumes the local Fabric package.
Its native executable is generated from the pinned RNW official `cpp-app`
template, then receives an explicit project reference and WinRT package provider
registration. It does not depend on Expo or load the mobile React Native version.

On Windows with Visual Studio 2026 and Windows App SDK prerequisites:

```powershell
# From packages/windows-fluent/rnw-fabric
npm install
npm run codegen
cd example
npm install
npm run init:windows
npm run prepare:host
npm run typecheck
npm test
npm start
# Separate terminal in example:
npm run windows
```

The app owns its Zustand store. Selecting Workspace creates a pending request;
Accept commits it, Reject keeps Home selected. Settings and pane toggles retain
the committed route. Disabled and unknown destinations cannot navigate.

CI generates the native host, builds it through its solution, deploys the
packaged app with `run-windows`, and runs `scripts/uia-smoke.ps1`: launch,
Down+Enter on Workspace, Reject, then Accept, checking the native selection
after each step. `prepare:host` adds the library project to the generated
solution and a Metro resolver so the bundle carries one React and one
react-native-windows; `scripts/check-bundle-singletons.mjs` enforces it.

Still manual: Settings focus return, Narrator speech, high contrast, pointer
input, an RTL locale and resizing.
