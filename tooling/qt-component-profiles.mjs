// Conceptual Qt counterparts for the frozen component roster. These describe
// comparable APIs/building blocks; they do not claim that an RN component
// instantiates the named QML type or that its engine runs on a target device.
export const qtReferences = Object.freeze({
  controls: "https://doc.qt.io/qt-6/qtquick-controls-qmlmodule.html",
  quick: "https://doc.qt.io/qt-6/qtquick-qmlmodule.html",
  layouts: "https://doc.qt.io/qt-6/qtquicklayouts-qmlmodule.html",
  dialogs: "https://doc.qt.io/qt-6/qtquick-dialogs-qmlmodule.html",
  shapes: "https://doc.qt.io/qt-6/qtquick-shapes-qmlmodule.html",
  multimedia: "https://doc.qt.io/qt-6/qtmultimedia-index.html",
  spatialAudio: "https://doc.qt.io/qt-6/qtspatialaudio-index.html",
  text: "https://doc.qt.io/qt-6/qtextdocument.html",
  pdf: "https://doc.qt.io/qt-6/qtpdf-index.html",
  quick3d: "https://doc.qt.io/qt-6/qtquick3d-qmlmodule.html",
  core: "https://doc.qt.io/qt-6/qtcore-index.html",
  gui: "https://doc.qt.io/qt-6/qtgui-index.html",
  network: "https://doc.qt.io/qt-6/qtnetwork-index.html",
  speech: "https://doc.qt.io/qt-6/qttexttospeech-index.html",
  xr: "https://doc.qt.io/qt-6/qtquick3d-xr-qmlmodule.html",
  test: "https://doc.qt.io/qt-6/qttest-index.html",
  qnx: "https://doc.qt.io/qt-6/qnx-support.html",
});

const profile = (counterparts, references, boundary, kind = "building-blocks") => ({ kind, counterparts, references, boundary });
const custom = "Qt supplies presentation and input building blocks. The existing RN control and its application/Forge callbacks still own the editor behavior.";
const media = "Playback, recording, codecs and device selection require a validated backend. A Qt API name does not establish a QNX or Marathon media provider.";

export const qtProfiles = Object.freeze({
  workspace: profile(["ApplicationWindow", "Item", "RowLayout", "ColumnLayout"], ["controls", "quick", "layouts"], "Keep the existing React tree, router and document state. Window/layout correspondence does not add a second QML UI owner."),
  choice: profile(["ComboBox", "ButtonGroup", "RadioButton"], ["controls"], "Comparable selection control; option identity, callbacks and platform presentation stay in the public RN contract.", "control-family"),
  dock: profile(["Drawer", "Popup", "SplitView"], ["controls"], "Docking is a composition. Preserve platform navigation, focus and fold/hinge behavior."),
  split: profile(["SplitView", "SplitHandle"], ["controls"], "Comparable resizable panes; existing sizing and document-state contracts remain authoritative.", "control-family"),
  tabs: profile(["TabBar", "TabButton", "StackLayout"], ["controls", "layouts"], "Comparable tabs and content layout. Route/state preservation still belongs to the application.", "control-family"),
  toolbar: profile(["ToolBar", "ToolButton", "Action"], ["controls"], "Comparable action controls; command semantics and keyboard shortcuts remain supplied by the application.", "control-family"),
  inspector: profile(["Pane", "GroupBox", "ScrollView", "TextField", "Slider"], ["controls"], custom),
  field: profile(["Label", "TextField", "SpinBox"], ["controls"], "Units, precision, validation and scrubbing remain part of the existing control contract.", "control-family"),
  slider: profile(["Slider"], ["controls"], "Comparable scalar input. Pointer, keyboard, accessibility, precision and RTL behavior require target validation.", "control-family"),
  range: profile(["RangeSlider"], ["controls"], "Comparable two-handle range input. Snapping and application time/range semantics remain in the RN control.", "control-family"),
  dial: profile(["Dial"], ["controls"], "Comparable rotary value input. Existing precision/gesture behavior remains in the RN control.", "control-family"),
  menu: profile(["Menu", "MenuItem", "Action"], ["controls"], "The Qt export path can use the shared RN implementation. That is not proof of a platform-native QML menu.", "control-family"),
  popup: profile(["Popup", "Dialog", "Overlay"], ["controls"], "Anchor placement, dismissal, focus restoration and input semantics must be verified in the Qt renderer.", "control-family"),
  search: profile(["TextField", "ListView", "Popup"], ["controls", "quick"], "Search/filter behavior remains in the existing implementation and application callbacks."),
  collection: profile(["ListView", "GridView", "ItemDelegate"], ["quick", "controls"], "Comparable collection presentation. Data, virtualization policy, selection and domain actions remain supplied by the RN implementation."),
  tree: profile(["TreeView", "TreeViewDelegate"], ["quick", "controls"], "Comparable hierarchy presentation; document tree editing and model semantics remain in the existing implementation."),
  progress: profile(["Label", "ProgressBar", "BusyIndicator", "Popup"], ["controls"], "Progress presentation does not create the underlying task, cancellation or engine service."),
  keyboard: profile(["Keys", "Shortcut", "FocusScope"], ["quick"], "Requires actual Qt-to-RN key/focus delivery; listing a counterpart does not register OS shortcuts.", "platform-service"),
  accessibility: profile(["Accessible", "FocusScope", "QAccessible"], ["quick", "gui"], "Requires the target accessibility bridge and assistive-technology evidence; RN semantic props alone do not prove screen-reader output.", "platform-service"),
  files: profile(["FileDialog", "FolderDialog", "QFile", "QSaveFile"], ["dialogs", "core"], "Native file picking, permissions and sharing need an installed target provider; file-format import/export still belongs to its engine.", "platform-service"),
  canvas: profile(["Item", "Shape", "ShapePath", "Canvas"], ["quick", "shapes"], "Conceptual 2D rendering correspondence. This does not replace or provide the Skia/Graphite dependency used by some existing controls."),
  transform: profile(["DragHandler", "PinchHandler", "Item"], ["quick"], "Conceptual pointer/transform correspondence. Existing Gesture Handler imports still require a compatible installed native provider."),
  image: profile(["Image", "GridView", "Flickable"], ["quick"], "Image presentation does not implement RAW decoding, retouching, image analysis or export processing."),
  color: profile(["ColorDialog", "Slider", "TextField", "QColorSpace"], ["dialogs", "controls", "gui"], "Color editing remains a composition. Wide-gamut rendering, profiles, print transforms and sampling need their own implementation/evidence."),
  gradient: profile(["Gradient", "GradientStop", "ShaderEffect", "DragHandler"], ["quick"], "Qt supplies gradient/shader/input building blocks; mesh editing and color-engine operations remain application/Forge work."),
  curve: profile(["Shape", "ShapePath", "DragHandler"], ["shapes", "quick"], "Custom graph/curve composition; DSP, analysis, interpolation and curve transactions are not built-in Qt editor widgets."),
  video: profile(["MediaPlayer", "VideoOutput", "QVideoSink"], ["multimedia"], media, "platform-service"),
  audio: profile(["QAudioSink", "QAudioSource", "QMediaDevices"], ["multimedia", "qnx"], media + " Upstream Qt's QNX 8 matrix does not provide an audio playback/recording backend.", "platform-service"),
  spatialAudio: profile(["AudioEngine", "SpatialSound", "QAudioEngine", "QSpatialSound"], ["spatialAudio", "qnx"], "Conceptual 3D sound-field counterparts in a technology-preview module. Surround mixing/routing remains the application's audio engine, and QNX 8 still needs a real audio backend.", "platform-service"),
  timeline: profile(["Flickable", "Repeater", "DragHandler", "Shape"], ["quick", "shapes"], "A timeline is a custom editor. Qt building blocks do not supply frame accuracy, editing transactions, DSP, media analysis or export engines."),
  richtext: profile(["TextEdit", "TextInput", "QTextDocument"], ["quick", "text"], "Comparable text/layout primitives. Pagination, tracked changes, layout fidelity and document-format operations remain owned by the editor/engine."),
  table: profile(["TableView", "HorizontalHeaderView", "VerticalHeaderView", "SelectionRectangle"], ["quick", "controls"], "Comparable table UI. Formula evaluation, workbook import/export, pivot computation and sheet transactions are separate engine capabilities."),
  slides: profile(["Item", "Image", "Text", "Shape", "PropertyAnimation"], ["quick", "shapes"], "Slide composition and preview use graphics building blocks; presentation formats, masters, transitions and export remain engine/application behavior."),
  pdf: profile(["PdfDocument", "PdfMultiPageView", "PdfSearchModel", "PdfSelection"], ["pdf", "qnx"], "Conceptual PDF viewing/search counterparts. Qt PDF is not upstream-supported on QNX; editing, redaction, signatures and document rewriting require separate capabilities."),
  design: profile(["Item", "RowLayout", "ColumnLayout", "Shape", "DragHandler"], ["quick", "layouts", "shapes"], "Design/prototype editing is a custom composition. Constraints, variables, interactions and format export remain editor/engine behavior."),
  scene3d: profile(["View3D", "Model", "PerspectiveCamera", "PrincipledMaterial"], ["quick3d"], "Conceptual scene/material counterparts. Existing RN/Viro/native surfaces still need their actual Qt integration; CAD, UV, baking and constraints are separate engines."),
  pointer: profile(["PointerHandler", "PointHandler", "QPointerEvent", "QTabletEvent"], ["quick", "gui"], "Device routing, pressure/tilt, pairing, palm rejection and prediction need real target/device support; this mapping adds none.", "platform-service"),
  haptics: profile([], ["gui"], "No general Qt 6 haptics widget is asserted. Use a real target service and preserve capability/opt-out reporting.", "target-provider"),
  adaptive: profile(["Window", "Screen", "SafeArea", "RowLayout", "ColumnLayout"], ["quick", "layouts"], "Window/usable-area layout is comparable. Fold state, hinge geometry and platform navigation need the existing device/layout policy."),
  xr: profile(["XrView", "XrOrigin", "XrController"], ["xr"], "Qt Quick 3D XR is a conceptual counterpart, not a Viro adapter or a QNX/Marathon support claim. The pinned external provider remains required.", "platform-service"),
  storage: profile(["QFile", "QSaveFile"], ["core"], "File primitives are conceptual counterparts. The existing MMKV snapshot schema, crash consistency and Forge transaction integration remain required.", "platform-service"),
  network: profile(["QNetworkAccessManager"], ["network"], "Transport primitives do not implement CRDT/Yjs collaboration, authorization, conflict resolution or synchronization semantics.", "platform-service"),
  tasks: profile(["QThreadPool", "QFuture", "QPromise"], ["core"], "Conceptual task primitives. The selected Nitro module still needs its real dispatcher, lifecycle, cancellation and generated registration.", "platform-service"),
  cache: profile(["QCache", "QByteArray"], ["core"], "Conceptual storage primitives. Forge owns cache budgets, pinned buffers and media lifetime semantics.", "platform-service"),
  undo: profile(["QUndoStack", "QUndoCommand"], ["gui"], "Conceptual undo counterparts. Forge's atomic Rust operations, document journal and cross-engine transaction rules remain authoritative.", "platform-service"),
  binary: profile(["QByteArray", "QBuffer"], ["core"], "Conceptual byte containers. Nitro ArrayBuffer ownership, zero-copy guarantees and runtime teardown need the actual native integration.", "platform-service"),
  lifecycle: profile(["Application", "MediaPlayer"], ["quick", "multimedia"], "Playback lifecycle and interruption recovery require real target signals and a validated media backend.", "platform-service"),
  telemetry: profile(["QTest", "QLoggingCategory", "QElapsedTimer"], ["test", "core"], "Conceptual diagnostics counterparts. Existing telemetry contracts and device evidence are still required.", "platform-service"),
  speech: profile(["QTextToSpeech"], ["speech"], "Read-aloud requires an installed speech backend. Dictation/speech recognition is a separate provider, not implied by QTextToSpeech.", "platform-service"),
  capture: profile(["Camera", "CaptureSession", "ImageCapture"], ["multimedia"], "Capture needs real camera/device support. OCR, page detection and document insertion are separate application/engine capabilities.", "platform-service"),
});

export const qtFamilies = Object.freeze({
  A: { name: "Workspace and shell", profile: "inspector" },
  B: { name: "Canvas, ink and selection", profile: "canvas" },
  C: { name: "Color", profile: "color" },
  D: { name: "Video and timeline", profile: "timeline" },
  E: { name: "Audio and MIDI", profile: "timeline" },
  F: { name: "Photography", profile: "inspector" },
  G: { name: "Motion graphics", profile: "curve" },
  H: { name: "Documents", profile: "richtext" },
  I: { name: "Spreadsheets", profile: "table" },
  J: { name: "Presentations", profile: "slides" },
  K: { name: "PDF", profile: "pdf" },
  L: { name: "Design and prototyping", profile: "design" },
  M: { name: "CAD and 3D", profile: "scene3d" },
  N: { name: "Platform and engine services", profile: null },
});

// Overrides are explicit canonical IDs so a new/renamed component cannot be
// classified by a name substring or silently dropped from the report.
const groups = {
  workspace: "A-01",
  choice: "A-02 B-18 C-09 D-07 E-08 E-12 I-11 J-08 K-03 L-05",
  dock: "A-03 B-28 C-26 D-26",
  split: "A-04 B-27 F-12 I-17",
  tabs: "A-05 A-08 I-08",
  toolbar: "A-06 A-07 B-07 B-13 B-20 B-25 D-06 D-20 D-21 E-06 E-07 E-18 F-03 H-03 J-07 K-06",
  inspector: "B-11 B-16 B-23 B-29 B-34 D-30 D-36 D-41 D-42 E-19 E-20 E-27 E-29 E-32 E-34 E-39 H-04 H-09 H-11 I-09 I-10 I-12 I-15 J-15 J-16 K-09 K-13 K-15 L-02 L-03 L-04 L-06 L-07 L-09 L-12 M-05 M-06 M-08 M-09 M-14 M-17",
  field: "A-11 A-12 A-13 C-06 C-07 C-08 D-08 I-03 I-04 M-13",
  slider: "A-14 C-04 C-05 D-04 D-05 E-14 N-21",
  range: "A-15 D-12 D-13 E-09",
  dial: "A-16 E-15",
  menu: "A-17 A-19",
  popup: "A-20 A-29 H-18 I-18 K-11 N-20",
  search: "A-18 A-21 I-05 M-11",
  collection: "A-22 A-23 A-24 B-14 B-15 C-13 D-16 D-37 D-38 D-40 E-23 E-36 E-38 F-01 F-02 F-13 F-15 F-17 G-05 H-05 H-19 H-20 I-16 I-20 I-21 J-01 J-02 J-04 J-06 K-02 K-10",
  tree: "B-09 G-01 H-15 L-01",
  progress: "A-25 A-26 D-28 D-29 F-14 G-15 J-13",
  keyboard: "A-27 D-09 N-07",
  accessibility: "A-28 N-06",
  files: "A-30 I-19 N-12",
  transform: "B-02 B-06 B-08 B-19 B-26 D-35 D-39 I-02 I-07 L-08",
  image: "B-10 B-12 B-31 J-10 M-12",
  gradient: "B-24 C-16 C-17 F-10",
  curve: "C-19 C-20 C-21 C-24 D-32 E-02 E-03 E-04 E-05 E-10 E-11 E-16 E-17 E-21 E-22 E-25 E-35 E-40 E-41 I-06 I-13 I-14 M-10",
  video: "D-01 D-02 D-03 D-27 J-12 N-19",
  audio: "E-01 E-31",
  richtext: "G-11 J-11",
  scene3d: "G-07 G-08",
  spatialAudio: "E-33",
  speech: "H-21 H-22 K-18",
  capture: "K-20",
  pointer: "N-01 N-02 N-03 N-04",
  haptics: "N-05",
  adaptive: "N-08",
  xr: "N-09",
  storage: "N-10",
  network: "N-11 L-13",
  tasks: "N-13",
  cache: "N-14",
  undo: "N-15",
  binary: "N-16",
  lifecycle: "N-17 K-19",
  telemetry: "N-18",
};

export function componentProfileAssignments() {
  const result = new Map();
  for (const [key, ids] of Object.entries(groups)) {
    if (!qtProfiles[key]) throw new Error(`Unknown Qt profile ${key}`);
    for (const id of ids.split(" ")) {
      if (result.has(id)) throw new Error(`Duplicate Qt profile assignment ${id}`);
      result.set(id, key);
    }
  }
  return result;
}
