import type { CommandMenuItem } from "@nyc-tron/core/overlays";
import type { WindowsInspectorField } from "./overlay-types.ts";

const nonempty = (v: unknown, limit: number) => typeof v === "string" && v.trim().length > 0 && v.length <= limit;
export function validateOverlayItems(items: readonly CommandMenuItem[]): void {
  if (!Array.isArray(items) || items.length > 128) throw new RangeError("A native menu is limited to 128 commands");
  const seen = new Set<string>();
  for (const item of items) {
    if (!nonempty(item.id, 256) || seen.has(item.id) || !nonempty(item.label, 1024) ||
      (item.description !== undefined && (typeof item.description !== "string" || item.description.length > 4096)) ||
      (item.disabled !== undefined && typeof item.disabled !== "boolean") ||
      (item.danger !== undefined && typeof item.danger !== "boolean")) throw new TypeError("Native menu commands need unique IDs, labels and valid state");
    seen.add(item.id);
  }
}
export function validateInspectorFields(fields: readonly WindowsInspectorField[]): void {
  if (!Array.isArray(fields) || fields.length > 32) throw new RangeError("A native inspector is limited to 32 fields");
  const seen = new Set<string>();
  for (const field of fields) {
    if (!nonempty(field.id, 256) || seen.has(field.id) || !nonempty(field.label, 1024) || typeof field.value !== "string" || field.value.length > 4096 ||
      (field.acknowledgedEventCount !== undefined && (!Number.isInteger(field.acknowledgedEventCount) || field.acknowledgedEventCount < 0 || field.acknowledgedEventCount > 2147483647)) ||
      (field.readOnly !== undefined && typeof field.readOnly !== "boolean")) throw new TypeError("Native inspector fields need unique IDs, labels and bounded values");
    seen.add(field.id);
  }
}
