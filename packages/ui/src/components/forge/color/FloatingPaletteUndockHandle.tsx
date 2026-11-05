import {useRef} from "react";
import {View,type ViewProps} from "react-native";
import {DragGrabHandle} from "../../DragGrabHandle.tsx";
import {keyboardKey,type KeyEventLike} from "../../gestures/drag-transport.ts";
import {joinClasses} from "../../styles.ts";
import {nudgePalette,placeFloatingPalette,shouldUndock,type PalettePosition,type PaletteRect} from "./floating-palette.ts";

/** Props for {@linkcode FloatingPaletteUndockHandle}. */
export interface FloatingPaletteUndockHandleProps extends Omit<ViewProps,"children"> {
  readonly docked:boolean;
  /** The palette's current top-left in the host's coordinates: its docked spot, or its floating position. */
  readonly origin:PalettePosition;
  /** The palette's size, for keeping it on screen. */
  readonly size:{readonly width:number;readonly height:number};
  /** Area the floating palette must stay inside, in the same coordinates as `origin`. */
  readonly bounds:PaletteRect;
  /** Hinges, folds and cutouts the palette must not cover. */
  readonly obstacles?:readonly PaletteRect[];
  /** Where to draw the palette during a drag; `undefined` when the drag ends or is cancelled. */
  readonly onPreview:(position:PalettePosition|undefined)=>void;
  /** A docked palette was dragged past the undock distance and released. One commit. */
  readonly onUndock:(position:PalettePosition)=>void;
  /** A floating palette was dragged or nudged to a new spot. One commit per release or key press. */
  readonly onMove:(position:PalettePosition)=>void;
  /** Enter, Space or the screen-reader action on a floating palette. */
  readonly onDock:()=>void;
  /** @default "Color palette" */
  readonly label?:string;
  readonly disabled?:boolean;
  unstyled?:boolean;
}

/**
 * Grip that undocks, moves and re-docks a palette (B-28), built on
 * `DragGrabHandle`. Docked, nothing moves until the drag passes 30 units, so a
 * tap or a short slip does not tear the palette off; past that the preview
 * follows the pointer and release undocks it. Floating, the drag moves it and
 * release commits once. Positions are clamped to `bounds` and kept off
 * `obstacles` on every preview and commit. Escape cancels a drag. With
 * keyboard focus, Enter or Space toggles docking and the arrow keys move a
 * floating palette 8 units (Page Up/Down 32).
 */
export function FloatingPaletteUndockHandle({
  docked,origin,size,bounds,obstacles=[],onPreview,onUndock,onMove,onDock,label="Color palette",
  disabled=false,unstyled=false,style,...rest
}:FloatingPaletteUndockHandleProps){
  const drag=useRef<{start?:{x:number;y:number};armed:boolean;at?:PalettePosition}>({armed:false});
  const place=(p:PalettePosition)=>placeFloatingPalette(p,size,bounds,obstacles).position;
  const undockHere=()=>onUndock(place({x:origin.x,y:origin.y+8}));
  const onKeyDown=(event:KeyEventLike)=>{
    const key=keyboardKey(event);
    if(disabled)return;
    if(key==="Enter"||key===" "){
      (event as {preventDefault?:()=>void}).preventDefault?.();
      if(docked)undockHere();else onDock();
      return;
    }
    if(docked)return;
    const next=nudgePalette(origin,key);
    if(!next)return;
    (event as {preventDefault?:()=>void}).preventDefault?.();
    const placed=place(next);
    if(placed.x!==origin.x||placed.y!==origin.y)onMove(placed);
  };
  return <View {...{onKeyDown,focusable:!disabled,
      className:joinClasses(!unstyled&&"rounded-control focus-visible:ring-2 focus-visible:ring-focus")}}
    style={[{alignSelf:"center"},style]} {...rest}>
    <DragGrabHandle label={docked?`Undock ${label.toLowerCase()}`:`Move ${label.toLowerCase()}`}
      disabled={disabled} unstyled={unstyled}
      accessibilityActions={docked?[{name:"activate",label:"Undock"}]:[{name:"activate",label:"Dock"}]}
      onAccessibilityAction={e=>{if(e.nativeEvent.actionName==="activate"){if(docked)undockHere();else onDock();}}}
      onStart={()=>{drag.current={armed:!docked};}}
      onMove={p=>{
        const d=drag.current;
        if(!d.start){d.start=p;return;}
        const dx=p.x-d.start.x,dy=p.y-d.start.y;
        if(!d.armed&&shouldUndock(dx,dy))d.armed=true;
        if(!d.armed)return;
        d.at=place({x:origin.x+dx,y:origin.y+dy});
        onPreview(d.at);
      }}
      onCommit={()=>{
        const d=drag.current;
        drag.current={armed:false};
        onPreview(undefined);
        if(!d.armed||!d.at)return;
        if(docked)onUndock(d.at);
        else if(d.at.x!==origin.x||d.at.y!==origin.y)onMove(d.at);
      }}
      onCancel={()=>{drag.current={armed:false};onPreview(undefined);}}
      style={{minWidth:88}}/>
  </View>;
}
