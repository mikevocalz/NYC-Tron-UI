import {iconSizes,iconMotion} from "./tokens.js";
/** Pure presentation state; no React/native dependency, portable to web, iPad, phone and XR. */
export function resolveIconState(options={}){
  const {selected=false,disabled=false,loading=false,hovered=false,pressed=false,
    status="idle",size="default",color,selectedColor,disabledColor,
    successColor,errorColor,reducedMotion=false}=options;
  const pixels=typeof size==="number"?size:iconSizes[size];
  if(!Number.isFinite(pixels)||pixels<8||pixels>256)throw new RangeError("Forge icon size must be 8..256");
  const variant=selected?"filled":"outline";
  const state=disabled?"disabled":loading?"loading":status==="success"?"success":
    status==="error"?"error":status==="recording"?"recording":pressed?"pressed":
    selected?"selected":hovered?"hover":"idle";
  // No built-in palette: every role falls back to the base color, then to
  // currentColor. Use iconColorsFromTheme(theme.colors) for themed roles.
  const base=color??"currentColor";
  let resolvedColor=base;
  if(selected)resolvedColor=selectedColor??base;
  if(status==="success")resolvedColor=successColor??base;
  if(status==="error")resolvedColor=errorColor??base;
  if(disabled)resolvedColor=disabledColor??base;
  const durationMs=reducedMotion||disabled?0:
    selected?iconMotion.selectMs:iconMotion.deselectMs;
  return Object.freeze({state,variant,size:pixels,color:resolvedColor,
    opacity:disabled?0.52:1,animated:!reducedMotion&&!disabled,durationMs});
}
export function riveIconInputs(options={}){
 const state=resolveIconState(options);
 return Object.freeze({State:state.state,Selected:state.variant==="filled",
   Disabled:state.state==="disabled",Loading:state.state==="loading",
   ReduceMotion:Boolean(options.reducedMotion),Color:state.color});
}
