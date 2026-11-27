// Behaviour adapted from NYC-MON packages/ui/Dialog.tsx (MIT).
import type {ComponentRef,ReactNode,Ref,RefObject} from "react";
import type {View} from "react-native";
import type {DialogDismissReason,DialogInsets,DialogSize} from "./dialog-model.ts";
export type {DialogDismissReason,DialogInsets,DialogSize} from "./dialog-model.ts";

/**
 * Props for `Dialog`, shared by both forks. Web (`Dialog.web.tsx`, also the
 * fallback on hosts without Expo UI) draws an RN `Modal` with the app's
 * tokens. iOS presents a SwiftUI sheet and Android a Compose
 * `BasicAlertDialog` (`Dialog.native.tsx`), both hosting the same RN panel.
 * Props marked "web" are ignored by the iOS and Android forks.
 */
export interface DialogProps {
  /** The panel (the element with role="dialog"). */
  ref?:Ref<ComponentRef<typeof View>>;
  open:boolean;
  /** Called with `false` when a close request is allowed. The app owns `open`. */
  onOpenChange:(open:boolean)=>void;
  /** Rendered as the dialog's heading and used as its accessible name. Say what the dialog is for. */
  title:string;
  /** One or two sentences under the title, read with it as the dialog's description. */
  description?:string;
  /** Body. Scrolls when the dialog is taller than the screen. */
  children?:ReactNode;
  /** Actions row (Buttons), aligned to the end edge and wrapping on narrow screens. */
  footer?:ReactNode;
  /** Escape, the Android back button and the backdrop close the dialog. @default true */
  dismissible?:boolean;
  /** The backdrop closes the dialog. Only applies while `dismissible`. @default dismissible */
  closeOnBackdrop?:boolean;
  /** Work is running: nothing closes the dialog and the panel reports busy. @default false */
  busy?:boolean;
  /** Panel max width: sm 400, md 560, lg 720 points. Full width below that. @default "md" */
  size?:DialogSize;
  /** Web: element that takes keyboard focus on open. Defaults to the first focusable control, then the panel. iOS and Android move focus into the dialog themselves. */
  initialFocusRef?:RefObject<{focus?:()=>void}|null>;
  /** Called with the reason before `onOpenChange(false)` for every allowed close request. */
  onDismiss?:(reason:DialogDismissReason)=>void;
  /**
   * Web and kit fallback: safe-area insets from the app's safe-area provider.
   * NYC-Tron adds no dependency for them; without insets the frame keeps a
   * 24pt gutter, which can sit under a notch on a dialog tall enough to reach
   * the top. iOS sheets and Compose dialogs keep clear of system bars themselves.
   */
  safeAreaInsets?:DialogInsets;
  /** Web: overrides the system reduce-motion setting. iOS and Android follow the system setting. */
  reduceMotion?:boolean;
  /** Web: screen-reader name of the backdrop when it closes the dialog. @default "Close dialog" */
  backdropLabel?:string;
  /** Web: "alertdialog" for a dialog that interrupts with a decision. Used by AlertDialog. @default "dialog" */
  role?:"dialog"|"alertdialog";
  testID?:string;
  /** Web: the full-screen frame that centres the panel. */
  className?:string;
  /** Web: the backdrop. Default recipe `bg-surface-sunken`, drawn at 80% opacity. iOS and Android draw their own scrim. */
  overlayClassName?:string;
  /** The panel. */
  contentClassName?:string;
  titleClassName?:string;
  descriptionClassName?:string;
  /** The scrolling body around `children`. */
  bodyClassName?:string;
  footerClassName?:string;
  /** No default visual classes on the RN panel; the app supplies the full recipe. Layout, sizing and a11y stay. */
  unstyled?:boolean;
  /** iOS and Android: appearance of the native presentation. Omit to follow the system. */
  colorScheme?:"light"|"dark";
}

