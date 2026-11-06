/*
 * Portions ported from ProCraft for Android,
 * https://github.com/artcraft-android/procraft-android
 * android/app/src/main/java/io/github/artcraftandroid/procraft/ui/LayersPanel.kt
 * at commit c2f7518d03141c746a365f90d8df05a44ddef002 (`Thumb` and
 * `LayerOptions`: a mask's preview drawn on a plain surface rather than the
 * checkerboard, and mask creation and merging offered only when the layer can
 * take them).
 *
 * Copyright (c) 2026 ArtCraft Team and the ProCraft contributors.
 * Licensed under the MIT License or the Apache License, Version 2.0, at your option.
 * See licenses/ProCraft-LICENSE-MIT.txt, licenses/ProCraft-LICENSE-APACHE.txt and
 * licenses/ProCraft-NOTICE.txt.
 *
 * Modified for NYC-Tron UI on 2026-11-05: rewritten from Compose to a
 * controlled React Native panel; unavailable options stay visible with their
 * reason instead of being left out, and enable, invert, refine (feather and
 * grow), apply and delete were added for the Prism mask ops.
 */
import {Text,View,type ViewProps} from "react-native";
import {PrecisionScrubber} from "../inputs/PrecisionScrubber.tsx";
import {joinClasses} from "../../styles.ts";
import {LayerThumbnail} from "./LayerThumbnail.tsx";
import {PanelButton,Reason} from "./panel-button.tsx";
import type {RasterPixels,ThumbnailCache} from "./layer-thumbnail-model.ts";
import {
  FEATHER_RANGE,GROW_RANGE,MASK_FILLS,NO_REFINE,maskBlockedReason,maskFillReason,maskStatusText,maskThumbnailId,
  normalizeRefine,refineOp,refineReason,
  type AddMaskOp,type InvertMaskOp,type MaskInfo,type RefineDraft,type RefineMaskOp,type RemoveMaskOp,type SetMaskEnabledOp,
} from "./mask-model.ts";

/** Props for {@linkcode MaskThumbnailAndEditor}. Each `on*` payload is one engine op's argument. */
export interface MaskThumbnailAndEditorProps extends Omit<ViewProps,"children"> {
  /** The layer whose mask this edits. */
  layerId:string;
  layerName:string;
  /** Locked layers reject mask edits; every control then shows why. @default false */
  locked?:boolean;
  /** The layer's mask, or `null` when it has none. */
  mask:MaskInfo|null;
  /** Whether a pixel selection exists, for "From selection". */
  hasSelection:boolean;
  /** Loads the mask preview (`maskThumbnail {id: layerId, max}`, decoded). */
  loadMaskThumbnail:(layerId:string,max:number)=>Promise<RasterPixels>;
  /** Feather and grow being dialled in; the host owns it so it survives re-renders and panel swaps. */
  refineDraft:RefineDraft;
  onRefineDraftChange:(draft:RefineDraft)=>void;
  /** `addMask`. */
  onAddMask:(op:AddMaskOp)=>void;
  /** `removeMask`; `apply: true` for "Apply mask", `false` for "Delete mask". */
  onRemoveMask:(op:RemoveMaskOp)=>void;
  /** `setMaskEnabled`. */
  onSetMaskEnabled:(op:SetMaskEnabledOp)=>void;
  /** `invertMask` (toggles). */
  onInvertMask:(op:InvertMaskOp)=>void;
  /** `refineMask`, once per press of "Refine". The host resets the draft after it lands. */
  onRefineMask:(op:RefineMaskOp)=>void;
  cache?:ThumbnailCache;
  className?:string;
  unstyled?:boolean;
}

/**
 * Mask panel for one layer (B-12). Without a mask it offers Reveal all, Hide
 * all and From selection (unavailable, with its reason, when nothing is
 * selected). With one it shows the mask preview, Enabled and Inverted
 * switches, Feather and Grow scrubbers with a Refine button, then Apply mask
 * and Delete mask. Every action reports one engine op and keeps no state.
 */
export function MaskThumbnailAndEditor({
  layerId,layerName,locked=false,mask,hasSelection,loadMaskThumbnail,refineDraft,onRefineDraftChange,
  onAddMask,onRemoveMask,onSetMaskEnabled,onInvertMask,onRefineMask,cache,className,unstyled=false,...rest
}:MaskThumbnailAndEditorProps){
  const styled=!unstyled;
  const blocked=maskBlockedReason(locked);
  const heading=<Text accessibilityRole="header" {...{className:joinClasses(styled&&"text-text text-sm font-semibold")}}>
    {"Mask"}
  </Text>;
  const muted=joinClasses(styled&&"text-text-muted text-xs");
  if(!mask){
    const reasons=MASK_FILLS.map(o=>maskFillReason(o.fill,{locked,hasSelection}));
    const shown=blocked??reasons.find(Boolean);
    return <View {...rest} accessibilityLabel={"Mask for "+layerName}
      {...{className:joinClasses("gap-2",styled&&"rounded-card bg-surface-raised border border-border p-3",className)}}>
      {heading}
      <Text {...{className:muted}}>{layerName+" has no mask. Start one:"}</Text>
      <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
        {MASK_FILLS.map((o,i)=><PanelButton key={o.fill} label={o.label} styled={styled} reason={reasons[i]} grow
          tone={o.fill==="reveal"?"primary":"secondary"} onPress={()=>onAddMask({id:layerId,fill:o.fill})}/>)}
      </View>
      <Reason text={shown} styled={styled}/>
    </View>;
  }
  const draft=normalizeRefine(refineDraft);
  const refineBlocked=refineReason(draft,locked);
  const dirty=draft.feather!==0||draft.grow!==0;
  return <View {...rest} accessibilityLabel={"Mask for "+layerName}
    {...{className:joinClasses("gap-3",styled&&"rounded-card bg-surface-raised border border-border p-3",className)}}>
    <View style={{flexDirection:"row",alignItems:"center",gap:12}}>
      <View>
        <LayerThumbnail variant="mask" width={64} height={48} label={"Mask of "+layerName}
          source={{kind:"loader",id:maskThumbnailId(layerId),revision:mask.revision,load:(_id,max)=>loadMaskThumbnail(layerId,max)}}
          {...(cache?{cache}:{})} unstyled={unstyled} style={{opacity:mask.enabled?1:0.45}}/>
        {mask.enabled?null:<View pointerEvents="none" {...{className:joinClasses(styled&&"bg-danger")}}
          style={{position:"absolute",left:-2,right:-2,top:23,height:2,transform:[{rotate:"-36deg"}]}}/>}
      </View>
      <View style={{flex:1,minWidth:0,gap:2}}>
        {heading}
        <Text numberOfLines={1} {...{className:muted}}>{maskStatusText(mask)}</Text>
      </View>
    </View>
    <Reason text={blocked} styled={styled}/>
    <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
      <PanelButton role="switch" label="Enabled" checked={mask.enabled} reason={blocked} styled={styled} grow
        onPress={()=>onSetMaskEnabled({id:layerId,enabled:!mask.enabled})}/>
      <PanelButton role="switch" label="Inverted" checked={mask.inverted} reason={blocked} styled={styled} grow
        onPress={()=>onInvertMask({id:layerId})}/>
    </View>
    <View style={{gap:4}}>
      <PrecisionScrubber label="Feather" unit=" px" {...FEATHER_RANGE} value={draft.feather} disabled={locked}
        unstyled={unstyled} onCommit={feather=>onRefineDraftChange({...draft,feather})}/>
      <PrecisionScrubber label="Grow" unit=" px" {...GROW_RANGE} value={draft.grow} disabled={locked}
        unstyled={unstyled} onCommit={grow=>onRefineDraftChange({...draft,grow})}/>
      <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
        <PanelButton label="Refine mask" tone="primary" reason={refineBlocked} styled={styled} grow
          onPress={()=>onRefineMask(refineOp(layerId,draft))}/>
        <PanelButton label="Reset" reason={dirty?undefined:"Nothing to reset"} styled={styled}
          onPress={()=>onRefineDraftChange(NO_REFINE)}/>
      </View>
      <Reason text={blocked?undefined:refineBlocked} styled={styled}/>
    </View>
    <View {...{className:joinClasses(styled&&"border-t border-border")}}
      style={{flexDirection:"row",flexWrap:"wrap",gap:8,paddingTop:12}}>
      <PanelButton label="Apply mask" reason={blocked} styled={styled} grow
        onPress={()=>onRemoveMask({id:layerId,apply:true})}/>
      <PanelButton label="Delete mask" reason={blocked} styled={styled} grow
        onPress={()=>onRemoveMask({id:layerId,apply:false})}/>
    </View>
  </View>;
}
