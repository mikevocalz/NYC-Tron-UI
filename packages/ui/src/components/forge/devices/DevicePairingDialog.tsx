import type { ReactNode } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Button } from "../../Button.tsx";
import { joinClasses } from "../../styles.ts";
import {
  presentPairing, signalLabel, type PairingAction, type PairingDevice, type PairingState,
} from "./pairing-model.ts";

/** Coarse phase handed to {@linkcode DevicePairingDialogProps.renderStatusArt}. */
export type PairingArtPhase = "idle" | "searching" | "connecting" | "connected" | "error";

/** Props for {@linkcode DevicePairingDialog}. */
export interface DevicePairingDialogProps {
  readonly visible: boolean;
  /** Pairing phase, mapped by the app from its own transport controller. */
  readonly state: PairingState;
  /** Start (or restart) discovery. */
  readonly onScan: () => void;
  /** The user picked a found device. */
  readonly onSelect: (deviceId: string) => void;
  /**
   * Stop scanning or connecting, or close before a connection exists. The
   * dialog also calls this for the system back gesture and the close button
   * in every state except `connected`.
   */
  readonly onCancel: () => void;
  /** Retry after an error. */
  readonly onRetry: () => void;
  /**
   * Close after a successful connection. Closing a connected dialog is not a
   * disconnect, so it never calls `onCancel`.
   */
  readonly onDone: () => void;
  /** Open system settings for permission or radio errors. */
  readonly onOpenSettings?: () => void;
  /** @default "Connect a device" */
  readonly title?: string;
  /** Lowercase noun used in copy, e.g. "pen" or "controller". @default "device" */
  readonly deviceNoun?: string;
  /**
   * Status illustration, e.g. a Rive state machine. Show `connected` only for
   * a verified link: the app decides what verified means.
   */
  readonly renderStatusArt?: (phase: PairingArtPhase) => ReactNode;
  className?: string;
  unstyled?: boolean;
  testID?: string;
}

function artPhase(state: PairingState): PairingArtPhase {
  switch (state.kind) {
    case "idle": return "idle";
    case "scanning": return "searching";
    case "found": return state.devices.length ? "idle" : "error";
    case "connecting": return "connecting";
    case "connected": return "connected";
    case "error": return "error";
  }
}

function DeviceRow({ device, disabled, onPress, styled }: {
  readonly device: PairingDevice; readonly disabled: boolean; readonly onPress: () => void; readonly styled: boolean;
}) {
  const secondary = [device.detail, device.signalDbm === undefined ? undefined : signalLabel(device.signalDbm)]
    .filter(Boolean).join(" · ");
  return <Pressable
    accessibilityRole="button"
    accessibilityLabel={"Connect to " + device.name}
    {...(secondary ? { accessibilityHint: secondary } : {})}
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    {...{ className: joinClasses("min-h-14 justify-center px-3 py-2",
      styled && "rounded-control border border-border bg-surface-sunken active:opacity-80 focus-visible:ring-2 focus-visible:ring-focus",
      disabled && "opacity-50") }}
  >
    <Text {...{ className: joinClasses(styled && "font-semibold text-text") }}>{device.name}</Text>
    {secondary ? <Text {...{ className: joinClasses(styled && "text-sm text-text-muted") }}>{secondary}</Text> : null}
  </Pressable>;
}

/**
 * Transport-agnostic pairing dialog over a controlled {@linkcode PairingState}.
 * Every state has copy and a recovery path: no device found offers a new
 * search, permission and radio errors offer Settings when `onOpenSettings`
 * is set, and every error offers retry. No Bluetooth or network code here.
 */
export function DevicePairingDialog({
  visible, state, onScan, onSelect, onCancel, onRetry, onDone, onOpenSettings,
  title = "Connect a device", deviceNoun = "device", renderStatusArt,
  className, unstyled = false, testID,
}: DevicePairingDialogProps) {
  const styled = !unstyled;
  const view = presentPairing(state, deviceNoun, onOpenSettings !== undefined);
  const close = state.kind === "connected" ? onDone : onCancel;
  const handlers: Record<PairingAction, (() => void) | undefined> = {
    scan: onScan, rescan: onScan, cancel: onCancel, retry: onRetry, "open-settings": onOpenSettings, done: onDone,
  };
  const phase = artPhase(state);
  const art = renderStatusArt?.(phase);
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.5)" }}>
      <View
        accessibilityViewIsModal
        {...(testID ? { testID } : {})}
        {...{ className: joinClasses("w-full gap-4 p-5", styled && "rounded-control border border-border bg-surface-raised", className) }}
        style={{ maxWidth: 480, maxHeight: "90%" }}
      >
        <View {...{ className: "flex-row items-center gap-3" }}>
          <Text accessibilityRole="header" {...{ className: joinClasses("flex-1", styled && "text-lg font-semibold text-text") }}>{title}</Text>
          <Button
            title="Close"
            variant="ghost"
            accessibilityLabel={state.kind === "connected" ? "Close" : "Cancel and close"}
            onPress={close}
            {...(testID ? { testID: testID + "-close" } : {})}
          />
        </View>
        {art !== undefined && art !== null ? <View
          accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
          {...{ className: "items-center justify-center" }} style={{ minHeight: 96 }}
        >{art}</View> : view.isBusy ? <ActivityIndicator accessibilityElementsHidden importantForAccessibility="no" size="large" /> : null}
        <Text
          accessibilityLiveRegion="polite"
          {...{ className: joinClasses(styled && (view.isProblem ? "text-danger" : "text-text")) }}
        >{view.body}</Text>
        {view.devices && view.devices.length ? <ScrollView
          accessibilityLabel={"Found " + view.devices.length + (view.devices.length === 1 ? " device" : " devices")}
          style={{ maxHeight: 240 }}
          contentContainerStyle={{ gap: 8 }}
        >{view.devices.map(device => <DeviceRow
          key={device.id}
          device={device}
          styled={styled}
          disabled={state.kind !== "found" && state.kind !== "scanning"}
          onPress={() => onSelect(device.id)}
        />)}</ScrollView> : null}
        {view.primary || view.secondary ? <View {...{ className: "gap-2" }}>
          {view.primary ? <Button
            title={view.primary.label}
            disabled={handlers[view.primary.kind] === undefined}
            onPress={handlers[view.primary.kind]}
            {...(testID ? { testID: testID + "-primary" } : {})}
          /> : null}
          {view.secondary ? <Button
            title={view.secondary.label}
            variant="secondary"
            disabled={handlers[view.secondary.kind] === undefined}
            onPress={handlers[view.secondary.kind]}
            {...(testID ? { testID: testID + "-secondary" } : {})}
          /> : null}
        </View> : null}
      </View>
    </View>
  </Modal>;
}
