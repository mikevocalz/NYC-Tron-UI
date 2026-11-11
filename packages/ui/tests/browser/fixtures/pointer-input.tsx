import { AppRegistry, ScrollView, View } from "react-native";
import { PointerInputDemo } from "../../../../../examples/native-instruments/PointerInputDemo";

function Fixture() {
  return <View style={{ flex: 1 }} {...{ className: "bg-surface-sunken" }}>
    <ScrollView contentContainerStyle={{ padding: 20 }}><PointerInputDemo /></ScrollView>
  </View>;
}
AppRegistry.registerComponent("PointerInput", () => Fixture);
AppRegistry.runApplication("PointerInput", { rootTag: document.getElementById("root") });
