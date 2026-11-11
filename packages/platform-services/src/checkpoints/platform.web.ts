import { CHECKPOINT_MAX_BYTES, validateStorageName, ownCheckpointStorage, type CheckpointStorage } from "./record.ts";

/** Each replacement resolves on transaction completion, never request success.
 * Storage quota/permission failures reject and leave the old record intact. */
export function createPlatformCheckpointStorage(namespace = "default"): CheckpointStorage {
  validateStorageName(namespace);
  let opening: Promise<IDBDatabase> | undefined;
  function database(): Promise<IDBDatabase> {
    if (opening) return opening;
    opening = new Promise<IDBDatabase>((resolve, reject) => {
      if (!globalThis.indexedDB) { reject(new Error("IndexedDB is unavailable")); return; }
      const request = indexedDB.open(`NYCTronCheckpoints:${namespace}`, 1);
      let blocked = false;
      request.onupgradeneeded = () => { request.result.createObjectStore("checkpoints"); };
      request.onerror = () => reject(request.error ?? new Error("Checkpoint database failed to open"));
      request.onblocked = () => { blocked = true; reject(new Error("Checkpoint database upgrade is blocked")); };
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) { db.close(); return; }
        db.onversionchange = () => { db.close(); opening = undefined; };
        db.onclose = () => { opening = undefined; };
        resolve(db);
      };
    }).catch(error => { opening = undefined; throw error; });
    return opening;
  }
  async function transaction<T>(key: string, mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    validateStorageName(key);
    const db = await database();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("checkpoints", mode, { durability: "strict" });
      const request = run(tx.objectStore("checkpoints"));
      tx.oncomplete = () => resolve(request.result);
      tx.onabort = () => reject(tx.error ?? request.error ?? new Error("Checkpoint transaction aborted"));
      tx.onerror = () => { /* The abort handler observes the final transaction failure. */ };
    });
  }
  return ownCheckpointStorage({
    async read(key) {
      const value = await transaction<unknown>(key, "readonly", store => store.get(key));
      if (value === undefined) return undefined;
      if (!(value instanceof ArrayBuffer) || value.byteLength > CHECKPOINT_MAX_BYTES)
        throw new Error("Invalid checkpoint storage record");
      return new Uint8Array(value).slice();
    },
    async write(key, bytes) {
      if (bytes.byteLength > CHECKPOINT_MAX_BYTES) throw new RangeError("Checkpoint exceeds size limit");
      const owned = new Uint8Array(bytes).buffer;
      await transaction(key, "readwrite", store => store.put(owned, key));
    },
    async remove(key) { await transaction(key, "readwrite", store => store.delete(key)); },
  }, async () => {
    const db = await opening?.catch(() => undefined);
    db?.close(); opening = undefined;
  });
}
