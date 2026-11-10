import { showContextMenu as showSparkContextMenu, getContextMenuAvailability, type ContextMenuOptions, type ContextMenuResult } from '@legendapp/spark/context-menu';
import { requireAppKit } from './native-availability.ts';

export type { ContextMenuOptions, ContextMenuResult, MenuItem, MenuAction } from '@legendapp/spark/context-menu';

/** Native NSMenu tracking in owner-content logical coordinates; no document mutation. */
export function showContextMenu(options: ContextMenuOptions): Promise<ContextMenuResult> {
  requireAppKit('Context menu', getContextMenuAvailability());
  return showSparkContextMenu(options);
}
