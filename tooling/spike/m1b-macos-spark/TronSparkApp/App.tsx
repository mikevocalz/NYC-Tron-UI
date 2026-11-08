import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import "./global.css";

// Verbatim @nyc-tron/ui sources vendored under src/nyc-tron (see PROVENANCE.md).
import { Button } from "./src/nyc-tron/Button";
import { Card } from "./src/nyc-tron/Card";
import { SegmentedControl } from "./src/nyc-tron/SegmentedControl";
import { TextField } from "./src/nyc-tron/TextField";
import { SegmentedControl as SparkSegmentedControl } from "@legendapp/spark/ui";

const MODES = [
  { value: "design", label: "Design" },
  { value: "preview", label: "Preview" },
  { value: "handoff", label: "Handoff" },
] as const;

export default function App() {
  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>("design");
  const [message, setMessage] = useState("Ready");
  const [draft, setDraft] = useState("");

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.title}>NYC-Tron on Spark</Text>
      <Text style={styles.subtitle}>
        Real @nyc-tron/ui sources on react-native-macos (RN 0.83)
      </Text>

      <Card className="mt-6 w-full max-w-xl gap-4">
        <Text style={styles.heading}>SegmentedControl</Text>
        <SegmentedControl
          aria-label="Workspace mode"
          options={MODES}
          value={mode}
          onChange={setMode}
        />
        <Text style={styles.muted}>Selected: {mode}</Text>
      </Card>

      <Card className="mt-4 w-full max-w-xl gap-4">
        <Text style={styles.heading}>Spark host-native control (real NSSegmentedControl)</Text>
        <SparkSegmentedControl
          accessibilityLabel="Spark native segmented control"
          options={MODES.map((o) => ({ value: o.value, label: o.label }))}
          value={mode}
          onValueChange={(v) => setMode(v as (typeof MODES)[number]["value"])}
        />
      </Card>

      <Card className="mt-4 w-full max-w-xl gap-4">
        <Text style={styles.heading}>Button</Text>
        <View className="flex-row flex-wrap gap-3">
          <Button title="Primary" onPress={() => setMessage("Primary pressed")} />
          <Button title="Secondary" variant="secondary" onPress={() => setMessage("Secondary pressed")} />
          <Button title="Ghost" variant="ghost" onPress={() => setMessage("Ghost pressed")} />
          <Button title="Danger" variant="danger" onPress={() => setMessage("Danger pressed")} />
          <Button title="Loading" loading onPress={() => {}} />
          <Button title="Disabled" disabled onPress={() => {}} />
        </View>
        <Text style={styles.muted}>{message}</Text>
      </Card>

      <Card className="mt-4 w-full max-w-xl gap-4">
        <Text style={styles.heading}>TextField</Text>
        <TextField
          id="spike-notes"
          label="Notes"
          placeholder="Type here — real TextInput on AppKit"
          helperText="Vendored TextField.tsx, unmodified"
          value={draft}
          onChangeText={setDraft}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#101017" },
  content: { alignItems: "center", padding: 24, gap: 8 },
  title: { color: "#F6F6FD", fontSize: 28, fontWeight: "700", marginTop: 24 },
  subtitle: { color: "#AAAABB", fontSize: 14 },
  heading: { color: "#F6F6FD", fontSize: 16, fontWeight: "600" },
  muted: { color: "#AAAABB", fontSize: 13 },
});
