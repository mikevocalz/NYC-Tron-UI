import "./reference.css";
import React from "react";
import { ScrollView } from "react-native";
import { registerRootComponent } from "expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PointerInputDemo } from "./PointerInputDemo";

function PointerAcceptance() {
  return React.createElement(SafeAreaProvider, null,
    React.createElement(SafeAreaView, { style: { flex: 1 }, className: "bg-surface" },
      React.createElement(ScrollView, { contentContainerStyle: { flexGrow: 1 }, keyboardShouldPersistTaps: "handled" },
        React.createElement(PointerInputDemo))));
}
registerRootComponent(PointerAcceptance);
