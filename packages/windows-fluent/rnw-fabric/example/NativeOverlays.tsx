import { Button, Text, View } from "react-native";
import { useStore } from "zustand";
import { WindowsMenuButton, WindowsContextMenu, WindowsInspector, WindowsTooltip } from "@nyc-tron/windows-fluent-fabric/overlays";
import { overlays, requestInspectorEdit, requestInspectorOpen, inspectorAction, vetoNextInspectorDismissal } from "./overlay-store";
import { failDesktop } from "./desktop-store";

export function NativeOverlays({ mountKey }: { mountKey: number }) {
  const state = useStore(overlays);
  const common = { scopeId: state.scopeId, onNativeError: failDesktop };
  return <View style={{ gap: 12 }}>
    <Text accessibilityRole="header">Native overlay acceptance</Text>
    <Text accessibilityLiveRegion="polite">{state.menuStatus}</Text>
    <WindowsMenuButton {...common} label="Native command menu" items={[
      { id: "approve", label: "Approve native command", description: "Commit through the application" },
      { id: "unavailable", label: "Unavailable native command", disabled: true },
    ]} onActionRequested={id => overlays.setState({ menuStatus: `Native menu action: ${id}` })}/>
    <Text accessibilityLiveRegion="polite">{state.contextStatus}</Text>
    <WindowsContextMenu {...common} label="Native context anchor" items={[
      { id: "inspect", label: "Inspect native selection" },
    ]} onActionRequested={id => overlays.setState({ contextStatus: `Native context action: ${id}` })}/>
    <WindowsTooltip {...common} label="Native tooltip anchor" tooltip="Native tooltip details"/>
    <WindowsInspector {...common} label="Native inspector anchor" title="Native document inspector" description="Edits containing an exclamation mark are rejected by the application."
      open={state.open} disabled={state.disabled} fields={[
        { id: "note", label: "Native inspector note", value: state.value, acknowledgedEventCount: state.acknowledgedEventCount },
      ]} actions={[
        { id: "close", label: "Close native inspector" }, { id: "disable", label: "Disable native inspector" }, { id: "replace", label: "Replace inspector scope" },
      ]} onOpenRequested={requestInspectorOpen} onFieldChangeRequested={request => requestInspectorEdit(request, mountKey)} onActionRequested={inspectorAction}/>
    <Text accessibilityLiveRegion="polite">{state.status}</Text>
    <Text>Committed native note: {state.value}</Text>
    <Text>Native edit acknowledgment: {state.acknowledgedEventCount}</Text>
    <Text>Native inspector scope: {state.scopeId}</Text>
    <Button title="Enable native inspector" accessibilityLabel="Enable native inspector" onPress={() => overlays.setState({ disabled: false })}/>
    <Button title="Veto next inspector dismissal" accessibilityLabel="Veto next inspector dismissal" onPress={vetoNextInspectorDismissal}/>
  </View>;
}
