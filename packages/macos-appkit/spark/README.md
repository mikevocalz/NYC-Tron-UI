# NYC-Tron AppKit host

`@nyc-tron/macos-appkit` binds NYC-Tron's shared window lifecycle to native macOS
windows and exposes Spark's AppKit controls through separate imports. The app
owns its document store, router selection, styling and close decisions. Moving
or resizing a window does not create a new document or editing session.

## Supported host

This package is isolated from the Expo 58 mobile workspace. Install it in the
Spark desktop application with these pinned dependency inputs:

| Dependency | Version |
| --- | --- |
| `@legendapp/spark` | `0.0.2` |
| `expo` | `55.0.32` |
| `react` | `19.2.0` |
| `react-native` | `0.83.10` |
| `react-native-macos` | `0.83.0` |
| `react-native-nitro-modules` | `0.37.0` |
| `@nyc-tron/core` | `1.0.0` |

Use Node 24.19 or later, full Xcode 26.2 or later and CocoaPods. The isolated
workflow selects Xcode 26.2 explicitly: the macOS 15 runner's default Xcode
16.4 cannot compile the isolated protocol conformances in Expo 55's Swift
sources. A real Swift compiler probe runs before dependency preparation, and
the workflow retains the selected compiler and SDK versions. Spark's published macOS target
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
for a custom native build. The AppKit package includes an NSScreen TurboModule
and an NSPopover Fabric component; the prebuilt Spark Runner does not include
those bindings. The native pod is
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

## Menus, tooltips and anchored inspectors

| Import | Native surface | Application ownership |
| --- | --- | --- |
| `@nyc-tron/macos-appkit/menus` | Spark's `NSMenu` and `NSMenuItem` registration | Command IDs, enabled states, shortcuts, action decisions and registration disposal |
| `@nyc-tron/macos-appkit/context-menu` | Spark's tracked native context `NSMenu` | Measured owner-window position, command IDs and the selected/canceled result |
| `@nyc-tron/macos-appkit/tooltip` | React Native macOS `NSView.toolTip` | Hint text and view style; the accessible hint defaults to the same text |
| `@nyc-tron/macos-appkit/popover` | The adapter's real `NSPopover` containing existing Fabric children | Controlled visibility, measured anchor, usable regions and document state |
| `@nyc-tron/macos-appkit/anchored-inspector` | The same `NSPopover` binding | Existing app inspector content; no second inspector model or pane tree |

`createMenu` and `showContextMenu` retain Spark's typed contracts. Menu actions
return the app's IDs; the adapter does not execute document commands. Keep the
menu registration for its owner lifetime and call `remove()` during disposal.
Context-menu cancellation returns a canceled result. The reference checks its
owner generation before applying an asynchronous menu result.

`Popover` and `AnchoredInspector` use the measured-anchor form: `anchor` and
`usableRegions` are top-left coordinates in the owning native window's content
view, measured in logical points. The app supplies nonoccluded regions and
remeasures its trigger after layout changes. Regions may extend beyond the
owner window only when the app explicitly approves that space; this adapter
does not infer external safe space from display size. The reference uses the
actual bounds of each root independently, including in secondary windows.

The shared `@nyc-tron/core/overlays` placement selects the region, preferred
content size and above/below preference. AppKit chooses the final x/y position.
Before revealing controls, the adapter checks the actual popover window frame
against the selected region. That frame includes AppKit's border and arrow;
the system's noninteractive window shadow is outside the frame. If the frame
does not fit, the adapter closes it, calls `onOpenChange(false)`, and reports
`onPresentationRejected({ reason: 'outside-usable-region', bounds, region })`.
The app can then choose another anchor, region or presentation. This is a safe
region gate, not exact replay of the shared placement's x/y coordinates.

Native close and Escape requests call `onOpenChange(false)`. The app remains
responsible for updating that controlled value. Changing `scope` discards
callbacks from a replaced document or target, and stale placement rejection
events cannot close a newer geometry request. Children and their native views
remain mounted across closing, reopening and resizing. The native binding
restores the previous responder when it still belongs to the owner and does
not take focus away from a newly focused window. Motion follows the supplied
`animated` value and the system's Reduce Motion preference.

The detached popover content has its own `RCTSurfaceTouchHandler`. In the
pinned RNmacOS 0.83 implementation, that handler hit-tests the retained Fabric
children, reads their `touchEventEmitterAtPoint`, and dispatches through each
child's existing event emitter. Its `EventTarget` retains the original Fabric
surface identifier; routing does not discover a new surface through native
view ancestry. The native descriptor uses the same `RootNodeKind` measurement
boundary as React Native's modal host. Native state supplies the actual content
origin inside the popover window, including the border and arrow. Fabric
measurements and RNmacOS responder `pageX`/`pageY` consequently use that window's
top-left logical coordinates, independent of the popover's declaration site.
The native content bounds subtract the inset once, preserving the children's
visible positions and original React ownership. Initial reveal waits for this
layout; safe updates keep existing content and its native field editor visible.

For a native content rectangle `(x, y, width, height)` in AppKit's bottom-left
window coordinates and outer window height `H`, the state records content
origin `(x, H - y - height)`. That measured origin becomes Yoga's left/top
padding and the native content view's bounds origin. The first adds the inset
to Fabric page measurements; the second removes it from native drawing. No
fixed border size or zero content origin is assumed. This popover-window
coordinate boundary is separate from the public anchor and safe-region
coordinates, which remain in the owning window's content view.

The acceptance fixture separately sends synthetic `NSEvent` down/move/up input
through the installed `RCTSurfaceTouchHandler` to an ordinary React `Pressable`,
declared under an offset ancestor. It records the actual native bounds, Fabric
measurements, content insets and responder transitions in `responder-events.json`.
Both the target and its report must be fully within their native visible rects.
This path
uses no Spark target/action callback and makes no physical OS pointer claim.

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
Custom data keys must be MIME types, such as
`application/x-nyctron-document-reference`, as required by Spark's parser.
Only a returned `transfer` authorizes the app to move the document reference.
Closing/minimizing a participating window, restoring layout, canceling or
disposing invalidates late approvals. Opaque payloads are never applied to a
second document model by this package.

The reference enables a source only in the current owner window. It rejects
foreign references and refuses an ownership move while the document has
unsaved changes. The native destination's acceptance is an offer; an AppKit
`move` result alone never changes app ownership. A canceled source invalidates
the controller token. An accepted source end does not prematurely cancel a
valid target while its app decision is still pending.

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
macOS app and runs native AppKit target/action, selection, text editing,
menus, tooltip text/help bindings, NSPopover geometry/focus/content lifetime and multi-window
checks through Spark's authenticated test driver. Drag protocol checks use a
real isolated NSPasteboard and the installed native source/destination methods
to verify accepted moves, app rejection, cancellation and shared document
identity. These protocol calls do not create an NSDraggingSession.

The driver also records the actual process's `CGPreflightPostEventAccess` and
accessibility trust results. When event posting is allowed, it posts a mouse
down/drag/up path through Core Graphics and requires an actual AppKit-provided
NSDraggingSession plus the resulting cross-window app transfer. When posting
is denied, the report records that observed permission block; it does not
change TCC settings, prompt for permissions or report a pointer-session pass.
`native-pointer.json` preserves that result separately from protocol evidence.

Tooltip hover has its own `tooltip-hover.json` evidence. When event posting is
allowed, the fixture moves the pointer outside the trigger, into its native
rectangle, and outside again. Public `NSEvent.mouseLocation` readback must
confirm each move while the owner is visible, key and active. Bounded,
cycle-safe traversal of `NSApp.windows` and public accessibility properties
must find a newly visible `AXHelpTag` with a native frame and the exact expected
text. On the retained 79a host observation, the tested public value/label/title
getters and diagnostic legacy value reads returned nil. The separately reported
standalone attribute enumeration has not been independently inspected here;
this does not establish that every host/version lacks a public text attribute.

The private acceptance driver also reads `_attributedString` from the exact
`NSCustomToolTipDrawView` class. It admits private text only from the selected
onscreen help-tag window's content subtree, with same-window identity, visible
finite nonempty clipped geometry, and a post-read eligibility recheck. Public
retained strings, private unique additions and the combined total are recorded
separately. Private inspection considers at most eight nodes and retains at
most four detail rows per observation; omitted or unavailable data stays
explicit. This is a host/version-dependent private-layout observation, not a
public AX/VoiceOver text result or independent pixel-content verification.
An absent or ineligible private source contributes no string. The strict
expected-text comparison remains required.

The bounded console projection retains the shown observation as well as the
last/final observation, with separate private provenance and a shared 16 KiB
output cap. Full original JSON remains separate evidence. The check must observe
the actual help-tag window disappearing after exit. The fixture retains
that window's native content bitmap during hover and an owner capture after
exit. It never counts
`toolTip` or `accessibilityHelp` as proof that a help tag appeared, and never
calls a private tooltip-show method or changes the system hover delay.
Permission denial records a blocked hover result separately from the text/help
binding. If posting is allowed but the public observations do not establish
presentation and dismissal, the native acceptance run fails. This posted-event
path does not test physical mouse hardware or a human gesture.

Both actual CGEvent tooltip hover and the AppKit-provided NSDraggingSession with
cross-window document transfer are required for native acceptance. A blocked
host capability retains the completed protocol/property checks and an explicit
`native-interaction-gate.json` diagnosis, fails the overall native gate, and
prevents a passed report or tested-package receipt. Native protocol calls alone
cannot satisfy these interaction requirements.

The workflow records
app-payload hashes, commands, results and native-rendered captures. A tested
archive receipt is produced only after those checks pass.

The test driver is excluded from this library's archive. The reference defaults
to excluding it from release builds; `--native-acceptance` opts in only inside
the generated private test application. That application is not distributed.
For that private consumer only, preparation applies an exact-preimage transport
patch to Spark 0.0.2's test driver. It records original/patched source and hashes,
rejects silent JSON serialization failures, and adds bounded native command-stage
diagnostics. A real Foundation/socketpair probe must pass before the app builds.
The patch changes neither distribution archives nor ordinary Spark consumers;
it preserves authentication, one-session behavior, deadlines and every native
interaction assertion. See `tooling/macos-appkit/TRANSPORT_DIAGNOSTICS.md` in the
repository for the exact provenance and probe boundary.
Its explicit `tron.window` show command uses `NSWorkspace.openApplication` for
initial activation of the exact existing test bundle, enabling regular AppKit
activation and verifying the returned process and resolved bundle identity.
After that verification, a subsequent command that observes the same process
already Regular, active and frontmost selects its owned window directly with
`NSWindow.makeKeyAndOrderFront`. If those conditions do not hold, it retains the
Workspace activation path. The response identifies the path actually used;
initial startup still requires Workspace activation. Every path retains the
observed visible, key and active owner-window checks and frontmost process
identity; an activation or selection request alone cannot pass. Spark's stock
capture-only driver otherwise prohibits activation. These operations use public
AppKit APIs and grant no input-posting permission.
Driver target/action and protocol evidence does not prove actual pointer input;
the separate CGEvent result must be inspected for that boundary. Even a passed
posted-event session does not prove physical mouse hardware, human gestures,
physical keyboard behavior, VoiceOver speech, multiple physical
screens, device performance or the complete eight-platform release matrix.
The example's save checkpoint is intentionally session-local, and does not
claim disk persistence. Application persistence and undo stay with the app.

Official references: [Spark development](https://github.com/LegendApp/legend-spark/blob/main/docs/development.md),
[Spark test driver](https://github.com/LegendApp/legend-spark/blob/main/docs/test-driver.md),
[React Native macOS](https://github.com/microsoft/react-native-macos), and
[AppKit NSScreen](https://developer.apple.com/documentation/appkit/nsscreen),
[NSPopover](https://developer.apple.com/documentation/appkit/nspopover),
[NSView.toolTip](https://developer.apple.com/documentation/appkit/nsview/tooltip),
[NSApplication.windows](https://developer.apple.com/documentation/appkit/nsapplication/windows),
[Cooperative app activation](https://developer.apple.com/documentation/appkit/passing-control-from-one-app-to-another-with-cooperative-activation),
[NSWorkspace application opening](https://developer.apple.com/documentation/appkit/nsworkspace/openapplication(at:configuration:completionhandler:)),
[Accessibility help-tag role](https://developer.apple.com/documentation/applicationservices/kaxhelptagrole),
[NSDraggingDestination](https://developer.apple.com/documentation/appkit/nsdraggingdestination),
and [NSDraggingSession](https://developer.apple.com/documentation/appkit/nsdraggingsession).
