import {AppRegistry,Text,View} from 'react-native';
import {create} from 'zustand';
import {Button} from '../../../src/components/Button.tsx';
import {DocumentTabBar} from '../../../src/components/shell/DocumentTabBar.tsx';
import {ToolRail} from '../../../src/components/shell/ToolRail.tsx';
import {ContextualToolbar} from '../../../src/components/shell/ContextualToolbar.tsx';
import {RibbonTabs} from '../../../src/components/shell/RibbonTabs.tsx';
import {SplitButton} from '../../../src/components/shell/SplitButton.tsx';
const useFixture=create<{scope:string;disabled:boolean;active:string;tab:string;tool:string;log:string[]}>(()=>({scope:'a',disabled:false,active:'one',tab:'home',tool:'move',log:[]}));
function App(){const s=useFixture(),set=useFixture.setState,log=(action:string)=>set(v=>({log:[...v.log,`${s.scope}:${action}`]})),owned={scope:s.scope,disabled:s.disabled};return <View style={{padding:16,gap:12}}>
<Button title="Replace command scope" onPress={()=>set(v=>({scope:v.scope==='a'?'b':'a'}))}/><Button title="Toggle command availability" onPress={()=>set(v=>({disabled:!v.disabled}))}/>
<DocumentTabBar {...owned} documents={[{id:'one',title:'One',dirty:true},{id:'two',title:'Two'}]} activeId={s.active} onActivate={active=>{set({active});log(`activate:${active}`);}} onClose={id=>log(`close:${id}`)} onReorder={(id,index)=>log(`reorder:${id}:${index}`)}/>
<ToolRail {...owned} expanded tools={[{id:'move',label:'Move',icon:null},{id:'shape',label:'Shape',icon:null,variants:[{id:'rect',label:'Rectangle',icon:null},{id:'ellipse',label:'Ellipse',icon:null}]}]} activeToolId={s.tool} onSelectTool={tool=>{set({tool});log(`tool:${tool}`);}}/>
<View style={{width:160}}><ContextualToolbar {...owned} label="Context actions" selectionKind={s.scope==='a'?'shape':'text'} items={[{id:'crop',label:'Crop',appliesTo:['shape']},{id:'bold',label:'Bold',appliesTo:['text']},{id:'duplicate',label:'Duplicate'},{id:'locked',label:'Locked',disabledReason:'Already locked'}]} onAction={id=>log(`context:${id}`)}/></View>
<RibbonTabs {...owned} activeTabId={s.tab} onTabChange={tab=>set({tab})} onCommand={(id,item)=>log(`ribbon:${id}:${item??'primary'}`)} tabs={[{id:'home',label:'Home',groups:[{id:'actions',label:'Actions',commands:[{kind:'button',id:'paste',label:'Paste'},{kind:'split',id:'export',label:'Export',items:[{id:'png',label:'Export PNG'},{id:'jpg',label:'Export JPEG',disabled:true}]},{kind:'gallery',id:'style',label:'Styles',inline:2,selectedId:'plain',items:[{id:'plain',label:'Plain',preview:<Text>Plain</Text>},{id:'title',label:'Title',preview:<Text>Title</Text>},{id:'body',label:'Body',preview:<Text>Body</Text>}]}]}]}]}/>
<SplitButton editScope={s.scope} disabled={s.disabled} label="Publish" items={[{id:'preview',label:'Preview publish'}]} onPress={()=>log('publish')} onSelect={id=>log(id)}/>
<Text testID="command-state">{JSON.stringify(s)}</Text>
</View>;}
document.body.style.margin='0';document.documentElement.dataset.theme='light';AppRegistry.registerComponent('command-ownership',()=>App);AppRegistry.runApplication('command-ownership',{rootTag:document.getElementById('root')});
