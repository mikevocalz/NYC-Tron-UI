import type { ReactNode } from "react";
import { Text as NativeText, type TextProps as NativeTextProps, type TextStyle } from "react-native";
import { font, leading } from "../../tokens.ts";
import { joinClasses } from "../styles.ts";

export type TextVariant = "body" | "caption";
export type TextTone = "text" | "muted" | "danger" | "primary" | "accent" | "info" | "success" | "onPrimary" | "onDanger";
/** Font size step key from the token scale. */
export type TextSize = keyof typeof font;

export interface TextProps extends Omit<NativeTextProps, "children"> {
  children?: ReactNode;
  /** Size and line height pair that already exists in the components. Omit it to inherit the size. */
  variant?: TextVariant;
  /** Font size only. Overrides the variant size and drops its line height. */
  size?: TextSize;
  /** Theme colour role. Default `text`, always applied: a Text inside a coloured Text does not inherit the parent colour, so pass `tone` to match it. */
  tone?: TextTone;
  className?: string;
}

// The pairs below are the two (size, line height) combinations that occur three or more times in `ui`.
const variants: Record<TextVariant, TextStyle> = {
  body: { fontSize: font[12], lineHeight: leading[16] },
  caption: { fontSize: font[11], lineHeight: leading[14] },
};
// Literal class names so a Tailwind or Uniwind scan finds them.
const tones: Record<TextTone, string> = {
  text: "text-text",
  muted: "text-text-muted",
  danger: "text-danger",
  primary: "text-primary",
  accent: "text-accent",
  info: "text-info",
  success: "text-success",
  onPrimary: "text-on-primary",
  onDanger: "text-on-danger",
};

/**
 * Text with a token-keyed size and a theme colour role. It adds no weight and no
 * font family. Explicit `style` stays last.
 */
export function Text({ children, variant, size, tone = "text", className, style, ...rest }: TextProps) {
  const sized: TextStyle | undefined = size !== undefined ? { fontSize: font[size] } : variant ? variants[variant] : undefined;
  return (
    <NativeText {...rest} {...{ className: joinClasses(tones[tone], className) }} style={[sized, style]}>
      {children}
    </NativeText>
  );
}
