---
name: "ToastAndProgress"
namespace: "@nyc-tron"
subpath: "@nyc-tron/ui/shell/ToastAndProgress"
tier: 1
docs: "handwritten"
platforms: []
category: "feedback"
tokens: ["color.border", "color.primary", "color.surfaceSunken", "color.text", "color.textMuted", "radius.control", "space.2", "space.2.5"]
registryDependencies: ["@nyc-tron/Button", "@nyc-tron/feedback/ErrorMessage"]
a11yStatus: "reviewed-pass"
---

# ToastAndProgress

## Purpose

List of toast notifications and progress jobs with dismiss and action buttons; shows three toasts until expanded, for React Native.

## Install

- Package: @nyc-tron/ui
- Import: `import { ToastAndProgress } from "@nyc-tron/ui/shell/ToastAndProgress";`
- Peers: react, react-native, zustand
- Requires: @nyc-tron/Button, @nyc-tron/feedback/ErrorMessage

```sh
npx shadcn@latest add @nyc-tron/shell/ToastAndProgress
```

### Dependencies

- `../Button.tsx` (`@nyc-tron/ui/components/Button`), `../feedback/ErrorMessage.tsx`, `./useOwnedAction.ts`, `./progress-model.ts`, `../styles.ts`.
- External: `react`, `react-native` (`FlatList`, `ActivityIndicator`), `zustand` and `zustand/vanilla`. `zustand` is an optional peer in `package.json`.

## Props

Exports: `ToastAndProgress`, `ToastAndProgressProps`, and the re-exported types `ProgressJob`, `JobAction`, `ToastMessage`.

`ToastAndProgressProps` extends `Omit<ViewProps,"children">`. The rest spread goes to the root `View`; `style` is appended after `{gap:8}`.

Extends: `Omit<ViewProps, "children">`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `scope` | `string` | none | yes | Owner key for the pending-action hook (`useOwnedAction(scope)`). |
| `toasts` | `readonly ToastMessage[]` | none | yes | Only the first 3 show unless expanded. |
| `jobs` | `readonly ProgressJob[]` | none | yes | All jobs render. |
| `onDismissToast` | `(id: string) => void` | none | yes | Called by each toast's dismiss button. |
| `onToastAction` | `(toastId: string, actionId: string, signal: AbortSignal) => void \| Promise<void>` | none | no | Required at runtime when any toast has an `action`. |
| `onJobAction` | `(jobId: string, action: JobAction, signal: AbortSignal) => void \| Promise<void>` | none | no | Required at runtime when any job has actions. |
| `height` | `number` | `360` | no | Height of the list; must be finite and at least 44. |
| `className` | `string` | none | no |  |
| `unstyled` | `boolean` | `false` | no | Removes class strings and passes `unstyled` to `Button` and `ErrorMessage`. |

`ToastMessage`: `id:string`, `title:string`, `detail?:string`, `tone:"info"|"success"|"error"`, `action?:{id:string;label:string}`.
`JobAction`: `"cancel"|"pause"|"resume"|"retry"`.
`ProgressJob`: `id`, `title`, `detail?`, `progress:number|null`, `actions:readonly JobAction[]`, and either `status:"queued"|"running"|"paused"|"cancelling"|"completed"|"cancelled"` or `status:"failed"` with a required `error:string`.

Throws: `TypeError("Notification actions require onToastAction")`, `TypeError("Job actions require onJobAction")`, `RangeError("Feedback height must be at least 44")`. `validateFeedback` throws for more than 100 toasts or 1000 jobs, duplicate or empty ids or titles, a progress outside 0..1, job actions not allowed for the status (queued: cancel; running: pause, cancel; paused: resume, cancel; failed: retry; cancelled: retry; cancelling and completed: none), a failed job with a blank error, and a completed job whose progress is not 1.

### Tokens

- Colour classes: `color.textMuted` 4, `color.text` 3, `color.border` 2, `color.surfaceSunken` 1, `color.primary` 1. Radius class: `radius.control` 1.
- Literals: `gap: 8` to `space.2` (5), `padding: 10` to `space.2.5` (2).
- no token: heights 6 and `"100%"`; the `height` default 360.
- Tailwind default classes (no token): `font-semibold` 3, `border` 6, `rounded-control` 1.

### Unverified

- UNVERIFIED: pending, cancel and error timing of `useOwnedAction`; that hook was not read.
- UNVERIFIED: how `Button` and `ErrorMessage` render disabled and error states; they live in other files.
- UNVERIFIED: screen reader output for `role="alert"`/`role="status"` and the progressbar value props.

## Variants

- `ToastMessage.tone`: `"error"` gives the title `role="alert"`; `"info"` and `"success"` give `role="status"`. No colour or class changes by tone.
- `ProgressJob.status`: `"failed"` renders an `ErrorMessage` with the job error. `"queued"`, `"running"`, `"cancelling"` with `progress:null` render an `ActivityIndicator`; other statuses with `progress:null` render "Progress not reported".

## States

| State | How it is set | What the code does |
|---|---|---|
| `empty` | derived in code | `ListEmptyComponent` text "No notifications or jobs". |
| `expanded` | derived in code | local store `{expanded}`; with more than 3 toasts a toggle button reads "Show all N notifications" or "Show recent notifications". |
| `pending (busy)` | derived in code | while `useOwnedAction` reports a pending action, toast action, dismiss and job action buttons get `disabled`, and a "Cancel pending notification or job request" button appears. |
| `error` | derived in code | `ErrorMessage` at the bottom shows `action.error` when set. |
| `progress` | derived in code | determinate bar width `progress*100%`; `aria-valuenow`, `aria-valuetext` and `accessibilityValue` are set; indeterminate sets text "Progress not reported". |
| `Live regions` | derived in code | toast titles and job title lines set `accessibilityLiveRegion="polite"`. |
| `hover, focus, pressed` | derived in code | no code in this file (inherited from `Button`). |

### Motion

`ActivityIndicator` for indeterminate queued, running or cancelling jobs (its animation is the native primitive's). No Animated or Reanimated calls. Progress never advances on a timer (doc comment).

### Platform notes

none in source. package.json export conditions: `types`, `react-native`, `default`, all to `dist/components/shell/ToastAndProgress.js`.

## A11y

- Contrast: text-text and text-text-muted 17.79/13.83:1 / 6.16/7.14:1; progress fill bg-primary 5.81/6.93:1. Default ActivityIndicator on a raised surface is 2.85/5.8:1 (iOS default colour) but the row text carries the same status.
- Keyboard and focus: Buttons only. Windows, macOS, QNX: no Platform.OS branch in the file, focus visuals are the host's (GU1).
- Touch target: Height guard throws under 44 (:30); actions are Buttons. Android: see Button. Android 48dp: below (F08).
- Screen reader: Header role; toast rows role alert (errors) or status with a polite live region; job rows have progressbar with aria-valuemin/max/now/text and "Progress not reported" when unknown (:44-57).
- Motion: Spinner is an essential progress cue; no decorative animation.
- Review status: **PASS**. Status text, live regions and valued progressbar.
- Reviewed from source only. Nothing was rendered and no screen reader was run. See `docs/agent-native/05-accessibility-review.md`.

## Example

```tsx example=ToastAndProgress
import {ToastAndProgress} from "@nyc-tron/ui/components/shell/ToastAndProgress";
export const Example = () => <ToastAndProgress scope="doc-1"
  toasts={[{id:"t1",title:"Export finished",tone:"success",action:{id:"open",label:"Open"}}]}
  jobs={[{id:"j1",title:"Render",status:"running",progress:0.5,actions:["pause","cancel"]}]}
  onDismissToast={()=>{}} onToastAction={async()=>{}} onJobAction={async()=>{}} height={240}/>;
```

## Do/Don't

### Do

- Pass `onToastAction` whenever any toast has an `action`, and `onJobAction` whenever a job has actions; both are required at runtime.
- Set `tone` to `error` for failures so the title gets `role="alert"`; `info` and `success` use `role="status"`.
- Give a `failed` job an `error` string, which renders an `ErrorMessage`.

### Don't

- Do not set `height` below 44 or non-finite; it throws a `RangeError`.
- Do not send toast `id` values that are empty or duplicated, or progress outside 0..1; `validateFeedback` throws.
- Do not expect more than three toasts at once; only the first 3 show unless `expanded` is set from the toggle button.
