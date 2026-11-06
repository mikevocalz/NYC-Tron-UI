import {useRef} from 'react';
import {AppRegistry,Text,View} from 'react-native';
import {create} from 'zustand';
import {Button} from '../../../src/components/Button.tsx';
import {PrecisionScrubber} from '../../../src/components/forge/inputs/PrecisionScrubber.tsx';
import {SliderField} from '../../../src/components/shell/SliderField.tsx';
import {RangeSlider} from '../../../src/components/shell/RangeSlider.tsx';
import {RotaryKnob} from '../../../src/components/shell/RotaryKnob.tsx';
import {InspectorPanel} from '../../../src/components/shell/InspectorPanel.tsx';
import {InspectorSection} from '../../../src/components/shell/InspectorSection.tsx';
import {PropertyRow} from '../../../src/components/shell/PropertyRow.tsx';
import {UnitInput} from '../../../src/components/shell/UnitInput.tsx';
const useFixture=create<{scope:string;defer:boolean;disabled:boolean;visible:boolean;value:number;range:readonly[number,number];commits:string[];previews:string[]}>(()=>({scope:'a',defer:false,disabled:false,visible:true,value:0.25,range:[0.25,1.75],commits:[],previews:[]}));
function App(){const pending=useRef<(()=>void)|null>(null);const s=useFixture(),set=useFixture.setState,commit=(kind:string,value:number|readonly[number,number])=>set(v=>({commits:[...v.commits,`${s.scope}:${kind}:${JSON.stringify(value)}`],...(typeof value==='number'?{value}:{range:value})})),preview=(kind:string,value:unknown)=>set(v=>({previews:[...v.previews,`${s.scope}:${kind}:${JSON.stringify(value)}`]}));const owned={scope:s.scope,disabled:s.disabled,min:0,max:2,step:0.25};return <View style={{padding:16,gap:8}}>
<Button title="Defer scrub commit" onPress={()=>set({defer:true})}/><Button title="Reject old scrub commit" onPress={()=>pending.current?.()}/><Button title="Replace precision scope" onPress={()=>set(v=>({scope:v.scope==='a'?'b':'a'}))}/><Button title="Toggle precision availability" onPress={()=>set(v=>({disabled:!v.disabled}))}/><Button title="Unmount precision controls" onPress={()=>set({visible:false})}/>
{s.visible?<View style={{width:360,gap:8}}><PrecisionScrubber {...owned} label="Canonical scrub" value={s.value} onPreview={v=>preview('scrub',v)} onCommit={v=>s.defer?new Promise<void>((_,reject)=>{pending.current=()=>reject(new Error('Old document failed'));}):commit('scrub',v)}/><SliderField {...owned} label="Amount" value={s.value} onPreview={v=>preview('slider',v)} onCommit={v=>commit('slider',v)}/><RangeSlider {...owned} label="Span" value={s.range} onPreview={v=>preview('range',v)} onCommit={v=>commit('range',v)}/><RotaryKnob {...owned} label="Turn" value={s.value} onPreview={v=>preview('knob',v)} onCommit={v=>commit('knob',v)}/></View>:null}
<View style={{height:220,width:360}}><InspectorPanel scope={s.scope} selection={{kind:'single',title:'Same named selection'}}><InspectorSection title="Values" expanded onExpandedChange={()=>{}}><PropertyRow label="Inspector amount">{({editorLabel})=><UnitInput label={editorLabel} value={s.value} onCommit={v=>commit('inspector',v)}/>}</PropertyRow></InspectorSection></InspectorPanel></View>
<Text testID="precision-state">{JSON.stringify(s)}</Text></View>;}
document.body.style.margin='0';document.documentElement.dataset.theme='light';AppRegistry.registerComponent('precision-ownership',()=>App);AppRegistry.runApplication('precision-ownership',{rootTag:document.getElementById('root')});
