import type { FilePickerProps } from "./FilePicker.types.ts";

export type { FilePickerProps } from "./FilePicker.types.ts";

/**
 * Renders nothing on iOS and Android, on purpose.
 *
 * DEFER (2026-11-05): the contract hands the app `File` objects, which React
 * Native does not have; a native picker returns cache URIs. The kit has no
 * document-picker peer today, and a button that opened nothing would be a dead
 * control. Native apps take files through DropZone (system drag and drop) or
 * their own picker until a URI-based native adapter lands as its own subpath.
 */
export function FilePicker(_props:FilePickerProps):null {
  return null;
}
