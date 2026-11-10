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
  // Fill the app's available height while keeping a content-sized basis for
  // longer pages. Width still belongs to this host, including a nested pane.
  return <View testID="native-feel-host" style={{ width: query.has("nested") ? 390 : "100%", minWidth: 0, flexGrow: 1 }}>
    <AccountScreen initialAppearance={initialAppearance} />
  </View>;
}
AppRegistry.registerComponent("NativeFeel", () => Reference);
AppRegistry.runApplication("NativeFeel", { rootTag: document.getElementById("root") });
