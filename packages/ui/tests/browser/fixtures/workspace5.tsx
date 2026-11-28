// Workspace host, presets, contextual toolbar and file transfer. The color
// dialog and presenter ink of this page moved with the editor controls to
// Nitro Forge's packages/editor-controls/tests/browser lane.
import {useEffect} from 'react';
import {AppRegistry,Text,View,ScrollView} from 'react-native';
import {create} from 'zustand';
import {Button} from '../../../src/components/Button.tsx';
import {WorkspaceHost} from '../../../src/components/shell/WorkspaceHost.tsx';
import {WorkspacePresetSwitcher} from '../../../src/components/shell/WorkspacePresetSwitcher.tsx';
import {ContextualToolbar} from '../../../src/components/shell/ContextualToolbar.tsx';
import {FileImportExportSheet} from '../../../src/components/files/FileImportExportSheet.web.tsx';
import type {DockLayout} from '../../../src/components/shell/dock-model.ts';
import {defaultExportSettings,type ExportSettings,type TransferStatus} from '../../../src/components/files/file-transfer-model.ts';
const modes=[{id:'edit',label:'Edit',panels:['layers'],defaultLayout:{left:{panels:['layers'],active:'layers',size:180},floating:[]}},{id:'color',label:'Color',panels:['layers'],defaultLayout:{right:{panels:['layers'],active:'layers',size:180},floating:[]}}] as const;
const formats=[{id:'nfd',label:'Forge document',extension:'nfd',mimeType:'application/vnd.nitro-forge.document'}];const destinations=[{id:'download',available:true},{id:'share',available:false,reason:'Sharing needs the native host'}] as const;
type State={mode:string;layouts:Record<string,DockLayout>;presets:{id:string;name:string;builtIn:boolean}[];active:string|undefined;sheet:'import'|'export'|undefined;settings:ExportSettings;status:TransferStatus;log:string[];mounts:number;selection:string};
const useDoc=create<State>(()=>({mode:'edit',layouts:{},presets:[{id:'edit',name:'Edit',builtIn:true},{id:'color',name:'Color',builtIn:true}],active:'edit',sheet:undefined,settings:defaultExportSettings(formats,destinations,'Harbor'),status:{kind:'idle'},log:[],mounts:0,selection:'shape'}));
const log=(v:string)=>useDoc.setState(s=>({log:[...s.log,v]}));
function Canvas(){useEffect(()=>{useDoc.setState(s=>({mounts:s.mounts+1}));},[]);return <Text testID="canvas-mounts">Canvas mounts {useDoc(s=>s.mounts)}</Text>;}
function App(){const s=useDoc(),rtl=document.documentElement.dir==='rtl';return <ScrollView contentContainerStyle={{padding:12,gap:16}} style={{flex:1}}>
 <View style={{height:480}} testID="workspace"><WorkspaceHost document={{id:'doc',title:'Harbor',dirty:true}} modes={modes} activeModeId={s.mode} onModeChange={mode=>{useDoc.setState({mode,active:undefined});log('mode '+mode);}} panels={[{id:'layers',title:'Layers',content:<Text>Shared layers panel</Text>}]} layouts={s.layouts} onLayoutChange={(mode,layout)=>useDoc.setState(x=>({layouts:{...x.layouts,[mode]:layout}}))} canvas={<Canvas/>} isRTL={rtl}/></View>
 <WorkspacePresetSwitcher presets={s.presets} {...(s.active?{activeId:s.active}:{})} onSelect={id=>{useDoc.setState({active:id});log('preset '+id);}} onSaveAs={name=>{useDoc.setState(x=>({presets:[...x.presets,{id:'custom',name,builtIn:false}],active:'custom'}));log('save '+name);}} onRename={(id,name)=>useDoc.setState(x=>({presets:x.presets.map(p=>p.id===id?{...p,name}:p)}))} onDuplicate={id=>log('duplicate '+id)} onDelete={id=>{useDoc.setState(x=>({presets:x.presets.filter(p=>p.id!==id),active:undefined}));log('delete '+id);}} onReset={id=>log('reset '+id)}/>
 <View style={{maxWidth:260}}><ContextualToolbar label="Selection actions" selectionKind={s.selection} isRTL={rtl} items={[{id:'align',label:'Align',priority:10},{id:'crop',label:'Crop',appliesTo:['shape']},{id:'bold',label:'Bold',appliesTo:['text'],pressed:true},{id:'rotate',label:'Rotate'},{id:'duplicate',label:'Duplicate'},{id:'lock',label:'Lock',disabledReason:'Selection is already locked'}]} onAction={id=>log('action '+id)}/></View>
 <Button title="Select text" onPress={()=>useDoc.setState({selection:'text'})}/>
 <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Button title="Export file" onPress={()=>useDoc.setState({sheet:'export',status:{kind:'idle'}})}/><Button title="Import file" onPress={()=>useDoc.setState({sheet:'import',status:{kind:'idle'}})}/></View>
 <Text testID="log">{s.log.join('\n')}</Text>
 <FileImportExportSheet visible={!!s.sheet} mode={s.sheet??'export'} formats={formats} importFormats={[{id:'nfd',label:'Forge document',extensions:['nfd']}]} destinations={destinations} settings={s.settings} onSettingsChange={settings=>useDoc.setState({settings})} status={s.status} onExport={request=>{log('export '+request.filename);useDoc.setState({status:{kind:'done'}});}} onClose={()=>useDoc.setState({sheet:undefined})} picker={{onFiles:files=>{log('import '+files[0]?.name);useDoc.setState({status:{kind:'done'}});}}}/>
 </ScrollView>;}
const q=new URLSearchParams(location.search);document.documentElement.dataset.theme=q.get('theme')??'light';document.documentElement.dir=q.get('dir')??'ltr';document.body.style.margin='0';AppRegistry.registerComponent('workspace5',()=>App);AppRegistry.runApplication('workspace5',{rootTag:document.getElementById('root')});
