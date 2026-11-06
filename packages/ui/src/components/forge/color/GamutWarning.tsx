import { Text, View, type ViewProps } from "react-native";
import { Button } from "../../Button.tsx";
import { joinClasses } from "../../styles.ts";
import { validateGamutReport, type GamutReport } from "./color-management.ts";
export type { GamutReport } from "./color-management.ts";
/** Measured gamut information and optional host inspection action. */
export interface GamutWarningProps extends Omit<ViewProps, "children"> {
  /** null means measurement has not arrived, not that every color is in gamut. */
  readonly report: GamutReport | null;
  readonly onInspect?: () => void;
  readonly unstyled?: boolean;
}
/** Announces the actual measured sample count; no guessed gamut test or clipping. */
export function GamutWarning({ report, onInspect, unstyled = false, ...props }: GamutWarningProps) {
  if (report) validateGamutReport(report);
  return <View {...props} style={[{ gap: 8 }, props.style]}>
    <Text accessibilityLiveRegion="polite" {...{ className: joinClasses(!unstyled && "text-text") }}>{!report ? "Gamut not measured" : report.total === 0 ? "No color samples" : `${report.outside} of ${report.total} samples outside ${report.destinationProfileId}${report.maximumDeltaE !== undefined ? `; maximum delta E ${report.maximumDeltaE}` : ""}`}</Text>
    {onInspect ? <Button title="Inspect out-of-gamut colors" disabled={!report || report.outside === 0} onPress={onInspect} unstyled={unstyled}/> : null}
  </View>;
}
