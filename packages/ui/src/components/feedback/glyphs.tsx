import { View } from "react-native";
import { joinClasses } from "../styles.ts";

/**
 * Status and close marks drawn with views, so they need no icon font, survive
 * forced colors (borders and backgrounds of a solid view stay visible) and
 * take the theme's tone tokens. Pass an `icon` to the owning component to use
 * the app's own icon set instead.
 */
export type StatusTone="info"|"success"|"danger"|"neutral";

// Fill and border in the same tone: forced colors drops backgrounds but
// keeps borders, so every part of a mark is drawn with a border too.
const FACE:Record<StatusTone,string>={
  info:"bg-info border-info",success:"bg-success border-success",
  danger:"bg-danger border-danger",neutral:"bg-text-muted border-text-muted",
};

/** 18pt disc with an "i", "!" or check cut out of it in the raised surface color. */
export function StatusGlyph({tone}:{tone:StatusTone}) {
  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants"
      {...{className:joinClasses("h-[18px] w-[18px] items-center justify-center rounded-full border",FACE[tone])}}>
      {tone==="success" ? (
        // Two bars at right angles: the short stroke leads the long one.
        <View style={{width:9,height:6,marginTop:-2,transform:[{rotate:"-45deg"}]}}
          {...{className:"border-b-2 border-l-2 border-surface-raised"}}/>
      ) : (
        <View style={{alignItems:"center",gap:2,flexDirection:tone==="danger"?"column":"column-reverse"}}>
          <View style={{width:0,height:7,borderLeftWidth:2,borderRadius:1}} {...{className:"border-surface-raised"}}/>
          <View style={{width:2,height:2,borderWidth:1,borderRadius:1}} {...{className:"border-surface-raised"}}/>
        </View>
      )}
    </View>
  );
}

/** A 12pt cross made of two bars, colored by the caller's border token. */
export function CloseGlyph({className}:{className?:string}) {
  // Bars are top borders so forced colors keeps them.
  const bar=joinClasses("absolute h-0 w-3 border-t-2",className??"border-text-muted");
  return (
    <View aria-hidden importantForAccessibility="no-hide-descendants"
      style={{width:12,height:12,alignItems:"center",justifyContent:"center"}}>
      <View style={{transform:[{rotate:"45deg"}]}} {...{className:bar}}/>
      <View style={{transform:[{rotate:"-45deg"}]}} {...{className:bar}}/>
    </View>
  );
}
