/**
 * Media cache (N-14): a bounded least-recently-used store for host-supplied
 * derived bytes — waveform peaks, preview frames, thumbnails. The host
 * generates and keys every entry; this module owns capacity accounting,
 * eviction order and owned references. It never decodes media and keeps no
 * document state.
 */

export interface MediaCacheStats {
  readonly entries:number;
  readonly bytes:number;
}

export interface MediaCache<V> {
  /** Returns the value and marks it most-recently-used, or undefined on a miss. */
  get(key:string):V|undefined;
  /** Returns the value without changing eviction order. */
  peek(key:string):V|undefined;
  /** Inserts or replaces an entry, then evicts least-recently-used entries
   * until the byte and entry bounds hold. Throws RangeError when the value
   * alone exceeds `maxBytes`, TypeError for an unestimable value without an
   * `estimate` callback, and Error once the cache is closed. */
  set(key:string,value:V):void;
  has(key:string):boolean;
  /** Removes one entry; returns whether it existed. */
  delete(key:string):boolean;
  /** Drops every entry and reports each through `onEvict`. */
  clear():void;
  stats():MediaCacheStats;
  /** Drops all references and rejects later writes. Idempotent. */
  close():void;
}

export interface MediaCacheOptions<V> {
  /** Total estimated bytes the cache may hold. Must be a positive integer. */
  readonly maxBytes:number;
  /** Entry-count bound alongside the byte bound. @default 4096 */
  readonly maxEntries?:number;
  /** Estimated retained size of a value. Defaults to byteLength for
   * ArrayBuffer/ArrayBufferView values and `{ bytes }` wrappers. */
  estimate?:(key:string,value:V)=>number;
  /** Called once per evicted or cleared entry, never for `delete`/`set` replacement. */
  onEvict?:(key:string,value:V)=>void;
}

const MAX_ENTRIES_DEFAULT=4096;
const MAX_KEY_LENGTH=512;

function validateKey(key:string):void{
  if(typeof key!=="string"||key.length===0||key.length>MAX_KEY_LENGTH)
    throw new RangeError(`Cache keys must be 1..${MAX_KEY_LENGTH} characters`);
}

/** Byte size of values the cache can measure without a consumer callback. */
export function estimateMediaCacheValue(value:unknown):number{
  if(value instanceof ArrayBuffer)return value.byteLength;
  if(ArrayBuffer.isView(value))return value.byteLength;
  if(value!==null&&typeof value==="object"){
    const bytes=(value as{bytes?:unknown}).bytes;
    if(bytes instanceof ArrayBuffer)return bytes.byteLength;
    if(ArrayBuffer.isView(bytes))return bytes.byteLength;
  }
  throw new TypeError("Media cache values need a byteLength, an ArrayBuffer/ArrayBufferView, a { bytes } wrapper, or an estimate callback");
}

function validateBound(name:string,value:number):void{
  if(!Number.isSafeInteger(value)||value<1)throw new RangeError(`${name} must be a positive integer`);
}

/**
 * Creates an LRU cache. Map insertion order tracks recency: `get`/`set`
 * refresh an entry, eviction removes from the front. `close` releases every
 * retained reference so host buffers can be reclaimed.
 */
export function createMediaCache<V>(options:MediaCacheOptions<V>):MediaCache<V>{
  validateBound("maxBytes",options.maxBytes);
  const maxEntries=options.maxEntries??MAX_ENTRIES_DEFAULT;
  validateBound("maxEntries",maxEntries);
  const estimate=options.estimate??((_key:string,value:V)=>estimateMediaCacheValue(value));
  const entries=new Map<string,{value:V;bytes:number}>();
  let bytes=0,closed=false;

  function evictOldest():void{
    const oldest=entries.entries().next().value as [string,{value:V;bytes:number}]|undefined;
    if(!oldest)return;
    entries.delete(oldest[0]);
    bytes-=oldest[1].bytes;
    options.onEvict?.(oldest[0],oldest[1].value);
  }

  function touch(key:string):{value:V;bytes:number}|undefined{
    const entry=entries.get(key);
    if(entry){entries.delete(key);entries.set(key,entry);}
    return entry;
  }

  return{
    get(key){
      validateKey(key);
      if(closed)return undefined;
      return touch(key)?.value;
    },
    peek(key){
      validateKey(key);
      if(closed)return undefined;
      return entries.get(key)?.value;
    },
    set(key,value){
      validateKey(key);
      if(closed)throw new Error("Media cache is closed");
      const size=estimate(key,value);
      if(!Number.isSafeInteger(size)||size<0)throw new RangeError("estimate must return a non-negative safe integer");
      if(size>options.maxBytes)throw new RangeError(`Value of ${size} bytes exceeds maxBytes ${options.maxBytes}`);
      const previous=entries.get(key);
      if(previous){entries.delete(key);bytes-=previous.bytes;}
      while(entries.size>=maxEntries||bytes+size>options.maxBytes)evictOldest();
      entries.set(key,{value,bytes:size});
      bytes+=size;
    },
    has(key){
      validateKey(key);
      return !closed&&entries.has(key);
    },
    delete(key){
      validateKey(key);
      const entry=entries.get(key);
      if(!entry)return false;
      entries.delete(key);
      bytes-=entry.bytes;
      return true;
    },
    clear(){
      if(closed)return;
      for(const [key,entry] of entries)options.onEvict?.(key,entry.value);
      entries.clear();
      bytes=0;
    },
    stats(){return{entries:entries.size,bytes};},
    close(){
      if(closed)return;
      closed=true;
      for(const [key,entry] of entries)options.onEvict?.(key,entry.value);
      entries.clear();
      bytes=0;
    },
  };
}
