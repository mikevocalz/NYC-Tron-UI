import { useLayoutEffect, useMemo } from "react";
import { Platform } from "react-native";
import { nativeIsRTL } from "./native-direction.ts";
import NativeAnchor from "./TronOverlayAnchorNativeComponent.ts";
import { createOverlayBinding, newOverlayScopeToken } from "./overlay-binding.ts";
import { validateOverlayItems, validateInspectorFields } from "./overlay-model.ts";
import type { WindowsOverlayAnchorProps, WindowsMenuProps, WindowsPopoverProps, WindowsTooltipProps } from "./overlay-types.ts";
export type * from "./overlay-types.ts";

function useAnchor<P extends WindowsOverlayAnchorProps>(props: P) {
  if (Platform.OS !== "windows") throw new Error("Native WinUI overlays require RNW 0.85 Fabric");
  if (typeof props.scopeId !== "string" || !props.scopeId.trim() || props.scopeId.length > 1024) throw new TypeError("A native overlay needs a bounded document or selection scopeId");
  if (typeof props.label !== "string" || !props.label.trim() || props.label.length > 1024) throw new TypeError("A native overlay anchor needs a bounded accessible label");
  if (props.tooltip !== undefined && (typeof props.tooltip !== "string" || props.tooltip.length > 4096)) throw new TypeError("Native tooltip text exceeds its budget");
  const scopeToken = useMemo(newOverlayScopeToken, [props.scopeId]);
  const binding = useMemo(() => createOverlayBinding<P>(), []);
  useLayoutEffect(() => binding.commit(scopeToken, props), [binding, scopeToken, props]);
  return { binding, native: {
    scopeToken, label: props.label, disabled: props.disabled, tooltip: props.tooltip, theme: props.theme ?? "system", isRTL: nativeIsRTL(props.style),
    style: [{ width: 240, height: 40 }, props.style],
    onNativeError: (event: { nativeEvent: { scopeToken: string; message: string } }) => {
      const current = binding.current(event.nativeEvent.scopeToken, true); if (!current) return;
      const error = new Error("WinUI overlay: " + event.nativeEvent.message);
      if (current.onNativeError) current.onNativeError(error); else console.error(error);
    },
  } };
}
function Menu(props: WindowsMenuProps & { kind: "menu" | "context" }) {
  validateOverlayItems(props.items); const { native, binding } = useAnchor(props);
  return <NativeAnchor {...native} kind={props.kind} itemsJson={JSON.stringify(props.items)} fieldsJson="[]" actionsJson="[]"
    onAction={({ nativeEvent: event }) => { const current = binding.current(event.scopeToken); if (current?.items.some(i => i.id === event.id && !i.disabled)) current.onActionRequested(event.id); }}
    onOpenChanged={({ nativeEvent: event }) => binding.current(event.scopeToken)?.onOpenChanged?.(event.open)} />;
}
/** WinUI MenuFlyout, opened by the native Button's pointer or keyboard invoke. */
export function WindowsMenuButton(props: WindowsMenuProps) { return <Menu {...props} kind="menu" />; }
/** WinUI ContextFlyout: native right-click, Shift+F10 and Menu-key behavior. */
export function WindowsContextMenu(props: WindowsMenuProps) { return <Menu {...props} kind="context" />; }
/** An app-controlled WinUI Flyout with real native inspector fields and actions. */
export function WindowsPopover(props: WindowsPopoverProps) {
  const fields = props.fields ?? [], actions = props.actions ?? [];
  validateInspectorFields(fields); validateOverlayItems(actions); const { native, binding } = useAnchor(props);
  if (typeof props.title !== "string" || props.title.length > 1024 || (props.description !== undefined && (typeof props.description !== "string" || props.description.length > 8192))) throw new TypeError("Native popover text exceeds its budget");
  return <NativeAnchor {...native} kind="popover" itemsJson="[]" fieldsJson={JSON.stringify(fields)} actionsJson={JSON.stringify(actions)}
    title={props.title} description={props.description} open={props.open}
    onOpenChanged={({ nativeEvent: event }) => { const current = binding.current(event.scopeToken); if (current && event.open !== current.open) current.onOpenRequested(event.open); }}
    onAction={({ nativeEvent: event }) => { const current = binding.current(event.scopeToken); if (current?.actions?.some(i => i.id === event.id && !i.disabled)) current.onActionRequested?.(event.id); }}
    onFieldChanged={({ nativeEvent: event }) => {
      const current = binding.current(event.scopeToken), field = current?.fields?.find(f => f.id === event.id && !f.readOnly);
      if (current && field && Number.isInteger(event.eventCount) && event.eventCount > (field.acknowledgedEventCount ?? 0) && event.eventCount <= 2147483647 && event.value.length <= 4096)
        current.onFieldChangeRequested?.({ scopeId: current.scopeId, id: event.id, value: event.value, eventCount: event.eventCount });
    }} />;
}
/** Anchored inspectors share the same native Flyout and app-owned edit contract. */
export const WindowsInspector = WindowsPopover;
/** Real WinUI ToolTipService attached to a native, keyboard-focusable Button. */
export function WindowsTooltip(props: WindowsTooltipProps) {
  const { native, binding } = useAnchor(props);
  return <NativeAnchor {...native} kind="tooltip" itemsJson="[]" fieldsJson="[]" actionsJson="[]"
    onAction={({ nativeEvent: event }) => { if (event.id === "anchor") binding.current(event.scopeToken)?.onPress?.(); }} />;
}
