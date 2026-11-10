import { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { Button } from "@nyc-tron/ui/components/Button";
import { NativePointerInput } from "@nyc-tron/native-controls/NativePointerInput";
import { createPointerRouter, type PointerBatch, type PointerKeyEvent, type PointerRouter, type PointerSample } from "@nyc-tron/native-controls/pointer-input";

interface InputState {
  width: number;
  mounted: boolean;
  current: readonly PointerSample[];
  strokes: readonly (readonly PointerSample[])[];
  predicted: readonly PointerSample[];
  hover: PointerSample | null;
  lastBatch: PointerBatch | null;
  lastKey: PointerKeyEvent | null;
  lastStrokePhase: string | null;
  committed: number;
  cancelled: number;
}
const HEIGHT = 280;

/** Actual input acceptance surface shared by the native host and browser fixture. */
export function PointerInputDemo() {
  const local = useRef<StoreApi<InputState> | null>(null);
  local.current ??= createStore<InputState>(() => ({ width: 0, mounted: true, current: [], strokes: [], predicted: [], hover: null,
    lastBatch: null, lastKey: null, lastStrokePhase: null, committed: 0, cancelled: 0 }));
  const store = local.current;
  const state = useStore(store, value => value);
  const router = useRef<PointerRouter | null>(null);
  useEffect(() => {
    const owner = createPointerRouter({
      onStroke: stroke => store.setState(current => {
        if (stroke.phase === "down") return { current: stroke.samples, lastStrokePhase: "down" };
        if (stroke.phase === "move") return { current: [...current.current, ...stroke.samples].slice(-1200), lastStrokePhase: "move" };
        if (stroke.phase === "cancel") return { current: [], cancelled: current.cancelled + 1, lastStrokePhase: "cancel" };
        return { current: [], strokes: [...current.strokes, [...current.current, ...stroke.samples]].slice(-6), committed: current.committed + 1, lastStrokePhase: "up" };
      }),
      onPrediction: predicted => store.setState({ predicted }),
      onHover: hover => store.setState({ hover }),
      onKey: lastKey => { store.setState({ lastKey }); if (lastKey.phase === "down" && lastKey.key === "Escape") owner.cancel(); },
    });
    router.current = owner;
    return () => { owner.dispose(); if (router.current === owner) router.current = null; };
  }, [store]);
  const batch = (lastBatch: PointerBatch) => { store.setState({ lastBatch }); router.current?.handleBatch(lastBatch); };
  const point = state.lastBatch?.samples.at(-1);
  const observation = {
    phase: state.lastBatch?.phase ?? null, lastStrokePhase: state.lastStrokePhase,
    kind: point?.kind ?? null, x: point?.x ?? null, y: point?.y ?? null, pressure: point?.pressure ?? null,
    tiltX: point?.tiltX ?? null, tiltY: point?.tiltY ?? null,
    observedSamples: state.lastBatch?.samples.length ?? 0, predictions: state.predicted.length,
    hover: state.hover?.kind ?? null, committed: state.committed, cancelled: state.cancelled,
    key: state.lastKey, mounted: state.mounted,
  };
  const marks = [...state.strokes.flat(), ...state.current];
  return <View testID="pointer-demo" style={{ width: "100%", maxWidth: 700, padding: 20, gap: 16 }} {...{ className: "bg-surface-raised" }}>
    <Text accessibilityRole="header" {...{ className: "text-2xl font-semibold text-text" }}>Pointer input</Text>
    <Text {...{ className: "text-sm leading-relaxed text-text-muted" }}>
      Draw with touch, mouse or a pen. Press Escape to cancel a stroke. Pressure and tilt stay unavailable when this device does not report them.
    </Text>
    <View testID="pointer-surface" onLayout={event => {
      const width = event.nativeEvent.layout.width;
      if (Number.isFinite(width) && width > 0 && width !== store.getState().width) store.setState({ width });
    }} style={{ height: HEIGHT, overflow: "hidden" }} {...{ className: "rounded-sm border border-border bg-surface-sunken" }}>
      <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: "absolute", inset: 0 }}>
        {marks.map((sample, index) => <View key={index} style={{ position: "absolute", left: sample.x - 2, top: sample.y - 2, width: 4, height: 4, borderRadius: 2 }} {...{ className: "bg-primary" }} />)}
        {state.predicted.map((sample, index) => <View key={`prediction-${index}`} style={{ position: "absolute", left: sample.x - 2, top: sample.y - 2, width: 4, height: 4, borderRadius: 2, opacity: 0.4 }} {...{ className: "bg-accent" }} />)}
      </View>
      {state.mounted && state.width > 0 ? <NativePointerInput width={state.width} height={HEIGHT} label="Input drawing surface"
        onBatch={batch} onKey={event => router.current?.handleKey(event)} /> : null}
    </View>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      <Button title="Clear input trace" variant="secondary" onPress={() => {
        router.current?.cancel();
        store.setState({ current: [], strokes: [], predicted: [], committed: 0, cancelled: 0, lastBatch: null, lastStrokePhase: null });
      }} />
      <Button title={state.mounted ? "Remove input surface" : "Mount input surface"} variant="secondary"
        onPress={() => store.setState(current => ({ mounted: !current.mounted }))} />
    </View>
    <Text testID="pointer-summary" role="status" accessibilityLiveRegion="polite" {...{ className: "text-sm text-text" }}>
      Committed strokes: {state.committed}. Cancelled strokes: {state.cancelled}. Prediction samples: {state.predicted.length}.
    </Text>
    <Text selectable testID="pointer-observation" accessibilityLabel="Reported input values" {...{ className: "text-xs leading-relaxed text-text-muted" }}>
      {JSON.stringify(observation)}
    </Text>
  </View>;
}
