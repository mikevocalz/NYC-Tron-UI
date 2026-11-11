import { MediaDecodeError } from "./decoder.ts";

/** Bound the complete-file path before allocating a browser codec input. */
export async function fetchMediaBytes(uri: string, signal: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(uri, { signal });
  if (response.status === 401 || response.status === 403) throw new MediaDecodeError("permission", `The server refused media access (${response.status}).`);
  if (!response.ok) throw new MediaDecodeError("not-found", `Media could not be loaded (${response.status}).`);
  const limit = 64 * 1024 * 1024;
  if (Number(response.headers.get("content-length")) > limit) {
    await response.body?.cancel().catch(() => undefined);
    throw new MediaDecodeError("out-of-range", "The web source exceeds 64 MiB.");
  }
  if (!response.body) throw new MediaDecodeError("decode-failed", "The media response has no body.");
  const reader = response.body.getReader(), parts: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      total += part.value.byteLength;
      if (total > limit) throw new MediaDecodeError("out-of-range", "The web source exceeds 64 MiB.");
      parts.push(part.value);
    }
  } finally { await reader.cancel().catch(() => undefined); reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.byteLength; }
  return bytes;
}
