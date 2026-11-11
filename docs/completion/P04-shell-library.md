# Reusable shell controls

This implementation checkpoint adds four independent NYC-Tron controls for the canonical shell rows A-22, A-24, A-26 and A-29. It does not require Nitro-Forge or import its engines. Application documents, filesystem access and job execution remain with the consuming application.

## Public imports

```tsx
import { AssetBrowser } from '@nyc-tron/ui/components/shell/AssetBrowser';
import { HistoryPanel } from '@nyc-tron/ui/components/shell/HistoryPanel';
import { FindReplacePopover } from '@nyc-tron/ui/components/shell/FindReplacePopover';
import { ToastAndProgress } from '@nyc-tron/ui/components/shell/ToastAndProgress';
// Native anchored presentation using the same content and provider contracts:
import { FindReplacePopover as NativeFindReplacePopover } from '@nyc-tron/expo-controls/FindReplacePopover';
```

Each control and its data helpers has an independent export. Consumers supply the documented semantic theme tokens, or choose `unstyled`. No app palette, global navigation or Forge package is required.

- AssetBrowser accepts a bounded catalog page, revision, location path and controlled selection. It filters and naturally sorts files, supports keyboard ranges and opening, and virtualizes the complete viewport including its header and footer. Applications page larger catalogs rather than sending more than 20,000 entries.
- HistoryPanel accepts the authoritative revision and cursor. Undo, redo and direct restore request one host transaction; the panel never invents a completed history operation.
- FindReplacePopover accepts indexed search and replacement providers. Match ranges use UTF-16 offsets; the opaque search token and expected revision let hosts reject stale changes. The optional literal-text helper handles Unicode word boundaries and literal replacement strings for bounded text documents. Large document providers supply their own index.
- ToastAndProgress renders reported jobs, errors and notifications. Pause, resume, cancel and retry call the host. Progress never advances on a UI timer.

Async requests own AbortControllers outside serialized state. Changing the committed document/location scope, cancelling, closing search or unmounting invalidates late results. Providers must honor cancellation before committing external mutations; detaching a UI cannot undo a host transaction already committed.

## Verification and remaining acceptance

The shell model suite covers catalog ordering/selection, history bounds, UTF-16 search, replacement tokens, literal dollar strings, progress state validation and stale async completion. Verification on November 6, 2026 passed all 742 source tests, workspace builds and types, independent export validation, packing all 13 packages, and eight rendered shell tests. The broader browser run passed 444 of 445 checks; its remaining check expected the former media fallback label. After correcting that expectation, all 18 shell/media checks passed, including a new explicit no-WebCodecs fallback check. The rendered Chromium consumer uses public package imports and exercises actual controlled state changes, keyboard navigation, focus restoration, 320/834-pixel widths and both text directions.

The Expo adapter reuses the established NativePopover SwiftUI/Compose presentation and passes workspace type checking. Device interaction, screen-reader announcements, software-keyboard behavior, tablet/fold occlusion and desktop/XR host acceptance for these new controls remain separate required evidence. Browser checks and native compilation do not mark those platforms accepted.

Run `pnpm verify` for source tests, builds, workspace types, independent exports and the 13 packed packages. After installing the browser test dependencies, run `UI_ACCEPTANCE_PORT=4191 pnpm --dir packages/ui/tests/browser exec playwright test shell-consumers.spec.mjs`.
