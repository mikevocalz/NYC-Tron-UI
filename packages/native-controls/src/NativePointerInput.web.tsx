import {useEffect, useRef, type ComponentRef} from 'react';
import {View} from 'react-native';
import type {NativePointerInputProps} from './NativePointerInput.types.js';
import type {PointerBatch, PointerSample, PointerKeyEvent} from './pointer-input.js';
export type {NativePointerInputProps} from './NativePointerInput.types.js';

/** Browser Pointer Events adapter. The surface is RNW; native DOM listeners preserve event history. */
export function NativePointerInput({width,height,label,onBatch,onKey}: NativePointerInputProps) {
  const host = useRef<ComponentRef<typeof View>>(null);
  const callbacks = useRef({onBatch,onKey});
  callbacks.current = {onBatch,onKey};
  useEffect(() => {
    const node = host.current as unknown as HTMLElement;
    const previousTouchAction = node.style.touchAction;
    node.style.touchAction = 'none';
    const active = new Map<number, PointerSample>();
    const hovering = new Map<number, PointerSample>();
    const heldKeys = new Map<string, PointerKeyEvent>();
    function sample(event: PointerEvent): PointerSample {
      const bounds = node.getBoundingClientRect();
      return {pointerId:event.pointerId, kind:event.pointerType === 'pen' ? 'pen' : event.pointerType === 'touch' ? 'touch' : 'mouse', x:event.clientX-bounds.left, y:event.clientY-bounds.top, timestampMs:event.timeStamp, pressure:event.pointerType === 'pen' || event.pointerType === 'touch' ? event.pressure : null, tiltX:event.pointerType === 'pen' ? event.tiltX : null, tiltY:event.pointerType === 'pen' ? event.tiltY : null, buttons:event.buttons};
    }
    function handle(event: PointerEvent) {
      const point = sample(event);
      let phase: PointerBatch['phase'];
      if (event.type === 'pointerdown') { phase='down'; active.set(event.pointerId,point); node.setPointerCapture(event.pointerId); node.focus({preventScroll:true}); }
      else if (event.type === 'pointerup') phase='up';
      else if (event.type === 'pointercancel' || event.type === 'lostpointercapture') { if (!active.has(event.pointerId)) return; phase='cancel'; }
      else if (event.type === 'pointerleave') {
        // Non-hovering pointers also leave after release. End only a hover
        // that this adapter observed, preserving the terminal contact event.
        if (active.has(event.pointerId) || !hovering.has(event.pointerId)) return;
        phase='hover-exit';
      }
      else phase=active.has(event.pointerId) ? 'move' : 'hover';
      if (phase === 'up' || phase === 'cancel') active.delete(event.pointerId);
      else if (phase === 'move') active.set(event.pointerId,point);
      if (phase === 'hover') hovering.set(point.pointerId,point);
      else if (phase === 'hover-exit') hovering.delete(point.pointerId);
      const history = phase === 'move' ? event.getCoalescedEvents?.() ?? [] : [];
      const samples = history.length ? history.map(sample) : [point];
      if (history.length && (history.at(-1)!.timeStamp !== event.timeStamp || history.at(-1)!.clientX !== event.clientX || history.at(-1)!.clientY !== event.clientY)) samples.push(point);
      const predicted = phase === 'move' ? (event.getPredictedEvents?.() ?? []).map(sample) : [];
      callbacks.current.onBatch({phase,samples,predicted});
    }
    function key(event: KeyboardEvent) { const value:PointerKeyEvent={phase:event.type==='keydown'?'down':'up',key:event.key,code:event.code,shift:event.shiftKey,alt:event.altKey,control:event.ctrlKey,meta:event.metaKey,repeat:event.repeat}; if(value.phase==='down')heldKeys.set(value.code,value);else heldKeys.delete(value.code); callbacks.current.onKey?.(value); }
    function cancel() {
      const pending=[...active.values()], previousHover=[...hovering.values()], keys=[...heldKeys.values()];
      active.clear();hovering.clear();heldKeys.clear();
      for (const point of pending) callbacks.current.onBatch({phase:'cancel',samples:[point],predicted:[]});
      for (const point of previousHover) callbacks.current.onBatch({phase:'hover-exit',samples:[point],predicted:[]});
      for (const value of keys) callbacks.current.onKey?.({...value,phase:'up',repeat:false});
    }
    const events = ['pointerdown','pointermove','pointerup','pointercancel','pointerleave','lostpointercapture'] as const;
    events.forEach(type => node.addEventListener(type,handle));
    node.addEventListener('keydown',key); node.addEventListener('keyup',key); node.addEventListener('blur',cancel);
    window.addEventListener('blur',cancel);
    return () => { events.forEach(type => node.removeEventListener(type,handle)); node.removeEventListener('keydown',key); node.removeEventListener('keyup',key); node.removeEventListener('blur',cancel); window.removeEventListener('blur',cancel); node.style.touchAction=previousTouchAction; cancel(); };
  }, []);
  if (![width,height].every(value => Number.isFinite(value) && value > 0 && value <= 16384) || !label.trim()) throw new RangeError('NativePointerInput needs positive dimensions up to 16384 and an accessible label.');
  return <View ref={host} accessibilityLabel={label} focusable tabIndex={0} style={{width,height}}/>;
}
