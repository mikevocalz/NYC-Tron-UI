import {useEffect,useMemo,useRef} from "react";
import {Platform,Text,View,type ViewProps} from "react-native";
import {joinClasses} from "../../styles.ts";
import {useLocalStore} from "../../local-store.ts";
import {keyboardKey,type KeyEventLike} from "../../gestures/drag-transport.ts";
import {useLocalPointer} from "../../gestures/useLocalPointer.ts";
import {createValueGesture} from "../../gestures/value-gesture.ts";
import {assertHsv,hsvToRgb,rgbaToHex,wrapHue,type HsvColor} from "../color.ts";
import {ChannelTrack} from "./ChannelTrack.tsx";
import {discPointToHsv,hsvToDiscPoint} from "./wheel-geometry.ts";
import {HueSaturationDiscLayer} from "./wheel-layers.tsx";

/** Props for {@linkcode ColorDiscPicker}. */
export interface ColorDiscPickerProps extends Omit<ViewProps,"children"> {
  /** The committed color. Keep it as HSV in the host so grays keep their hue. */
  readonly value:HsvColor;
  /** Every drag move on the disc or the brightness track. */
  readonly onPreview?:(next:HsvColor)=>void;
  /** Once per drag release, key press or screen-reader action that changes the color. */
  readonly onCommit:(next:HsvColor)=>void;
  /** Largest disc diameter in layout units. @default 240 */
  readonly maxSize?:number;
  readonly disabled?:boolean;
  /** Brightness track runs right to left. @default I18nManager.isRTL */
  readonly rtl?:boolean;
  className?:string;
  unstyled?:boolean;
}

const NO_SELECT=(Platform.OS==="web"?{userSelect:"none",touchAction:"none"}:{}) as object;
const THUMB=28;
const same=(a:HsvColor,b:HsvColor)=>a.h===b.h&&a.s===b.s&&a.v===b.v&&a.alpha===b.alpha;
const r3=(n:number)=>Math.round(n*1000)/1000;

/**
 * Controlled hue/saturation disc with a brightness track (C-27): angle is hue,
 * distance from the center is saturation. Dragging through the gray center
 * keeps the previous hue instead of snapping to red, and brightness 0 keeps hue
 * and saturation, because the host stores HSV rather than re-deriving it from
 * RGB. Arrow keys: Left/Right turn the hue 5°, Up/Down change saturation by 5%.
 *
 * sRGB display preview only. A Display P3 or wider-gamut preview needs the
 * owning engine's color management and is not drawn here.
 */
export function ColorDiscPicker({
  value,onPreview,onCommit,maxSize=240,disabled=false,rtl,className,unstyled=false,testID,style,...rest
}:ColorDiscPickerProps){
  assertHsv(value);
  if(!Number.isFinite(maxSize)||maxSize<120||maxSize>800)throw new RangeError("maxSize must be 120..800");
  const [state,store]=useLocalStore(()=>({width:0,preview:undefined as HsvColor|undefined}));
  const latest=useRef({value,onPreview,onCommit,disabled});
  latest.current={value,onPreview,onCommit,disabled};
  const gesture=useMemo(()=>createValueGesture<HsvColor>({
    disabled:()=>latest.current.disabled,
    equals:same,
    preview:c=>{store.set(s=>({...s,preview:c}));latest.current.onPreview?.(c);},
    commit:c=>latest.current.onCommit(c),
  }),[store]);
  useEffect(()=>()=>gesture.cancel(),[gesture]);
  const size=Math.max(120,Math.min(maxSize,state.width||maxSize));
  const box={width:size,height:size};
  const at=(p:{x:number;y:number})=>{
    const next=discPointToHsv(p,box,latest.current.value);
    return {...next,h:Math.round(next.h*100)/100,s:r3(next.s)};
  };
  const end=()=>store.set(s=>({...s,preview:undefined}));
  const handlers=useLocalPointer({
    disabled,
    onBegin:p=>{gesture.begin(latest.current.value);gesture.update(at(p));},
    onMove:p=>gesture.update(at(p)),
    onRelease:()=>{gesture.release();end();},
    onCancel:()=>{gesture.cancel();end();},
  });
  const commit=(next:HsvColor)=>{if(!disabled&&!same(next,value))onCommit(next);};
  const hueBy=(d:number)=>commit({...value,h:wrapHue(Math.round((value.h+d)*100)/100)});
  const satBy=(d:number)=>commit({...value,s:r3(Math.max(0,Math.min(1,value.s+d)))});
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    if(key==="Escape"){if(gesture.active){gesture.cancel();end();}return;}
    if(key==="ArrowRight")hueBy(5);
    else if(key==="ArrowLeft")hueBy(-5);
    else if(key==="ArrowUp")satBy(0.05);
    else if(key==="ArrowDown")satBy(-0.05);
    else return;
    (event as {preventDefault?:()=>void}).preventDefault?.();
  };
  const shown=state.preview??value;
  const thumb=hsvToDiscPoint(shown,box);
  const sat=Math.round(shown.s*100);
  const hue=Math.round(wrapHue(shown.h))%360;
  const opaque=rgbaToHex(hsvToRgb({...shown,alpha:1}),false);
  const styled=!unstyled;
  return <View {...rest} testID={testID} {...{className:joinClasses("gap-2",className)}} style={style}
    onLayout={e=>store.set(s=>({...s,width:e.nativeEvent.layout.width}))}>
    <View {...handlers}
      {...{onKeyDown,focusable:!disabled,className:joinClasses(styled&&"focus-visible:ring-2 focus-visible:ring-focus")}}
      accessible accessibilityRole="adjustable" accessibilityLabel="Hue and saturation"
      accessibilityHint="Drag on the disc. Swipe up or down to change saturation; use the actions menu for hue."
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={sat}
      aria-valuetext={`Saturation ${sat} percent, hue ${hue} degrees, ${opaque}`}
      aria-disabled={disabled}
      accessibilityActions={[
        {name:"increment",label:"Increase saturation"},{name:"decrement",label:"Decrease saturation"},
        {name:"increaseHue",label:"Increase hue"},{name:"decreaseHue",label:"Decrease hue"},
      ]}
      onAccessibilityAction={e=>{
        const a=e.nativeEvent.actionName;
        if(a==="increment")satBy(0.05);
        else if(a==="decrement")satBy(-0.05);
        else if(a==="increaseHue")hueBy(5);
        else if(a==="decreaseHue")hueBy(-5);
      }}
      style={{width:size,height:size,borderRadius:size/2,alignSelf:"center",opacity:disabled?0.45:1,...NO_SELECT}}>
      <HueSaturationDiscLayer size={size} value={shown.v}/>
      <View pointerEvents="none" {...{className:joinClasses(styled&&"border-border")}}
        style={{position:"absolute",left:0,top:0,width:size,height:size,borderRadius:size/2,borderWidth:1}}/>
      <View pointerEvents="none" {...{className:joinClasses(styled&&"border-text")}}
        style={{position:"absolute",left:thumb.x-THUMB/2,top:thumb.y-THUMB/2,width:THUMB,height:THUMB,borderRadius:THUMB/2,
          borderWidth:2,alignItems:"center",justifyContent:"center"}}>
        <View {...{className:joinClasses(styled&&"border-surface-raised")}}
          style={{width:THUMB-4,height:THUMB-4,borderRadius:(THUMB-4)/2,borderWidth:2,backgroundColor:opaque}}/>
      </View>
    </View>
    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
      <Text {...{className:joinClasses(styled&&"text-text-muted text-sm")}} style={{fontVariant:["tabular-nums"]}}>
        {`Hue ${hue}°, saturation ${sat}%`}
      </Text>
      <Text selectable {...{className:joinClasses(styled&&"text-text-muted text-sm")}} style={{fontVariant:["tabular-nums"]}}>{opaque}</Text>
    </View>
    <ChannelTrack label="Brightness" value={shown.v} step={0.01} rtl={rtl} disabled={disabled} unstyled={unstyled}
      stops={[{r:0,g:0,b:0,alpha:1},hsvToRgb({h:shown.h,s:shown.s,v:1,alpha:1})]}
      valueText={v=>`Brightness ${Math.round(v*100)} percent`}
      thumbColor={v=>rgbaToHex(hsvToRgb({...shown,v,alpha:1}),false)}
      // A cancelled drag previews the start value; clear the preview then, or
      // it would mask the next committed value.
      onPreview={v=>{const c={...value,v};store.set(s=>({...s,preview:v===value.v?undefined:c}));onPreview?.(c);}}
      onCommit={v=>{end();commit({...value,v});}}
      {...(testID?{testID:testID+"-brightness"}:{})}/>
  </View>;
}
