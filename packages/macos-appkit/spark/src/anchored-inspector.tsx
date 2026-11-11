import { Popover, type PopoverProps } from './popover.tsx';

export type AnchoredInspectorProps = PopoverProps;

/** Native NSPopover presentation of the app's existing inspector content/state. */
export function AnchoredInspector(props: AnchoredInspectorProps) {
  return <Popover {...props} />;
}
