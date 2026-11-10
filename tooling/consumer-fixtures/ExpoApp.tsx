import { useRef } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { NativeDropdown } from "@nyc-tron/expo-controls/NativeDropdown";
import { AdaptivePaneHost } from "@nyc-tron/panes/AdaptivePaneHost";
import { Button } from "@nyc-tron/ui/components/Button";
import { BasicApp } from "./BasicApp";

export function ExpoApp() {
  const local = useRef<ReturnType<typeof makeStore> | null>(null);
  if (!local.current) local.current = makeStore();
  const store = local.current;
  const state = useStore(store, value => value);
  const { width } = useWindowDimensions();
  return <View style={{ width: "100%", minHeight: 800 }}>
    <View style={{ padding: 20, gap: 12 }}>
      <Text accessibilityRole="header" style={{ fontSize: 24 }}>Packed Expo consumer</Text>
      <NativeDropdown label="Workspace" testID="consumer-workspace" value={state.workspace}
        options={[{ value: "studio", label: "Studio" }, { value: "library", label: "Library" }]}
        colorScheme={state.dark ? "dark" : "light"}
        onValueChange={workspace => store.setState({ workspace })} />
      <Text testID="consumer-workspace-value">Workspace: {state.workspace}</Text>
      <Button title="Toggle appearance" onPress={() => store.setState({ dark: !store.getState().dark })} />
      <Text testID="consumer-appearance">{state.dark ? "dark" : "light"}</Text>
    </View>
    <AdaptivePaneHost style={{ height: 600 }} container={{ x: 0, y: 0, width, height: 600 }}
      master={<Text testID="consumer-master" style={{ padding: 12 }}>Library</Text>}
      masterConfig={{ present: true, minWidth: 200, preferredWidth: 240 }}
      detail={<BasicApp />} detailConfig={{ minWidth: 320 }} />
  </View>;
}

const makeStore = () => createStore(() => ({ workspace: "studio", dark: false }));
