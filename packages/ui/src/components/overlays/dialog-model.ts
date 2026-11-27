/*
 * Behaviour adapted from NYC-MON packages/ui/Dialog.tsx and
 * packages/ui/ConfirmDestructive.tsx (MIT), mikevocalz/nyc-mon commit
 * 5ed8cf8322c685c86dbe03f4ac7b801255d1b907. Copyright (c) 2025 Gursel Cakar,
 * MIT. Notices: THIRD_PARTY_NOTICES.md. Modified for NYC-Tron UI (2026-11):
 * pure dismissal, size and focus rules split out for unit tests.
 */
/**
 * Pure rules shared by Dialog and AlertDialog: when a close request is
 * allowed, the size scale, frame padding, animation choice and initial focus.
 * No React or React Native import, so the rules are unit tested directly.
 */

/** Where a close request came from. `action` is an explicit control in the dialog, such as Cancel. */
export type DialogDismissReason="backdrop"|"escape"|"back"|"action";

export type DialogSize="sm"|"md"|"lg";

export interface DismissOptions {
  /** Escape, the Android back button and the backdrop may close the dialog. @default true */
  dismissible?:boolean;
  /** The backdrop may close the dialog. Only applies while `dismissible`. @default dismissible */
  closeOnBackdrop?:boolean;
  /** Work is running; nothing closes the dialog until it ends. @default false */
  busy?:boolean;
}

/**
 * Whether a close request for `reason` is honoured. While busy, no request
 * closes the dialog, including explicit actions, so a pending save or delete
 * cannot be abandoned half way. Otherwise explicit actions always close, and
 * Escape, back and the backdrop follow `dismissible` / `closeOnBackdrop`.
 */
export function canDismiss(reason:DialogDismissReason,{dismissible=true,closeOnBackdrop=dismissible,busy=false}:DismissOptions={}):boolean{
  if(busy)return false;
  if(reason==="action")return true;
  if(!dismissible)return false;
  if(reason==="backdrop")return closeOnBackdrop;
  return reason==="escape"||reason==="back";
}

/** Panel max width in points for each size. The panel is full width below it. */
export const DIALOG_MAX_WIDTH:Readonly<Record<DialogSize,number>>=Object.freeze({sm:400,md:560,lg:720});

/** Max width for `size`. Throws RangeError for a value outside the scale. */
export function dialogMaxWidth(size:DialogSize):number{
  if(typeof size!=="string"||!Object.hasOwn(DIALOG_MAX_WIDTH,size))throw new RangeError(`Invalid dialog size ${String(size)}`);
  return DIALOG_MAX_WIDTH[size];
}

export interface DialogInsets {top?:number;bottom?:number;left?:number;right?:number}
export interface DialogFramePadding {paddingTop:number;paddingBottom:number;paddingLeft:number;paddingRight:number}

/**
 * Padding of the frame that centres the panel: the safe-area inset on each
 * side plus `gutter`. Insets are physical (left/right), as safe-area
 * libraries report them. Throws RangeError for a negative or non-finite value.
 */
export function dialogFramePadding(insets:DialogInsets={},gutter=24):DialogFramePadding{
  if(!Number.isFinite(gutter)||gutter<0)throw new RangeError("Dialog gutter must be a finite number of at least 0");
  const side=(value:number|undefined)=>{
    if(value===undefined)return gutter;
    if(!Number.isFinite(value)||value<0)throw new RangeError("Dialog safe-area insets must be finite numbers of at least 0");
    return value+gutter;
  };
  return {paddingTop:side(insets.top),paddingBottom:side(insets.bottom),paddingLeft:side(insets.left),paddingRight:side(insets.right)};
}

/**
 * Modal animation. Reduced motion always gets "none". On web the dialog also
 * opens and closes without a fade, because react-native-web keeps a fading
 * modal's focus trap active until the fade ends, which blocks focus restore
 * (the same choice AnchoredPopover makes).
 */
export function dialogAnimation(platform:string,reduceMotion:boolean):"none"|"fade"{
  return reduceMotion||platform==="web"?"none":"fade";
}

export type AlertDialogTone="default"|"danger";

/**
 * Which footer control takes keyboard focus when an AlertDialog opens. A
 * destructive dialog starts on Cancel so Enter or Space never confirms by
 * accident (WAI-ARIA APG alertdialog pattern); a default one starts on the
 * confirm action.
 */
export function alertInitialFocus(tone:AlertDialogTone):"cancel"|"confirm"{
  return tone==="danger"?"cancel":"confirm";
}

/**
 * Elements the browser puts in the Tab order. React Native Web renders a
 * Pressable as tabindex="0". Same selector as AnchoredPopover.
 */
export const TABBABLE_SELECTOR='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),'+
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Compose `DialogProperties` for the current dismiss rules. Compose reports
 * back and tap-outside through one `onDismissRequest`; back is allowed
 * whenever either is, so the native fork requests "back" for both.
 */
export function composeDialogProperties(options:DismissOptions):{dismissOnBackPress:boolean;dismissOnClickOutside:boolean}{
  return {dismissOnBackPress:canDismiss("back",options),dismissOnClickOutside:canDismiss("backdrop",options)};
}

export type AlertDialogAction="confirm"|"cancel";

/**
 * What an AlertDialog does for a press of Confirm or Cancel, or a dismissal
 * (Escape, back, a tap outside), which counts as Cancel. While busy nothing
 * happens. Confirm calls `onConfirm` and closes only when `closeOnConfirm`;
 * Cancel calls `onCancel` and always closes.
 */
export function alertAction(action:AlertDialogAction,{busy=false,closeOnConfirm=true}:{busy?:boolean;closeOnConfirm?:boolean}={}):
  {call:AlertDialogAction|null;close:boolean}{
  if(busy)return {call:null,close:false};
  if(action==="confirm")return {call:"confirm",close:closeOnConfirm};
  return {call:"cancel",close:true};
}

/**
 * Whether the system alert (SwiftUI `Alert`, Compose `AlertDialog`) can show
 * this AlertDialog. Custom `children` need the kit dialog. SwiftUI closes an
 * alert as soon as any button is pressed, so on iOS a dialog that stays open
 * after Confirm (`closeOnConfirm` false, to show busy) also uses the kit.
 */
export function prefersSystemAlert(platform:string,{hasChildren,closeOnConfirm=true}:{hasChildren:boolean;closeOnConfirm?:boolean}):boolean{
  if(hasChildren)return false;
  if(platform==="android")return true;
  if(platform==="ios")return closeOnConfirm;
  return false;
}
