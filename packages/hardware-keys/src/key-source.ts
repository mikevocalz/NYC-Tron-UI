import type {KeyChord} from "@nyc-tron/ui/components/shell/shortcut-model";
import type {NativeKeyBinding} from "@nyc-tron/ui/components/shell/keyboard-map";

/** Cleanup handle returned by every registration in this package. */
export interface Subscription {
  remove():void;
}

/**
 * Where keydowns come from on one platform: the document on web, the
 * NYCTronHardwareKeys module on iOS and Android.
 */
export interface KeySource {
  /** Every keydown the source delivers. The listener returns true when it ran a command. */
  addChordListener(listener:(chord:KeyChord)=>boolean):Subscription;
  /** Bindings the source should intercept. Ignored on web, where every key reaches the page. */
  registerBindings(bindings:readonly NativeKeyBinding[]):Subscription;
  /** A text field has focus now. */
  isTextInputFocused():boolean;
}
