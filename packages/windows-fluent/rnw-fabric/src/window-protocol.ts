import type { Rect } from "@nyc-tron/core/folds";
import { MAX_WINDOWS, parseLayoutSnapshot, type LayoutSnapshot } from "@nyc-tron/core/window-lifecycle";
import type { WindowsDesktopLayout, WindowsDesktopSnapshot, WindowsTitleBar, WindowsTitleBarStyle } from "./window-types.ts";

export function validWindowId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 256;
}
export function validDpi(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 1920;
}
export function validWindowRect(value: unknown): value is Rect {
  if (typeof value !== "object" || value === null) return false;
  const r = value as Rect;
  return [r.x, r.y, r.width, r.height].every(v => typeof v === "number" && Number.isFinite(v) && Math.abs(v) <= 10_000_000)
    && r.width > 0 && r.height > 0;
}
export function pixelRect(rect: Rect, referenceDpi: number): Rect {
  if (!validWindowRect(rect) || !validDpi(referenceDpi)) throw new TypeError("Invalid desktop rectangle or DPI");
  const scale = referenceDpi / 96;
  const result = { x: Math.round(rect.x * scale), y: Math.round(rect.y * scale),
    width: Math.round(rect.width * scale), height: Math.round(rect.height * scale) };
  if (!validWindowRect(result)) throw new RangeError("Desktop rectangle has no positive pixel area");
  return result;
}
export function logicalRect(rect: Rect, referenceDpi: number): Rect {
  if (!validWindowRect(rect) || !validDpi(referenceDpi)) throw new TypeError("Invalid desktop rectangle or DPI");
  const scale = referenceDpi / 96;
  return { x: rect.x / scale, y: rect.y / scale, width: rect.width / scale, height: rect.height / scale };
}
export function validTitleBarStyle(value: unknown): value is WindowsTitleBarStyle {
  return value === "standard" || value === "extended";
}
const validInset = (value: unknown) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 10_000;
/** A standard title bar belongs to the system frame, so it reserves nothing inside the content. */
export function validTitleBar(value: unknown): value is WindowsTitleBar {
  if (typeof value !== "object" || value === null) return false;
  const bar = value as WindowsTitleBar;
  if (!validTitleBarStyle(bar.style) || ![bar.leading, bar.trailing, bar.height].every(validInset)) return false;
  return bar.style === "extended" || (bar.leading === 0 && bar.trailing === 0 && bar.height === 0);
}
function samePixels(a: Rect, b: Rect): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}

/** Validates the actual native protocol, including the reversible shared coordinate mapping. */
export function parseDesktopSnapshot(json: string): WindowsDesktopSnapshot {
  if (typeof json !== "string" || json.length > 1_048_576) throw new TypeError("Native desktop report exceeds its budget");
  const s = JSON.parse(json) as WindowsDesktopSnapshot;
  if (s?.schema !== 1 || !validWindowId(s.ownerToken) || !validDpi(s.referenceDpi) ||
    !Number.isSafeInteger(s.sequence) || s.sequence < 0 || !Array.isArray(s.windows) || s.windows.length > MAX_WINDOWS ||
    !Array.isArray(s.displays) || !s.displays.length || s.displays.length > 64 || !Array.isArray(s.pendingCloses) ||
    s.pendingCloses.length > MAX_WINDOWS) throw new TypeError("Malformed native desktop report");
  const displays = new Set<string>(), windows = new Map<string, string>();
  let primary = 0;
  for (const d of s.displays) {
    if (!validWindowId(d.id) || displays.has(d.id) || !validWindowRect(d.bounds) ||
      !validWindowRect(d.pixelBounds) || !validWindowRect(d.pixelWorkArea) ||
      !samePixels(pixelRect(d.bounds, s.referenceDpi), d.pixelWorkArea)) throw new TypeError("Invalid native display geometry");
    displays.add(d.id);
  }
  for (const w of s.windows) {
    if (!validWindowId(w.id) || windows.has(w.id) || !validWindowId(w.generation) || !displays.has(w.displayId) ||
      !validWindowRect(w.rect) || !validWindowRect(w.pixelRect) || !validDpi(w.dpi) ||
      !samePixels(pixelRect(w.rect, s.referenceDpi), w.pixelRect) ||
      (w.status !== "open" && w.status !== "minimized") || typeof w.primary !== "boolean" || !validTitleBar(w.titleBar))
      throw new TypeError("Invalid native window observation");
    windows.set(w.id, w.generation);
    if (w.primary) primary++;
  }
  if (primary !== 1 || (s.focusedId !== null && !s.windows.some(w => w.id === s.focusedId && w.status === "open")))
    throw new TypeError("Invalid primary or focused native window");
  const pending = new Set<string>();
  for (const request of s.pendingCloses) {
    if (windows.get(request.id) !== request.generation || !validWindowId(request.token) || pending.has(request.id))
      throw new TypeError("Invalid native close ownership");
    pending.add(request.id);
  }
  // Public snapshots cannot mutate the connection token, close leases, or future geometry.
  const freeze = (value: object): void => {
    for (const item of Object.values(value)) if (typeof item === "object" && item !== null) freeze(item);
    Object.freeze(value);
  };
  freeze(s);
  return s;
}

export function convertDesktopLayout(value: WindowsDesktopLayout, nextDpi: number): LayoutSnapshot {
  if (value?.schema !== 1 || !validDpi(value.referenceDpi) || !validDpi(nextDpi))
    throw new TypeError("A desktop layout requires its observed reference DPI");
  const layout = parseLayoutSnapshot(value.layout);
  if (!layout) throw new TypeError("Invalid core window layout snapshot");
  const convert = (rect: Rect) => logicalRect(pixelRect(rect, value.referenceDpi), nextDpi);
  return { ...layout, windows: layout.windows.map(w => ({ ...w, rect: convert(w.rect),
    ...(w.home ? { home: { ...w.home, rect: convert(w.home.rect) } } : {}) })) };
}
