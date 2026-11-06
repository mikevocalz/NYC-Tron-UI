import {FilePicker} from './FilePicker.web.tsx';
import {FileImportExportSheetBody,type FileImportExportSheetProps} from './FileImportExportSheet.shared.tsx';
import {importAccept} from './file-transfer-model.ts';
export type {FileImportExportSheetProps} from './FileImportExportSheet.shared.tsx';
/** Controlled file transfer form with the existing web picker transport. */
export function FileImportExportSheet(props:FileImportExportSheetProps){
 const ready=!!props.picker?.onFiles;
 return <FileImportExportSheetBody {...props} {...(ready?{importControl:<FilePicker key={props.scope??"file-transfer"} {...props.picker} label="Choose file to import" accept={importAccept(props.importFormats??[])} disabled={props.status.kind==='working'}/>}:{importUnavailableReason:'Import needs a document picker and a host import handler.'})}/>;
}
