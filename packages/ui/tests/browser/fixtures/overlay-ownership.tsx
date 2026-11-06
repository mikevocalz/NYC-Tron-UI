import {AppRegistry,Text,View} from 'react-native';
import {create} from 'zustand';
import {Button} from '../../../src/components/Button.tsx';
import {ContextMenu} from '../../../src/components/shell/ContextMenu.tsx';
import {CommandPalette} from '../../../src/components/overlays/CommandPalette.tsx';
import {PresetGallery} from '../../../src/components/shell/PresetGallery.tsx';
import {KeyboardShortcutHUD} from '../../../src/components/shell/KeyboardShortcutHUD.tsx';
import {StatusBar} from '../../../src/components/shell/StatusBar.tsx';
import type {ExportSettings,ExportFormat} from '../../../src/components/files/file-transfer-model.ts';
import {FileImportExportSheet} from '../../../src/components/files/FileImportExportSheet.web.tsx';
import {NativeActionMenu} from '../../../../expo-controls/src/components/NativeActionMenu.web.tsx';
import {NativePopover} from '../../../../expo-controls/src/components/NativePopover.web.tsx';
const formats:readonly ExportFormat[]=[{id:'png',label:'PNG',extension:'png',mimeType:'image/png',quality:{min:0,max:100,step:1,default:80,unit:'%'},metadata:[{kind:'toggle',id:'copyright',label:'Include copyright',default:false}]},{id:'webp',label:'WebP',extension:'webp',mimeType:'image/webp',quality:{min:0,max:100,step:1,default:75,unit:'%'}}];
const destinations=[{id:'download',available:true}] as const;
const useFixture=create<{scope:string;emptyRegions:boolean;palette:boolean;shortcuts:boolean;file:boolean;popover:boolean;reject:boolean;selected:string;elapsed:number;settings:ExportSettings;settled:number;log:string[]}>(()=>({scope:'a',emptyRegions:false,palette:false,shortcuts:false,file:false,popover:false,reject:false,selected:'warm',elapsed:0,settings:{formatId:'png',filename:'Harbor.png',destination:'download',quality:80,metadata:{}},settled:0,log:[]}));
function App(){const s=useFixture(),set=useFixture.setState,log=(event:string)=>set(v=>({log:[...v.log,`${s.scope}:${event}`]}));return <View style={{padding:16,gap:8}}>
<Button title="Toggle usable regions" onPress={()=>set(v=>({emptyRegions:!v.emptyRegions}))}/><Button title="Replace overlay scope" onPress={()=>set(v=>({scope:v.scope==='a'?'b':'a'}))}/><Button title="Open palette" onPress={()=>set({palette:true})}/><Button title="Open shortcuts" onPress={()=>set({shortcuts:true})}/><Button title="Open transfer" onPress={()=>set({file:true})}/><Button title="Reject export" onPress={()=>set({reject:true})}/><Button title="Advance recording clock" onPress={()=>set(v=>({elapsed:v.elapsed+1000}))}/>
<NativeActionMenu scope={s.scope} accessibilityLabel="Native actions" trigger={<Text>Native actions</Text>} actions={[{id:"rename",title:"Native rename"}]} onAction={id=>log(`native:${id}`)}/>
<ContextMenu scope={s.scope} label="Layer target" items={[{id:'rename',label:'Rename layer'}]} onSelect={id=>log(`context:${id}`)}><Text>Layer target</Text></ContextMenu>
<View style={{width:300}}><PresetGallery scope={s.scope} label="Grade presets" presets={[{id:'warm',name:'Warm',preview:<Text>Warm preview</Text>},{id:'cool',name:'Cool',preview:<Text>Cool preview</Text>}]} selectedId={s.selected} onSelect={selected=>{set({selected});log(`preset:${selected}`);}} onPreview={id=>log(`preview:${id??'clear'}`)}/></View>
<StatusBar scope={s.scope} activity={{kind:'recording',elapsedMs:s.elapsed}} zoom={{value:100,onChange:v=>log(`zoom:${v}`)}} units={{value:'px',options:[{value:'px',label:'Pixels'},{value:'mm',label:'Millimeters'}],onChange:v=>log(`unit:${v}`)}}/>
<CommandPalette scope={s.scope} open={s.palette} onOpenChange={palette=>set({palette})} onSelect={id=>log(`palette:${id}`)} commands={[{id:'rename',label:'Rename layer'}]} anchor={{x:80,y:80,width:44,height:44}} usableRegions={s.emptyRegions?[]:[{x:0,y:0,width:700,height:800}]}/>
<KeyboardShortcutHUD {...(s.emptyRegions?{usableRegions:[]}:{})} scope={s.scope} visible={s.shortcuts} onDismiss={()=>set({shortcuts:false})} commands={[{id:'rename',label:'Rename layer',binding:'Mod+R'}]} onRebind={(id,binding)=>log(`binding:${id}:${binding}`)}/>
<FileImportExportSheet scope={s.scope} visible={s.file} mode="export" formats={formats} destinations={destinations} settings={s.settings} onSettingsChange={settings=>set({settings})} status={{kind:'idle'}} onClose={()=>set({file:false})} usableRegions={[{x:20,y:40,width:380,height:600}]} onExport={request=>{log(`export:${request.filename}`);return new Promise((resolve,reject)=>setTimeout(()=>s.reject?reject(new Error(`Export rejected in ${s.scope}`)):resolve(undefined),400)).finally(()=>set(v=>({settled:v.settled+1})));}}/>
<NativePopover {...(s.emptyRegions?{usableRegions:[]}:{})} scope={s.scope} open={s.popover} onOpenChange={popover=>set({popover})} accessibilityLabel="Popover inspector" width={250} trigger={state=><Button title="Open native popover" onPress={state.toggle}/>}><Button title="Popover action" onPress={()=>log('popover')}/></NativePopover>
<Text testID="overlay-state">{JSON.stringify(s)}</Text></View>;}
document.body.style.margin='0';document.documentElement.dataset.theme='light';AppRegistry.registerComponent('overlay-ownership',()=>App);AppRegistry.runApplication('overlay-ownership',{rootTag:document.getElementById('root')});
