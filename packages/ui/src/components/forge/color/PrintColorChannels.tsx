import { View, type ViewProps } from "react-native";
import { UnitInput } from "../../shell/UnitInput.tsx";
import { validateColorChannels, type PrintColor } from "./color-management.ts";
export type { PrintColor } from "./color-management.ts";
/** Controlled, profile-preserving CMYK editor; every field acceptance commits one change. */
export interface PrintColorChannelsProps extends Omit<ViewProps, "children"> {
  readonly value: PrintColor;
  readonly onCommit: (value: PrintColor) => void;
  readonly disabled?: boolean;
  readonly unstyled?: boolean;
}
/** Edits actual CMYK percentages without approximating ICC conversion from RGB. */
export function PrintColorChannels({ value, onCommit, disabled = false, unstyled = false, ...props }: PrintColorChannelsProps) {
  validateColorChannels(value, 4, 0, 100);
  return <View {...props} style={[{ gap: 8 }, props.style]}>
    {(["Cyan", "Magenta", "Yellow", "Black"] as const).map((label, index) => <UnitInput key={label} label={`${label} percent`} value={value.channels[index]!} min={0} max={100} step={1} precision={2} disabled={disabled} unstyled={unstyled}
      onCommit={number => { if (disabled || number === value.channels[index]) return; const channels = [...value.channels] as [number, number, number, number]; channels[index] = number; onCommit({ ...value, channels }); }}/>) }
    <UnitInput label="Print opacity percent" value={value.alpha * 100} min={0} max={100} step={1} disabled={disabled} unstyled={unstyled} onCommit={alpha => { if (!disabled && alpha / 100 !== value.alpha) onCommit({ ...value, alpha: alpha / 100 }); }}/>
  </View>;
}
