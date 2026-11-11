import "./reference.css";
import { useEffect, useRef } from "react";
import { Platform, ScrollView, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { verifyNativeMedia } from "./verify-native-media";

declare const process: { env: { EXPO_PUBLIC_NYC_TRON_REVISION?: string; EXPO_PUBLIC_NYC_TRON_ACCEPTANCE_URL?: string } };

let acceptance: Promise<string> | undefined;
function runOnce() {
  // Effect replay must not create a second owner that clears the first run's files.
  return acceptance ??= (async () => {
    let payload: unknown;
    try { payload = await verifyNativeMedia(); }
    catch (error) {
      payload = { schema: 1, status: "failed", platform: Platform.OS,
        revision: process.env.EXPO_PUBLIC_NYC_TRON_REVISION ?? "local",
        error: error instanceof Error ? error.message : String(error) };
    }
    const passed = (payload as { status: string }).status === "passed";
    const message = `NYC_TRON_NATIVE_MEDIA_${passed ? "PASS" : "FAIL"} ${JSON.stringify(payload)}`;
    console.info(message);
    const endpoint = process.env.EXPO_PUBLIC_NYC_TRON_ACCEPTANCE_URL;
    if (endpoint) {
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 10_000);
      try {
        const response = await fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify(payload), signal: controller.signal });
        if (!response.ok) throw new Error(`Acceptance receiver returned ${response.status}`);
      } finally { clearTimeout(timeout); }
    }
    return message;
  })();
}

export default function MediaAcceptance() {
  const ref = useRef<StoreApi<{ result: string }> | null>(null);
  ref.current ??= createStore(() => ({ result: "Running the installed native decoder…" }));
  const store = ref.current, result = useStore(store, state => state.result);
  useEffect(() => {
    let active = true;
    void runOnce().then(value => { if (active) store.setState({ result: value }); }, error => {
      const message = `NYC_TRON_NATIVE_MEDIA_FAIL ${String(error)}`;
      console.error(message); if (active) store.setState({ result: message });
    });
    return () => { active = false; };
  }, [store]);
  return <SafeAreaProvider><SafeAreaView style={{ flex: 1 }} {...{ className: "bg-surface" }}>
    <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
      <Text accessibilityRole="header" {...{ className: "text-xl font-semibold text-text" }}>Native media acceptance</Text>
      <Text testID="native-media-result" accessibilityLiveRegion="polite" selectable {...{ className: "text-sm text-text" }}>{result}</Text>
    </ScrollView>
  </SafeAreaView></SafeAreaProvider>;
}
