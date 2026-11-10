import { useLayoutEffect, useMemo, useRef, type ReactNode } from 'react';
import { UIManager, View } from 'react-native';
import { hasUsableRegion, placePopover, placementSide, type Rect2D } from '@nyc-tron/core/overlays';
import NativePopover from './NYCTronPopoverNativeComponent.ts';
import { requireAppKit } from './native-availability.ts';

export interface PopoverPresentationRejection {
  reason: 'outside-usable-region';
  /** Actual native window frame, including popover chrome, in owner-content coordinates. */
  bounds: Rect2D;
  region: Rect2D;
}
export interface PopoverProps {
  /** Document/target identity; replacement discards old native dismissal events. */
  scope?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPresentationRejected?: (rejection: PopoverPresentationRejection) => void;
  accessibilityLabel: string;
  /** Owner-content/window coordinates from the app's measured anchor. */
  anchor: Rect2D;
  /** AppKit chooses final placement; content outside the selected region is dismissed. */
  usableRegions: readonly Rect2D[];
  children: ReactNode;
  width?: number;
  maxHeight?: number;
  animated?: boolean;
  testID?: string;
}
let nextLifetime = 0;

/** Genuine NSPopover. React children stay mounted while AppKit presents/dismisses it. */
export function Popover({ scope = 'popover', open, onOpenChange, onPresentationRejected, accessibilityLabel, anchor, usableRegions, children, width = 320, maxHeight = 420, animated = true, testID }: PopoverProps) {
  requireAppKit('Popover', UIManager.hasViewManagerConfig('NYCTronPopover') ? { available: true } : { available: false, reason: 'missing-module' });
  if (!scope.trim() || !accessibilityLabel.trim()) throw new TypeError('Popover scope and accessible name must be nonempty');
  if (![width, maxHeight].every(value => Number.isFinite(value) && value > 0)) throw new RangeError('Popover dimensions must be positive finite points');
  const available = hasUsableRegion(usableRegions);
  // Retain the content tree during temporary loss of usable geometry.
  const position = placePopover(anchor, available ? usableRegions : [{ x: 0, y: 0, width: width + 16, height: maxHeight + 16 }], width, maxHeight);
  const scopeToken = useMemo(() => `popover-${++nextLifetime}`, [scope, open]);
  const presentationToken = `${scopeToken}:${[anchor.x, anchor.y, anchor.width, anchor.height, position.width, position.height, position.region.x, position.region.y, position.region.width, position.region.height].join(':')}`;
  const committed = useRef<{ scopeToken: string; presentationToken: string; open: boolean; available: boolean; onOpenChange: typeof onOpenChange; onPresentationRejected: typeof onPresentationRejected } | null>(null);
  useLayoutEffect(() => { committed.current = { scopeToken, presentationToken, open, available, onOpenChange, onPresentationRejected }; });
  useLayoutEffect(() => () => { committed.current = null; }, []);
  return <NativePopover testID={testID} accessibilityLabel={accessibilityLabel} collapsable={false}
    style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1 }}
    visible={open && available} scopeToken={scopeToken} presentationToken={presentationToken} animated={animated}
    anchorX={anchor.x} anchorY={anchor.y} anchorWidth={anchor.width} anchorHeight={anchor.height}
    popupWidth={position.width} popupHeight={position.height} preferredEdge={placementSide(anchor, position) === 'above' ? 'above' : 'below'}
    regionX={position.region.x} regionY={position.region.y} regionWidth={position.region.width} regionHeight={position.region.height}
    onDismiss={event => {
      const current = committed.current;
      if (current?.scopeToken === event.nativeEvent.scopeToken && current.open && current.available) current.onOpenChange(false);
    }}
    onPresentationRejected={event => {
      const current = committed.current, value = event.nativeEvent;
      if (current?.scopeToken !== value.scopeToken || current.presentationToken !== value.presentationToken || !current.open || !current.available) return;
      current.onOpenChange(false);
      current.onPresentationRejected?.({ reason: 'outside-usable-region',
        bounds: { x: value.x, y: value.y, width: value.width, height: value.height },
        region: { x: value.regionX, y: value.regionY, width: value.regionWidth, height: value.regionHeight } });
    }}>
    <View collapsable={false} style={{ width: position.width, height: position.height }}>{children}</View>
  </NativePopover>;
}
