import { SidebarSplitView, getSplitViewAvailability, type SidebarSplitViewProps } from '@legendapp/spark/ui/split-view';
import { requireAppKit } from './native-availability.ts';
export type SplitViewProps = SidebarSplitViewProps;
export type { SidebarSplitViewResizeEvent as SplitViewResizeEvent } from '@legendapp/spark/ui/split-view';

/** One AppKit split owner with stable named sidebar/list/content children. */
export function SplitView(props: SplitViewProps) {
  requireAppKit('SplitView', getSplitViewAvailability());
  return <SidebarSplitView {...props} />;
}
