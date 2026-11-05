// Shapes that cross the native boundary, kept free of react-native imports
// so the contract tests run on plain Node.
import type {KeyChord} from "@nyc-tron/ui/components/shell/shortcut-model";

/** Name both platforms register the Expo module under. */
export const NATIVE_MODULE_NAME="NYCTronHardwareKeys";

/**
 * One hardware keydown as a native key source reports it. The modifier
 * fields are the physical keys: on Apple hardware Command is `metaKey`, on
 * Android and other keyboards Control is `ctrlKey`; `bindingFromChord`
 * maps either to `Mod`.
 */
export interface HardwareKeyChord extends KeyChord {
  readonly key:string;
  readonly ctrlKey:boolean;
  readonly metaKey:boolean;
  readonly altKey:boolean;
  readonly shiftKey:boolean;
  /** The key is held and the OS is repeating it. */
  readonly isRepeat:boolean;
  /** Delivered by an active recording rather than a registered binding. */
  readonly recording:boolean;
}

/** Reads a native payload; undefined when it is not a chord. */
export function toChord(payload:unknown):HardwareKeyChord|undefined{
  if(!payload||typeof payload!=="object")return undefined;
  const p=payload as Record<string,unknown>;
  if(typeof p.key!=="string"||!p.key)return undefined;
  return {key:p.key,ctrlKey:p.ctrlKey===true,metaKey:p.metaKey===true,altKey:p.altKey===true,
    shiftKey:p.shiftKey===true,isRepeat:p.isRepeat===true,recording:p.recording===true};
}
