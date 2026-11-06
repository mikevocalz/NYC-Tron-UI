import type {ReactNode} from 'react';
import {Modal,ScrollView,Text,View,Pressable} from 'react-native';
import {Button} from '../Button.tsx';
import {TextField} from '../TextField.tsx';
import {joinClasses} from '../styles.ts';
import type {FilePickerProps} from './FilePicker.types.ts';
import {applyFormat,buildExportRequest,destinationLabel,exportSummary,filenameProblem,statusText,validateExportFormats,type ExportDestination,type ExportFormat,type ExportRequest,type ExportSettings,type ImportFormat,type TransferStatus} from './file-transfer-model.ts';

/** Host-owned form/status and actual platform picker for {@linkcode FileImportExportSheetBody}. */
export interface FileImportExportSheetProps {
 readonly visible:boolean;readonly mode:'import'|'export';readonly title?:string;
 readonly formats:readonly ExportFormat[];readonly importFormats?:readonly ImportFormat[];
 readonly destinations:readonly ExportDestination[];readonly settings:ExportSettings;
 readonly onSettingsChange:(settings:ExportSettings)=>void;readonly onExport:(request:ExportRequest)=>void|Promise<unknown>;
 readonly status:TransferStatus;readonly onClose:()=>void;readonly onCancel?:()=>void;
 readonly picker?:Omit<FilePickerProps,'label'|'accept'|'disabled'>;className?:string;unstyled?:boolean;
}
/** Shared controlled sheet. Platform wrappers supply a real file-picker control. */
export function FileImportExportSheetBody({importControl,importUnavailableReason,...props}:FileImportExportSheetProps&{readonly importControl?:ReactNode;readonly importUnavailableReason?:string}){
 const {visible,mode,title,formats,destinations,settings,onSettingsChange,onExport,status,onClose,onCancel,className,unstyled=false}=props;
 if(formats.length)validateExportFormats(formats);
 const format=formats.find(f=>f.id===settings.formatId),working=status.kind==='working';
 let problem:string|undefined;
 try{if(mode==='export')buildExportRequest(settings,formats,destinations);}catch(e){problem=e instanceof Error?e.message:String(e);}
 const change=(next:ExportSettings)=>{if(!working)onSettingsChange(next);};
 const field=(id:string,label:string,value:string,onChangeText:(s:string)=>void)=><TextField key={id} id={id} label={label} value={value} editable={!working} onChangeText={onChangeText}/>;
 return <Modal visible={visible} transparent onRequestClose={()=>{if(!working)onClose();}} animationType="none">
  <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:16}} {...{className:!unstyled?'bg-text/50':undefined}}>
   <View accessibilityViewIsModal {...{role:'dialog','aria-modal':true,'aria-label':title??(mode==='export'?'Export file':'Import file'),className:joinClasses(!unstyled&&'bg-surface-raised border border-border rounded-card p-4 gap-3',className)}} style={{width:'100%',maxWidth:540,maxHeight:'90%'}}>
    <Text accessibilityRole="header" {...{className:!unstyled?'text-text text-lg font-semibold':undefined}}>{title??(mode==='export'?'Export file':'Import file')}</Text>
    <ScrollView contentContainerStyle={{gap:12}}>
    {mode==='export'?<>
     <View role="radiogroup" accessibilityLabel="Export format" style={{flexDirection:'row',flexWrap:'wrap',gap:4}}>{formats.map(f=><Choice key={f.id} label={f.label} selected={f.id===settings.formatId} disabled={working} onPress={()=>change(applyFormat(settings,f))} unstyled={unstyled}/>)}</View>
     {format?<>
      {field('export-filename','File name',settings.filename,filename=>change({...settings,filename}))}
      {filenameProblem(settings.filename,format.extension)?<Text {...{className:!unstyled?'text-danger':undefined}}>{filenameProblem(settings.filename,format.extension)}</Text>:null}
      {format.quality?field('export-quality',format.quality.label??'Quality',String(settings.quality??format.quality.default),q=>{const quality=Number(q);if(Number.isFinite(quality))change({...settings,quality});}):null}
      {format.metadata?.map(m=>m.kind==='text'?field('metadata-'+m.id,m.label,String(settings.metadata[m.id]??''),v=>change({...settings,metadata:{...settings.metadata,[m.id]:v}})):<Choice key={m.id} label={m.label} selected={settings.metadata[m.id]===true} disabled={working} onPress={()=>change({...settings,metadata:{...settings.metadata,[m.id]:settings.metadata[m.id]!==true}})} unstyled={unstyled}/>)}
      <View role="radiogroup" accessibilityLabel="Export destination" style={{gap:4}}>{destinations.map(d=><View key={d.id}><Choice label={destinationLabel(d.id)} selected={d.id===settings.destination} disabled={working||!d.available} onPress={()=>change({...settings,destination:d.id})} unstyled={unstyled}/>{!d.available?<Text {...{className:!unstyled?'text-text-muted':undefined}}>{d.reason}</Text>:null}</View>)}</View>
      <Text {...{className:!unstyled?'text-text-muted':undefined}}>{exportSummary(settings,format)}</Text>
     </>:<Text>No export formats are available.</Text>}
     {problem?<Text {...{className:!unstyled?'text-text-muted':undefined}}>{problem}</Text>:null}
    </>:<>{importControl}{importUnavailableReason?<Text {...{className:!unstyled?'text-text-muted':undefined}}>{importUnavailableReason}</Text>:null}</>}
    <Text accessibilityLiveRegion="polite" {...{className:!unstyled?(status.kind==='error'?'text-danger':'text-text-muted'):undefined}}>{statusText(status,mode,settings.filename)}</Text>
    </ScrollView>
    <View style={{flexDirection:'row',justifyContent:'flex-end',gap:8,flexWrap:'wrap'}}>
     {working&&onCancel?<Button title="Cancel transfer" onPress={onCancel} variant="secondary"/>:null}
     <Button title="Close" variant="secondary" onPress={onClose} disabled={working}/>
     {mode==='export'?<Button title="Export" disabled={working||!!problem||status.kind==='done'} onPress={()=>{if(!working&&!problem)void onExport(buildExportRequest(settings,formats,destinations));}}/>:null}
    </View>
   </View>
  </View>
 </Modal>;
}
function Choice({label,selected,disabled,onPress,unstyled}:{label:string;selected:boolean;disabled:boolean;onPress:()=>void;unstyled:boolean}){return <Pressable role="radio" aria-checked={selected} accessibilityState={{checked:selected,disabled}} accessibilityLabel={label} disabled={disabled} onPress={onPress} style={{minHeight:44,minWidth:44,justifyContent:'center',paddingHorizontal:12,opacity:disabled?0.5:1}} {...{className:!unstyled?joinClasses('rounded-control focus-visible:ring-2 focus-visible:ring-focus',selected?'bg-primary':'bg-surface-sunken'):undefined}}><Text {...{className:!unstyled?(selected?'text-on-primary':'text-text'):undefined}}>{label}</Text></Pressable>;}
