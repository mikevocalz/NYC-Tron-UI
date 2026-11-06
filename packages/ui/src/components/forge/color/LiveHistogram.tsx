import { Text, View, type ViewProps } from "react-native";
import { joinClasses } from "../../styles.ts";
import { bounded, poolHistogram, type HistogramChannel } from "./color-adjustments.ts";
export type { HistogramChannel } from "./color-adjustments.ts";
/** Actual histogram bins and their explicit numeric domain. */
export interface LiveHistogramProps extends Omit<ViewProps,"children"> {
  readonly channels: readonly HistogramChannel[];
  readonly domain: readonly [number,number];
  readonly logarithmic?: boolean;
  readonly height?: number;
  readonly unstyled?: boolean;
}
/** Renders bounded, count-preserving histograms; no fake signal or recurring UI timer. */
export function LiveHistogram({channels,domain,logarithmic=false,height=120,unstyled=false,...props}:LiveHistogramProps){
  bounded(height,44,600,"Histogram height");
  if(!domain.every(Number.isFinite)||domain[0]>=domain[1])throw new RangeError("Histogram domain must increase");
  if(channels.length>8||new Set(channels.map(c=>c.id)).size!==channels.length||channels.some(c=>!c.id||!c.label))throw new TypeError("Histogram requires at most eight distinct labeled channels");
  return <View {...props} style={[{gap:8},props.style]}>{channels.length===0?<Text {...{className:joinClasses(!unstyled&&"text-text-muted")}}>No histogram measurements</Text>:channels.map(channel=>{
    const counts=poolHistogram(channel.bins),values=counts.map(n=>logarithmic?Math.log1p(n):n),peak=Math.max(0,...values),total=channel.bins.reduce((sum,n)=>sum+n,0);
    return <View key={channel.id} accessible accessibilityLabel={`${channel.label}: ${total} samples, ${channel.bins.length} bins, domain ${domain[0]} to ${domain[1]}${logarithmic?', logarithmic':''}`} style={{gap:4}}>
      <Text {...{className:joinClasses(!unstyled&&"text-text")}}>{channel.label}: {total} samples</Text>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants" aria-hidden style={{height,flexDirection:'row',alignItems:'flex-end',gap:0}}>{values.map((value,index)=><View key={index} {...{className:joinClasses(!unstyled&&"bg-primary")}} style={{flex:1,height:peak?value/peak*height:0}}/>)}</View>
      <Text {...{className:joinClasses(!unstyled&&"text-text-muted")}}>{domain[0]} → {domain[1]}</Text>
    </View>;
  })}</View>;
}
