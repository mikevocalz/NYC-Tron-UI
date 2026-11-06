import {useLayoutEffect,useRef,useId,type ReactNode,type ComponentRef} from 'react';
import {createStore,type StoreApi} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {Modal,ScrollView,Text,View,Pressable,useWindowDimensions,Platform,I18nManager} from 'react-native';
import {placePopover,type Rect2D} from '../overlays/popover-position.ts';
import {useRestoreFocus} from '../overlays/focus-restore.ts';
import {nodeIsRTL,rovingTarget,shellKey} from '../shell/shell-keys.ts';
import {Button} from '../Button.tsx';
import {TextField} from '../TextField.tsx';
import {joinClasses} from '../styles.ts';
import type {FilePickerProps} from './FilePicker.types.ts';
import {applyFormat,buildExportRequest,destinationLabel,exportSummary,filenameProblem,statusText,validateExportFormats,type ExportDestination,type ExportFormat,type ExportRequest,type ExportSettings,type ImportFormat,type TransferStatus} from './file-transfer-model.ts';

/** Host-owned form/status and actual platform picker for {@linkcode FileImportExportSheetBody}. */
export interface FileImportExportSheetProps {
 readonly scope?:string;readonly usableRegions?:readonly Rect2D[];
 readonly visible:boolean;readonly mode:'import'|'export';readonly title?:string;
 readonly formats:readonly ExportFormat[];readonly importFormats?:readonly ImportFormat[];
 readonly destinations:readonly ExportDestination[];readonly settings:ExportSettings;
 readonly onSettingsChange:(settings:ExportSettings)=>void;readonly onExport:(request:ExportRequest)=>void|Promise<unknown>;
 readonly status:TransferStatus;readonly onClose:()=>void;readonly onCancel?:()=>void;
 readonly picker?:Omit<FilePickerProps,'label'|'accept'|'disabled'>;className?:string;unstyled?:boolean;
}
/** Shared controlled sheet. Platform wrappers supply a real file-picker control. */
export function FileImportExportSheetBody({importControl,importUnavailableReason,...props}:FileImportExportSheetProps&{readonly importControl?:ReactNode;readonly importUnavailableReason?:string}){
 const {scope="file-transfer",usableRegions,visible,mode,title,formats,destinations,settings,onSettingsChange,onExport,status,onClose,onCancel,className,unstyled=false}=props;
 if(formats.length)validateExportFormats(formats);
 const local=useRef<StoreApi<{pending:boolean;error:string|undefined}>|null>(null);
 local.current??=createStore<{pending:boolean;error:string|undefined}>(()=>({pending:false,error:undefined}));
 const store=local.current,localState=useStore(store,s=>s),flight=useRef<object|null>(null),nameId=useId();
 const boundary=JSON.stringify([scope,mode,visible]);
 const committed=useRef<{boundary:string;props:typeof props}|null>(null);
 useLayoutEffect(()=>{committed.current={boundary,props};});
 useLayoutEffect(()=>{flight.current=null;store.setState({pending:false,error:undefined});},[boundary,store]);
 useLayoutEffect(()=>()=>{committed.current=null;flight.current=null;},[]);
 const current=()=>visible&&committed.current?.boundary===boundary?committed.current.props:null;
 const window=useWindowDimensions(),regions=usableRegions??[{x:0,y:0,width:window.width,height:window.height}];
 const region=regions.some(r=>r.width>0&&r.height>0)?placePopover({x:window.width/2,y:window.height/2,width:0,height:0},regions,540,560,16).region:undefined;
 useRestoreFocus(visible&&!!region);
 const format=formats.find(f=>f.id===settings.formatId),working=status.kind==='working'||localState.pending;
 const close=()=>{const p=current();if(p&&p.status.kind!=="working"&&!flight.current)p.onClose();};
 const cancel=()=>{const p=current();if(p?.onCancel&&(p.status.kind==='working'||flight.current))p.onCancel();};
 const exportFile=()=>{
  const p=current();if(!p||p.mode!=="export"||p.status.kind==='working'||p.status.kind==='done'||flight.current)return;
  const token={};flight.current=token;store.setState({pending:true,error:undefined});
  void Promise.resolve().then(()=>{if(current()&&flight.current===token)return p.onExport(buildExportRequest(p.settings,p.formats,p.destinations));}).catch(error=>{if(current()&&flight.current===token)store.setState({error:error instanceof Error?error.message:String(error)});}).finally(()=>{if(flight.current===token){flight.current=null;store.setState({pending:false});}});
 };
 let problem:string|undefined;
 try{if(mode==='export')buildExportRequest(settings,formats,destinations);}catch(e){problem=e instanceof Error?e.message:String(e);}
 const change=(next:ExportSettings|((value:ExportSettings)=>ExportSettings))=>{const p=current();if(p&&p.status.kind!=="working"&&!flight.current){store.setState({error:undefined});p.onSettingsChange(typeof next==="function"?next(p.settings):next);}};
 const field=(id:string,label:string,value:string,onChangeText:(s:string)=>void)=><TextField key={id} id={`${nameId}-${id}`} label={label} value={value} editable={!working} onChangeText={onChangeText}/>;
 return <Modal visible={visible&&!!region} transparent onRequestClose={close} animationType="none">
  <View style={{flex:1}} {...{className:!unstyled?'bg-text/50':undefined}}>
   <View style={{position:'absolute',left:region?.x??0,top:region?.y??0,width:region?.width??0,height:region?.height??0,justifyContent:'center',alignItems:'center',padding:16}}>
   <View accessibilityViewIsModal {...{role:'dialog','aria-modal':true,'aria-label':title??(mode==='export'?'Export file':'Import file'),className:joinClasses(!unstyled&&'bg-surface-raised border border-border rounded-card p-4 gap-3',className)}} style={{width:'100%',maxWidth:540,maxHeight:'90%'}}>
    <Text accessibilityRole="header" {...{className:!unstyled?'text-text text-lg font-semibold':undefined}}>{title??(mode==='export'?'Export file':'Import file')}</Text>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{gap:12}}>
    {mode==='export'?<>
     <ChoiceGroup label="Export format" value={settings.formatId} options={formats.map(f=>({id:f.id,label:f.label,disabled:working}))} onSelect={id=>{const format=formats.find(f=>f.id===id);if(format)change(current=>applyFormat(current,format));}} unstyled={unstyled}/>
     {format?<>
      {field('export-filename','File name',settings.filename,filename=>change(current=>({...current,filename})))}
      {filenameProblem(settings.filename,format.extension)?<Text {...{className:!unstyled?'text-danger':undefined}}>{filenameProblem(settings.filename,format.extension)}</Text>:null}
      {format.quality?field('export-quality',format.quality.label??'Quality',String(settings.quality??format.quality.default),q=>{const quality=Number(q);if(Number.isFinite(quality))change(current=>({...current,quality}));}):null}
      {format.metadata?.map(m=>m.kind==='text'?field('metadata-'+m.id,m.label,String(settings.metadata[m.id]??''),v=>change(current=>({...current,metadata:{...current.metadata,[m.id]:v}}))):<Choice key={m.id} kind="checkbox" label={m.label} selected={settings.metadata[m.id]===true} disabled={working} onPress={()=>change(current=>({...current,metadata:{...current.metadata,[m.id]:current.metadata[m.id]!==true}}))} unstyled={unstyled}/>)}
      <ChoiceGroup label="Export destination" axis="vertical" value={settings.destination} options={destinations.map(d=>({id:d.id,label:destinationLabel(d.id),disabled:working||!d.available,...(!d.available?{reason:d.reason}:{})}))} onSelect={destination=>change(current=>({...current,destination:destination as ExportSettings["destination"]}))} unstyled={unstyled}/>
      <Text {...{className:!unstyled?'text-text-muted':undefined}}>{exportSummary(settings,format)}</Text>
     </>:<Text>No export formats are available.</Text>}
     {problem?<Text {...{className:!unstyled?'text-text-muted':undefined}}>{problem}</Text>:null}
    </>:<>{importControl}{importUnavailableReason?<Text {...{className:!unstyled?'text-text-muted':undefined}}>{importUnavailableReason}</Text>:null}</>}
    {localState.error?<Text accessibilityRole="alert" {...{className:!unstyled?"text-danger":undefined}}>{localState.error}</Text>:null}
    <Text accessibilityLiveRegion="polite" {...{className:!unstyled?(status.kind==='error'?'text-danger':'text-text-muted'):undefined}}>{statusText(status,mode,settings.filename)}</Text>
    </ScrollView>
    <View style={{flexDirection:'row',justifyContent:'flex-end',gap:8,flexWrap:'wrap'}}>
     {working&&onCancel?<Button title="Cancel transfer" onPress={cancel} variant="secondary"/>:null}
     <Button title="Close" variant="secondary" onPress={close} disabled={working}/>
     {mode==='export'?<Button title="Export" disabled={working||!!problem||status.kind==='done'} onPress={exportFile}/>:null}
    </View>
   </View>
   </View>
  </View>
 </Modal>;
}
function ChoiceGroup({label,value,options,onSelect,unstyled,axis="horizontal"}:{label:string;value:string;options:readonly {id:string;label:string;disabled:boolean;reason?:string}[];onSelect:(id:string)=>void;unstyled:boolean;axis?:"horizontal"|"vertical"}){
 const refs=useRef<(ComponentRef<typeof Pressable>|null)[]>([]);
 const selected=options.findIndex(o=>o.id===value&&!o.disabled),stop=selected>=0?selected:options.findIndex(o=>!o.disabled);
 return <View role="radiogroup" accessibilityLabel={label} aria-orientation={axis} style={{flexDirection:axis==="horizontal"?"row":"column",flexWrap:"wrap",gap:4}}>{options.map((option,index)=><View key={option.id}>
 <Choice buttonRef={node=>{refs.current[index]=node;}} label={option.label} selected={option.id===value} disabled={option.disabled} unstyled={unstyled} onPress={()=>onSelect(option.id)} tabIndex={index===stop?0:-1} onKeyDown={event=>{if(option.disabled)return;const k=shellKey(event);if(k.altKey||k.ctrlKey||k.metaKey)return;const next=rovingTarget(index,k.key,options.map(o=>o.disabled),axis,nodeIsRTL(k.target)||I18nManager.isRTL);if(next===null)return;k.preventDefault();(refs.current[next] as unknown as {focus?:()=>void}|null)?.focus?.();onSelect(options[next]!.id);}}/>
 {option.reason?<Text {...{className:!unstyled?"text-text-muted":undefined}}>{option.reason}</Text>:null}</View>)}</View>;
}
function Choice({label,selected,disabled,onPress,unstyled,kind="radio",buttonRef,tabIndex,onKeyDown}:{label:string;selected:boolean;disabled:boolean;onPress:()=>void;unstyled:boolean;kind?:"radio"|"checkbox";buttonRef?:(node:ComponentRef<typeof Pressable>|null)=>void;tabIndex?:0|-1;onKeyDown?:(event:unknown)=>void}){return <Pressable ref={buttonRef} role={kind} aria-checked={selected} accessibilityState={{checked:selected,disabled}} accessibilityLabel={label} disabled={disabled} onPress={onPress} {...(Platform.OS==="web"?{tabIndex,onKeyDown:(event:unknown)=>{if(disabled)return;const k=shellKey(event);if(k.key===" "||k.key==="Enter"){k.preventDefault();onPress();return;}onKeyDown?.(event);}}:{})} style={{minHeight:44,minWidth:44,justifyContent:"center",paddingHorizontal:12,opacity:disabled?0.5:1}} {...{className:!unstyled?joinClasses("rounded-control focus-visible:ring-2 focus-visible:ring-focus",selected?"bg-primary":"bg-surface-sunken"):undefined}}><Text {...{className:!unstyled?(selected?"text-on-primary":"text-text"):undefined}}>{label}</Text></Pressable>;}
