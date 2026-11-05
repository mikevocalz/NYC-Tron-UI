/**
 * Audit registry, not a completion claim. These are cross-app NYC-Tron component
 * contracts; engine-backed behavior still lives in Nitro Forge.
 */
export type ComponentStage="prototype"|"contract"|"planned";
export type AdvancedComponent=Readonly<{
 id:string;category:string;stage:ComponentStage;
 owner:"@nyc-tron/ui"|"@nyc-tron/core";
 sourcePath?:string;
 platforms:readonly ("ios"|"android"|"web"|"windows"|"macos"|"xr")[];
}>;
const native=["ios","android","web"] as const;
const everywhere=["ios","android","web","windows","macos"] as const;
const extended=["ios","android","web","windows","macos","xr"] as const;
const prototype=(id:string,category:string,sourcePath:string):AdvancedComponent=>({
 id,category,stage:"prototype",owner:"@nyc-tron/ui",sourcePath,platforms:native
});
const planned=(id:string,category:string):AdvancedComponent=>({
 id,category,stage:"planned",owner:"@nyc-tron/ui",platforms:extended
});
export const advancedNativeCatalog:readonly AdvancedComponent[]=[
 prototype("InstrumentKnob","precision","packages/ui/src/components/forge/inputs/InstrumentKnob.tsx"),
 prototype("InstrumentXYPad","precision","packages/ui/src/components/forge/inputs/InstrumentXYPad.tsx"),
 prototype("TreeGrid","data","packages/ui/src/components/data/TreeGrid.tsx"),
 prototype("PatchGraph","graph","packages/ui/src/components/forge/graph/PatchGraph.tsx"),
 prototype("ImageCropOverlay","graphics","packages/ui/src/components/forge/graphics/ImageCropOverlay.tsx"),
 prototype("CommandPopover","overlays","packages/ui/src/components/overlays/CommandPopover.tsx"),
 {id:"SpatialRayAndPinchContract",category:"spatial",stage:"contract",owner:"@nyc-tron/core",
   sourcePath:"packages/core/src/spatial-interactions.ts",platforms:extended},
 ...["NativeContextMenu","NativeDropdown","NativeToolTip","CommandPalette","InspectorPanel","FloatingPalette",
    "AdaptiveDock","PaneSplitter","DocumentTabBar","NativeMultiWindowDragDrop"].map(id=>planned(id,"workspace")),
 ...["CurveEditor","HDRColorWheel","VideoScopesPanel","NativeVideoMonitor","FrameAccurateTimeline",
    "MulticamAngleViewer","RealtimeAudioMixer","ParametricEQ","SpectrogramView","MIDIPianoRoll",
    "StereoWaveform","NativeRecordingPanel"].map(id=>planned(id,"media")),
 ...["GPUBrushStroke","InkStabilizer","LassoSelection","LayerStack","SelectionMarquee","GradientMesh",
    "GaussianBlurGraph","ReferenceImageBoard"].map(id=>planned(id,"graphics")),
 ...["FrozenGridPanes","GridClipboardController","FormulaReferenceColorizer","PivotDataPanel",
    "DependencyGraph","DiffMergeViewer","ColumnReorderHandle","ExpandableCell"].map(id=>planned(id,"data")),
 ...["PatchCable","RoutingMatrix","SignalInspector","TypedPort","NodeGraphGPU"].map(id=>planned(id,"graph")),
 ...["BoneManipulator","IKPoseHandle","WeightPaintOverlay","RigHierarchy","AnimationRetargetPanel",
    "GaussianSplatViewport","SplatSelectionBrush","DepthLayerInspector","SceneCapturePanel",
    "ViewCube","UVEditor","PBRMaterialInspector","GPU3DModelViewer"].map(id=>planned(id,"3d")),
 ...["GazeFocusRing","HandGrabHandle","SpatialRadialMenu","DepthAwarePopover",
    "TwoHandTransform","WorldAnchorInspector","WatchModelViewerHandoff"].map(id=>planned(id,"spatial")),
 ...["MapOverlayCanvas","GeospatialClusterOverlay","NativeWidgetScenePreview",
    "AIChangeDiffPreview","AIChangeApprovalPanel","AccessibleTouchTargetDebugger"].map(id=>planned(id,"platform")),
];
/** Reference sources are not vendored. License is repository metadata, NOT file-level clearance. */
export type LicenseReview="MIT"|"Apache-2.0"|"BSD-3-Clause"|"AGPL-3.0"|"REVIEW";
export const upstreamCandidates:readonly Readonly<{
 repo:string;license:LicenseReview;target:string;sourceType:"native-controls"|"processing"|"renderer";
}>[]=[
 {repo:"AudioKit/Controls",license:"MIT",target:"InstrumentKnob/InstrumentXYPad",sourceType:"native-controls"},
 {repo:"AudioKit/Flow",license:"MIT",target:"PatchGraph/NodeGraphGPU",sourceType:"native-controls"},
 {repo:"AudioKit/PianoRoll",license:"MIT",target:"MIDIPianoRoll",sourceType:"native-controls"},
 {repo:"AudioKit/Waveform",license:"MIT",target:"StereoWaveform",sourceType:"renderer"},
 {repo:"google/ink",license:"Apache-2.0",target:"InkStabilizer/GPUBrushStroke",sourceType:"processing"},
 {repo:"MetalPetal/MetalPetal",license:"MIT",target:"GPUImageFilters",sourceType:"processing"},
 {repo:"AcademySoftwareFoundation/OpenColorIO",license:"BSD-3-Clause",target:"ColorManagement/LUT",sourceType:"processing"},
 {repo:"guoyingtao/Mantis",license:"MIT",target:"ImageCropOverlay",sourceType:"native-controls"},
 {repo:"Yalantis/uCrop",license:"REVIEW",target:"ImageCropOverlay",sourceType:"native-controls"},
 {repo:"patrykandpatrick/vico",license:"Apache-2.0",target:"NativeCharts",sourceType:"native-controls"},
 {repo:"google/filament",license:"Apache-2.0",target:"GPU3DModelViewer",sourceType:"renderer"},
 {repo:"CommunityToolkit/Windows",license:"REVIEW",target:"WindowsFluentAdapters",sourceType:"native-controls"},
 {repo:"microsoft/Win2D",license:"REVIEW",target:"WindowsCanvasAdapter",sourceType:"renderer"},
 {repo:"artcraft-android/procraft",license:"Apache-2.0",target:"Brush/Layer/ColorControls",sourceType:"native-controls"},
 {repo:"artcraft-android/filmcraft-android",license:"Apache-2.0",target:"Timeline/VideoMonitor",sourceType:"native-controls"},
 {repo:"artcraft-android/lightcraft-android",license:"Apache-2.0",target:"PhotoColorControls",sourceType:"native-controls"},
 {repo:"artcraft-android/capcraft-android",license:"AGPL-3.0",target:"OptionalAGPLVideoTools",sourceType:"native-controls"},
];
