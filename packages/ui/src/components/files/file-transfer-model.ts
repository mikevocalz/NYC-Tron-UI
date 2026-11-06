/**
 * Platform-free rules for {@linkcode FileImportExportSheet}: export formats,
 * quality ranges, metadata fields, destinations, file name checks, the
 * summary line, and matching an imported file to an import format.
 */

/** A quality or bitrate range an export format accepts. */
export interface QualityRange {
  readonly min:number;
  readonly max:number;
  readonly step:number;
  /** Value a fresh export starts at. */
  readonly default:number;
  /** Unit shown after the value, e.g. "%" or " kbps". */
  readonly unit:string;
  /** @default "Quality" */
  readonly label?:string;
}

/** A free-text metadata field, such as title or author. */
export interface TextMetadataField {
  readonly kind:"text";
  readonly id:string;
  readonly label:string;
  readonly default?:string;
  /** @default 200 */
  readonly maxLength?:number;
}
/** An on/off metadata choice, such as removing location data. */
export interface ToggleMetadataField {
  readonly kind:"toggle";
  readonly id:string;
  /** Says what "on" does, e.g. "Remove location data". */
  readonly label:string;
  readonly default?:boolean;
}
/** A metadata field an {@linkcode ExportFormat} can write. */
export type MetadataField=TextMetadataField|ToggleMetadataField;

/** A format the host can export to. Only the host knows which formats it can write. */
export interface ExportFormat {
  readonly id:string;
  /** Short name, e.g. "PNG". */
  readonly label:string;
  /** File extension without the dot, e.g. "png". */
  readonly extension:string;
  readonly mimeType:string;
  /** Present when the format has a quality or bitrate setting. */
  readonly quality?:QualityRange;
  /** Metadata this format can carry. Fields missing here are not offered. */
  readonly metadata?:readonly MetadataField[];
}

/** Where an export goes. `download` is the web browser's download. */
export type ExportDestinationId="share"|"files"|"download";
/**
 * A destination and whether this platform and session can use it. An
 * unavailable destination says why, and the sheet shows that reason.
 */
export type ExportDestination=
  | {readonly id:ExportDestinationId;readonly available:true}
  | {readonly id:ExportDestinationId;readonly available:false;readonly reason:string};

/** Metadata values by field id: text for text fields, booleans for toggles. */
export type MetadataValues=Readonly<Record<string,string|boolean>>;

/**
 * The export form's values. The host owns them (and may keep the last used
 * ones); the sheet proposes changes through `onSettingsChange`.
 */
export interface ExportSettings {
  readonly formatId:string;
  /** Only meaningful when the format has a {@linkcode QualityRange}. */
  readonly quality?:number;
  readonly metadata:MetadataValues;
  readonly destination:ExportDestinationId;
  /** Full file name including the extension. */
  readonly filename:string;
}

/**
 * What `onExport` receives: validated settings with the file name trimmed,
 * quality snapped into range (absent when the format has none), and only the
 * metadata the format declares.
 */
export interface ExportRequest {
  readonly formatId:string;
  readonly quality?:number;
  readonly metadata:MetadataValues;
  readonly destination:ExportDestinationId;
  readonly filename:string;
}

/** Progress of the host's import or export. */
export type TransferStatus=
  | {readonly kind:"idle"}
  /** `progress` 0 to 1; omit when the host cannot measure it. */
  | {readonly kind:"working";readonly progress?:number}
  | {readonly kind:"error";readonly message:string}
  /** `message` replaces the default "Exported <file>." line. */
  | {readonly kind:"done";readonly message?:string};

/** A format the host can import, matched by extension first, then MIME type. */
export interface ImportFormat {
  readonly id:string;
  readonly label:string;
  /** Extensions without the dot, e.g. `["jpg","jpeg"]`. */
  readonly extensions:readonly string[];
  readonly mimeTypes?:readonly string[];
}

const DESTINATION_LABEL:Record<ExportDestinationId,string>={share:"Share",files:"Save to Files",download:"Download"};
/** Button text for a destination. */
export function destinationLabel(id:ExportDestinationId):string{
  return DESTINATION_LABEL[id];
}

/** Throws on duplicate ids, blank labels, bad extensions, or an invalid quality range. */
export function validateExportFormats(formats:readonly ExportFormat[]):void{
  if(!formats.length)throw new TypeError("Export needs at least one format");
  const seen=new Set<string>();
  for(const f of formats){
    if(typeof f.id!=="string"||!f.id||seen.has(f.id))throw new TypeError("Duplicate or missing format id");
    if(!f.label?.trim())throw new TypeError(`Format ${f.id} needs a label`);
    if(!/^[a-z0-9]+$/i.test(f.extension))throw new TypeError(`Format ${f.id} needs an extension without a dot`);
    seen.add(f.id);
    const q=f.quality;
    if(q&&(![q.min,q.max,q.step,q.default].every(Number.isFinite)||q.min>=q.max||q.step<=0||q.default<q.min||q.default>q.max))
      throw new RangeError(`Format ${f.id} has an invalid quality range`);
    const fields=new Set<string>();
    for(const m of f.metadata??[]){
      if(!m.id||fields.has(m.id))throw new TypeError(`Format ${f.id} repeats metadata field ${m.id}`);
      fields.add(m.id);
    }
  }
}

/** Snaps a quality value to the range's step and bounds. */
export function snapQuality(value:number,range:QualityRange):number{
  if(!Number.isFinite(value))return range.default;
  const stepped=range.min+Math.round((value-range.min)/range.step)*range.step;
  const clamped=Math.min(range.max,Math.max(range.min,stepped));
  return Number(clamped.toFixed(6));
}

const extOf=(name:string)=>{const at=name.lastIndexOf(".");return at>0?name.slice(at+1):"";};
const baseOf=(name:string)=>{const at=name.lastIndexOf(".");return at>0?name.slice(0,at):name;};

/**
 * Settings after switching to `format`: the file name takes the new
 * extension, quality starts at the format's default unless the old value is
 * in range, and metadata keeps values for fields the new format also has.
 */
export function applyFormat(settings:ExportSettings,format:ExportFormat):ExportSettings{
  const trimmed=settings.filename.trim();
  const base=baseOf(trimmed)||trimmed;
  const metadata:Record<string,string|boolean>={};
  for(const field of format.metadata??[]){
    const kept=settings.metadata[field.id];
    if(field.kind==="text")metadata[field.id]=typeof kept==="string"?kept:field.default??"";
    else metadata[field.id]=typeof kept==="boolean"?kept:field.default??false;
  }
  const q=format.quality;
  const quality=q?(settings.quality!==undefined&&settings.quality>=q.min&&settings.quality<=q.max?snapQuality(settings.quality,q):q.default):undefined;
  return {
    formatId:format.id,metadata,destination:settings.destination,
    filename:base?`${base}.${format.extension}`:"",
    ...(quality!==undefined?{quality}:{}),
  };
}

/**
 * Fresh settings: the first format, the first available destination (or the
 * first one listed), and `<baseName>.<extension>`.
 */
export function defaultExportSettings(
  formats:readonly ExportFormat[],destinations:readonly ExportDestination[],baseName:string,
):ExportSettings{
  const format=formats[0];
  if(!format)throw new TypeError("Export needs at least one format");
  const destination=(destinations.find(d=>d.available)??destinations[0])?.id??"files";
  return applyFormat({formatId:format.id,metadata:{},destination,filename:baseName.trim()+".x"},format);
}

// Windows refuses these as base names on every drive.
const RESERVED=/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
// Control characters, then the characters Windows, macOS and Android reject in names.
const ILLEGAL=/[\u0000-\u001f\u007f/\\:*?"<>|]/;
/** Longest file name most file systems accept, in UTF-16 units. */
export const FILENAME_MAX=255;

/** Why a file name was refused, as a sentence, or undefined when it is usable. */
export function filenameProblem(name:string,extension:string):string|undefined{
  const trimmed=name.trim();
  const ext="."+extension.toLowerCase();
  if(!trimmed)return "Enter a file name.";
  if(ILLEGAL.test(trimmed))return "File names can’t contain / \\ : * ? \" < > | or control characters.";
  if(trimmed.length>FILENAME_MAX)return `Use ${FILENAME_MAX} characters or fewer.`;
  if(!trimmed.toLowerCase().endsWith(ext))return `End the name with ${ext}.`;
  const base=trimmed.slice(0,-ext.length);
  if(!base.trim()||base.startsWith("."))return `Enter a name before ${ext}.`;
  if(RESERVED.test(base.trim()))return `“${base.trim()}” is reserved on Windows. Choose another name.`;
  if(/[. ]$/.test(base))return "Remove the space or dot before the extension.";
  return undefined;
}

/**
 * Validated request for `onExport`. Throws when the format is unknown, the
 * destination is unavailable, or the file name has a {@linkcode filenameProblem}.
 */
export function buildExportRequest(
  settings:ExportSettings,formats:readonly ExportFormat[],destinations:readonly ExportDestination[],
):ExportRequest{
  const format=formats.find(f=>f.id===settings.formatId);
  if(!format)throw new TypeError(`Unknown export format ${settings.formatId}`);
  const destination=destinations.find(d=>d.id===settings.destination);
  if(!destination?.available)throw new TypeError(`Destination ${settings.destination} is not available`);
  const problem=filenameProblem(settings.filename,format.extension);
  if(problem)throw new TypeError(problem);
  const metadata:Record<string,string|boolean>={};
  for(const field of format.metadata??[]){
    const v=settings.metadata[field.id];
    if(field.kind==="text")metadata[field.id]=typeof v==="string"?v.trim().slice(0,field.maxLength??200):"";
    else metadata[field.id]=v===true;
  }
  return {
    formatId:format.id,metadata,destination:destination.id,filename:settings.filename.trim(),
    ...(format.quality?{quality:snapQuality(settings.quality??format.quality.default,format.quality)}:{}),
  };
}

const lowerFirst=(s:string)=>s.charAt(0).toLocaleLowerCase()+s.slice(1);
const listOf=(items:readonly string[],last="and")=>items.length<2?items.join(""):items.slice(0,-1).join(", ")+` ${last} `+items[items.length-1];

/**
 * One-line summary above the Export button, e.g. "PNG, quality 80%, title
 * and author added, remove location data. Saves “Poster.png” to Files."
 */
export function exportSummary(settings:ExportSettings,format:ExportFormat):string{
  const parts=[format.label];
  if(format.quality){
    const q=settings.quality??format.quality.default;
    parts.push(`${lowerFirst(format.quality.label??"Quality")} ${q}${format.quality.unit}`);
  }
  const fields=format.metadata??[];
  const filled=fields.filter(f=>f.kind==="text"&&typeof settings.metadata[f.id]==="string"&&(settings.metadata[f.id] as string).trim())
    .map(f=>lowerFirst(f.label));
  if(filled.length)parts.push(listOf(filled)+" added");
  for(const f of fields)if(f.kind==="toggle"&&settings.metadata[f.id]===true)parts.push(lowerFirst(f.label));
  const file=`“${settings.filename.trim()}”`;
  const where=settings.destination==="share"?`Shares ${file}.`
    :settings.destination==="files"?`Saves ${file} to Files.`:`Downloads ${file}.`;
  return parts.join(", ")+". "+where;
}

/** Status line text for a {@linkcode TransferStatus}. */
export function statusText(status:TransferStatus,mode:"import"|"export",filename?:string):string{
  const verb=mode==="export"?"Exporting":"Importing";
  switch(status.kind){
    case "idle":return "";
    case "working":{
      const p=status.progress;
      return p===undefined||!Number.isFinite(p)?`${verb}…`:`${verb}… ${Math.round(Math.min(1,Math.max(0,p))*100)}%`;
    }
    case "error":return status.message;
    case "done":return status.message??(mode==="export"
      ?(filename?`Exported “${filename.trim()}”.`:"Export finished.")
      :(filename?`Imported “${filename.trim()}”.`:"Import finished."));
  }
}

/** HTML input `accept` string for the import formats, e.g. ".png,.jpg,image/png". */
export function importAccept(formats:readonly ImportFormat[]):string{
  const entries=formats.flatMap(f=>[...f.extensions.map(e=>"."+e.toLowerCase()),...(f.mimeTypes??[])]);
  return [...new Set(entries)].join(",");
}

/** Import format for a file, by extension first, then MIME type, or undefined. */
export function matchImportFormat(name:string,mimeType:string|undefined,formats:readonly ImportFormat[]):string|undefined{
  const ext=extOf(name.trim()).toLowerCase();
  if(ext){
    const byExt=formats.find(f=>f.extensions.some(e=>e.toLowerCase()===ext));
    if(byExt)return byExt.id;
  }
  const type=(mimeType??"").toLowerCase();
  if(!type)return undefined;
  return formats.find(f=>f.mimeTypes?.some(m=>m.toLowerCase()===type))?.id;
}

/** Message for a file no import format accepts, naming the formats that work. */
export function unsupportedFileMessage(name:string,formats:readonly ImportFormat[]):string{
  return `“${name}” can’t be imported. Choose a ${listOf(formats.map(f=>f.label),"or")} file.`;
}
