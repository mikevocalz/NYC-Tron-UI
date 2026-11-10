import "./reference.css";
import React from "react";
import { registerRootComponent } from "expo";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PointerInputDemo } from "./PointerInputDemo";

function PointerAcceptance() {
  return React.createElement(SafeAreaProvider, null,
    React.createElement(SafeAreaView, { style: { flex: 1 }, className: "bg-surface" },
      React.createElement(ScrollView, { contentContainerStyle: { flexGrow: 1 } },
        React.createElement(PointerInputDemo))));
}
registerRootComponent(PointerAcceptance);
