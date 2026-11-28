/*
 * Behaviour adapted from NYC-MON packages/ui/BottomSheet.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): Tron token classes instead of the
 * NYC-MON night facade, controlled `open` / `onOpenChange`, app-set snap
 * points and `dismissible`.
 */
import type {ComponentRef,ReactNode,Ref} from "react";
import type {View} from "react-native";
import type {SheetSnapPoint} from "./sheet-model.ts";
export type {SheetSnapPoint} from "./sheet-model.ts";

/** Props for `Sheet`, one implementation on every platform. */
export interface SheetProps {
  /** The content root inside the sheet. */
  ref?:Ref<ComponentRef<typeof View>>;
  open:boolean;
  /** Called with `false` for the close button and every allowed system close. The app owns `open`. */
  onOpenChange:(open:boolean)=>void;
  /** The sheet's heading and its accessible name. Required. */
  title:string;
  children?:ReactNode;
  /**
   * Heights the sheet can rest at, dragged between with the grabber. Omit to
   * size the sheet to its content. See {@linkcode SheetSnapPoint}.
   */
  snapPoints?:readonly SheetSnapPoint[];
  /**
   * Swipe-down, the backdrop, Escape and the Android back button close the
   * sheet. When `false` only the close button does, and the grabber is
   * hidden. @default true
   */
  dismissible?:boolean;
  /** Accessible name of the close button, in the app's language. Required. */
  closeLabel:string;
  /** Glyph for the close button. Defaults to a drawn cross in `text` color. */
  closeIcon?:ReactNode;
  /** Expo UI: color scheme of the native sheet. Omit to follow the system. */
  colorScheme?:"light"|"dark";
  testID?:string;
  /** The content root (inside the platform sheet chrome). */
  className?:string;
  headerClassName?:string;
  titleClassName?:string;
  closeClassName?:string;
  /** The scrolling body around `children`. */
  bodyClassName?:string;
  /** No default visual classes on the content; layout, 44pt targets and a11y stay. */
  unstyled?:boolean;
}
