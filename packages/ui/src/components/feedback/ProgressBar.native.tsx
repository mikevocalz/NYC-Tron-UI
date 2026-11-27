import { Platform, View } from "react-native";
import { Host } from "@expo/ui";
import { ProgressView } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as swiftUILabel, accessibilityValue as swiftUIValue, progressViewStyle, tint,
} from "@expo/ui/swift-ui/modifiers";
import { LinearProgressIndicator } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, semantics } from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { KitProgressBar, ProgressLabelRow, useReducedMotion } from "./ProgressBar.shared.tsx";
import { resolveProgressBar, type ProgressBarProps } from "./ProgressBar.types.ts";
export type { ProgressBarProps, ProgressBarSize, ProgressBarTone, ProgressValueContext } from "./ProgressBar.types.ts";

/**
 * Linear progress on the OS bar: SwiftUI `ProgressView` (linear style) on
 * iOS, Material 3 `LinearProgressIndicator` on Android, both from `@expo/ui`.
 * The visible label and value are app-token RN text above the bar and hidden
 * from assistive tech; the name (and the value text on iOS, or a custom
 * `valueText` on Android, where the bar already reports its percent) goes
 * into the native control so it is read once.
 *
 * The OS indicators keep animating while reduce motion is on, so an
 * indeterminate bar renders the kit bar's still segment in that case.
 * `tone`, `size`, `trackClassName` and `fillClassName` only apply to that
 * fallback; use `color` to tint the native bar. Validation matches the web
 * build: RangeError for `min >= max` or a non-finite bound or value,
 * TypeError with no label in words.
 */
export function ProgressBar(props:ProgressBarProps) {
  const {name,a11y}=resolveProgressBar(props);
  const reduced=useReducedMotion();
  if(a11y.busy&&reduced)return <KitProgressBar {...props}/>;
  const {
    ref,value:_value,min:_min,max:_max,indeterminate:_indeterminate,label,showValue=false,valueText,busyText:_busyText,
    tone:_tone,size:_size,color,colorScheme,className,labelClassName,valueClassName,trackClassName:_track,fillClassName:_fill,
    unstyled=false,accessibilityLabel:_accessibilityLabel,accessibilityState:_accessibilityState,style,...rest
  }=props;
  const text=a11y.accessibilityValue.text;
  const progress=a11y.busy?null:a11y.fraction;
  const indicator=Platform.OS==="android"
    ? <LinearProgressIndicator progress={progress} {...(color===undefined?{}:{color})}
        modifiers={[fillMaxWidth(),semantics({contentDescription:valueText&&!a11y.busy?`${name}, ${text}`:name})]}/>
    : <ProgressView value={progress}
        modifiers={[progressViewStyle("linear"),swiftUILabel(name),swiftUIValue(text),...(color===undefined?[]:[tint(color)])]}/>;
  return (
    <View {...rest} ref={ref} style={[{gap:6},style]} {...{className:joinClasses("w-full",className)}}>
      <ProgressLabelRow label={label} value={showValue&&!a11y.busy?text:undefined}
        unstyled={unstyled} labelClassName={labelClassName} valueClassName={valueClassName}/>
      <Host matchContents={{vertical:true}} style={{width:"100%"}} {...(colorScheme===undefined?{}:{colorScheme})}>
        {indicator}
      </Host>
    </View>
  );
}
