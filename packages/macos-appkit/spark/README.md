# NYC-Tron AppKit host

`@nyc-tron/macos-appkit` binds NYC-Tron's shared window lifecycle to native macOS
windows and exposes Spark's AppKit controls through separate imports. The app
owns its document store, router selection, styling and close decisions. Moving
or resizing a window does not create a new document or editing session.

## Supported host

This package is isolated from the Expo 58 mobile workspace. Install it in the
Spark desktop application with these exact tested dependency inputs:

| Dependency | Version |
| --- | --- |
| `@legendapp/spark` | `0.0.2` |
| `expo` | `55.0.32` |
| `react` | `19.2.0` |
| `react-native` | `0.83.10` |
| `react-native-macos` | `0.83.0` |
| `react-native-nitro-modules` | `0.37.0` |
| `@nyc-tron/core` | `1.0.0` |

Use Node 24.19 or later, full Xcode and CocoaPods. Spark's published macOS target
is ARM64. This adapter does not establish Intel, iOS, Android, Windows or headset
support. Do not put its dependencies in the Expo 58 workspace or substitute
Nitro v1 for Spark's tested Nitro 0.37 ABI.

Create the desktop host with Spark's official starter so its verified native
SDK archives are installed. The Runtimes and Nitro packages include Spark's
patches; registry packages with the same version numbers are not equivalent.
The consumer preparation script uses the published Spark 0.0.2 release
manifest and the same archive materialization and hash verification helpers as
`spark create`, retains the SDK input receipt, and runs `spark analyze` before
native compilation. The AppKit-only example excludes the Windows host from
Expo autolinking.

Packages are distributed as GitHub Release tarballs. Install the matching core
and AppKit archives, then use the application's installed `spark build` command
for a custom native build. The AppKit package includes an NSScreen TurboModule;
the prebuilt Spark Runner does not include that module. The native pod is
selected only when Spark's macOS autolinker sets `SPARK_DESKTOP_AUTOLINK=macos`.

## Controls

Import only the required surface:

```tsx
import { Sidebar } from '@nyc-tron/macos-appkit/sidebar';
import { SplitView } from '@nyc-tron/macos-appkit/split-view';
import { Button } from '@nyc-tron/macos-appkit/button';
import { TextField } from '@nyc-tron/macos-appkit/text-field';
import { Select } from '@nyc-tron/macos-appkit/select';
import { SegmentedControl } from '@nyc-tron/macos-appkit/segmented-control';
import { DragDropView } from '@nyc-tron/macos-appkit/drag-drop';
```

These render Spark's actual AppKit controls: native sidebar/table, split view,
button, text field, pop-up menu and segmented control. Availability checks fail
explicitly when the native host or module is missing. Values and selection
remain controlled by the app. Spark's documented props and supported frame
styles apply; native appearance follows the app's system/light/dark choice.

## Window ownership

Register each component with React Native's `AppRegistry`. Construct one host
above the registered roots and keep app-owned document state in the existing
Zustand store. Window props carry document identifiers.

```ts
import { createMacOSWindowHost } from '@nyc-tron/macos-appkit/windows';

const windows = createMacOSWindowHost({
  beforeClose: async id => documents.canClose(id),
  onError: error => diagnostics.report(error),
});
await windows.attach('main');
await windows.open({
  id: 'document-1',
  component: 'DocumentWindow',
  props: { documentId: 'invoice-42' },
  title: 'Invoice 42',
  size: { width: 800, height: 640 },
});
await windows.minimize('document-1');
await windows.focus('document-1');
const result = await windows.close('document-1');
if (!result.closed) showUnsavedChanges();
```

New windows remain hidden until their observers and app close guard are
installed. A false, rejected or throwing close decision vetoes closing. The
registry tracks observed native bounds, focus and minimization; failed native
commands never publish their intended geometry as an actual result. Observers
belong to a particular window instance, so stale events cannot close a new
window that reuses an ID.

`getSnapshot()` and `subscribe()` support React `useSyncExternalStore`.
`snapshot()` produces a JSON-safe layout without document data or live drags.
After the app reopens its documents and attaches their windows, call
`restore(snapshot)` with exactly those IDs. It validates the whole snapshot,
fits geometry to real screen work areas, applies native bounds/status, and
reports actual completed changes if a later native command fails. Windows from
a disconnected screen retain their home and return when that screen reconnects.
Coordinates are logical points; mixed display scales are not multiplied twice.

`dispose()` immediately invalidates new commands and drains acquired/late native
registrations. It does not close app documents. Close those explicitly first;
repeated disposal returns the same completion promise.

## Drag and drop

`DragDropView` supplies native drag source/destination events. Route an app-owned
reference through `beginDrag`, `dragOver` and `drop(token, targetId, approve)`.
Only a returned `transfer` authorizes the app to move the document reference.
Closing/minimizing a participating window, restoring layout, canceling or
disposing invalidates late approvals. Opaque payloads are never applied to a
second document model by this package.

## Verification and limits

`tooling/macos-appkit/prepare-consumer.mjs` builds the AppKit archive and consumes
the shared core archive supplied through `--shared-archives`. That directory
must contain the output of `tooling/pack-release.mjs --packages core`, including
`SHA256SUMS`. The workflow builds core once on Ubuntu with the release packer,
then transfers those exact bytes to macOS. The preparation checks the shared
archive hash and package identity before installing it in a fresh external
application, and verifies dependency pins, lock integrity and archive file
bytes. The native receipt records the core hash so release assembly can compare
the tested dependency with the shipped archive. The isolated workflow compiles a real standalone
macOS app and runs native AppKit target/action, selection, text editing and
multi-window checks through Spark's authenticated test driver. It records
app-payload hashes, commands, results and native-rendered captures. A tested
archive receipt is produced only after those checks pass.

The test driver is excluded from this library's archive. The reference defaults
to excluding it from release builds; `--native-acceptance` opts in only inside
the generated private test application. That application is not distributed. Driver target/action evidence does not
prove physical pointer/keyboard behavior, VoiceOver speech, multiple physical
screens, device performance or the complete eight-platform release matrix.
The example's save checkpoint is intentionally session-local, and does not
claim disk persistence. Application persistence and undo stay with the app.

Official references: [Spark development](https://github.com/LegendApp/legend-spark/blob/main/docs/development.md),
[Spark test driver](https://github.com/LegendApp/legend-spark/blob/main/docs/test-driver.md),
[React Native macOS](https://github.com/microsoft/react-native-macos), and
[AppKit NSScreen](https://developer.apple.com/documentation/appkit/nsscreen).
