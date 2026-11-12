import {AppRegistry,Text,View,Pressable} from 'react-native';
import {useSyncExternalStore} from 'react';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {createPageWindowHost} from '@nyc-tron/core/window-chrome';
import {WindowTitleBar,useWindowChrome} from '../../../src/components/window/WindowTitleBar.tsx';

// App-owned documents. The title bar never reads this store; only the close
// decision below does, the way a real app's unsaved-changes guard would.
const docs=createStore<{dirty:Record<string,boolean>;log:string[]}>(()=>({dirty:{mac:true,win:true},log:[]}));
const record=(entry:string)=>docs.setState(s=>({log:[...s.log,entry]}));
const host=createPageWindowHost({beforeClose:id=>{const allow=!docs.getState().dirty[id];record(`guard:${id}:${allow?'proceed':'cancel'}`);return allow;}});
const rect={x:0,y:0,width:520,height:240};
host.open({id:'mac',displayId:'page',rect});
host.open({id:'win',displayId:'page',rect});

function Doc({id,layout,title}:{id:string;layout:'macos'|'windows';title:string}){
  const chrome=useWindowChrome(host,id);
  const dirty=useStore(docs,s=>s.dirty[id]);
  const state=useSyncExternalStore(host.subscribe,host.getState,host.getState);
  const window=state.windows.find(w=>w.id===id);
  if(!window)return <Text testID={`gone-${id}`}>{title} closed</Text>;
  return <View testID={`window-${id}`} style={{width:520,borderWidth:1}} {...{className:'border-border bg-surface-raised'}}>
    <WindowTitleBar testID={`titlebar-${id}`} chrome={chrome} title={title} edited={dirty} controls={{kind:'drawn',layout}}
      onCommandResult={r=>record(`${id}:${r.command}:${r.status}`)} onError={e=>record(`${id}:error:${String(e)}`)}/>
    {window.status==='open'?<View style={{padding:16,gap:8}}>
      <Text {...{className:'text-text'}}>Body of {title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`Save ${title}`} onPress={()=>docs.setState(s=>({dirty:{...s.dirty,[id]:false}}))} style={{minHeight:44,justifyContent:'center'}}>
        <Text {...{className:'text-text'}}>Save {title}</Text>
      </Pressable>
    </View>:null}
  </View>;
}
function App(){
  const state=useSyncExternalStore(host.subscribe,host.getState,host.getState);
  const log=useStore(docs,s=>s.log);
  return <View style={{padding:16,gap:16}} {...{className:'bg-surface-sunken'}}>
    <Doc id="mac" layout="macos" title="Q3 report"/>
    <Doc id="win" layout="windows" title="Budget sheet"/>
    <Text testID="registry">{JSON.stringify({windows:state.windows.map(w=>({id:w.id,status:w.status})),focusedId:state.focusedId,zoomed:['mac','win'].filter(id=>host.zoom.isZoomed(id)),log})}</Text>
  </View>;
}
document.body.style.margin='0';document.documentElement.dataset.theme='light';
AppRegistry.registerComponent('window-chrome',()=>App);AppRegistry.runApplication('window-chrome',{rootTag:document.getElementById('root')});
