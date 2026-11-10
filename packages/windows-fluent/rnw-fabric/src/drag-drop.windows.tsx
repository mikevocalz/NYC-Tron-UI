import { useLayoutEffect, useMemo, useRef } from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";
import type { DragOffer } from "@nyc-tron/core/window-lifecycle";
import NativeSurface from "./TronDragSurfaceNativeComponent.ts";
import type { WindowsWindowHost, WindowsNativeDragResult } from "./window-types.ts";
import { createOverlayBinding, newOverlayScopeToken } from "./overlay-binding.ts";

interface SurfaceProps {
  /** Document/selection identity; replacing it cancels outstanding native offers. */
  readonly scopeId: string;
  readonly host: WindowsWindowHost;
  readonly windowId: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly onError?: (error: Error) => void;
}
export interface WindowsDragSourceProps extends SurfaceProps {
  /** Opaque app-owned reference; never serialized into a native DataPackage. */
  readonly payload: unknown;
  readonly onCompleted: (result: WindowsNativeDragResult) => void;
}
export interface WindowsDropTargetProps extends SurfaceProps {
  /** Decide only. The source's completed transfer is the authorization to apply a document move. */
  readonly approve: (offer: DragOffer) => boolean | Promise<boolean>;
}
function useSurface<P extends SurfaceProps>(props: P) {
  if (Platform.OS !== "windows") throw new Error("Native WinUI drag surfaces require RNW 0.85 Fabric");
  const snapshot = props.host.snapshot(), window = snapshot.windows.find(w => w.id === props.windowId);
  if (!window || typeof props.label !== "string" || !props.label.trim() || props.label.length > 1024 || typeof props.scopeId !== "string" || !props.scopeId.trim() || props.scopeId.length > 1024) throw new Error("Native drag surfaces require an observed window, accessible label and document scope");
  const scopeToken = useMemo(newOverlayScopeToken, [props.scopeId, props.host, props.windowId, window.generation]);
  const binding = useMemo(() => createOverlayBinding<P>(), []);
  useLayoutEffect(() => binding.commit(scopeToken, props), [binding, scopeToken, props]);
  const report = (error: unknown) => { const value = error instanceof Error ? error : new Error(String(error)); if (props.onError) props.onError(value); else console.error(value); };
  return { binding, native: { scopeToken, ownerToken: snapshot.ownerToken, windowId: window.id, generation: window.generation, label: props.label,
    disabled: props.disabled || window.status === "minimized", style: [{ width: 260, height: 56 }, props.style],
    onNativeError: (event: { nativeEvent: { message: string } }) => report(new Error(event.nativeEvent.message)) }, report };
}
/** A real WinUI CanDrag source; pointer movement starts the OS gesture, never a JS simulation. */
export function WindowsDragSource(props: WindowsDragSourceProps) {
  const { native, report, binding } = useSurface(props);
  return <NativeSurface {...native} dragRole="source" onDragStarting={event => {
    const scope = event.nativeEvent.scopeToken, current = binding.current(scope); if (!current) return;
    void current.host.startNativeDrag(event.nativeEvent.requestId, current.windowId, current.payload)
      .then(result => binding.current(scope)?.onCompleted(result)).catch(report);
  }} />;
}
/** Native AllowDrop/DragEventArgs deferral; one live target policy per observed window. */
export function WindowsDropTarget(props: WindowsDropTargetProps) {
  const { native } = useSurface(props), callback = useRef(props.approve);
  useLayoutEffect(() => { callback.current = props.approve; }, [props.approve]);
  useLayoutEffect(() => {
    if (native.disabled) return;
    return props.host.bindNativeDropTarget(props.windowId, offer => callback.current(offer));
  }, [props.host, props.windowId, native.generation, native.disabled, native.scopeToken]);
  return <NativeSurface {...native} dragRole="target" />;
}
