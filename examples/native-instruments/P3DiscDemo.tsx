import {useRef} from 'react';
import {Text,View} from 'react-native';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {SegmentedControl} from '@nyc-tron/ui/components/SegmentedControl';
import {DisplayP3DiscLayer} from '@nyc-tron/native-controls/DisplayP3DiscLayer';

const levels=[{value:'1',label:'Full'},{value:'0.75',label:'75%'},{value:'0.5',label:'50%'},{value:'0.25',label:'25%'}] as const;
type Level=typeof levels[number]['value'];
const makeStore=()=>createStore(()=>({level:'1' as Level}));
/** Independent native consumer of the input-free Display P3 disc background.
 * The interactive disc picker that hosts it is an editor control owned by Nitro Forge. */
export function P3DiscDemo(){
 const local=useRef<ReturnType<typeof makeStore>|null>(null);local.current??=makeStore();
 const store=local.current,level=useStore(store,s=>s.level);
 return <View style={{padding:16,gap:12}}>
  <Text style={{color:'white'}}>Display P3 hue and saturation</Text>
  <Text style={{color:'white'}}>Native P3 rendering; output gamut depends on the display and host color mode.</Text>
  <SegmentedControl aria-label="P3 disc brightness" options={levels} value={level} onChange={value=>store.setState({level:value})}/>
  <DisplayP3DiscLayer size={240} value={Number(level)}/>
  <Text accessibilityLabel={`P3 disc brightness ${level}`} style={{color:'white'}}>{`brightness ${level}`}</Text>
 </View>;
}
