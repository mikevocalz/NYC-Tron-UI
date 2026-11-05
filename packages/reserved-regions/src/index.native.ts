// iOS / Android entry (the "react-native" export condition).
export { useReservedRegions, isReservedRegionsAvailable } from "./useReservedRegions.native.ts";
export { ReservedRegionsOverride, useReservedRegionsOverride } from "./ReservedRegionsOverride.tsx";
export type { ReservedRegionsOverrideProps } from "./ReservedRegionsOverride.tsx";
export { NATIVE_MODULE_NAME, toRegions, regionsEqual } from "./payload.ts";
export type { FoldOcclusionType, FoldOrientation, FoldState, ReservedRegion } from "./payload.ts";
