import { DragDropView as SparkDragDropView, getDragDropAvailability, type DragDropViewProps } from '@legendapp/spark/drag-drop';
import { requireAppKit } from './native-availability.ts';

export type { DragDropViewProps, DragPayload, DragOperation, DropEvent, DragEndEvent } from '@legendapp/spark/drag-drop';
/** Real NSDraggingSource/NSDraggingDestination. Native acceptance is only an offer. */
export function DragDropView(props: DragDropViewProps) {
  requireAppKit('DragDropView', getDragDropAvailability());
  return <SparkDragDropView {...props} />;
}
