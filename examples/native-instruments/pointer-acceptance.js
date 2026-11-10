import "./reference.css";
import React from "react";
import { ScrollView, StatusBar, useColorScheme } from "react-native";
import { registerRootComponent } from "expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { PointerInputDemo } from "./PointerInputDemo";

function PointerAcceptance() {
  const scheme = useColorScheme() ?? "light";
  return React.createElement(SafeAreaProvider, null,
    React.createElement(StatusBar, { barStyle: scheme === "dark" ? "light-content" : "dark-content" }),
    React.createElement(SafeAreaView, { style: { flex: 1 }, className: "bg-surface" },
      React.createElement(ScrollView, { contentContainerStyle: { flexGrow: 1 }, keyboardShouldPersistTaps: "handled" },
        React.createElement(PointerInputDemo))));
}
registerRootComponent(PointerAcceptance);
