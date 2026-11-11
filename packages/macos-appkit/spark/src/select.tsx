import { Select as SparkSelect, getControlAvailability, type SelectProps as SparkSelectProps } from '@legendapp/spark/ui';
import { requireAppKit } from './native-availability.ts';

export type SelectProps = SparkSelectProps;
/** AppKit control; supported frame styles belong to the app, native chrome to macOS. */
export function Select(props: SelectProps) {
  requireAppKit('Select', getControlAvailability('select'));
  return <SparkSelect {...props} />;
}
