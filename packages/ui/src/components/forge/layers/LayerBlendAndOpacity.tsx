import {useLayoutEffect,useRef} from 'react';
import {Text,View,type ViewProps} from 'react-native';
import {MenuButton} from '../../shell/MenuButton.tsx';
import {ErrorMessage} from '../../feedback/ErrorMessage.tsx';
import {useOwnedAction} from '../../shell/useOwnedAction.ts';
import {joinClasses} from '../../styles.ts';
import {PrecisionScrubber} from '../inputs/PrecisionScrubber.tsx';
import {layerBlendProblem,layerOpacityFromPercent,validateLayerBlend,type LayerAlphaMode,type LayerBlendMode,type LayerBlendSpace,type LayerBlendValue} from './layer-blend-model.ts';
export type {LayerAlphaMode,LayerBlendMode,LayerBlendSpace,LayerBlendValue} from './layer-blend-model.ts';
export interface LayerBlendAndOpacityProps extends Omit<ViewProps,'children'> {
 scope:string;revision?:string|number;layerId:string;value:LayerBlendValue;
 modes:readonly LayerBlendMode[];spaces:readonly LayerBlendSpace[];
 onPreview?:(value:LayerBlendValue)=>void;
 /** One host transaction. Respect the signal before applying an asynchronous result. */
 onCommit:(value:LayerBlendValue,detail:{kind:'mode'|'opacity'|'space'|'alpha'},signal:AbortSignal)=>void|Promise<void>;
 disabled?:boolean;className?:string;unstyled?:boolean;
}
/** Compositing policy requests, not document-profile assignment or pixel conversion. */
export function LayerBlendAndOpacity({scope,revision=0,layerId,value,modes,spaces,onPreview,onCommit,disabled=false,className,unstyled=false,style,...rest}:LayerBlendAndOpacityProps){
 validateLayerBlend(value,modes,spaces);if(!scope.trim()||scope.length>512||!layerId.trim()||layerId.length>512||typeof revision==='number'&&!Number.isFinite(revision)||typeof revision==='string'&&revision.length>512)throw new RangeError('Invalid layer blend identity');
 const owner=JSON.stringify([scope,revision,layerId,disabled,modes,spaces]),boundary=JSON.stringify([owner,value]),action=useOwnedAction(owner),pending=action.pending!==null;
 const committed=useRef<null|{boundary:string;onPreview:typeof onPreview;onCommit:typeof onCommit}>(null),request=useRef<symbol|null>(null);
 useLayoutEffect(()=>{committed.current={boundary,onPreview,onCommit};});useLayoutEffect(()=>{request.current=null;return()=>{request.current=null;};},[owner]);useLayoutEffect(()=>()=>{committed.current=null;},[]);
 const current=()=>!disabled&&!pending&&committed.current?.boundary===boundary?committed.current:null;
 const commit=(patch:Partial<LayerBlendValue>,kind:'mode'|'opacity'|'space'|'alpha')=>{const p=current();if(!p||request.current)return Promise.resolve();const next={...value,...patch};if(layerBlendProblem(next,modes,spaces)||JSON.stringify(next)===JSON.stringify(value))return Promise.resolve();const token=Symbol();request.current=token;return action.run(kind,signal=>p.onCommit(next,{kind},signal)).then(()=>{}).finally(()=>{if(request.current===token)request.current=null;});};
 const problem=layerBlendProblem(value,modes,spaces),space=spaces.find(space=>space.id===value.spaceId)!;
 return <View key={owner} {...rest} {...{className:joinClasses(className)}} style={[{gap:8},style]}>
  <Text {...{className:joinClasses(!unstyled&&'text-text')}}>Layer blend mode</Text>
  <MenuButton label="Layer blend mode" editScope={JSON.stringify([scope,revision,layerId,'mode'])} accessibilityValue={{text:modes.find(mode=>mode.id===value.mode)!.label}} items={modes.map(mode=>({id:mode.id,label:mode.label,...(mode.unavailableReason?{description:mode.unavailableReason}:{}),disabled:!!mode.unavailableReason||!!space.unavailableReason||!space.modeIds.includes(mode.id)}))} disabled={disabled||pending} unstyled={unstyled} onSelect={mode=>{if(modes.some(item=>item.id===mode))void commit({mode},'mode');}}><Text {...{className:joinClasses(!unstyled&&'text-text')}}>{modes.find(mode=>mode.id===value.mode)!.label}</Text></MenuButton>
  <PrecisionScrubber key={JSON.stringify([value.mode,value.spaceId,value.alphaMode])} scope={layerId} revision={revision} label="Layer opacity" value={value.opacity*100} min={0} max={100} step={.0001} detents={[0,25,50,75,100]} unit="%" disabled={disabled||pending||!!problem} unstyled={unstyled} onPreview={percent=>{const p=current();if(p&&!problem)p.onPreview?.({...value,opacity:layerOpacityFromPercent(percent)});}} onCommit={percent=>commit({opacity:layerOpacityFromPercent(percent)},'opacity')}/>
  <Text {...{className:joinClasses(!unstyled&&'text-text')}}>Layer compositing space</Text>
  <MenuButton label="Layer compositing space" editScope={JSON.stringify([scope,revision,layerId,'space'])} accessibilityValue={{text:space.label+' ('+space.transfer+')'}} items={spaces.map(item=>({id:item.id,label:item.label+' ('+item.transfer+')',...(item.unavailableReason?{description:item.unavailableReason}:{}),disabled:!!item.unavailableReason||!item.modeIds.includes(value.mode)}))} disabled={disabled||pending} unstyled={unstyled} onSelect={spaceId=>{if(spaces.some(item=>item.id===spaceId))void commit({spaceId},'space');}}><Text {...{className:joinClasses(!unstyled&&'text-text')}}>{space.label+' ('+space.transfer+')'}</Text></MenuButton>
  <Text {...{className:joinClasses(!unstyled&&'text-text')}}>Layer alpha representation</Text>
  <MenuButton label="Layer alpha representation" editScope={JSON.stringify([scope,revision,layerId,'alpha'])} accessibilityValue={{text:value.alphaMode==='straight'?'Straight alpha':'Premultiplied alpha'}} items={[{id:'straight',label:'Straight alpha'},{id:'premultiplied',label:'Premultiplied alpha'}]} disabled={disabled||pending||!!problem} unstyled={unstyled} onSelect={alphaMode=>{if(alphaMode==='straight'||alphaMode==='premultiplied')void commit({alphaMode:alphaMode as LayerAlphaMode},'alpha');}}><Text {...{className:joinClasses(!unstyled&&'text-text')}}>{value.alphaMode==='straight'?'Straight alpha':'Premultiplied alpha'}</Text></MenuButton>
  <Text {...{className:joinClasses(!unstyled&&'text-text-muted')}}>{space.transfer==='linear'?'Blend calculations use the host’s named linear space.':'Blend calculations use the host’s named encoded space.'} Changing this policy requests a compositor update; the document color profile stays host-owned.</Text>
  {problem?<Text accessibilityRole="alert" {...{className:joinClasses(!unstyled&&'text-text')}}>{problem}</Text>:null}
  {pending?<Text accessibilityLiveRegion="polite" {...{className:joinClasses(!unstyled&&'text-text-muted')}}>Updating layer compositing</Text>:null}<ErrorMessage {...(action.error?{message:action.error}:{})} unstyled={unstyled}/>
 </View>;
}
