import { View, type ViewProps } from "react-native";

export interface ContentFrameProps extends ViewProps {
  /** App-chosen reading/form/media width in logical layout units. */
  maxWidth: number;
  /** Logical alignment follows the containing layout's reading direction. */
  align?: "start" | "center" | "end";
  className?: string;
}

/**
 * Bounds content within its actual parent without reading the app window.
 * Use inside an already usable pane; this is not a fold or safe-area resolver.
 * The app owns spacing, surfaces and type. Explicit style remains last.
 */
export function ContentFrame({
  maxWidth, align = "center", children, style, ...rest
}: ContentFrameProps) {
  if (!Number.isFinite(maxWidth) || maxWidth <= 0) {
    throw new RangeError("ContentFrame maxWidth must be a positive finite number");
  }
  return <View {...rest} style={[{
    width: "100%", minWidth: 0, maxWidth, flexShrink: 1,
    marginStart: align === "start" ? 0 : "auto",
    marginEnd: align === "end" ? 0 : "auto",
  }, style]}>{children}</View>;
}
