import {useLayoutEffect,useRef} from 'react';
import {GestureDetector,useCompetingGestures,usePanGesture,useTapGesture} from 'react-native-gesture-handler';
import type {DragTransportProps} from './drag-transport.ts';
/** RNGH 3 native recognizers; value ownership remains in the caller. Requires GestureHandlerRootView. */
export function GestureHandlerDrag(props:DragTransportProps){
 const active=useRef(false),latest=useRef(props);useLayoutEffect(()=>{latest.current=props;});
 const cancel=()=>{if(active.current){active.current=false;latest.current.onCancel();}};
 useLayoutEffect(()=>{if(props.disabled)cancel();},[props.disabled]);useLayoutEffect(()=>cancel,[]);
 const pan=usePanGesture({enabled:!props.disabled,runOnJS:true,minDistance:0,maxPointers:1,
 onActivate:e=>{if(latest.current.disabled)return;active.current=true;latest.current.onBegin({x:e.absoluteX,y:e.absoluteY});},
 onUpdate:e=>{if(active.current)latest.current.onMove({x:e.absoluteX,y:e.absoluteY},e.numberOfPointers);},onTouchesDown:e=>{if(e.numberOfTouches!==1)cancel();},
 onDeactivate:e=>{if(e.canceled){cancel();return;}if(!active.current)return;active.current=false;latest.current.onRelease({x:e.absoluteX,y:e.absoluteY});},onFinalize:e=>{if(e.canceled)cancel();}});
 const tap=useTapGesture({enabled:!props.disabled,runOnJS:true,maxDistance:4,onActivate:e=>{if(latest.current.disabled)return;const point={x:e.absoluteX,y:e.absoluteY};latest.current.onBegin(point);latest.current.onRelease(point);}}),gesture=useCompetingGestures(pan,tap);
 return <GestureDetector gesture={gesture}>{props.children}</GestureDetector>;
}
