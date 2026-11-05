/** Presentation-only commit arbitration; the consuming app owns persistence. */
export interface CellEditSnapshot {
  draft: string;
  dirty: boolean;
  pending: boolean;
  editVersion: number;
}

export async function commitCellEdit(
  address: string,
  commit: ((address: string, raw: string) => unknown | Promise<unknown>) | undefined,
  read: () => CellEditSnapshot,
  write: (patch: Partial<CellEditSnapshot> & { error?: string | null }) => void,
): Promise<void> {
  const edit = read();
  // Read the store synchronously: submit and blur can arrive before React renders.
  if (!address || !commit || edit.pending || !edit.dirty) return;
  write({ pending: true, error: null });
  try {
    await commit(address, edit.draft);
    if (read().editVersion === edit.editVersion) write({ dirty: false });
  } catch (error) {
    // A completion from a previous sheet/selection must not overwrite a new edit.
    if (read().editVersion === edit.editVersion) {
      write({ error: error instanceof Error ? error.message : "Could not update cell" });
    }
  } finally {
    write({ pending: false });
  }
}
