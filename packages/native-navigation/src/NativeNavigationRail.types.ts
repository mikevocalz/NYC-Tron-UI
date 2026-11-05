import type { NativeNavigationItem } from "./navigation-model";
export type { NativeNavigationItem } from "./navigation-model";
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
