import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

/** Same shape as expo-drag-drop-content-view's DropAsset, so one handler serves both platforms. */
export interface DropAsset {
  /** Native: the app cache file URI. Web: a blob URL unless `disableObjectUrl`. */
  uri?:string;
  type:string;
  /** Data URL, only with `includeBase64`. */
  base64?:string;
  /** Native only: the original file path. */
  path?:string;
  /** Web only: the dropped or picked File. */
  file?:File;
  width?:number;
  height?:number;
  fileName?:string;
  /** Plain-text drops. */
  text?:string;
  /** Web only: revokes the blob URL. The app calls it when done with `uri`. */
  release?:()=>void;
}
export interface DropAssets {assets:DropAsset[]}

/** Props for DropZone. Drop-in for Nitro Forge's `StudioDropZoneProps`. */
export interface DropZoneProps extends Omit<ViewProps,"children"> {
  /** Replaces the default copy and browse control. */
  children?:ReactNode;
  /** One call per drop (or web pick), after `accept` and `allowedMimeTypes` filtering. */
  onDrop?:(event:DropAssets)=>void;
  /** A drag carrying content entered the zone. */
  onEnter?:()=>void;
  /** The drag left, was dropped or was cancelled. */
  onExit?:()=>void;
  /** HTML input syntax, e.g. ".docx,.nfd" or "image/*". Applied to drops and picks. */
  accept?:string;
  /** Exact strings or RegExps, as in expo-drag-drop-content-view. */
  allowedMimeTypes?:(string|RegExp)[];
  /** @default false */
  includeBase64?:boolean;
  /** Web only: skip creating blob URLs (the app reads `file` instead). @default false */
  disableObjectUrl?:boolean;
  disabled?:boolean;
  /** Default content headline. @default "Drop a file here" */
  title?:string;
  description?:string;
  /**
   * Web only: label of the file picker shown with the default content, the
   * path for people who cannot drag (WCAG 2.5.7). @default "Choose a file"
   */
  browseLabel?:string;
  className?:string;
  unstyled?:boolean;
}
