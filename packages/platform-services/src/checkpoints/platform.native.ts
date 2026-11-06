import { Directory, File, Paths } from "expo-file-system";
import { CHECKPOINT_MAX_BYTES, RECORD_HEADER_BYTES, decodeRecord, encodeRecord,
  validateStorageName, ownCheckpointStorage, type CheckpointStorage } from "./record.ts";

const operations = new Map<string, Promise<unknown>>();
function serialized<T>(key: string, run: () => Promise<T>): Promise<T> {
  const result = (operations.get(key) ?? Promise.resolve()).then(run, run);
  const settled = result.catch(() => undefined);
  operations.set(key, settled);
  void settled.then(() => { if (operations.get(key) === settled) operations.delete(key); });
  return result;
}

/** Immutable generations in the app's documents directory. A failed write
 * never overwrites the prior generation; temporary files are never recovered.
 * This supports process interruption, not a claim of OS power-loss fsync. */
export function createPlatformCheckpointStorage(namespace = "default"): CheckpointStorage {
  validateStorageName(namespace);
  const root = new Directory(Paths.document, "NYCTronCheckpoints", namespace);
  function directory(key: string) {
    validateStorageName(key);
    const dir = new Directory(root, key);
    dir.create({ intermediates: true, idempotent: true });
    return dir;
  }
  function generations(dir: Directory) {
    return dir.list().filter((file): file is File => file instanceof File)
      .flatMap(file => {
        const match = /^(\d{16})\.bin$/.exec(file.name);
        const generation = match ? Number(match[1]) : 0;
        return Number.isSafeInteger(generation) && generation > 0 ? [{ file, generation }] : [];
      }).sort((a, b) => b.generation - a.generation);
  }
  async function latestValid(items: ReturnType<typeof generations>) {
    for (const { file, generation } of items) {
      if (file.size > CHECKPOINT_MAX_BYTES + RECORD_HEADER_BYTES) continue;
      const record = await decodeRecord(await file.bytes());
      if (record?.generation === generation) return { file, record };
    }
    return undefined;
  }
  return ownCheckpointStorage({
    read(key) {
      validateStorageName(key);
      return serialized(`${root.uri}/${key}`, async () => {
        const items = generations(directory(key));
        const valid = await latestValid(items);
        if (items.length && !valid) throw new Error("No intact checkpoint generation remains");
        return valid?.record.bytes;
      });
    },
    write(key, bytes) {
      validateStorageName(key);
      if (bytes.byteLength > CHECKPOINT_MAX_BYTES) return Promise.reject(new RangeError("Checkpoint exceeds size limit"));
      const owned = bytes.slice(); // Copy before waiting for another operation.
      return serialized(`${root.uri}/${key}`, async () => {
        const dir = directory(key);
        const previous = generations(dir);
        const lastGood = await latestValid(previous);
        const generation = (previous[0]?.generation ?? 0) + 1;
        const name = String(generation).padStart(16, "0");
        const staged = new File(dir, `${name}-${Math.random().toString(36).slice(2)}.tmp`);
        let committed = false;
        try {
          const record = await encodeRecord(owned, generation);
          staged.create();
          await staged.write(record);
          // Same-directory move to a new filename: no delete/overwrite gap.
          await staged.move(new File(dir, `${name}.bin`));
          committed = true;
        } finally {
          if (!committed && staged.exists) { try { staged.delete(); } catch { /* Preserve original I/O failure. */ } }
        }
        // Keep the last valid checkpoint as well as the new generation.
        // Retention failure cannot turn a committed save into a rejection.
        for (const { file } of previous) {
          if (file.uri === lastGood?.file.uri) continue;
          try { file.delete(); } catch { /* Retry retention on a later save. */ }
        }
      });
    },
    remove(key) {
      validateStorageName(key);
      return serialized(`${root.uri}/${key}`, async () => {
        const dir = new Directory(root, key);
        if (dir.exists) dir.delete();
      });
    },
  });
}
