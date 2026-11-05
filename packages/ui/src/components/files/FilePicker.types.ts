/** A file a native picker returned: a URI, not a `File`. */
export interface NativeDocument {
  readonly uri:string;
  readonly name:string;
  readonly size?:number;
  readonly mimeType?:string;
  /** Reopens an open-in-place pick in a later launch. */
  readonly bookmark?:string;
}

/** Opens the OS document picker. `accept` uses the same syntax as the web prop. */
export interface NativeDocumentSource {
  pick(options:{accept?:string;multiple?:boolean}):Promise<readonly NativeDocument[]>;
}

/** Props for FilePicker. Drop-in for the `FilePicker` Nitro Forge's studio preview imports. */
export interface FilePickerProps {
  /** Visible text and accessible name, e.g. "Open". */
  label:string;
  /** HTML input syntax, e.g. ".docx,.nfd". */
  accept?:string;
  multiple?:boolean;
  disabled?:boolean;
  /** Web: called once per pick with at least one file; cancelling calls nothing. Without it web renders nothing. */
  onFiles?:(files:File[])=>void;
  /**
   * iOS and Android: the OS document picker, e.g.
   * `documentPickerSource(createPlatformDocuments())` from
   * `@nyc-tron/platform-services/documents`. Native renders the button only
   * when this and `onDocuments` are both set. Web ignores it.
   */
  documentSource?:NativeDocumentSource;
  /** iOS and Android: called once per pick with at least one document; cancelling calls nothing. */
  onDocuments?:(documents:readonly NativeDocument[])=>void;
  /** iOS and Android: the picker failed (not a cancel). Without it the error is rethrown. */
  onError?:(error:Error)=>void;
  accessibilityHint?:string;
  testID?:string;
  className?:string;
  labelClassName?:string;
  unstyled?:boolean;
}

export const filePickerRecipe={
  root:"min-h-11 flex-row items-center justify-center gap-2 rounded-control border border-border bg-surface-raised px-4 "+
    "hover:bg-surface-sunken active:opacity-80 focus-visible:ring-2 focus-visible:ring-focus",
  label:"text-sm font-semibold text-text",
} as const;
