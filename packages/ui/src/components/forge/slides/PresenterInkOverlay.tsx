import {useEffect,useRef} from 'react';
import {View,type ViewProps,type GestureResponderEvent} from 'react-native';
import {createStore,type StoreApi} from 'zustand/vanilla';
import {useStore} from 'zustand';
import {createCanvasResponder} from '../../gestures/canvas-responder.ts';
import {webKey} from '../../forms/choice-keys.ts';
import type {InkSize} from '../ink/ink-model.ts';
import {appendPoint,createStrokeIdFactory,normalizePoint,resolvePresenterInkKey,strokeSegments,strokesUnderEraser,validatePresenterStrokes,presenterModeStatus,HIGHLIGHTER_OPACITY,LASER_TRAIL_MS,type PresenterInkMode,type PresenterInkPoint,type PresenterInkStroke} from './presenter-ink-model.ts';

/** Controlled normalized presentation ink. The host owns session strokes and undo. */
export interface PresenterInkOverlayProps extends Omit<ViewProps,'children'> {
 readonly mode:PresenterInkMode;readonly color:string;readonly size:InkSize;readonly strokes:readonly PresenterInkStroke[];
 readonly onStrokeCommit:(stroke:PresenterInkStroke)=>void|Promise<unknown>;
 readonly onRemoveStrokes:(ids:readonly string[])=>void|Promise<unknown>;
 readonly onModeChange:(mode:PresenterInkMode)=>void;readonly disabled?:boolean;readonly reducedMotion?:boolean;
}
type Local={width:number;height:number;draft:PresenterInkStroke|undefined;laser:PresenterInkPoint|undefined};
/** A stable overlay; off passes input through, Escape cancels, one commit per stroke/erase gesture. */
export function PresenterInkOverlay({mode,color,size,strokes,onStrokeCommit,onRemoveStrokes,onModeChange,disabled=false,reducedMotion=false,style,...rest}:PresenterInkOverlayProps){
 validatePresenterStrokes(strokes);
 const local=useRef<StoreApi<Local>|null>(null);if(!local.current)local.current=createStore<Local>(()=>({width:0,height:0,draft:undefined,laser:undefined}));
 const store=local.current;const state=useStore(store,s=>s);const latest=useRef({mode,color,size,strokes,onStrokeCommit,onRemoveStrokes,onModeChange,disabled});latest.current={mode,color,size,strokes,onStrokeCommit,onRemoveStrokes,onModeChange,disabled};
 const makeId=useRef(createStrokeIdFactory());const active=useRef(false),erased=useRef(new Set<string>());
 const cancel=()=>{active.current=false;erased.current.clear();store.setState({draft:undefined,laser:undefined});};
 useEffect(()=>{cancel();},[mode,disabled]);
 useEffect(()=>{if(!state.laser)return;const timer=setTimeout(()=>store.setState({laser:undefined}),reducedMotion?150:LASER_TRAIL_MS);return()=>clearTimeout(timer);},[state.laser,reducedMotion,store]);
 const point=(e:GestureResponderEvent)=>{const s=store.getState();return normalizePoint(e.nativeEvent.locationX,e.nativeEvent.locationY,s);};
 const move=(e:GestureResponderEvent)=>{
  if(!active.current)return;const p=point(e),v=latest.current,s=store.getState();
  if(v.mode==='laser')store.setState({laser:p});
  else if(v.mode==='eraser'){for(const id of strokesUnderEraser(v.strokes,p,s))erased.current.add(id);}
  else if(s.draft)store.setState({draft:{...s.draft,points:appendPoint(s.draft.points,p,s)}});
 };
 const responder=useRef<ReturnType<typeof createCanvasResponder>|null>(null);
 if(!responder.current)responder.current=createCanvasResponder({
  onStartShouldSetPanResponder:()=>!latest.current.disabled&&latest.current.mode!=='off'&&store.getState().width>0&&store.getState().height>0,
  onPanResponderGrant:e=>{active.current=true;erased.current.clear();const v=latest.current;if(v.mode==='pen'||v.mode==='highlighter')store.setState({draft:{id:makeId.current(),tool:v.mode,color:v.color,size:v.size,points:[point(e)]}});else move(e);},
  onPanResponderMove:move,
  onPanResponderRelease:e=>{if(latest.current.disabled){cancel();return;}if(!active.current)return;move(e);const draft=store.getState().draft,ids=[...erased.current];active.current=false;erased.current.clear();store.setState({draft:undefined});if(draft)void latest.current.onStrokeCommit(draft);else if(ids.length)void latest.current.onRemoveStrokes(ids);},
  onPanResponderTerminate:cancel,onPanResponderTerminationRequest:()=>!active.current,
 });
 const key=(event:unknown)=>{if(latest.current.disabled)return;const k=webKey(event),command=resolvePresenterInkKey(k);if(!command)return;k.preventDefault();if(command.type==='exit'){cancel();latest.current.onModeChange('off');}else if(command.type==='tool')latest.current.onModeChange(command.tool);else {const last=latest.current.strokes.at(-1);if(last)void latest.current.onRemoveStrokes([last.id]);}};
 return <View {...rest} {...responder.current.panHandlers} pointerEvents={mode==='off'||disabled?'none':'auto'} focusable={mode!=='off'&&!disabled} accessibilityLabel={presenterModeStatus(mode)} {...{onKeyDown:key}}
  onLayout={e=>store.setState({width:e.nativeEvent.layout.width,height:e.nativeEvent.layout.height})} style={[{position:'absolute',left:0,top:0,right:0,bottom:0,overflow:'hidden',direction:'ltr',...(mode!=='off'?{touchAction:'none'}:{} )},style]}>
  {[...strokes,...(state.draft?[state.draft]:[])].map(stroke=><View key={stroke.id} pointerEvents="none" needsOffscreenAlphaCompositing={stroke.tool==='highlighter'} style={{position:'absolute',left:0,top:0,right:0,bottom:0,opacity:stroke.tool==='highlighter'?HIGHLIGHTER_OPACITY:1}}>
   {strokeSegments(stroke,state).map((s,i)=><View key={i} style={{position:'absolute',left:s.left,top:s.top,width:s.length,height:s.thickness,borderRadius:s.thickness/2,backgroundColor:stroke.color,transform:[{rotate:`${s.angle}deg`}]}}/>)}
  </View>)}
  {state.laser?<View pointerEvents="none" {...{className:'bg-danger'}} style={{position:'absolute',left:state.laser.x*state.width-5,top:state.laser.y*state.height-5,width:10,height:10,borderRadius:5}}/>:null}
 </View>;
}
