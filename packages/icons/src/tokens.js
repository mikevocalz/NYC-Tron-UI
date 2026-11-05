/**
 * Icon color roles mapped to `@nyc-tron/core` theme color keys. The package
 * ships no palette: unset roles fall back to `currentColor`, so icons inherit
 * the host text color on web and the Svg `color` on native.
 */
export const iconColorTokens=Object.freeze({
  color:"text", selectedColor:"primary", disabledColor:"textMuted",
  successColor:"accent", errorColor:"danger",
});
/** Resolve icon color options from a validated theme's `colors`. Missing optional keys stay unset. */
export function iconColorsFromTheme(colors){
  const out={};
  for(const [role,key] of Object.entries(iconColorTokens)){
    if(typeof colors?.[key]==="string"&&colors[key].trim())out[role]=colors[key];
  }
  return Object.freeze(out);
}
export const iconSizes=Object.freeze({xs:12,sm:16,toolbar:20,default:24,touch:28,feature:32,hero:48});
export const iconStroke=Object.freeze({size:24,width:2.35,cap:"round",join:"round"});
export const iconMotion=Object.freeze({
  hoverMs:120, pressMs:110, selectMs:225, deselectMs:175,
  successMs:320, errorMs:240, loadingMs:850,
  pressScale:0.9, selectedScale:1.075,
});
export const iconStates=Object.freeze(["idle","hover","pressed","selected","disabled","loading","success","error","recording"]);
