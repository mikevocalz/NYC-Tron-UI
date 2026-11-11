import { Button, Text, View } from "react-native";
import { useStore } from "zustand";
import { WindowsDragSource, WindowsDropTarget } from "@nyc-tron/windows-fluent-fabric/drag-drop";
import { nativeDrag, dragPayload, approveNativeDrop, completeNativeDrag, resolveDelayedApproval } from "./drag-store";
import { desktop, getNativeHost, failDesktop } from "./desktop-store";

export function NativeDragStatus() {
  const state = useStore(nativeDrag);
  return <View style={{ gap: 8 }}>
    <Text accessibilityLiveRegion="polite">{state.status}</Text>
    <Text>Document owner: {state.owner}</Text>
    <Text>Authorized transfers: {state.transfers}</Text>
    <Text>Completed native drags: {state.attempts}</Text>
  </View>;
}
export function NativeDragSourcePanel() {
  const state = useStore(desktop), drag = useStore(nativeDrag), host = getNativeHost();
  return <View style={{ gap: 12 }}>
    <Text accessibilityRole="header">Native cross-window drag acceptance</Text>
    <NativeDragStatus/>
    <Text>Native drag phase: {state.windows.drag?.phase ?? "idle"}</Text>
    {state.ready && host?.snapshot().windows.some(w => w.id === "main") && <WindowsDragSource host={host} scopeId="shared-draft" windowId="main" label="Drag shared native draft" payload={dragPayload}
      onCompleted={completeNativeDrag} onError={failDesktop}/>}
    <Text>Native drop policy: {drag.mode}</Text>
    <Button title="Reject native drops" accessibilityLabel="Reject native drops" onPress={() => nativeDrag.setState({ mode: "reject" })}/>
    <Button title="Accept native drops" accessibilityLabel="Accept native drops" onPress={() => nativeDrag.setState({ mode: "accept" })}/>
    <Button title="Delay native drop approval" accessibilityLabel="Delay native drop approval" onPress={() => nativeDrag.setState({ mode: "delay" })}/>
    <Button title="Resolve delayed native approval" accessibilityLabel="Resolve delayed native approval" onPress={resolveDelayedApproval}/>
  </View>;
}
export function NativeDragTargetPanel({ windowId }: { windowId: string }) {
  const state = useStore(desktop), host = getNativeHost();
  return <View style={{ gap: 12 }}>
    {state.ready && host?.snapshot().windows.some(w => w.id === windowId) && <WindowsDropTarget host={host} scopeId="shared-draft-target" windowId={windowId} label="Drop shared native draft" approve={approveNativeDrop} onError={failDesktop}/>}
    <NativeDragStatus/>
  </View>;
}
