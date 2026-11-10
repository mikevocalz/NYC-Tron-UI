import { useRef } from "react";
import { Text, View } from "react-native";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { Button } from "@nyc-tron/ui/components/Button";
import { TextField } from "@nyc-tron/ui/components/TextField";
import { ContentFrame } from "@nyc-tron/ui/components/layout/ContentFrame";
import { AdaptiveColumns } from "@nyc-tron/ui/components/layout/AdaptiveColumns";

/** A consumer fixture using only public, installed package exports. */
export function BasicApp() {
  const local = useRef<ReturnType<typeof makeStore> | null>(null);
  if (!local.current) local.current = makeStore();
  const store = local.current;
  const state = useStore(store, value => value);
  const save = () => {
    const name = store.getState().draft.trim();
    store.setState(name ? { saved: name, error: "" } : { error: "Enter a name." });
  };
  return <View style={{ width: "100%", padding: 20 }}>
    <ContentFrame maxWidth={900} testID="consumer-frame">
      <AdaptiveColumns gap={24} testID="consumer-columns">
        <AdaptiveColumns.Item minWidth={280} testID="consumer-form">
          <Text accessibilityRole="header" style={{ fontSize: 24 }}>Packed UI consumer</Text>
          <TextField id="consumer-name" label="Display name" value={state.draft}
            onChangeText={draft => store.setState({ draft, error: "" })}
            errorText={state.error} style={{ minHeight: 44, padding: 8, borderWidth: 1 }} />
          <Button title="Save name" onPress={save} style={{ marginTop: 12 }} />
        </AdaptiveColumns.Item>
        <AdaptiveColumns.Item minWidth={240} testID="consumer-preview">
          <Text accessibilityRole="header" style={{ fontSize: 20 }}>Saved profile</Text>
          <Text testID="consumer-saved" selectable>{state.saved}</Text>
        </AdaptiveColumns.Item>
      </AdaptiveColumns>
    </ContentFrame>
  </View>;
}

const makeStore = () => createStore(() => ({ draft: "Alex Morgan", saved: "Alex Morgan", error: "" }));
