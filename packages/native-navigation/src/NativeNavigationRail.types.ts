import type { NativeNavigationItem } from "./navigation-model.js";
export type { NativeNavigationItem } from "./navigation-model.js";
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
  /**
   * Fill of the fully rounded selected pill, from the app's theme token.
   * Defaults to `activeColor` at 15% alpha (via `defaultIndicatorColor`).
   */
  readonly indicatorColor?: string;
}
