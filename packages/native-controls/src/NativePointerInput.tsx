import {Host} from '@expo/ui';
import {requireNativeView} from 'expo';
import {Platform, type NativeSyntheticEvent} from 'react-native';
import type {PointerBatch, PointerKeyEvent} from './pointer-input.js';
import type {NativePointerInputProps} from './NativePointerInput.types.js';
export type {NativePointerInputProps} from './NativePointerInput.types.js';

const InputView = requireNativeView<{
  label: string;
  onBatch: (event: NativeSyntheticEvent<PointerBatch>) => void;
  onKey: (event: NativeSyntheticEvent<PointerKeyEvent>) => void;
}>('NYCTronInstruments', 'TronPointerInputView');

/** UIKit/Android input with actual history, pen force/tilt, hover and hardware keys. */
export function NativePointerInput({width, height, label, onBatch, onKey}: NativePointerInputProps) {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') throw new Error('NativePointerInput requires iOS or Android; web uses its browser export.');
  if (![width,height].every(value => Number.isFinite(value) && value > 0 && value <= 16384) || !label.trim()) throw new RangeError('NativePointerInput needs positive dimensions up to 16384 and an accessible label.');
  return <Host style={{width,height}}><InputView label={label} onBatch={event => onBatch(event.nativeEvent)} onKey={event => onKey?.(event.nativeEvent)}/></Host>;
}
