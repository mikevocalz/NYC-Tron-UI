import { TextInput as SparkTextInput, getControlAvailability, type TextInputProps } from '@legendapp/spark/ui';
import { requireAppKit } from './native-availability.ts';

export type TextFieldProps = TextInputProps;
/** AppKit control; supported frame styles belong to the app, native chrome to macOS. */
export function TextField(props: TextFieldProps) {
  requireAppKit('TextField', getControlAvailability('text-input'));
  return <SparkTextInput {...props} />;
}
