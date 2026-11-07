import {useRef,type ComponentRef} from 'react';
import {Text,View} from 'react-native';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {Button} from '@nyc-tron/ui/components/Button';
import {Select} from '@nyc-tron/ui/components/Select';
import {useA11yPreferences,useAnnounce} from '@nyc-tron/ui/components/shell/FocusAndA11yLayer';
import {NativeActionMenu} from '@nyc-tron/expo-controls/NativeActionMenu';
import {NativePopover} from '@nyc-tron/expo-controls/NativePopover';
import type {Rect2D} from '@nyc-tron/ui/components/overlays/popover-position';
interface State {kind:'menu'|'popover';open:boolean;viewport:Rect2D|null;events:readonly string[]}
function makeStore(){return createStore<State>(()=>({kind:'menu',open:false,viewport:null,events:[]}));}
/** Actual SwiftUI/Compose menu and popover consumer, independent of Forge. */
export function NativeOverlayDemo(){
 const host=useRef<ComponentRef<typeof View>|null>(null),ref=useRef<ReturnType<typeof makeStore>|null>(null);ref.current??=makeStore();const store=ref.current,s=useStore(store,v=>v),preferences=useA11yPreferences(),announce=useAnnounce();
 const log=(event:string)=>store.setState(v=>({events:[...v.events,event].slice(-20)}));
 const open=(value:boolean)=>store.setState({open:value});
 return <View ref={host} style={{flex:1,gap:12,padding:12}} onLayout={()=>host.current?.measureInWindow((x,y,width,height)=>{const before=store.getState().viewport;if([x,y,width,height].every(Number.isFinite)&&width>0&&height>0&&(!before||before.x!==x||before.y!==y||before.width!==width||before.height!==height))store.setState({viewport:{x,y,width,height}});})}>
  <Select testID="native-overlay-component" label="Native overlay component" value={s.kind} options={[{value:'menu',label:'Menu'},{value:'popover',label:'Popover'}]} onValueChange={kind=>store.setState({kind:kind as State['kind'],open:false})}/>
  <Text accessibilityRole="header" {...{className:'text-text'}}>{s.kind==='menu'?'Native action menu section':'Native popover section'}</Text>
  {s.kind==='menu'?<NativeActionMenu scope="layer-a" accessibilityLabel="Layer actions" trigger={<Text {...{className:'text-text'}}>Layer actions</Text>} actions={[{id:'rename',title:'Rename layer'},{id:'duplicate',title:'Duplicate layer'},{id:'locked',title:'Locked action',disabled:true}]} onAction={id=>log('menu:'+id)}/>:null}
  {s.kind==='popover'?<NativePopover scope="layer-a" accessibilityLabel="Layer properties" open={s.open} onOpenChange={open} usableRegions={s.viewport?[s.viewport]:[]} width={260} maxHeight={200} trigger={state=><Button title="Open layer properties" onPress={state.toggle} {...state.triggerProps}/>}><View style={{padding:12,gap:8}}><Text {...{className:'text-text'}}>Native layer properties</Text><Button title="Apply layer property" onPress={()=>{log('popover:apply');open(false);}}/></View></NativePopover>:null}
  <Button title="Announce overlay status" onPress={()=>announce('Layer controls ready')}/>
  <Text testID="native-overlay-state" numberOfLines={6} accessibilityLabel={'Native overlay state '+JSON.stringify({kind:s.kind,open:s.open,events:s.events,preferences})} {...{className:'text-text'}}>{JSON.stringify({kind:s.kind,open:s.open,events:s.events,preferences})}</Text>
 </View>;
}
