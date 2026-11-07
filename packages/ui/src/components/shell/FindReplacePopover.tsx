import { AnchoredPopover, type PopoverAnchorProps, type PopoverTriggerProps } from "../overlays/AnchoredPopover.tsx";
import { FindReplaceContent, type FindReplaceContentProps } from "./FindReplaceContent.tsx";
export type { FindReplaceContentProps } from "./FindReplaceContent.tsx";
export type FindReplacePopoverProps = Omit<FindReplaceContentProps, "onClose" | "active"> & (
  Omit<PopoverAnchorProps, "children" | "accessibilityLabel"> | Omit<PopoverTriggerProps, "children" | "accessibilityLabel">
);

/** Portable anchored search. The Expo-controls entry supplies SwiftUI/Compose popover surfaces. */
export function FindReplacePopover(props: FindReplacePopoverProps) {
  const { document, onFind, onReplace, onNavigate, initialQuery, unstyled, ...popover } = props;
  return <AnchoredPopover {...popover} accessibilityLabel="Find and replace">
    <FindReplaceContent active={props.open} document={document} onFind={onFind} onReplace={onReplace} onNavigate={onNavigate}
      {...(initialQuery !== undefined ? { initialQuery } : {})} {...(unstyled !== undefined ? { unstyled } : {})} onClose={() => props.onOpenChange(false)}/>
  </AnchoredPopover>;
}
