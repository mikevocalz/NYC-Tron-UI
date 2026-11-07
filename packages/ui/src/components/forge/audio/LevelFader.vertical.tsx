import {useLayoutEffect,useRef} from 'react';
import {Text,TextInput,View,type ViewProps} from 'react-native';
import {GestureDetector,useCompetingGestures,usePanGesture,useTapGesture} from 'react-native-gesture-handler';
import {createStore} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {Button} from '../../Button.tsx';
import {ErrorMessage} from '../../feedback/ErrorMessage.tsx';
import {controlIdentity,useScopedControl,type ScopedControlProps} from '../inputs/useScopedControl.ts';
import {assertFaderRange,clampGain,dbToGain,dragToGain,FADER_RANGES,formatDb,gainToPosition,stepGain,type FaderRange} from './level.ts';
export interface NativeVerticalFaderProps extends Omit<ViewProps,'children'>,ScopedControlProps {
 value:number;label:string;range?:FaderRange;length?:number;stepDb?:number;className?:string;
 onPreview?:(gain:number)=>void;onCommit:(gain:number,signal?:AbortSignal)=>void|Promise<unknown>;unstyled?:boolean;
}
/** Native RNGH fader with dB taper, fine travel, numeric gain and double-tap unity reset. */
export function NativeVerticalFader({scope='vertical-fader',revision=0,...props}:NativeVerticalFaderProps){
 const {value,label,range=FADER_RANGES.CHANNEL,length=180,stepDb=1,onPreview:_preview,onCommit:_commit,unstyled=false,disabledReason,style,...rest}=props;assertFaderRange(range);
 if(!Number.isFinite(stepDb)||stepDb<=0||!Number.isFinite(value)||value<0||value>dbToGain(range.maxDb)||!label.trim()||label.length>1024||!Number.isFinite(length)||length<64||length>2048)throw new RangeError('Invalid vertical fader');
 const owner=JSON.stringify([...controlIdentity(scope,revision),range,length,disabledReason]),guard=useScopedControl(owner,props,disabledReason!==undefined),off=guard.pending||disabledReason!==undefined;
 const local=useRef<ReturnType<typeof makeStore>|null>(null);local.current??=makeStore();const store=local.current,s=useStore(store,v=>v),active=useRef<{owner:string;start:number;value:number}|null>(null),tapRejected=useRef(false);
 const cancel=()=>{active.current=null;store.setState({preview:null});guard.current()?.onPreview?.(value);};
 useLayoutEffect(()=>{cancel();tapRejected.current=true;store.setState({draft:formatDb(value),dirty:false,error:null});},[owner,value,off]);
 const commit=(gain:number)=>{store.setState({preview:null});return guard.run('gain',(host,signal)=>gain!==host.value?host.onCommit(gain,signal):undefined);};
 const update=(dy:number)=>{const a=active.current;if(!a||a.owner!==owner||!guard.current())return;const next=dragToGain(a.start,-dy*(store.getState().fine ? .1 : 1),length-16,range);a.value=next;store.setState({preview:next});guard.current()?.onPreview?.(next);};
 const pan=usePanGesture({enabled:!off,runOnJS:true,minDistance:4,maxPointers:1,activeOffsetY:[-4,4],failOffsetX:[-8,8],
  onActivate:event=>{if(!guard.current())return;active.current={owner,start:gainToPosition(value,range),value};update(event.translationY);},
  onUpdate:event=>update(event.translationY),onTouchesDown:event=>{if(event.numberOfTouches>1)cancel();},
  onDeactivate:event=>{if(event.canceled){cancel();return;}update(event.translationY);const a=active.current;active.current=null;if(a?.owner===owner)void commit(a.value);},onFinalize:event=>{if(event.canceled)cancel();},
 });
 const reset=()=>commit(clampGain(1,range));
 const doubleTap=useTapGesture({enabled:!off,runOnJS:true,numberOfTaps:2,maxDelay:300,maxDuration:250,maxDistance:12,
  onBegin:()=>{tapRejected.current=false;},onTouchesDown:event=>{if(event.numberOfTouches!==1)tapRejected.current=true;},onActivate:()=>{if(!tapRejected.current)void reset();},
 });
 const gesture=useCompetingGestures(pan,doubleTap),shown=s.preview??value,position=gainToPosition(shown,range);
 const numeric=()=>{const state=store.getState();if(!state.dirty||off)return;const text=state.draft.trim().replace(/dB$/i,'').trim().replaceAll('−','-');let gain:number;
  if(/^-?(?:inf|infinity|∞)$/i.test(text))gain=0;else{const db=Number(text);if(!text||!Number.isFinite(db)||db<range.minDb||db>range.maxDb){store.setState({error:`Enter ${range.minDb} to ${range.maxDb} dB, or -inf for silence`});return;}gain=dbToGain(db);}
  store.setState({dirty:false,error:null});void commit(gain);
 };
 const key=(event:{key?:string;shiftKey?:boolean;preventDefault?:()=>void})=>{if(off)return;const direction=event.key==='ArrowUp'?1:event.key==='ArrowDown'?-1:0;if(event.key==='Escape'){event.preventDefault?.();cancel();return;}if(direction){event.preventDefault?.();void commit(stepGain(value,direction as -1|1,event.shiftKey ? stepDb/10 : stepDb,range));}else if(event.key==='Home'){event.preventDefault?.();void commit(0);}else if(event.key==='End'){event.preventDefault?.();void commit(dbToGain(range.maxDb));}};
 return <View {...rest} style={[{gap:8,minWidth:88,maxWidth:'100%',alignItems:'center'},style]} accessibilityLabel={label+' fader'}>
  <Text {...{className:unstyled?undefined:'text-text'}}>{label}</Text>
  <GestureDetector key={owner} gesture={gesture} touchAction="pan-x" userSelect="none"><View collapsable={false} accessible accessibilityRole="adjustable" accessibilityLabel={label} accessibilityState={{disabled:off}}
   accessibilityValue={{min:0,max:100,now:position*100,text:formatDb(shown)}} accessibilityActions={[{name:'increment',label:'Raise gain'},{name:'decrement',label:'Lower gain'},{name:'reset',label:'Reset to unity'}]}
   onAccessibilityAction={e=>{if(off)return;if(e.nativeEvent.actionName==='reset')void reset();else if(e.nativeEvent.actionName==='increment'||e.nativeEvent.actionName==='decrement')void commit(stepGain(value,e.nativeEvent.actionName==='increment'?1:-1,stepDb,range));}}
   {...{onKeyDown:key,focusable:!off}} style={{width:44,height:length,position:'relative',opacity:off ? .5 : 1}}>
   <View pointerEvents="none" {...{className:unstyled?undefined:'bg-surface-sunken border border-border'}} style={{position:'absolute',left:18,top:8,bottom:8,width:8}}/>
   <View pointerEvents="none" {...{className:unstyled?undefined:'bg-accent'}} style={{position:'absolute',left:18,bottom:8,width:8,height:position*(length-16)}}/>
   <View pointerEvents="none" {...{className:unstyled?undefined:'bg-surface-raised border-2 border-accent'}} style={{position:'absolute',left:0,top:(1-position)*(length-16),width:44,height:16}}/>
  </View></GestureDetector>
  <TextInput accessibilityLabel={label+' gain decibels'} value={s.dirty?s.draft:formatDb(shown)} maxLength={64} editable={!off} onChangeText={draft=>store.setState({draft,dirty:true,error:null})} onSubmitEditing={numeric} onBlur={numeric} style={{minHeight:44,minWidth:88,maxWidth:'100%',padding:8}} {...{className:unstyled?undefined:'text-text border border-border rounded-control'}}/>
  <View style={{flexDirection:'row',gap:4}}><Button title="−" accessibilityLabel={`Lower ${label} by ${stepDb} dB`} disabled={off} unstyled={unstyled} onPress={()=>commit(stepGain(value,-1,stepDb,range))}/><Button title="+" accessibilityLabel={`Raise ${label} by ${stepDb} dB`} disabled={off} unstyled={unstyled} onPress={()=>commit(stepGain(value,1,stepDb,range))}/></View>
  <Button title={s.fine?'Fine on':'Fine off'} accessibilityLabel={s.fine?'Fine gain on':'Fine gain off'} variant="secondary" disabled={off} unstyled={unstyled} onPress={()=>store.setState({fine:!s.fine})}/>
  <Button title="Reset unity" accessibilityLabel="Reset gain to unity" variant="ghost" disabled={off} unstyled={unstyled} onPress={reset}/>
  <ErrorMessage message={s.error??guard.error??undefined} unstyled={unstyled}/>
 </View>;
}
function makeStore(){return createStore(()=>({preview:null as number|null,fine:false,draft:'',dirty:false,error:null as string|null}));}
