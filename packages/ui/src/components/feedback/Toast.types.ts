import type { ComponentRef, ReactNode, Ref } from "react";
import type { View, ViewProps } from "react-native";
import type { ToastAction, ToastLive, ToastOptions, ToastStore, ToastTone } from "./toast-model.ts";
export type { ToastAction, ToastItem, ToastLive, ToastOptions, ToastSnapshot, ToastStore, ToastStoreOptions, ToastTone } from "./toast-model.ts";

/**
 * Props for the presentational `Toast` card, the same in every fork (the
 * card is RN + theme tokens everywhere; on Android the queue shows Compose
 * snackbars instead of cards).
 */
export interface ToastProps extends Omit<ViewProps,"children"|"role"> {
  ref?:Ref<ComponentRef<typeof View>>;
  /** Border and drawn mark; the title carries the meaning in words. @default "info" */
  tone?:ToastTone;
  /** One sentence naming what happened. */
  title:string;
  description?:string;
  /** One action, drawn as a secondary button under the copy. */
  action?:ToastAction;
  /** Shows a 44pt close control. */
  onDismiss?:()=>void;
  /** Screen-reader name of the close control. @default `Dismiss ${title}` */
  dismissLabel?:string;
  /**
   * `status` (polite) or `alert` (assertive) live region on the card. `off`
   * when a parent region announces it, as `ToastViewport` does. @default "status"
   */
  live?:ToastLive|"off";
  /** Replaces the drawn status mark. */
  icon?:ReactNode;
  className?:string;
  titleClassName?:string;
  descriptionClassName?:string;
  actionClassName?:string;
  /** No default visual classes; the app supplies the full recipe. */
  unstyled?:boolean;
}

export type ToastPlacement="top"|"bottom";

/** Safe-area insets in points, e.g. from react-native-safe-area-context. Logical start/end. */
export interface ToastInsets {
  readonly top?:number;
  readonly bottom?:number;
  readonly start?:number;
  readonly end?:number;
}

/**
 * Props for `ToastViewport`, which shows the provider's queue. Kit viewport:
 * web and iOS. Compose `SnackbarHost`: Android (native fork).
 */
export interface ToastViewportProps extends Omit<ViewProps,"children"> {
  /** Screen edge the toasts sit on (both). @default "bottom" */
  placement?:ToastPlacement;
  /** Added to the 12pt edge padding and 16pt side padding (both). */
  insets?:ToastInsets;
  /** Name of the notification landmark on web. @default "Notifications" */
  label?:string;
  /** Kit viewport only. */
  className?:string;
  /** Kit viewport only: passed to each card. */
  toastClassName?:string;
  /** Kit viewport only. */
  unstyled?:boolean;
  /** Android only: appearance for the Compose snackbar host. Omit to follow the system. */
  colorScheme?:"light"|"dark";
}

export interface ToastProviderProps {
  children?:ReactNode;
  /** An app-owned store from `createToastStore`. When set, the three store options below are ignored. */
  store?:ToastStore;
  /** Read once, when the provider creates its store. @default 3 */
  maxVisible?:number;
  /** Read once. @default 50 */
  maxQueued?:number;
  /** Read once, in milliseconds. @default 5000 */
  defaultDuration?:number;
  /** Renders a `ToastViewport` after the children. Pass false to place one yourself. @default true */
  viewport?:boolean;
  placement?:ToastPlacement;
  insets?:ToastInsets;
  /** Other props for the built-in viewport. */
  viewportProps?:Omit<ToastViewportProps,"placement"|"insets">;
  /**
   * Holds every timer while a screen reader is running, so toasts stay until
   * dismissed (WCAG 2.2.1). @default true
   */
  persistForScreenReader?:boolean;
}

/** What `useToast()` returns. Both functions are stable for the provider's lifetime. */
export interface ToastApi {
  /** Shows or replaces (by `id`) a toast; returns its id. */
  show(options:ToastOptions):string;
  /** Hides one toast, or all of them without an id. Returns whether anything was removed. */
  dismiss(id?:string):boolean;
}
