import { ActivityIndicator } from "react-native";
import { joinClasses } from "../styles.ts";
import { assertSpinnerSize, type SpinnerProps, type SpinnerSize } from "./Spinner.types.ts";
export type { SpinnerProps, SpinnerSize } from "./Spinner.types.ts";

const SIZES:Record<SpinnerSize,{native:"small"|"large";scale:number}>={
  sm:{native:"small",scale:0.8},
  md:{native:"small",scale:1},
  lg:{native:"large",scale:1},
};

/**
 * Indeterminate busy mark over React Native's `ActivityIndicator` (the web
 * and kit build). Exposes `progressbar` with a busy state and a label in
 * words. Use ProgressBar when the amount of work done is known.
 */
export function Spinner({
  ref,size="md",label="Loading",color,colorClassName,colorScheme:_colorScheme,className,unstyled:_unstyled,style,
  accessibilityLabel,accessibilityState,...rest
}:SpinnerProps) {
  assertSpinnerSize(size);
  const preset=SIZES[size];
  return (
    <ActivityIndicator
      {...rest}
      ref={ref}
      size={preset.native}
      {...(color===undefined?{}:{color})}
      {...(colorClassName===undefined?{}:{colorClassName})}
      style={[preset.scale===1?undefined:{transform:[{scale:preset.scale}]},style]}
      {...{className:joinClasses(className)}}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel??label}
      accessibilityState={{...accessibilityState,busy:true}}
    />
  );
}
