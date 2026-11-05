# Rendered web overlay acceptance

This fixture bundles the actual web files for `NativeActionMenu`, `NativePopover`
and `Tooltip`, plus `CommandPopover` and `CommandPalette` from `@nyc-tron/ui`,
through React Native Web. It does not mock the menu, Pressable, Modal, focus handling or Zustand.
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

`overlays-visual.spec.mjs` opens the popover, command popover, palette and
tooltip in the InFraX light and dark themes at 390 and 820 px wide, checks that
each surface stays inside the viewport without horizontal scroll, and saves a
PNG of each. CI uploads them as the `overlay-renders` artifact for review. The
server stands in for the host app's Uniwind output: it writes the theme tokens
as CSS variables, defines only the utility classes these components use, and
forwards `className` to the DOM the way Uniwind does on web.

These tests do not establish iOS/Android native behavior, screen-reader output,
Safari/Firefox acceptance, foldable hardware support or app-theme screenshots.
