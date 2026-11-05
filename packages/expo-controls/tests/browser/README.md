# Rendered web menu acceptance

This fixture bundles the actual `NativeActionMenu.web.tsx` through React Native
Web. It does not mock the menu, Pressable, Modal, focus handling or Zustand.
All fixture UI is authored with React Native components; the server's HTML
is only the browser document bootstrap.

Run from this directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx --no-install playwright install --with-deps chromium
npm test
```

The isolated lockfile pins browser-only tooling without changing native package
peers or the root pnpm workspace. The dedicated workflow runs these interactions
in Chromium: keyboard open and initial focus, arrows/Home/End, disabled sections,
checked state, Space activation, Escape focus restoration, pointer selection and
backdrop dismissal. Assertions query actual accessible roles in the browser DOM.
Failure traces are retained as a CI artifact.

These tests do not establish iOS/Android native behavior, screen-reader output,
Safari/Firefox acceptance, foldable hardware support or app-theme screenshots.
