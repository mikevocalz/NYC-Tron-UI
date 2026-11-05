import type {Documents,PickMode} from "./documents.ts";

/**
 * The shape `@nyc-tron/ui`'s native FilePicker takes as `documentSource`:
 * `accept` in HTML syntax (".docx,.nfd,image/png") in, documents out.
 */
export interface FilePickerDocumentSource {
  pick(options:{accept?:string;multiple?:boolean}):Promise<readonly {uri:string;name:string;size?:number;mimeType?:string;bookmark?:string}[]>;
}

/**
 * Adapts {@linkcode Documents} to FilePicker's `documentSource`, so the
 * kit's FilePicker opens the OS document picker on iOS and Android.
 */
export function documentPickerSource(documents:Documents,mode:PickMode="import"):FilePickerDocumentSource{
  return {
    pick:({accept,multiple=false})=>documents.pick({
      types:(accept??"").split(",").map(t=>t.trim()).filter(Boolean),multiple,mode,
    }),
  };
}
