import { Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";
import { StatusGlyph } from "./glyphs.tsx";

/** Props for {@linkcode ErrorMessage}. Drop-in for Nitro Forge's `StudioErrorMessageProps`. */
export interface ErrorMessageProps extends Omit<ViewProps,"children"> {
  /** Nothing renders without a message, so the row collapses. */
  message?:string;
  /**
   * Accepted so Forge's `surface="night"` call sites compile unchanged. It does
   * not pick colors: the danger token resolves from the nearest scheme scope,
   * so a message inside `NightScope` already takes the dark value.
   */
  surface?:"page"|"night";
  className?:string;
  messageClassName?:string;
  unstyled?:boolean;
}

/**
 * Inline error for a form or pane: what went wrong and how to recover, in one
 * or two sentences. Announced as an alert when it appears. The drawn "!" mark
 * keeps the state readable without color.
 */
export function ErrorMessage({
  message,surface:_surface,className,messageClassName,unstyled=false,...rest
}:ErrorMessageProps) {
  if(!message)return null;
  const styled=!unstyled;
  return (
    <View {...rest} {...{className:joinClasses("flex-row items-start",styled&&"gap-2",className)}}>
      <View {...{className:"pt-px"}}><StatusGlyph tone="danger"/></View>
      <Text role="alert" accessibilityLiveRegion="polite"
        {...{className:joinClasses("min-w-0 flex-1",styled&&"text-sm leading-5 text-danger",messageClassName)}}>
        {message}
      </Text>
    </View>
  );
}
