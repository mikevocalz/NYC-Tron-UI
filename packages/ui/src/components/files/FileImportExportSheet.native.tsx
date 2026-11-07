import {FilePicker} from './FilePicker.native.tsx';
import {FileImportExportSheetBody,type FileImportExportSheetProps} from './FileImportExportSheet.shared.tsx';
import {importAccept} from './file-transfer-model.ts';
export type {FileImportExportSheetProps} from './FileImportExportSheet.shared.tsx';
/** Controlled file transfer form with the existing native picker transport. */
export function FileImportExportSheet(props:FileImportExportSheetProps){
 const ready=!!props.picker?.documentSource && !!props.picker?.onDocuments;
 return <FileImportExportSheetBody {...props} {...(ready?{importControl:<FilePicker key={props.scope??"file-transfer"} {...props.picker} label="Choose file to import" accept={importAccept(props.importFormats??[])} disabled={props.status.kind==='working'}/>}:{importUnavailableReason:'Import needs a document picker and a host import handler.'})}/>;
}
