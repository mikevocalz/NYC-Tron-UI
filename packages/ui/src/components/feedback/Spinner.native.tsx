import { Platform, View } from "react-native";
import { Host } from "@expo/ui";
import { ProgressView } from "@expo/ui/swift-ui";
import { accessibilityLabel as swiftUILabel, controlSize, progressViewStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { CircularProgressIndicator } from "@expo/ui/jetpack-compose";
import { semantics, size as composeSize } from "@expo/ui/jetpack-compose/modifiers";
import { joinClasses } from "../styles.ts";
import { assertSpinnerSize, type SpinnerProps, type SpinnerSize } from "./Spinner.types.ts";
export type { SpinnerProps, SpinnerSize } from "./Spinner.types.ts";

const SWIFTUI_SIZE:Record<SpinnerSize,"small"|"regular"|"large">={sm:"small",md:"regular",lg:"large"};
const COMPOSE_DP:Record<SpinnerSize,number>={sm:20,md:32,lg:48};

/**
 * Indeterminate busy mark on the OS indicator: SwiftUI `ProgressView`
 * (circular) on iOS, Material 3 `CircularProgressIndicator` on Android, both
 * from `@expo/ui`. The label goes into the native control (SwiftUI
 * `accessibilityLabel`, Compose `contentDescription`), so VoiceOver and
 * TalkBack name it; the RN wrapper is not an accessibility element, so the
 * name is read once.
 */
export function Spinner({
  ref,size="md",label="Loading",color,colorClassName:_colorClassName,colorScheme,className,unstyled:_unstyled,style,
  accessibilityLabel,...rest
}:SpinnerProps) {
  assertSpinnerSize(size);
  const name=accessibilityLabel??label;
  const indicator=Platform.OS==="android"
    ? <CircularProgressIndicator {...(color===undefined?{}:{color})}
        modifiers={[composeSize(COMPOSE_DP[size],COMPOSE_DP[size]),semantics({contentDescription:name})]}/>
    : <ProgressView modifiers={[progressViewStyle("circular"),controlSize(SWIFTUI_SIZE[size]),swiftUILabel(name),
        ...(color===undefined?[]:[tint(color)])]}/>;
  return (
    <View {...rest} ref={ref} style={[{alignSelf:"flex-start"},style]} {...{className:joinClasses(className)}}>
      <Host matchContents {...(colorScheme===undefined?{}:{colorScheme})}>{indicator}</Host>
    </View>
  );
}
