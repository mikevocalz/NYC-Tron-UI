import type { ReactNode } from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../styles.ts";
import { CloseGlyph, StatusGlyph, type StatusTone } from "./glyphs.tsx";

export type BannerTone=StatusTone;

/** Props for {@linkcode Banner}. Drop-in for Nitro Forge's `StudioBannerProps`. */
export interface BannerProps extends Omit<ViewProps,"children"|"role"> {
  tone:BannerTone;
  /** One sentence naming what happened. Never the only place an error's recovery is described. */
  title:string;
  description?:string;
  /** A control that resolves the notice (Try again, Open settings). Rendered under the copy. */
  action?:ReactNode;
  /**
   * `status` (default) is a polite live region. `alert` is assertive: use it
   * only for a banner that appears because of something the person just did.
   */
  live?:"status"|"alert";
  /** Shows a 44pt close control. The app owns whether the banner stays mounted. */
  onDismiss?:()=>void;
  /** Screen-reader name of the close control. @default "Dismiss" */
  dismissLabel?:string;
  /** Replaces the drawn status mark. */
  icon?:ReactNode;
  className?:string;
  titleClassName?:string;
  descriptionClassName?:string;
  /** No default visual classes; the app supplies the full recipe. */
  unstyled?:boolean;
}

const tones:Record<BannerTone,string>={
  info:"border-info bg-surface-raised",
  success:"border-success bg-surface-raised",
  danger:"border-danger bg-surface-raised",
  neutral:"border-border bg-surface-sunken",
};

/**
 * Page- or pane-level notice: saved, couldn't save, offline, read-only.
 * Tone shows in the border and the drawn mark, and the title carries the
 * meaning in words, so color is never the only signal. Not dismissible unless
 * `onDismiss` is passed.
 */
export function Banner({
  tone,title,description,action,live="status",onDismiss,dismissLabel="Dismiss",icon,
  className,titleClassName,descriptionClassName,unstyled=false,...rest
}:BannerProps) {
  const styled=!unstyled;
  return (
    <View {...rest} role={live}
      accessibilityLiveRegion={live==="alert"?"assertive":"polite"}
      {...{className:joinClasses("w-full flex-row items-start",
        styled&&"gap-3 rounded-card border ps-4 py-3",styled&&tones[tone],
        styled&&(onDismiss?"pe-1":"pe-4"),className)}}>
      <View {...{className:"pt-0.5"}}>{icon??<StatusGlyph tone={tone}/>}</View>
      <View {...{className:joinClasses("min-w-0 flex-1",styled&&"gap-1 py-px")}}>
        <Text {...{className:joinClasses(styled&&"text-sm font-semibold leading-5 text-text",titleClassName)}}>{title}</Text>
        {description ? <Text {...{className:joinClasses(styled&&"text-sm leading-5 text-text-muted",descriptionClassName)}}>{description}</Text> : null}
        {action ? <View {...{className:joinClasses("self-start",styled&&"mt-2")}}>{action}</View> : null}
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel={dismissLabel}
          // Negative margins keep the 44pt target from growing the banner; the
          // cross lands centered on the title's first line.
          style={{marginVertical:-10}}
          {...{className:joinClasses("min-h-11 min-w-11 items-center justify-center",
            styled&&"rounded-control hover:bg-surface-sunken active:opacity-70 focus-visible:ring-2 focus-visible:ring-focus")}}>
          <CloseGlyph/>
        </Pressable>
      ) : null}
    </View>
  );
}
