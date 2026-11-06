import {Text,View,type ViewProps} from "react-native";
import {SegmentedControl} from "../../SegmentedControl.tsx";
import {joinClasses} from "../../styles.ts";
import {LiveHistogram,type LiveHistogramProps} from "./LiveHistogram.tsx";
import {poolScope,bounded,type ScopeSample} from "./color-adjustments.ts";
export type {ScopeSample} from "./color-adjustments.ts";
/** Frame-tagged engine measurements; a missing frame is different from a measured empty scope. */
export interface VideoScopesPanelProps extends Omit<ViewProps,'children'> {
 readonly frameTimeUs:number|null;
 readonly mode:'histogram'|'waveform'|'vectorscope';
 readonly onModeChange:(mode:VideoScopesPanelProps['mode'])=>void;
 readonly histogram:LiveHistogramProps['channels'];
 readonly domain:readonly [number,number];
 readonly waveform:readonly ScopeSample[];
 readonly vectorscope:readonly ScopeSample[];
 readonly height?:number;readonly unstyled?:boolean;
}
/** Renders actual decoded measurements with bounded density pooling; no synthetic scope signal. */
export function VideoScopesPanel({frameTimeUs,mode,onModeChange,histogram,domain,waveform,vectorscope,height=180,unstyled=false,...props}:VideoScopesPanelProps){
 if(frameTimeUs!==null&&(!Number.isSafeInteger(frameTimeUs)||frameTimeUs<0))throw new RangeError('Scope frame time must be nonnegative integer microseconds');bounded(height,88,600,'Scope height');
 if(!['histogram','waveform','vectorscope'].includes(mode))throw new TypeError('Unknown video scope mode');
 const samples=mode==='waveform'?waveform:vectorscope,grid=mode==='histogram'?[]:poolScope(samples),peak=Math.max(0,...grid);
 return <View {...props} style={[{gap:8},props.style]}>
  <SegmentedControl aria-label="Video scope" value={mode} onChange={onModeChange} options={[{value:'histogram',label:'Histogram'},{value:'waveform',label:'Waveform'},{value:'vectorscope',label:'Vectorscope'}]} unstyled={unstyled}/>
  <Text accessibilityLiveRegion="polite" {...{className:joinClasses(!unstyled&&'text-text-muted')}}>{frameTimeUs===null?'No decoded scope frame':`Decoded frame ${frameTimeUs} microseconds`}</Text>
  {frameTimeUs===null?null:mode==='histogram'?<LiveHistogram channels={histogram} domain={domain} height={height} unstyled={unstyled}/>:<View accessible accessibilityLabel={`${mode}, ${samples.length} decoded samples`} style={{height,flexDirection:'row',flexWrap:'wrap'}}>
   {grid.map((density,index)=><View key={index} pointerEvents="none" {...{className:joinClasses(!unstyled&&'bg-primary')}} style={{width:'3.125%',height:height/32,opacity:peak?Math.log1p(density)/Math.log1p(peak):0}}/>)}
  </View>}
 </View>;
}
