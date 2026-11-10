import "./reference.css";
import { useCallback, useEffect, useRef, type ComponentRef } from "react";
import { I18nManager, KeyboardAvoidingView, Platform, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "expo-asset";
import { Uniwind } from "uniwind";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";
import { foldFeaturesFromRegions, resolveUsableRegions, type Rect } from "@nyc-tron/core/folds";
import { resolveNavigationShell, type DeviceFamily } from "@nyc-tron/core/navigation";
import { useReservedRegions } from "@nyc-tron/reserved-regions";
import { NativeNavigationRail } from "@nyc-tron/native-navigation/NativeNavigationRail";
import { resolvePhysicalRightRailRegion } from "@nyc-tron/native-navigation/navigation-model";
import { createPlatformMediaDecoder } from "@nyc-tron/platform-services/media";
import { FocusAndA11yLayer } from "@nyc-tron/ui/components/shell/FocusAndA11yLayer";
import { ReferenceApp } from "../native-feel/ReferenceApp";
import type { DemoAppearance } from "../native-feel/AccountScreen";
import type { ReferenceMediaSource, ReferenceRoute } from "../native-feel/reference-model";

function createNativeMedia() {
  const decoder = createPlatformMediaDecoder();
  const pending = new Set<Promise<unknown>>();
  let lifecycle = 0;
  const getAsset = async () => {
    const asset = await Asset.fromModule(require("./assets/reference.mp4")).downloadAsync();
    return asset.localUri ?? asset.uri;
  };
  const source: ReferenceMediaSource = {
    label: "Generated motion study",
    loadFrame(timeUs, signal) {
      const operation = (async () => {
        const uri = await getAsset();
        if (signal.aborted) throw new Error("Frame request cancelled");
        const probe = await decoder.probe(uri);
        if (signal.aborted) throw new Error("Frame request cancelled");
        const frame = await decoder.decodeFrame(uri, { timeUs, maxWidth: 960, maxHeight: 720, signal });
        return { ...frame, durationUs: probe.durationUs };
      })();
      pending.add(operation);
      void operation.then(() => pending.delete(operation), () => pending.delete(operation));
      return operation;
    },
  };
  return {
    source,
    retain: () => { lifecycle++; },
    dispose: async () => {
      const closing = ++lifecycle;
      await Promise.allSettled([...pending]);
      // A StrictMode effect replay may retain this owner before draining ends.
      if (closing === lifecycle) await decoder.clearCache();
    },
  };
}
const setReferenceAppearance = (appearance: DemoAppearance) => Uniwind.setTheme(appearance);
const nativeItems = [
  { id: "library", label: "Library", glyph: "▦" }, { id: "editor", label: "Editor", glyph: "✎" },
  { id: "media", label: "Media", glyph: "▷" }, { id: "settings", label: "Settings", glyph: "⚙" },
];
const renderRail = ({ selectedId, onSelect }: { selectedId: ReferenceRoute; onSelect: (id: ReferenceRoute) => void }) =>
  <View testID="reference-right-rail" style={{ width: 88, flexShrink: 0 }}>
    <NativeNavigationRail items={nativeItems} selectedId={selectedId} onSelectionChange={id => onSelect(id as ReferenceRoute)} width={88} />
  </View>;

export interface NativeReferenceAppProps {
  /** Supplied by the native host's verified capability. Width is never a device classifier. */
  deviceFamily?: DeviceFamily;
}
function ReferenceHost({ deviceFamily = "unknown" }: NativeReferenceAppProps) {
  const host = useRef<ComponentRef<typeof View> | null>(null);
  const local = useRef<StoreApi<{ container: Rect | null; knownFold: boolean }> | null>(null);
  local.current ??= createStore(() => ({ container: null as Rect | null, knownFold: false }));
  const state = useStore(local.current, value => value);
  const media = useRef<ReturnType<typeof createNativeMedia> | null>(null);
  media.current ??= createNativeMedia();
  const regions = useReservedRegions();
  const dimensions = useWindowDimensions();
  const features = foldFeaturesFromRegions(regions, { includeOcclusions: true });
  // A camera cutout is an occlusion, not evidence of foldable hardware.
  const verifiedFold = foldFeaturesFromRegions(regions).length > 0;
  useEffect(() => { if (verifiedFold) local.current!.setState({ knownFold: true }); }, [verifiedFold]);
  const family: DeviceFamily = verifiedFold || state.knownFold ? "foldable" : deviceFamily;
  const platform = Platform.OS === "ios" ? "ios" : "android";
  const navigation = { runtime: "native" as const, platform: platform as "ios" | "android", family, isRTL: I18nManager.isRTL };
  const shell = resolveNavigationShell(navigation);
  const measure = useCallback(() => host.current?.measureInWindow((x, y, width, height) => {
    if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return;
    const previous = local.current!.getState().container;
    if (!previous || x !== previous.x || y !== previous.y || width !== previous.width || height !== previous.height) {
      local.current!.setState({ container: { x, y, width, height } });
    }
  }), []);
  useEffect(measure, [measure, dimensions.width, dimensions.height, regions]);
  useEffect(() => { const owner = media.current!; owner.retain(); return () => { void owner.dispose().catch(() => undefined); }; }, []);
  const usable = state.container ? resolveUsableRegions({ container: state.container, features }) : [];
  const safe = usable.length ? shell.kind === "physical-right-rail" ? resolvePhysicalRightRailRegion(usable)
    : usable.reduce((best, next) => next.width * next.height > best.width * best.height ? next : best) : null;
  const bounded = safe && state.container ? { left: safe.x - state.container.x, top: safe.y - state.container.y, width: safe.width, height: safe.height }
    : { left: 0, right: 0, top: 0, bottom: 0 };
  const obscured = Boolean(state.container && !safe || features.length && !state.container);
  return <SafeAreaView style={{ flex: 1 }} {...{ className: "bg-surface-sunken" }}>
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View ref={host} collapsable={false} onLayout={measure} style={{ flex: 1, direction: "ltr" }}>
        <View style={{ position: "absolute", ...bounded, opacity: obscured ? 0 : 1, direction: I18nManager.isRTL ? "rtl" : "ltr" }}
          pointerEvents={obscured ? "none" : "auto"} accessibilityElementsHidden={obscured} importantForAccessibility={obscured ? "no-hide-descendants" : "auto"}>
          <ReferenceApp navigation={navigation} mediaSource={media.current.source}
            onAppearanceChange={setReferenceAppearance} renderNativeRail={renderRail} />
        </View>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

/** SDK 58 acceptance host. A phone entry is explicit; other hosts pass verified capability. */
export default function NativeReferenceApp(props: NativeReferenceAppProps) {
  return <SafeAreaProvider><FocusAndA11yLayer><ReferenceHost {...props} /></FocusAndA11yLayer></SafeAreaProvider>;
}
