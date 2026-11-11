import {useContext,useLayoutEffect,useMemo,useRef} from "react";
import {PanResponder,type GestureResponderEvent,type GestureResponderHandlers,type PanResponderGestureState,type PanResponderCallbacks} from "react-native";
import {localPointerConfig,type LocalPointerHandlers} from "./local-pointer.ts";
import {EditorInteractionScope} from './editor-interaction-scope.ts';

/**
 * Responder handlers for one view, built once and fed the latest callbacks on
 * every event. Spread the result on the view that defines the local coordinate
 * space; see {@linkcode localPointerConfig} for the `pointerEvents` rule.
 */
export function useLocalPointer(handlers:LocalPointerHandlers):GestureResponderHandlers{
  const scope=useContext(EditorInteractionScope);
  const latest=useRef(handlers);
  useLayoutEffect(()=>{latest.current=handlers;});
  const owner=useRef<{active:boolean;blocked:boolean;last:[GestureResponderEvent,PanResponderGestureState]|null}>({active:false,blocked:false,last:null});
  const config=useMemo<PanResponderCallbacks>(()=>localPointerConfig(latest),[]);
  const cancel=()=>{const s=owner.current;owner.current={active:false,blocked:true,last:null};if(s.active&&s.last)config.onPanResponderTerminate?.(...s.last);};
  useLayoutEffect(()=>{if(scope!==null)cancel();return()=>{if(scope!==null)cancel();};},[scope]);
  return useMemo(()=>PanResponder.create({
    ...config,
    onStartShouldSetPanResponder:(...args)=>{owner.current.blocked=false;return config.onStartShouldSetPanResponder?.(...args)??false;},
    onMoveShouldSetPanResponder:(...args)=>!owner.current.blocked&&(config.onMoveShouldSetPanResponder?.(...args)??false),
    onPanResponderGrant:(...args)=>{owner.current={active:true,blocked:false,last:args};config.onPanResponderGrant?.(...args);},
    onPanResponderMove:(...args)=>{if(!owner.current.active)return;owner.current.last=args;config.onPanResponderMove?.(...args);},
    onPanResponderRelease:(...args)=>{if(!owner.current.active)return;owner.current.active=false;owner.current.last=null;config.onPanResponderRelease?.(...args);},
    onPanResponderTerminate:(...args)=>{if(!owner.current.active)return;owner.current.active=false;owner.current.last=null;config.onPanResponderTerminate?.(...args);},
  }).panHandlers,[config]);
}
