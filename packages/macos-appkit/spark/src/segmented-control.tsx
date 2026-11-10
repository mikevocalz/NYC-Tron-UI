import { SegmentedControl as SparkSegmentedControl, getControlAvailability, type SegmentedControlProps as SparkSegmentedControlProps } from '@legendapp/spark/ui';
import { requireAppKit } from './native-availability.ts';

export type SegmentedControlProps = SparkSegmentedControlProps;
/** AppKit control; supported frame styles belong to the app, native chrome to macOS. */
export function SegmentedControl(props: SegmentedControlProps) {
  requireAppKit('SegmentedControl', getControlAvailability('segmented-control'));
  return <SparkSegmentedControl {...props} />;
}
