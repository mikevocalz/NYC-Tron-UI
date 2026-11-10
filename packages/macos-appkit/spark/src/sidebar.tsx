import { Sidebar as SparkSidebar, SidebarItem as SparkSidebarItem, getSidebarAvailability, type SidebarProps, type SidebarItemProps } from '@legendapp/spark/ui/sidebar';
import { requireAppKit } from './native-availability.ts';
export type { SidebarProps, SidebarItemProps, SidebarItemData, SidebarSelectionEvent } from '@legendapp/spark/ui/sidebar';

/** Controlled native selection: the app/router alone decides selectedId. */
export function Sidebar(props: SidebarProps) {
  requireAppKit('Sidebar', getSidebarAvailability());
  return <SparkSidebar {...props} />;
}
export function SidebarItem(props: SidebarItemProps) {
  requireAppKit('SidebarItem', getSidebarAvailability());
  return <SparkSidebarItem {...props} />;
}
