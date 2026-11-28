/**
 * Canonical shell name for the shared precision scrubber. The same implementation
 * supplies bounded numeric entry, pointer precision modes, cancellation,
 * screen-reader adjustment and one async-aware commit boundary.
 */
export {PrecisionScrubber as NumericScrubField} from "./PrecisionScrubber.tsx";
export type {PrecisionScrubberProps as NumericScrubFieldProps} from "./PrecisionScrubber.tsx";
