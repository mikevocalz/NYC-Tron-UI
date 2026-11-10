import { AppRegistry, View } from "react-native";
import { AccountScreen } from "../../../../../examples/native-feel/AccountScreen.tsx";

const query = new URLSearchParams(location.search);
const initialAppearance = query.get("theme") === "dark" ? "dark" :
  query.get("theme") === "light" ? "light" : "system";
document.documentElement.dir = query.get("dir") === "rtl" ? "rtl" : "ltr";
if (query.has("large-text")) document.documentElement.style.fontSize = "32px";
// A narrow pane in a wide app verifies container-driven reflow independently
// from the viewport. Hardware folds still belong to AdaptivePaneHost.
function Reference() {
  return <View testID="native-feel-host" style={{ width: query.has("nested") ? 390 : "100%", minWidth: 0 }}>
    <AccountScreen initialAppearance={initialAppearance} />
  </View>;
}
AppRegistry.registerComponent("NativeFeel", () => Reference);
AppRegistry.runApplication("NativeFeel", { rootTag: document.getElementById("root") });
