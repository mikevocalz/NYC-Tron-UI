export interface AssetEntry {
  readonly id: string;
  readonly name: string;
  readonly kind: "file" | "folder";
  readonly mediaType?: string;
  readonly byteLength?: number;
  readonly modifiedMs?: number;
  readonly thumbnailUri?: string;
}
export type AssetSort = "name" | "modified" | "size";
export interface AssetLocation { readonly id: string; readonly label: string }
export interface AssetRequest { readonly locationId: string; readonly expectedRevision: string; readonly entry: AssetEntry }
export function filterAssets(entries: readonly AssetEntry[], query: string, sort: AssetSort): readonly AssetEntry[] {
  if (!["name", "modified", "size"].includes(sort)) throw new TypeError("Unknown asset sort");
  if (entries.length > 20_000) throw new RangeError("Page asset collections larger than 20000 entries");
  if (query.length > 256) throw new RangeError("Asset search is limited to 256 characters");
  const ids = new Set<string>();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id) || !entry.name.length) throw new TypeError("Assets need distinct IDs and nonempty names");
    if (entry.byteLength !== undefined && (!Number.isSafeInteger(entry.byteLength) || entry.byteLength < 0)) throw new RangeError("Asset size must be nonnegative integer bytes");
    if (entry.modifiedMs !== undefined && !Number.isFinite(entry.modifiedMs)) throw new RangeError("Asset modification time must be finite");
    ids.add(entry.id);
  }
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  return entries.filter(entry => words.every(word => `${entry.name} ${entry.mediaType ?? ""}`.toLocaleLowerCase().includes(word))).sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    const value = sort === "modified" ? (b.modifiedMs ?? -Infinity) - (a.modifiedMs ?? -Infinity)
      : sort === "size" ? (b.byteLength ?? -1) - (a.byteLength ?? -1) : 0;
    return (Number.isNaN(value) ? 0 : value) || collator.compare(a.name, b.name) || a.id.localeCompare(b.id);
  });
}
export function selectAsset(visible: readonly AssetEntry[], selected: readonly string[], id: string,
  mode: "replace" | "toggle" | "range", anchor: string | null): readonly string[] {
  const index = visible.findIndex(entry => entry.id === id);
  if (index < 0) return selected;
  if (mode === "replace") return [id];
  if (mode === "toggle") return selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id];
  const at = visible.findIndex(entry => entry.id === anchor);
  if (at < 0) return [id];
  return visible.slice(Math.min(at, index), Math.max(at, index) + 1).map(entry => entry.id);
}
export function formatAssetBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KiB", "MiB", "GiB", "TiB", "PiB"];
  let value = bytes / 1024, index = 0;
  while (value >= 1024 && index < units.length - 1) { value /= 1024; index++; }
  return `${Number(value.toFixed(1))} ${units[index]}`;
}

/** Preserve valid whitespace-only filenames while making them visible. */
export const assetDisplayName = (name: string): string => name.trim() ? name : JSON.stringify(name);
