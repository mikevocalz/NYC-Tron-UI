/** Props for FilePicker. Drop-in for the `FilePicker` Nitro Forge's studio preview imports. */
export interface FilePickerProps {
  /** Visible text and accessible name, e.g. "Open". */
  label:string;
  /** HTML input syntax, e.g. ".docx,.nfd". */
  accept?:string;
  multiple?:boolean;
  disabled?:boolean;
  /** Called once per pick with at least one file; cancelling calls nothing. */
  onFiles:(files:File[])=>void;
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
