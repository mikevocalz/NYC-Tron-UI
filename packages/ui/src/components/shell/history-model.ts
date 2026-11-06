export interface HistoryEntry {
  readonly id: string;
  readonly label: string;
  readonly detail?: string;
  readonly timestampMs?: number;
}
export interface HistoryJump {
  readonly documentId: string;
  readonly expectedRevision: string;
  /** Zero is the initial state; N is the state after entry N-1. */
  readonly cursor: number;
}
export function validateHistory(entries: readonly HistoryEntry[], cursor: number): void {
  if (!Number.isSafeInteger(cursor) || cursor < 0 || cursor > entries.length) throw new RangeError("History cursor is outside the document history");
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id) || !entry.label.trim()) throw new TypeError("History entries need distinct IDs and labels");
    if (entry.timestampMs !== undefined && !Number.isFinite(entry.timestampMs)) throw new RangeError("History timestamp must be finite");
    ids.add(entry.id);
  }
}
