/** Generic bytes only: engine/document semantics belong to the consumer. */
export interface CheckpointStorage {
  read(key: string): Promise<Uint8Array | undefined>;
  write(key: string, bytes: Uint8Array): Promise<void>;
  remove(key: string): Promise<void>;
  close(): Promise<void>;
}

/** Stop accepting work and drain accepted operations before releasing a
 * backend connection. Failed operations remain failures for their callers. */
export function ownCheckpointStorage(backend: Omit<CheckpointStorage, "close">,
  release: () => void | Promise<void> = () => {}): CheckpointStorage {
  const pending = new Set<Promise<unknown>>();
  let closing: Promise<void> | undefined;
  function run<T>(work: () => Promise<T>): Promise<T> {
    if (closing) return Promise.reject(new Error("Checkpoint storage is closed"));
    let result: Promise<T>;
    try { result = work(); } catch (error) { result = Promise.reject(error); }
    pending.add(result);
    void result.then(() => pending.delete(result), () => pending.delete(result));
    return result;
  }
  return {
    read: key => run(() => backend.read(key)),
    write: (key, bytes) => run(() => backend.write(key, bytes)),
    remove: key => run(() => backend.remove(key)),
    close() {
      closing ??= Promise.allSettled([...pending]).then(() => release());
      return closing;
    },
  };
}

export const CHECKPOINT_MAX_BYTES = 256 * 1024 * 1024 + 5;
export const RECORD_HEADER_BYTES = 20;

export function validateStorageName(name: string): void {
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(name))
    throw new RangeError("Checkpoint names must be 1..80 ASCII letters, digits, underscores or hyphens");
}

const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  return value >>> 0;
});

async function checksum(bytes: Uint8Array): Promise<number> {
  let crc = 0xffffffff;
  for (let start = 0; start < bytes.length; start += 1024 * 1024) {
    const end = Math.min(bytes.length, start + 1024 * 1024);
    for (let i = start; i < end; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]!) & 255]!;
    // Large snapshots must give the host's event loop chances to handle input.
    if (end < bytes.length) await new Promise<void>(resolve => setTimeout(resolve, 0));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export async function encodeRecord(bytes: Uint8Array, generation: number): Promise<Uint8Array> {
  if (bytes.byteLength > CHECKPOINT_MAX_BYTES || !Number.isSafeInteger(generation) || generation < 1)
    throw new RangeError("Checkpoint size or generation exceeds bounds");
  const result = new Uint8Array(RECORD_HEADER_BYTES + bytes.byteLength);
  result.set([78, 84, 83, 49]); // NTS1: generation, length and CRC32, then owned bytes.
  const view = new DataView(result.buffer);
  view.setFloat64(4, generation, true);
  view.setUint32(12, bytes.byteLength, true);
  result.set(bytes, RECORD_HEADER_BYTES);
  view.setUint32(16, await checksum(result.subarray(RECORD_HEADER_BYTES)), true);
  return result;
}

export async function decodeRecord(bytes: Uint8Array): Promise<{ generation: number; bytes: Uint8Array } | undefined> {
  if (bytes.length < RECORD_HEADER_BYTES || bytes.length > CHECKPOINT_MAX_BYTES + RECORD_HEADER_BYTES ||
      String.fromCharCode(...bytes.subarray(0, 4)) !== "NTS1") return undefined;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const generation = view.getFloat64(4, true);
  if (!Number.isSafeInteger(generation) || generation < 1 ||
      view.getUint32(12, true) !== bytes.length - RECORD_HEADER_BYTES) return undefined;
  const payload = bytes.subarray(RECORD_HEADER_BYTES);
  if (view.getUint32(16, true) !== await checksum(payload)) return undefined;
  return { generation, bytes: payload.slice() };
}
