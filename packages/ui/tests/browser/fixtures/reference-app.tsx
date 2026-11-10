import { AppRegistry, View, useWindowDimensions } from "react-native";
import { ReferenceApp, type ReferenceRenderSample } from "../../../../../examples/native-feel/ReferenceApp";
import { referenceLibrary, type LibraryItem, type ReferenceMediaSource, type ReferenceRoute } from "../../../../../examples/native-feel/reference-model";
import { createPlatformMediaDecoder } from "../../../../platform-services/src/media/platform.web";

const query = new URLSearchParams(location.search);
document.documentElement.dir = query.get("dir") === "rtl" ? "rtl" : "ltr";
document.documentElement.style.setProperty("--radius-control", "4px");
document.documentElement.style.setProperty("--radius-card", "4px");
if (query.has("large-text")) document.documentElement.style.fontSize = "28px";
const initialAppearance = query.get("theme") === "dark" ? "dark" : query.get("theme") === "light" ? "light" : "system";
const decoder = createPlatformMediaDecoder();
let libraryAttempt = 0;
let frameAttempt = 0;
const fixture = window as unknown as {
  referenceRenderSamples: ReferenceRenderSample[];
  completeReferenceLibrary?: () => void;
};
fixture.referenceRenderSamples = [];
const mediaSource: ReferenceMediaSource = {
  label: "Generated motion study",
  async loadFrame(timeUs, signal) {
    if (query.has("frame-error") && frameAttempt++ === 0) throw new Error("The sample frame could not be decoded. Try again.");
    const uri = location.origin + "/decoder.webm";
    const probe = await decoder.probe(uri);
    const frame = await decoder.decodeFrame(uri, { timeUs, maxWidth: 960, maxHeight: 720, signal });
    return { ...frame, durationUs: probe.durationUs };
  },
};
function Reference() {
  const { height } = useWindowDimensions();
  return <View testID="reference-fixture" style={{ width: query.has("nested") ? 390 : "100%", height, minWidth: 0 }}>
    <ReferenceApp initialAppearance={initialAppearance} initialRoute={(query.get("route") ?? "library") as ReferenceRoute}
      mediaSource={mediaSource} navigation={{ runtime: "web", family: "unknown", isRTL: query.get("dir") === "rtl" }}
      onRenderSample={sample => fixture.referenceRenderSamples.push(sample)}
      loadLibrary={async signal => {
        const attempt = libraryAttempt++;
        if (query.has("library-error") && attempt === 0) throw new Error("The sample library is unavailable. Your work has not changed.");
        if (query.has("loading") && attempt === 0) await new Promise<void>((resolve, reject) => {
          fixture.completeReferenceLibrary = resolve;
          signal.addEventListener("abort", () => reject(new Error("Request cancelled")), { once: true });
        });
        return query.has("empty") ? [] as readonly LibraryItem[] : referenceLibrary;
      }} />
  </View>;
}
AppRegistry.registerComponent("ReferenceApp", () => Reference);
AppRegistry.runApplication("ReferenceApp", { rootTag: document.getElementById("root") });
