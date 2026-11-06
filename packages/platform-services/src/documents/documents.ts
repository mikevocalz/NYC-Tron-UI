/**
 * How a pick hands the file over. `import` gives the app its own copy (in
 * the cache on Android, the sandbox on iOS). `open-in-place` gives the
 * original with read access kept open and a `bookmark` to reopen it later.
 */
export type PickMode="import"|"open-in-place";

/** Options for {@linkcode Documents.pick}. */
export interface PickDocumentsOptions {
  /** MIME types ("image/png"), extensions (".nfd") or iOS UTType ids. Empty or unknown means any file. */
  types?:readonly string[];
  /** @default false */
  multiple?:boolean;
  /** @default "import" */
  mode?:PickMode;
}

/** A document returned by {@linkcode Documents.pick}. */
export interface PickedDocument {
  /** `file://` for imports; the provider's URI (`content://`, iCloud file URL) for open-in-place. */
  readonly uri:string;
  readonly name:string;
  /** Bytes, when the provider reports it. */
  readonly size?:number;
  readonly mimeType?:string;
  /** Store this to reopen an open-in-place document in a later launch with {@linkcode Documents.restoreAccess}. */
  readonly bookmark?:string;
}

/** A bookmark reopened by {@linkcode Documents.restoreAccess}. */
export interface RestoredAccess {
  readonly uri:string;
  /** Save this in place of the old bookmark when {@linkcode RestoredAccess.stale} is true. */
  readonly bookmark:string;
  /** The file moved or was renamed (iOS). The URI works now; the old bookmark may not next time. */
  readonly stale:boolean;
}

/** What {@linkcode Documents.share} hands the share sheet. */
export interface ShareOptions {
  /** `file://` URIs inside the app's cache or documents, or provider URIs from a pick. */
  uris?:readonly string[];
  text?:string;
  /** Sheet title, where the platform shows one. */
  title?:string;
}

/** The native half; payloads are validated before they reach the app. */
export interface DocumentsNative {
  pick(options:{types:string[];multiple:boolean;mode:PickMode}):Promise<unknown>;
  restoreAccess(bookmark:string):Promise<unknown>|unknown;
  releaseAccess(uri:string):Promise<void>|void;
  share(options:{uris:string[];text?:string;title?:string}):Promise<boolean>|boolean;
}

/**
 * Native file picking, open-in-place access and sharing (N-12). On iOS and
 * Android this is the OS document picker and share sheet; see
 * `createPlatformDocuments` for web.
 */
export interface Documents {
  /** False when no native picker is linked; `pick` then resolves []. */
  readonly isAvailable:boolean;
  /** The picked documents, or [] when the person cancels. */
  pick(options?:PickDocumentsOptions):Promise<PickedDocument[]>;
  /** Reopens an open-in-place document, or undefined when access is gone (file deleted, grant revoked). */
  restoreAccess(bookmark:string):Promise<RestoredAccess|undefined>;
  /** Closes an open-in-place document's access when the app is done with it. */
  releaseAccess(uri:string):Promise<void>;
  /**
   * Opens the share sheet. iOS resolves true when the person completed a
   * share; Android cannot tell and resolves true once the sheet opens.
   * Resolves false with nothing to share.
   */
  share(options:ShareOptions):Promise<boolean>;
}

const optionalNumber=(v:unknown)=>typeof v==="number"&&Number.isFinite(v)?v:undefined;
const optionalString=(v:unknown)=>typeof v==="string"&&v?v:undefined;

/** Reads one native record; undefined when it lacks a URI or a name. */
export function toPickedDocument(payload:unknown):PickedDocument|undefined{
  if(!payload||typeof payload!=="object")return undefined;
  const p=payload as Record<string,unknown>;
  if(typeof p.uri!=="string"||!p.uri||typeof p.name!=="string")return undefined;
  const size=optionalNumber(p.size),mimeType=optionalString(p.mimeType),bookmark=optionalString(p.bookmark);
  return {uri:p.uri,name:p.name,...(size!==undefined?{size}:{}),...(mimeType?{mimeType}:{}),...(bookmark?{bookmark}:{})};
}

/**
 * Builds {@linkcode Documents} over `native` (null when no picker is linked).
 * @throws RangeError for an unknown {@linkcode PickMode}
 */
export function createDocuments(native:DocumentsNative|null):Documents{
  return {
    isAvailable:native!==null,
    async pick({types=[],multiple=false,mode="import"}={}){
      if(mode!=="import"&&mode!=="open-in-place")throw new RangeError(`Unknown pick mode "${String(mode)}"`);
      if(!native)return [];
      const raw=await native.pick({types:[...types],multiple,mode});
      return Array.isArray(raw)?raw.flatMap(r=>{const d=toPickedDocument(r);return d?[d]:[];}):[];
    },
    async restoreAccess(bookmark){
      if(!native||!bookmark)return undefined;
      const raw=await native.restoreAccess(bookmark) as Record<string,unknown>|null|undefined;
      if(!raw||typeof raw.uri!=="string"||typeof raw.bookmark!=="string")return undefined;
      return {uri:raw.uri,bookmark:raw.bookmark,stale:raw.stale===true};
    },
    async releaseAccess(uri){
      if(native)await native.releaseAccess(uri);
    },
    async share({uris=[],text,title}){
      if(!native||(!uris.length&&!text))return false;
      return await native.share({uris:[...uris],...(text!==undefined?{text}:{}),...(title!==undefined?{title}:{})});
    },
  };
}
