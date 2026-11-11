import {createContext} from 'react';
import type {PanGesture,PinchGesture} from 'react-native-gesture-handler';
/** Native gesture handles stay in React context, outside serialized document state. */
export const CanvasGestureRelations=createContext<{gestures:Array<PanGesture|PinchGesture>;onePointerPan:boolean}>({gestures:[],onePointerPan:false});
