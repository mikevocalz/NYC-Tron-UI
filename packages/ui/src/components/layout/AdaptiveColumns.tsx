import { View, type ViewProps } from "react-native";

export interface AdaptiveColumnsProps extends ViewProps {
  /** App-owned space between columns and wrapped rows, in logical units. */
  gap: number;
  className?: string;
}

export interface AdaptiveColumnProps extends ViewProps {
  /**
   * Preferred minimum before the item wraps. A container narrower than this
   * still fits one column. Multiply by fontScale for text-heavy columns.
   */
  minWidth: number;
  /** Share of spare row space. Zero keeps the preferred width. Default 1. */
  grow?: number;
  className?: string;
}

/**
 * Intrinsic wrapping within one usable pane. The same child tree stays
 * mounted while CSS/Yoga reflows it, including before hydration/measurement.
 * Hardware separation remains the job of AdaptivePaneHost.
 */
function AdaptiveColumnsRoot({ gap, children, style, ...rest }: AdaptiveColumnsProps) {
  if (!Number.isFinite(gap) || gap < 0) {
    throw new RangeError("AdaptiveColumns gap must be a nonnegative finite number");
  }
  return <View {...rest} style={[{
    minWidth: 0, flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", gap,
  }, style]}>{children}</View>;
}

export function AdaptiveColumn({ minWidth, grow = 1, children, style, ...rest }: AdaptiveColumnProps) {
  if (!Number.isFinite(minWidth) || minWidth <= 0 || !Number.isFinite(grow) || grow < 0) {
    throw new RangeError("AdaptiveColumn requires a positive minWidth and nonnegative grow");
  }
  return <View {...rest} style={[{
    flexBasis: minWidth, flexGrow: grow, flexShrink: 1, minWidth: 0, maxWidth: "100%",
  }, style]}>{children}</View>;
}

export const AdaptiveColumns = Object.assign(AdaptiveColumnsRoot, { Item: AdaptiveColumn });
