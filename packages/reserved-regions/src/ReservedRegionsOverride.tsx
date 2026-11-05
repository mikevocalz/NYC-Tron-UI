// Simulated reserved regions for previews and tests. Storybook runs on web,
// where no fold exists, and a foldable emulator is not always at hand. Inside
// a ReservedRegionsOverride, useReservedRegions answers the given regions and
// never touches the native module, so the real pipeline (regions ->
// @nyc-tron/core/folds -> pane planner) runs against a known hinge.
// Ported from NYC-MON packages/ui/reserved-regions-override.tsx.
import { createContext, use, type ReactNode } from "react";
import type { ReservedRegion } from "@nyc-tron/core/folds";

const ReservedRegionsOverrideContext = createContext<readonly ReservedRegion[] | null>(null);

export interface ReservedRegionsOverrideProps {
  /** Window-relative regions in layout units, as the native module reports them. */
  readonly regions: readonly ReservedRegion[];
  readonly children?: ReactNode;
}

/** Make useReservedRegions return `regions` for everything below. */
export function ReservedRegionsOverride({ regions, children }: ReservedRegionsOverrideProps) {
  return <ReservedRegionsOverrideContext value={regions}>{children}</ReservedRegionsOverrideContext>;
}

/** The simulated regions, or null when no override is mounted. */
export function useReservedRegionsOverride(): readonly ReservedRegion[] | null {
  return use(ReservedRegionsOverrideContext);
}
