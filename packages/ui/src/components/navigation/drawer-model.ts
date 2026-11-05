/**
 * A strictly controlled React Native Windows-compatible navigation fallback.
 * This is NOT WinUI NavigationView; native hosts map the same semantic modes
 * to WinUI 3 PaneDisplayMode (Left, LeftCompact, LeftMinimal).
 */
export type DrawerMode = "expanded" | "compact" | "minimal";
export interface DrawerGeometryInput {
  readonly mode: DrawerMode;
  readonly open: boolean;
  readonly expandedWidth?: number;
  readonly compactWidth?: number;
}
export interface DrawerGeometry {
  readonly contentInsetLeft: number;
  readonly paneWidth: number;
  readonly showPane: boolean;
  readonly showLabels: boolean;
  readonly overlay: boolean;
  readonly scrim: boolean;
}
export function drawerGeometry({
  mode, open, expandedWidth = 280, compactWidth = 64,
}: DrawerGeometryInput): DrawerGeometry {
  if (!Number.isFinite(expandedWidth) || expandedWidth < 180 ||
      !Number.isFinite(compactWidth) || compactWidth < 44 ||
      compactWidth >= expandedWidth) {
    throw new RangeError("Invalid navigation drawer widths");
  }
  switch (mode) {
    case "expanded":
      return { contentInsetLeft: expandedWidth, paneWidth: expandedWidth,
        showPane: true, showLabels: true, overlay: false, scrim: false };
    case "compact":
      return { contentInsetLeft: compactWidth,
        paneWidth: open ? expandedWidth : compactWidth,
        showPane: true, showLabels: open, overlay: open, scrim: open };
    case "minimal":
      return { contentInsetLeft: 0,
        paneWidth: open ? expandedWidth : 0,
        showPane: open, showLabels: open, overlay: open, scrim: open };
    default:
      throw new RangeError("Unknown navigation drawer mode");
  }
}
