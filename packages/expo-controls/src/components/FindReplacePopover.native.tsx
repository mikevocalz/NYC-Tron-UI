import { FindReplaceContent } from "@nyc-tron/ui/components/shell/FindReplaceContent";
import type { FindReplacePopoverProps } from "@nyc-tron/ui/components/shell/FindReplacePopover";
import { NativePopover } from "./NativePopover.native.tsx";
export type { FindReplacePopoverProps } from "@nyc-tron/ui/components/shell/FindReplacePopover";

/** Reuses the search owner and presents its content in SwiftUI/Compose's anchored surface. */
export function FindReplacePopover(props: FindReplacePopoverProps) {
  const { document, onFind, onReplace, onNavigate, initialQuery, unstyled, ...popover } = props;
  return <NativePopover {...popover} accessibilityLabel="Find and replace">
    <FindReplaceContent active={props.open} document={document} onFind={onFind} onReplace={onReplace} onNavigate={onNavigate}
      {...(initialQuery !== undefined ? { initialQuery } : {})} {...(unstyled !== undefined ? { unstyled } : {})} onClose={() => props.onOpenChange(false)}/>
  </NativePopover>;
}
