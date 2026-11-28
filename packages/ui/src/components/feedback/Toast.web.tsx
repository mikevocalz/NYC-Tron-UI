import { KitToastViewport, ToastProviderBase } from "./Toast.shared.tsx";
import type { ToastProviderProps, ToastViewportProps } from "./Toast.types.ts";
export { Toast, useToast } from "./Toast.shared.tsx";
export { createToastStore } from "./toast-model.ts";
export type {
  ToastAction, ToastApi, ToastInsets, ToastItem, ToastLive, ToastOptions, ToastPlacement, ToastProps,
  ToastProviderProps, ToastSnapshot, ToastStore, ToastStoreOptions, ToastTone, ToastViewportProps,
} from "./Toast.types.ts";

/**
 * Shows the provider's queue as kit cards (web build). See
 * `ToastViewportProps` for placement, insets and the pause rules.
 */
export function ToastViewport(props:ToastViewportProps) {
  return <KitToastViewport {...props}/>;
}

/**
 * Owns a toast queue for its subtree and, by default, renders a
 * `ToastViewport` after the children. Read it with `useToast()`.
 */
export function ToastProvider(props:ToastProviderProps) {
  return <ToastProviderBase {...props} Viewport={ToastViewport}/>;
}
