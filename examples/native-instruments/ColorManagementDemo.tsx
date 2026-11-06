import {  ScrollView, Text, View } from 'react-native';
import {useRef} from 'react';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import { PrintColorChannels } from '@nyc-tron/ui/components/forge/color/PrintColorChannels';
import { WideGamutChannels } from '@nyc-tron/ui/components/forge/color/WideGamutChannels';
import { ColorSpaceChooser } from '@nyc-tron/ui/components/forge/color/ColorSpaceChooser';
import { GamutWarning } from '@nyc-tron/ui/components/forge/color/GamutWarning';
import { ThemeColorReferences } from '@nyc-tron/ui/components/forge/color/ThemeColorReferences';
import { SpotAndGlobalColorEditor } from '@nyc-tron/ui/components/forge/color/SpotAndGlobalColorEditor';
import { SoftProofControls } from '@nyc-tron/ui/components/forge/color/SoftProofControls';
import { TabBar } from '@nyc-tron/ui/components/TabBar';
import type { PrintColor, WideGamutColor, NamedColor, SoftProofSettings } from '@nyc-tron/ui/components/forge/color/color-management';
const profiles=[{id:'press',label:'Coated press',model:'cmyk' as const},{id:'p3',label:'Display P3',model:'rgb' as const}];
const createDemo=()=>createStore<{tab:string;print:PrintColor;wide:WideGamutColor;profile:string;reference:string|null;ink:NamedColor;proof:SoftProofSettings;saved:string;inspect:number}>(()=>({
 tab:'print',print:{profileId:'press',channels:[10,20,30,40],alpha:.8},wide:{profileId:'p3',channels:[-.2,2,1.25],alpha:1},profile:'p3',reference:'brand',
 ink:{id:'ink1',name:'Brand ink',kind:'spot',tint:75,alternate:{r:20,g:100,b:200,alpha:1}},proof:{enabled:false,profileId:null,intent:'relative-colorimetric',blackPointCompensation:true,simulatePaper:false,simulateBlackInk:false},saved:'',inspect:0,
}));
export function ColorManagementDemo({ fail = false }: {readonly fail?:boolean}){const local=useRef<ReturnType<typeof createDemo>|null>(null);local.current??=createDemo();const store=local.current;const s=useStore(store,value=>value);return <ScrollView contentContainerStyle={{padding:16,gap:12,maxWidth:640,width:'100%'}}>
 <TabBar tabs={['print','wide','profiles','references','ink','proof'].map(key=>({key,label:key,active:key===s.tab,onPress:()=>store.setState({tab:key})}))}/>
 {s.tab==='print'?<PrintColorChannels value={s.print} onCommit={print=>store.setState({print})}/>:null}
 {s.tab==='wide'?<WideGamutChannels value={s.wide} onCommit={wide=>store.setState({wide})}/>:null}
 {s.tab==='profiles'?<View style={{gap:12}}><ColorSpaceChooser profiles={profiles} value={s.profile} onProfileChange={profile=>store.setState({profile})}/><GamutWarning report={{sourceProfileId:'p3',destinationProfileId:'press',outside:25,total:100,maximumDeltaE:3.4}} onInspect={()=>store.setState({inspect:s.inspect+1})}/></View>:null}
 {s.tab==='references'?<ThemeColorReferences referenceId={s.reference} references={[{id:'brand',label:'Brand',source:'Theme',preview:{r:20,g:100,b:200,alpha:1}},{id:'accent',label:'Accent',source:'Theme',preview:{r:100,g:20,b:200,alpha:1}}]} onBind={reference=>store.setState({reference})} onDetach={()=>store.setState({reference:null})}/>:null}
 {s.tab==='ink'?<SpotAndGlobalColorEditor value={s.ink} onChange={ink=>store.setState({ink})} onSave={async ink=>{if(fail)throw Error('Ink definition rejected');store.setState({saved:ink.name});}}/>:null}
 {s.tab==='proof'?<SoftProofControls profiles={profiles} value={s.proof} onCommit={proof=>store.setState({proof})}/>:null}
 <Text accessibilityLabel={`Consumer document state: ${JSON.stringify(s)}`} {...{className:"text-text-muted"}} testID="consumer-state">{JSON.stringify(s)}</Text>
 </ScrollView>;}
