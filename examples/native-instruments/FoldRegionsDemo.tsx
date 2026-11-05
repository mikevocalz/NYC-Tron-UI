import { Text, View } from "react-native";
import { useReservedRegions } from "@nyc-tron/reserved-regions";
import { foldLayoutsFromRegions, foldPostureFromRegions } from "@nyc-tron/core/folds";

// Live readout of @nyc-tron/reserved-regions on this device: what the native
// module reports, and the posture @nyc-tron/core/folds derives from it.
// Hardware without a fold, and iOS before 27.1, report nothing; the readout
// says so instead of showing an empty list.
export function FoldRegionsDemo() {
  const regions = useReservedRegions();
  const folds = foldLayoutsFromRegions(regions);
  return <View accessibilityLabel="Fold regions" style={{gap:6}}>
    <Text style={{color:"#F6F6FD",fontWeight:"600",fontSize:20}}>Fold regions</Text>
    <Text style={{color:"#AAAABB"}}>
      {regions.length === 0
        ? "No fold or camera region reported on this window."
        : `Posture: ${foldPostureFromRegions(regions)} | ${folds.filter(f=>f.separating).length} separating fold(s)`}
    </Text>
    {regions.map((r,i)=>
      <Text key={i} style={{color:"#AAAABB",fontVariant:["tabular-nums"]}}>
        {r.kind} {r.orientation ?? ""} {r.state ?? ""} x {r.x.toFixed(0)} y {r.y.toFixed(0)} w {r.width.toFixed(0)} h {r.height.toFixed(0)}{r.active ? "" : " (inactive)"}
      </Text>)}
  </View>;
}
