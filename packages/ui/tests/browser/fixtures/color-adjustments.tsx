import {AppRegistry,ScrollView,Text,View} from 'react-native';import {create} from 'zustand';
import {TabBar} from '@nyc-tron/ui/components/TabBar';
import {LevelsEditor} from '@nyc-tron/ui/components/forge/color/LevelsEditor';
import {CurvesEditor} from '@nyc-tron/ui/components/forge/color/CurvesEditor';
import {GradientStopEditor} from '@nyc-tron/ui/components/forge/color/GradientStopEditor';
import {GradientMeshEditor} from '@nyc-tron/ui/components/forge/color/GradientMeshEditor';
import {ColorGradingWheels} from '@nyc-tron/ui/components/forge/color/ColorGradingWheels';
import {HSLSecondaryEditor} from '@nyc-tron/ui/components/forge/color/HSLSecondaryEditor';
import {VideoScopesPanel} from '@nyc-tron/ui/components/forge/color/VideoScopesPanel';
import {HueSlider} from '@nyc-tron/ui/components/forge/color/HueSlider';
import {SVColorField} from '@nyc-tron/ui/components/forge/color/SVColorField';
import {EyedropperTool} from '@nyc-tron/ui/components/forge/color/EyedropperTool';
import type {ColorCurve} from '@nyc-tron/ui/components/forge/color/color-adjustments';
import type {GradientPaint} from '@nyc-tron/ui/components/forge/vector/vector-types';
const band={hue:0,saturation:0,exposureEv:0},color={r:20,g:100,b:200,alpha:1};
const initial={tab:'curves',revision:1,commits:0,preview:null as unknown,selected:'mid',seq:0,
 curve:{interpolation:'monotone' as const,points:[{id:'black',x:0,y:0},{id:'mid',x:.5,y:.7},{id:'white',x:1,y:1}]},
 levels:{inputBlack:0,inputWhite:1,gamma:1,outputBlack:0,outputWhite:1},
 paint:{type:'linear' as const,x0:0,y0:0,x1:100,y1:0,stops:[{offset:0,color:[0,0,0,255] as const},{offset:1,color:[255,255,255,255] as const}]},stop:0,
 mesh:{rows:2,columns:2,points:[{id:'a',x:0,y:0,color},{id:'b',x:1,y:0,color},{id:'c',x:0,y:1,color},{id:'d',x:1,y:1,color}]},meshId:'a',
 grade:{shadows:band,midtones:band,highlights:band,balance:0,blend:1},
 hsl:{enabled:true,hueStart:340,hueEnd:20,hueFeather:10,saturationMin:0,saturationMax:1,luminanceMin:0,luminanceMax:1,softness:.1,denoise:0,hueShift:0,saturationShift:0,luminanceShift:0,showMask:false,invert:false},
 mode:'histogram' as 'histogram'|'waveform'|'vectorscope',hsv:{h:120,s:.5,v:.5,alpha:.75},sample:{documentId:'image',revision:'1',sourceId:'composite',x:20,y:30,radius:0},applied:null as unknown,
};
// Controlled unions permit the public components to return every supported variant.
type Demo=Omit<typeof initial,'curve'|'paint'>&{curve:ColorCurve;paint:GradientPaint};
const useDoc=create<Demo>(()=>initial);const commit=(change:Partial<Demo>)=>useDoc.setState(s=>({...change,commits:s.commits+1,revision:s.revision+1,preview:null}));
function App(){const s=useDoc();return <ScrollView contentContainerStyle={{padding:16,gap:12,width:'100%',maxWidth:640}}>
 <TabBar tabs={['curves','levels','gradient','mesh','grade','secondary','scopes','field','sample'].map(key=>({key,label:key,active:s.tab===key,onPress:()=>useDoc.setState({tab:key})}))}/>
 {s.tab==='curves'?<CurvesEditor scope={String(s.revision)} value={s.curve} selectedId={s.selected} onSelect={selected=>useDoc.setState({selected})} createPointId={()=>{const seq=useDoc.getState().seq+1;useDoc.setState({seq});return `p${seq}`;}} onPreview={preview=>useDoc.setState({preview:preview??null})} onCommit={(curve,selected)=>commit({curve,selected})}/>:null}
 {s.tab==='levels'?<LevelsEditor value={s.levels} onCommit={levels=>commit({levels})}/>:null}
 {s.tab==='gradient'?<GradientStopEditor value={s.paint} selectedIndex={s.stop} onSelect={stop=>useDoc.setState({stop})} onCommit={(paint,stop)=>commit({paint,stop})}/>:null}
 {s.tab==='mesh'?<GradientMeshEditor scope={String(s.revision)} value={s.mesh} selectedId={s.meshId} onSelect={meshId=>useDoc.setState({meshId})} onPreview={preview=>useDoc.setState({preview:preview??null})} onCommit={mesh=>commit({mesh})}/>:null}
 {s.tab==='grade'?<ColorGradingWheels value={s.grade} onPreview={preview=>useDoc.setState({preview:preview??null})} onCommit={grade=>commit({grade})}/>:null}
 {s.tab==='secondary'?<HSLSecondaryEditor value={s.hsl} onCommit={hsl=>commit({hsl})}/>:null}
 {s.tab==='scopes'?<VideoScopesPanel frameTimeUs={125000} mode={s.mode} onModeChange={mode=>useDoc.setState({mode})} histogram={[{id:'luma',label:'Luminance',bins:[0,5,10,5,0]}]} domain={[0,1]} waveform={[{x:0,y:.5,intensity:1},{x:1,y:0,intensity:.5}]} vectorscope={[{x:.5,y:.5,intensity:.5}]}/>:null}
 {s.tab==='field'?<View style={{gap:8}}><SVColorField value={s.hsv} onPreview={preview=>useDoc.setState({preview})} onCommit={hsv=>commit({hsv})}/><HueSlider value={s.hsv} onPreview={preview=>useDoc.setState({preview})} onCommit={hsv=>commit({hsv})}/></View>:null}
 {s.tab==='sample'?<EyedropperTool request={s.sample} documentWidth={100} documentHeight={100} sources={[{id:'composite',label:'Merged document'},{id:'layer:1',label:'Selected layer'}]} onRequestChange={sample=>useDoc.setState({sample})} onSample={async()=>{if(query.has('fail'))throw Error('Document sampler unavailable');return {profileId:'linear:p3',channels:[-.2,2,.25],alpha:.75,preview:color};}} onApply={(sample,request)=>commit({applied:{sample,request}})}/>:null}
 <Text testID="consumer-state">{JSON.stringify(s)}</Text>
 </ScrollView>;}
const query=new URLSearchParams(location.search);document.documentElement.dataset.theme=query.get('theme')??'light';document.documentElement.dir=query.get('dir')??'ltr';AppRegistry.registerComponent('ColorAdjustments',()=>App);AppRegistry.runApplication('ColorAdjustments',{rootTag:document.getElementById('root')});
