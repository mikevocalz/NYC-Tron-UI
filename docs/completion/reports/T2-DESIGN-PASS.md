# T2 title bar: §3.3 design pass

Surface: the window title bar in both drawn layouts (`macos`, `windows`), the
`native` mode that reserves system insets, and the title-bar strips the macOS
and Windows example apps draw under their system buttons.

Files reviewed:

- `packages/ui/src/components/window/WindowTitleBar.tsx`
- `packages/core/src/window-chrome.ts` (labels, insets, layout)
- `examples/macos-appkit/spark/App.tsx` (`DocumentTitleBar`)
- `packages/windows-fluent/rnw-fabric/example/App.tsx` (`DocumentTitleBar`)

Each section below came from loading the named skill through the Skill tool
on 2026-11-12 and applying its output format to these files. No rendered
capture was reviewed for the native strips: the AppKit and WinUI jobs produce
the only screenshots (`06b-custom-title-bar.png` in the WinUI artifact), and
this pass read source, not those images.

## 1. design:user-research

Not run as a separate step for T2. The T1 to T4 program shares one note per
product, owned by the integrator. For the title bar: the people who install
Tron's window chrome are app teams already on Spark (macOS) or React Native
Windows, who have a working window and want a title bar that does not fight
the system one.

## 2. Mobbin, per screen

**Not met.** Mobbin covers iOS, Android and web. It has no macOS or Windows
desktop title bars and no windowed iPadOS screens, so the three references per
surface the gate asks for could not be saved from Mobbin. No Dribbble
substitute was saved either. The references used instead are the platform
guidance the gate names: Apple HIG Windows and Microsoft's title bar guidance
for Windows App SDK.

## 3. design:design-system (audit)

**Components reviewed:** 3 (WindowTitleBar, macOS strip, Windows strip).
**Issues found:** 6.

### Naming consistency

| Issue | Where | Recommendation |
| --- | --- | --- |
| Style names differ per host: macOS `standard` / `hiddenTitle` / `contentUnderTitleBar`, Windows `standard` / `extended` | `MacOSTitleBarStyle`, `WindowsTitleBarStyle` | Keep. Each matches its platform's own vocabulary, and both expose the same `TitleBarInsets` shape. Documented in the handoff below. |
| macOS reads insets with `readInsets(id)`; Windows reports them on every snapshot as `titleBar` | `MacOSWindowChromeHost`, `WindowsObservedWindow` | Keep. AppKit gives no change event for button frames; RNW snapshots already carry geometry. |
| Default labels differ by layout ("Close window" vs "Close") | `DEFAULT_WINDOW_CONTROL_LABELS` | Keep. Each follows its platform's wording for the system buttons ("Close window" style on macOS, caption tooltips on Windows). |

### Token coverage

| Category | Tokens used | Hardcoded values |
| --- | --- | --- |
| Colour | `bg-surface-sunken`, `bg-surface-raised`, `bg-danger`, `border-border`, `border-accent`, `border-text-muted`, `text-text`, `text-text-muted`, `ring-focus` | 0 |
| Radius | `rounded-control` (macOS chips) | 1 before this pass: the edited dot used `borderRadius: DOT / 2`. Now `rounded-full`. |
| Type | `text-sm font-semibold`, `text-sm` | 0 in the component. The macOS example strip sets `fontSize: 12, fontWeight: '600'` inline. |
| Size | none | `TITLE_BAR_HEIGHT` 44, `CONTROL_TARGET` 44, `CAPTION_TARGET_WIDTH` 48, glyph 12, stroke 1.5, chip 20, dot 8. Exported constants, not tokens, because they are hit-target minimums, not theme values. |

### Component completeness

| Component | States | Variants | Docs |
| --- | --- | --- | --- |
| WindowTitleBar | focused, unfocused, edited, pending (disabled), vetoed announcement | drawn `macos`, drawn `windows`, `native` | JSDoc on every prop |
| macOS strip (example) | measured, unmeasured (height 0) | one | inline comment |
| Windows strip (example) | standard (not rendered), extended | one | inline comment |

### Priority actions

1. Replace the raw radius on the edited dot. Done in this PR.
2. Move the macOS example's inline type to the same `text-sm font-semibold` classes when that example adopts uniwind. Not done; the AppKit example has no class pipeline today.
3. Have both example strips render `WindowTitleBar` in `native` mode once `@nyc-tron/ui` builds on React Native 0.83 and 0.85 (gate T4 question). Not done.

## 4. design:ux-copy

### Recommended copy

| Element | Copy |
| --- | --- |
| Close (macos / windows) | "Close window" / "Close" |
| Minimize | "Minimize window" / "Minimize" |
| Restore | "Restore window" / "Restore" |
| Zoom | "Zoom window" / "Maximize", "Restore down" while maximized |
| Empty title | "Untitled" |
| Edited marker | "Edited" beside the title; accessible title "<name>, edited" |
| Close refused | "Window not closed." (polite live region) |

### Alternatives considered for the close-refused announcement

| Option | Copy | Best for |
| --- | --- | --- |
| A (kept) | "Window not closed." | Any app; states the result without guessing the reason |
| B | "Save your changes before closing." | Apps whose only guard is unsaved changes; the app can pass it as `closeBlockedLabel` |
| C | "Close cancelled." | Rejected: "cancelled" suggests the person cancelled it |

### Rationale

The component cannot know why the app refused a close, so the default says
what happened and leaves the reason to the app, which owns the guard and
usually shows its own save prompt.

### Localization notes

Every string is a prop (`labels`, `editedLabel`, `closeBlockedLabel`). Windows
labels match the system caption tooltips, so translators should reuse the
platform's own strings. Labels are accessible names and tooltips only,
never drawn text, so length does not affect layout.

Example-app strings ("Title bar close result: 3:vetoed", "Close guard
decisions") are test instrumentation read by UI Automation and the AppKit
driver, not product copy.

## 5. frontend-design

Direction applied: the title bar stays quiet and lets the system own its
controls. Tron ships no palette, so the visual choices are structural.

- Native mode draws no controls. The macOS strip leaves `leading` clear for
  the traffic lights and starts the title after them; the Windows strip
  leaves `trailing` clear for the caption buttons. Nothing imitates either.
- Drawn `macos` glyphs sit in outlined chips with `rounded-control`, not
  coloured circles, so they read as original artwork and never as fake
  traffic lights.
- Drawn `windows` close turns `bg-danger` on hover, the only state colour in
  the bar; everything else uses surface and text tokens.
- The edited state is one 8 pt dot in `border-accent` plus the word "Edited",
  so the state never relies on colour alone.

Before and after captures: the web receipt at
`docs/completion/evidence/t2-window-chrome/` covers the drawn layouts. The
dot change has no recapture in this PR (see the PR's NOT RUN list).

## 6. design:accessibility-review

**Standard:** WCAG 2.1 AA. **Date:** 2026-11-12.
**Issues found:** 2. Critical 0, major 0, minor 2.

### Findings

| # | Issue | Criterion | Severity | Recommendation |
| --- | --- | --- | --- | --- |
| 1 | Windows example strip collapses to one accessible element named "Document title bar"; the window name inside it is not exposed separately | 1.3.1 | Minor | Example only. Acceptable because the native window title already carries the name for Narrator. |
| 2 | Glyph contrast depends on the app's `text-muted` against `surface-sunken` | 1.4.11 | Minor | Tron cannot check app palettes. Document a 3:1 minimum for those two tokens in the handoff. |

### Keyboard

| Element | Tab | Enter / Space | Escape |
| --- | --- | --- | --- |
| Drawn controls | In visual order: leading controls first in `macos`, title then trailing controls in `windows` | Runs the command | No effect |
| Native mode | System buttons are not in the app's tab order; the OS provides Cmd+W / Alt+F4 | n/a | n/a |

Visible focus: `focus-visible:ring-2 ring-focus` on every drawn control.

### Touch targets

Drawn controls are at least 44 by 44 (`macos`) and 48 by 44 (`windows`),
above the 2.5.5 minimum.

### Screen reader

| Element | Announced as |
| --- | --- |
| Bar | "<title> window controls", toolbar |
| Title | "<title>" or "<title>, edited", heading |
| Close refused | "Window not closed." |

Not tested with VoiceOver or Narrator speech on hardware; see NOT RUN.

## 7. design:design-critique

Against §2.2 (Rauno Freiberg and Emil Kowalski for interface craft and
motion restraint) and §2.5 (the radius rule, which Forge applies through
Tron). §2.3 agencies have no title-bar-specific bar.

### Overall impression

The bar does one job: it hands window commands to the app and keeps out of
the system's way. Its weakest point was a raw radius that would fail Forge's
radius check.

### Usability

| Finding | Severity | Recommendation |
| --- | --- | --- |
| A vetoed close gives no visible feedback inside the bar, only the live region | Moderate | Keep: the app's guard owns the save prompt. `onCommandResult` lets the app show one. |
| Double-clicking close cannot send two requests (`busy`) | Works | none |

### Consistency

| Element | Issue | Change made |
| --- | --- | --- |
| Edited dot | Raw `borderRadius: 4` breaks §2.5 ("raw numeric borderRadius outside the token file") | Now `rounded-full`, allowed because the dot is circular by nature |
| macOS chips | `rounded-control` resolves to the app's control radius, which Forge sets to `rounded-sm` (4 px) | none |

### Accessibility

Covered in step 6.

### What works

- No traffic-light redraw anywhere; the macOS host never emits Spark's
  `hidden` style or touches `trafficLights`.
- Motion: none beyond hover and press, and `motion-reduce:transition-none`.

### Priority recommendations

1. Radius fix (done).
2. Render `WindowTitleBar` in the native examples once T4 settles the RN floor.
3. Recapture the drawn layouts after the dot change.

## 8. design:design-handoff

### Layout

| Mode | Height | Leading | Trailing |
| --- | --- | --- | --- |
| drawn `macos` | max(44, insets.height) | controls, 44 each | none |
| drawn `windows` | max(44, insets.height) | none | controls, 48 each |
| native macOS `contentUnderTitleBar` | `readInsets().height` | `readInsets().leading`, from the zoom button's right edge | 0 |
| native Windows `extended` | `titleBar.height` | 0 | `titleBar.trailing`, the three caption buttons |
| native iPadOS windowed | `useWindowControlsInsets().height` | `.leading` | 0 |

### Tokens used

| Token | Usage |
| --- | --- |
| `bg-surface-sunken` | bar background |
| `border-border` | bottom rule |
| `text-text` / `text-text-muted` | title, focused / unfocused |
| `bg-surface-raised` | control hover |
| `bg-danger` | `windows` close hover |
| `ring-focus` | focus ring |
| `border-accent` | edited dot |
| `rounded-control` | `macos` chips |

Contrast requirement for the app: `text-muted` on `surface-sunken` at 3:1 or
more, since glyphs are non-text UI.

### States

| Element | State | Behaviour |
| --- | --- | --- |
| Control | pending | every control disabled until the command settles |
| Close | vetoed | window stays, live region says "Window not closed." |
| Restore | window not minimized | `ignored`, reason `unavailable` |
| Zoom | host without zoom | control not drawn |
| Title | inactive window | `text-text-muted` |

### Edge cases

- Empty title shows "Untitled".
- Long titles truncate at the tail on one line.
- RTL: insets follow layout direction on all hosts; macOS reads
  `windowTitlebarLayoutDirection`, Windows reads `WS_EX_LAYOUTRTL`.
- Windows without customization support (`IsCustomizationSupported()` false)
  reject `setTitleBar("extended")` and keep the system bar.
- A narrow Windows window with no room between the insets keeps the system
  drag region.

### Accessibility notes

Focus order follows the visual order. Each drawn control has an accessible
name, a tooltip with the same text, and a finger-sized target.
