import {useContext,useLayoutEffect,useRef} from 'react';
import {usePanGesture} from 'react-native-gesture-handler';
import {CanvasGestureRelations} from '../forge/canvas/canvas-gesture-relations.ts';

/** RNGH 3 single-contact editing, composed with the containing canvas navigator. */
export function useEditorPan({disabled=false,boundary=0,onBegin,onMove,onRelease,onCancel}: {
 disabled?:boolean;boundary?:string|number;onBegin:()=>void;onMove:(dx:number,dy:number)=>void;onRelease:()=>void;onCancel:()=>void;
}){
 const relations=useContext(CanvasGestureRelations);
 const latest=useRef({onBegin,onMove,onRelease,onCancel});
 const session=useRef<{x:number;y:number;active:boolean}|null>(null);
 const rejected=useRef(false);
 useLayoutEffect(()=>{latest.current={onBegin,onMove,onRelease,onCancel};});
 const cancel=()=>{const s=session.current;session.current=null;if(s?.active)latest.current.onCancel();};
 useLayoutEffect(()=>{cancel();},[disabled,boundary]);
 useLayoutEffect(()=>()=>{cancel();},[]);
 return usePanGesture({enabled:!disabled,runOnJS:true,minDistance:0,maxPointers:1,simultaneousWith:relations.gestures,
  onBegin:event=>{rejected.current=event.numberOfPointers!==1;session.current={x:event.absoluteX,y:event.absoluteY,active:false};},
  onTouchesDown:event=>{if(event.numberOfTouches!==1){rejected.current=true;cancel();}},
  onActivate:()=>{const s=session.current;if(!s||rejected.current)return;s.active=true;latest.current.onBegin();},
  onUpdate:event=>{const s=session.current;if(s?.active&&!rejected.current)latest.current.onMove(event.absoluteX-s.x,event.absoluteY-s.y);},
  onTouchesUp:event=>{const s=session.current,touch=event.changedTouches[0];if(!s?.active||!touch||rejected.current)return;session.current=null;latest.current.onMove(touch.absoluteX-s.x,touch.absoluteY-s.y);latest.current.onRelease();},
  onTouchesCancel:()=>{rejected.current=true;cancel();},
  onDeactivate:event=>{const s=session.current;if(!s)return;if(event.canceled||rejected.current)cancel();else if(s.active){session.current=null;latest.current.onMove(event.absoluteX-s.x,event.absoluteY-s.y);latest.current.onRelease();}},
  onFinalize:()=>{cancel();},
 });
}
