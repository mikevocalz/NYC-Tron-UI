import { Button as SparkButton, getControlAvailability, type ButtonProps as SparkButtonProps } from '@legendapp/spark/ui';
import { requireAppKit } from './native-availability.ts';

export type ButtonProps = SparkButtonProps;
/** AppKit control; supported frame styles belong to the app, native chrome to macOS. */
export function Button(props: ButtonProps) {
  requireAppKit('Button', getControlAvailability('button'));
  return <SparkButton {...props} />;
}
