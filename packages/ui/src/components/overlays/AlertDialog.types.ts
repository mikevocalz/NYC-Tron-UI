/*
 * Behaviour adapted from NYC-MON packages/ui/ConfirmDestructive.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): prop surface shared by the web and
 * native AlertDialog.
 */
import type {ComponentRef,ReactNode,Ref} from "react";
import type {View} from "react-native";
import type {AlertDialogTone,DialogSize} from "./dialog-model.ts";
export type {AlertDialogTone,DialogSize} from "./dialog-model.ts";

/**
 * Props for `AlertDialog`, shared by both forks. Web (`AlertDialog.web.tsx`,
 * also the fallback on other React Native hosts) builds on the kit `Dialog`
 * with NYC-Tron `Button`s. iOS shows a SwiftUI `Alert` and Android a Compose
 * `AlertDialog` (`AlertDialog.native.tsx`) when the content fits a system
 * alert; see `prefersSystemAlert` in dialog-model.ts. Props marked "kit" only
 * apply where the kit dialog draws.
 *
 * Copy: make the title the question and name the action ("Delete 3 files?",
 * not "Are you sure?"), say what happens in `description` ("This can't be
 * undone."), and label Confirm with the verb ("Delete files", not "OK").
 */
export interface AlertDialogProps {
  /** Kit: the panel (the element with role="alertdialog"). */
  ref?:Ref<ComponentRef<typeof View>>;
  open:boolean;
  /** Called with `false` after Cancel, a dismissal, or Confirm when `closeOnConfirm`. The app owns `open`. */
  onOpenChange:(open:boolean)=>void;
  /** The question, as the dialog's heading and accessible name. */
  title:string;
  /** What happens if the person confirms. */
  description?:string;
  /** Kit only: extra content, such as a list of affected items. Passing it uses the kit dialog on iOS and Android. */
  children?:ReactNode;
  /** The confirm button's label: the action as a verb ("Delete files"). Required, so it is never "OK". */
  confirmLabel:string;
  /** @default "Cancel" */
  cancelLabel?:string;
  onConfirm:()=>void;
  /** Called for Cancel and for every allowed dismissal (Escape, back, tap outside). */
  onCancel?:()=>void;
  /** "danger" draws a danger confirm button (SwiftUI destructive role, Material error color) and starts focus on Cancel. @default "default" */
  tone?:AlertDialogTone;
  /** Work is running: Confirm shows loading, Cancel is disabled and nothing closes the dialog. iOS shows the kit dialog while busy. @default false */
  busy?:boolean;
  /**
   * Close after Confirm. Set false to keep the dialog open while `busy`, then
   * close it yourself. iOS then uses the kit dialog, because a SwiftUI alert
   * closes on every button press. @default true
   */
  closeOnConfirm?:boolean;
  /** Escape and the Android back button cancel. @default true */
  dismissible?:boolean;
  /** A tap outside cancels. Off by default so a stray tap never answers the question. @default false */
  closeOnBackdrop?:boolean;
  /** Kit: panel max width. @default "sm" */
  size?:DialogSize;
  testID?:string;
  /** Kit: the full-screen frame. */
  className?:string;
  /** Kit: the backdrop. */
  overlayClassName?:string;
  /** Kit: the panel. */
  contentClassName?:string;
  /** Kit: the title. */
  titleClassName?:string;
  /** Kit: the description. */
  descriptionClassName?:string;
  /** Kit: the actions row. */
  footerClassName?:string;
  /** Kit: no default visual classes on the panel and buttons. */
  unstyled?:boolean;
  /** iOS and Android: appearance of the native presentation. Omit to follow the system. */
  colorScheme?:"light"|"dark";
}
