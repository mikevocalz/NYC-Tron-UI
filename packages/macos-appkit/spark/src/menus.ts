import { createMenu as createSparkMenu, getMenuAvailability, type MenuOptions, type Menu } from '@legendapp/spark/menus';
import { requireAppKit } from './native-availability.ts';

export type { Menu, MenuOptions, MenuUpdate, MenuItem, MenuRootItem, MenuAction, MenuRole, MenuTarget, MenuPlacement, MenuLocation, MenuIcon, MenuLifecycleEvent } from '@legendapp/spark/menus';

/** Real NSMenu/NSMenuItem registration. IDs and command effects belong to the app. */
export function createMenu(options: MenuOptions): Promise<Menu> {
  requireAppKit('Application menu', getMenuAvailability());
  return createSparkMenu(options);
}
