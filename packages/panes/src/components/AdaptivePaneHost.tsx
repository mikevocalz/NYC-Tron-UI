import { useEffect, useRef, type ReactNode } from "react";
import {
  BackHandler, Pressable, Text, View, type ViewProps, type ViewStyle,
} from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { resolvePanePlan, type PanePlanInput, type PanePlan } from "@nyc-tron/core/pane-plan";
import type { FoldFeature, Rect } from "@nyc-tron/core/folds";

type Size = { width: number; height: number };
type Master = PanePlanInput["master"];
type Detail = PanePlanInput["detail"];
type Inspector = NonNullable<PanePlanInput["inspector"]>;

export interface AdaptivePaneHostProps extends Omit<ViewProps, "children"> {
  /** Master/Detail/Inspector are stable React children, not route owners. */
  readonly master: ReactNode;
  readonly detail: ReactNode;
  readonly inspector?: ReactNode;
  readonly masterConfig: Omit<Master, "openOnCompact">;
  readonly detailConfig: Detail;
  readonly inspectorConfig?: Omit<Inspector, "open">;
  readonly masterOpenOnCompact?: boolean;
  readonly inspectorOpen?: boolean;
  readonly onDismissMaster?: () => void;
  readonly onDismissInspector?: () => void;
  readonly posture?: PanePlanInput["posture"];
  readonly isRTL?: boolean;
  /**
   * Required for any nonempty hardware features. This is the actual pane-host
   * bounding rect in window-space logical units, including x/y origin.
   * Never pass the full app window when the host occupies only one column.
   */
  readonly container?: Rect;
  readonly features?: readonly FoldFeature[];
  readonly className?: string;
  readonly masterClassName?: string;
  readonly detailClassName?: string;
  readonly inspectorClassName?: string;
  readonly onPlanChange?: (plan: PanePlan) => void;
}

function css(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}
function rectStyle(rect: Rect): ViewStyle {
  return {
    position: "absolute",
    left: rect.x, top: rect.y,
    width: rect.width, height: rect.height,
  };
}
export function AdaptivePaneHost({
  master, detail, inspector, masterConfig, detailConfig,
  inspectorConfig, masterOpenOnCompact = false, inspectorOpen = false,
  onDismissMaster, onDismissInspector, posture = "flat", isRTL = false,
  container, features = [], className, masterClassName, detailClassName,
  inspectorClassName, onPlanChange, onLayout, style, ...rest
}: AdaptivePaneHostProps) {
  const sizeStore = useRef<StoreApi<Size> | null>(null);
  if (!sizeStore.current) sizeStore.current = createStore<Size>(() => ({ width: 0, height: 0 }));
  const store = sizeStore.current;
  const width = useStore(store, state => state.width);
  const height = useStore(store, state => state.height);

  if (features.length > 0 && !container) {
    throw new Error("AdaptivePaneHost requires window-space container coordinates with fold features");
  }
  const bounds = container ?? { x: 0, y: 0, width, height };
  const ready = bounds.width > 0 && bounds.height > 0;
  const plan: PanePlan | null = ready ? resolvePanePlan({
    container: bounds, features, posture, isRTL,
    master: { ...masterConfig, openOnCompact: masterOpenOnCompact },
    detail: detailConfig,
    inspector: inspectorConfig ? { ...inspectorConfig, open: inspectorOpen } : undefined,
  }) : null;

  const onPlanChangeRef = useRef(onPlanChange);
  onPlanChangeRef.current = onPlanChange;
  const planKey = plan ? JSON.stringify(plan) : "";
  // Notify only after React commits geometry; never set parent state in render.
  useEffect(() => {
    if (plan) onPlanChangeRef.current?.(plan);
  }, [planKey]);
  const measured = (event: Parameters<NonNullable<ViewProps["onLayout"]>>[0]) => {
    const next = event.nativeEvent.layout;
    if (Number.isFinite(next.width) && Number.isFinite(next.height) &&
        next.width >= 0 && next.height >= 0 &&
        (next.width !== store.getState().width || next.height !== store.getState().height)) {
      store.setState({ width: next.width, height: next.height });
    }
    onLayout?.(event);
  };

  const masterVisible = Boolean(plan && plan.master.placement !== "hidden");
  const inspectorVisible = Boolean(plan && inspector && plan.inspector.placement !== "closed");
  const isMasterOverlay = plan?.master.placement === "overlay";
  const isInspectorSheet = inspectorVisible && plan?.inspector.placement === "contained-sheet";
  // A compact master overlay or a full-width inspector sheet covers the
  // detail pane, so screen readers must not reach the content behind it.
  const detailCovered = isMasterOverlay || isInspectorSheet;
  const dismissTop = isInspectorSheet ? onDismissInspector :
    isMasterOverlay ? onDismissMaster : undefined;
  const dismissRef = useRef(dismissTop);
  dismissRef.current = dismissTop;
  const backActive = Boolean(dismissTop);
  useEffect(() => {
    if (!backActive) return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      dismissRef.current?.();
      return true;
    });
    return () => subscription.remove();
  }, [backActive]);
  const dir = isRTL ? "rtl" : "ltr";
  const paneRoot: ViewStyle = { direction: dir, flex: 1 };
  const content = (child: ReactNode, label: string, classes: string | undefined,
    position: ViewStyle, visible: boolean, rank: number,
    a11yHidden = !visible, modal = false) => (
    <View
      accessibilityLabel={label}
      accessibilityViewIsModal={modal}
      accessibilityElementsHidden={a11yHidden}
      importantForAccessibility={a11yHidden ? "no-hide-descendants" : "auto"}
      pointerEvents={visible ? "auto" : "none"}
      {...{ className: css("overflow-hidden bg-surface-raised", classes) }}
      style={[position, { zIndex: rank, display: visible ? "flex" : "none" }, paneRoot]}
    >{child}</View>
  );

  return (
    <View {...rest} onLayout={measured}
      {...{ className: css("flex-1", className) }}
      // Physical positions remain LTR; content restores RTL independently.
      style={[{ position: "relative", direction: "ltr", overflow: "hidden" }, style]}>
      {content(detail, "Detail pane", detailClassName,
        plan ? rectStyle(plan.detail.rect) : { position: "absolute", top: 0, bottom: 0, left: 0, right: 0 },
        true, 1, detailCovered)}
      {isMasterOverlay && plan ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close master pane"
          onPress={onDismissMaster}
          disabled={!onDismissMaster}
          style={{ ...rectStyle(plan.detail.rect), zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.18)" }}
        />
      ) : null}
      {content(master, "Master pane", masterClassName,
        plan ? rectStyle(plan.master.rect) : { display: "none" },
        masterVisible, 3, !masterVisible || isInspectorSheet, isMasterOverlay && !isInspectorSheet)}
      {inspector ? content(inspector, "Inspector pane", inspectorClassName,
        plan ? rectStyle(plan.inspector.rect) : { display: "none" },
        inspectorVisible, 4, !inspectorVisible, isInspectorSheet) : null}
      {inspectorVisible && onDismissInspector && plan ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Close inspector"
          onPress={onDismissInspector}
          // A small contained close affordance; do not capture the whole inspector.
          style={{
            position: "absolute", zIndex: 5,
            top: plan.inspector.rect.y + 4,
            left: plan.inspector.edge === "right"
              ? plan.inspector.rect.x + plan.inspector.rect.width - 48
              : plan.inspector.rect.x + 4,
            minWidth: 44, minHeight: 44,
            alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.12)",
          }}
        ><Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants">×</Text></Pressable>
      ) : null}
    </View>
  );
}
