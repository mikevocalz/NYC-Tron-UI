/**
 * Hardware FAMILY selects the navigation shell; live geometry selects the
 * content panes independently. No inferred screen-width phone/foldable test.
 * Derived from NYC-MON's pinned mikevocalz-foldable-layouts skill §2.
 */
export type Runtime = "native" | "web";
export type NativePlatform = "android" | "ios" | "macos" | "windows" | "visionos" | "meta" | "pico";
export type DeviceFamily = "phone" | "foldable" | "dual-screen" | "tablet" | "headset" | "desktop" | "unknown";
export type NavigationShell =
  | { readonly kind: "web-header"; readonly edge: null; readonly compactTabs: boolean }
  | { readonly kind: "bottom-tabs"; readonly edge: "bottom"; readonly compactTabs: true }
  | { readonly kind: "physical-right-rail"; readonly edge: "right"; readonly compactTabs: false }
  | { readonly kind: "windows-drawer"; readonly edge: "left"; readonly collapsible: true; readonly compactTabs: false }
  | { readonly kind: "macos-sidebar"; readonly edge: "left"; readonly compactTabs: false }
  | { readonly kind: "unresolved"; readonly edge: null; readonly compactTabs: false };

export interface NavigationInput {
  readonly runtime: Runtime;
  readonly platform?: NativePlatform;
  /** Stable verified hardware family, not derived from current window width. */
  readonly family: DeviceFamily;
  /** Preserve known family when hinge capability temporarily drops out. */
  readonly lastKnownFamily?: Exclude<DeviceFamily,"unknown">;
  /** Web's own responsive navigation choice; not hardware classification. */
  readonly compactWeb?: boolean;
  readonly isRTL?: boolean;
}

export function resolveNavigationShell(input: NavigationInput): NavigationShell {
  if (input.runtime === "web") {
    return { kind: "web-header", edge: null, compactTabs: input.compactWeb === true };
  }
  if (input.platform === "windows") {
    return { kind: "windows-drawer", edge: "left", collapsible: true, compactTabs: false };
  }
  if (input.platform === "macos") {
    return { kind: "macos-sidebar", edge: "left", compactTabs: false };
  }
  const family = input.family === "unknown" ? input.lastKnownFamily : input.family;
  if (family === "foldable" || family === "dual-screen" || family === "tablet" ||
      family === "headset" || input.platform === "visionos" ||
      input.platform === "meta" || input.platform === "pico") {
    return { kind: "physical-right-rail", edge: "right", compactTabs: false };
  }
  if (family === "phone") {
    return { kind: "bottom-tabs", edge: "bottom", compactTabs: true };
  }
  // Unknown is not a verified ordinary phone: preserve a bootstrap shell in app.
  return { kind: "unresolved", edge: null, compactTabs: false };
}

/**
 * Hint for WinUI NavigationView; WinUI owns real display transitions.
 * Thresholds are explicit application configuration, not global presets.
 */
export function windowsPaneMode(
  width: number,
  thresholds: { readonly compact: number; readonly expanded: number },
): "minimal" | "compact" | "expanded" {
  const { compact, expanded } = thresholds;
  if (![width,compact,expanded].every(Number.isFinite) || width < 0 ||
      compact < 0 || expanded < compact) {
    throw new RangeError("Invalid Windows pane size or app-owned thresholds");
  }
  return width >= expanded ? "expanded" : width >= compact ? "compact" : "minimal";
}
