import type { ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { Button } from "../Button.tsx";
import { joinClasses } from "../styles.ts";

/** A live way out of the empty state, rendered as the kit's secondary Button. */
export interface EmptyStateExit {
  title:string;
  onPress:()=>void;
  accessibilityHint?:string;
}

/** Props for {@linkcode EmptyState}. Drop-in for Nitro Forge's `StudioEmptyStateProps`. */
export interface EmptyStateProps extends Omit<ViewProps,"children"> {
  title:string;
  /**
   * Honest copy: what is missing and where the job gets done today. If the
   * promised feature does not exist yet, say where to go instead; never a
   * placeholder promise.
   */
  description?:string;
  /** The app's own control. Takes precedence over `exitAction`. */
  action?:ReactNode;
  /** Shorthand for the common single exit; ignored when `action` is passed. */
  exitAction?:EmptyStateExit;
  /** Small glyph above the title. Ignored when `illustration` is passed. */
  icon?:ReactNode;
  /** Art above the title; the caller owns its accessible name or aria-hidden. */
  illustration?:ReactNode;
  /** Heading level of the title on web. iOS and Android announce a heading without a level. @default 2 */
  titleLevel?:1|2|3|4|5|6;
  /**
   * Accepted so Forge's brand tones (`royal`, `carolina`) compile unchanged.
   * Colors come from the app's tokens, so the value does not change the render.
   */
  tone?:string;
  className?:string;
  titleClassName?:string;
  descriptionClassName?:string;
  unstyled?:boolean;
}

/**
 * The state shown when a pane has nothing to list. It is for real emptiness:
 * a failed read is an error, not an empty state, and renders `ErrorMessage`
 * or a danger `Banner` instead.
 */
export function EmptyState({
  title,description,action,exitAction,icon,illustration,titleLevel=2,tone:_tone,
  className,titleClassName,descriptionClassName,unstyled=false,...rest
}:EmptyStateProps) {
  const styled=!unstyled;
  const exit=action??(exitAction
    ? <Button title={exitAction.title} variant="secondary" onPress={exitAction.onPress}
        accessibilityHint={exitAction.accessibilityHint}/>
    : null);
  const art=illustration??icon;
  return (
    <View {...rest} {...{className:joinClasses("w-full items-center justify-center",styled&&"gap-2 px-6 py-8",className)}}>
      {art ? <View {...{className:joinClasses("items-center",styled&&"mb-2")}}>{art}</View> : null}
      <Text role="heading" {...{"aria-level":titleLevel}}
        {...{className:joinClasses("text-center",styled&&"text-base font-semibold leading-6 text-text",titleClassName)}}>{title}</Text>
      {description ? (
        <Text {...{className:joinClasses("text-center",styled&&"max-w-sm text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text>
      ) : null}
      {exit ? <View {...{className:joinClasses("items-center",styled&&"mt-3")}}>{exit}</View> : null}
    </View>
  );
}
