// Web / default entry. Native builds resolve index.native through the
// "react-native" export condition.
export { useReservedRegions, isReservedRegionsAvailable } from "./useReservedRegions.ts";
export { ReservedRegionsOverride, useReservedRegionsOverride } from "./ReservedRegionsOverride.tsx";
export type { ReservedRegionsOverrideProps } from "./ReservedRegionsOverride.tsx";
export { useWindowControlsInsets } from "./useWindowControlsInsets.ts";
export { NATIVE_MODULE_NAME, toRegions, regionsEqual, NO_WINDOW_CONTROLS, toWindowControlsInsets, windowControlsEqual } from "./payload.ts";
export type { FoldOcclusionType, FoldOrientation, FoldState, ReservedRegion, TitleBarInsets } from "./payload.ts";
