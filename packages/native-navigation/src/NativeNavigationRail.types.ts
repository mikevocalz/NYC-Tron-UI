import type { NativeNavigationItem } from "./navigation-model.ts";
export type { NativeNavigationItem } from "./navigation-model.ts";
/** Host owns physical edge, route and selection state. */
export interface NativeRailProps {
  readonly items: readonly NativeNavigationItem[];
  readonly selectedId: string | null;
  readonly onSelectionChange: (id: string) => void;
  readonly expanded?: boolean;
  readonly enabled?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly activeColor?: string;
  readonly foregroundColor?: string;
  readonly backgroundColor?: string;
}
