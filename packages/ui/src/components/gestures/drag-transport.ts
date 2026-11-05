import type {ComponentType,ReactElement} from "react";

/** A point in page (web) or absolute window (native) coordinates. */
export interface DragPoint {
  x:number;
  y:number;
}
/**
 * Props every drag transport receives. A transport recognises one-pointer drags on
 * its single child and reports them; it owns no value and never commits anything.
 * @see {@linkcode PanResponderDrag}
 * @see {@linkcode GestureHandlerDrag}
 */
export interface DragTransportProps {
  /** One host view. The transport attaches handlers without replacing it. */
  children:ReactElement;
  disabled?:boolean;
  onBegin:(point:DragPoint)=>void;
  /** `touches` is the active pointer count; callers cancel when it is not 1. */
  onMove:(point:DragPoint,touches:number)=>void;
  onRelease:(point:DragPoint)=>void;
  /** Interruption, termination, a second pointer or a failed recognizer. */
  onCancel:()=>void;
}
/** A component that turns pointer input into {@linkcode DragTransportProps} callbacks. */
export type DragTransport=ComponentType<DragTransportProps>;

/** Keyboard event shape shared by React Native Web (`key`) and native (`nativeEvent.key`). */
export interface KeyEventLike {
  readonly key?:string;
  readonly nativeEvent?:{readonly key?:string};
}
/** Read the key name from a web or native keyboard event. */
export function keyboardKey(event:KeyEventLike):string|undefined {
  return event.key ?? event.nativeEvent?.key;
}
