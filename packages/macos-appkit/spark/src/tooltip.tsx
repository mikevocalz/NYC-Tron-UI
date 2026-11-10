import { View, type ViewProps } from 'react-native';
import { requireAppKit } from './native-availability.ts';

export interface TooltipProps extends ViewProps {
  /** Plain text owned by AppKit's native tooltip mechanism. */
  label: string;
  disabled?: boolean;
}

/** RNmacOS Fabric maps tooltip directly to NSView.toolTip; AppKit owns hover timing. */
export function Tooltip({ label, disabled = false, accessibilityHint, ...props }: TooltipProps) {
  requireAppKit('Tooltip', { available: true });
  if (typeof label !== 'string' || !label.trim()) throw new TypeError('Tooltip label must be nonempty text');
  return <View {...props} collapsable={false} accessibilityHint={accessibilityHint ?? (disabled ? undefined : label)}
    {...{ tooltip: disabled ? undefined : label }} />;
}
