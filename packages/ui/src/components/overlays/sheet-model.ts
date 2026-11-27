/*
 * Behaviour adapted from NYC-MON packages/ui/BottomSheet.tsx (MIT),
 * mikevocalz/nyc-mon commit 5ed8cf8322c685c86dbe03f4ac7b801255d1b907.
 * Copyright (c) 2025 Gursel Cakar, MIT. Notices: THIRD_PARTY_NOTICES.md.
 * Modified for NYC-Tron UI (2026-11): pure validation split out of the
 * component; snap points are the app's, not fixed at 55% / 85%.
 */
/**
 * Pure rules for `Sheet`: snap point validation and the close label check.
 * No React or React Native import, so the rules are unit tested directly.
 */

/**
 * A height the sheet can rest at, as @expo/ui's universal `BottomSheet`
 * takes it. `fraction` and `height` are honoured on iOS and web; Android
 * snaps them to the nearest of `half` / `full`.
 */
export type SheetSnapPoint="half"|"full"|{fraction:number}|{height:number};

/**
 * Checks `snapPoints` and returns them unchanged, or `undefined` for an
 * empty or missing list (the sheet then sizes to its content). Throws
 * RangeError for a fraction outside (0, 1], a height that is not a positive
 * finite number, or any other value.
 */
export function resolveSnapPoints(snapPoints:readonly SheetSnapPoint[]|undefined):SheetSnapPoint[]|undefined{
  if(snapPoints===undefined)return undefined;
  if(!Array.isArray(snapPoints))throw new RangeError("Sheet snapPoints must be an array");
  if(snapPoints.length===0)return undefined;
  for(const point of snapPoints){
    if(point==="half"||point==="full")continue;
    if(point&&typeof point==="object"&&"fraction" in point){
      const {fraction}=point;
      if(typeof fraction!=="number"||!Number.isFinite(fraction)||fraction<=0||fraction>1)
        throw new RangeError(`Sheet snap fraction must be greater than 0 and at most 1, got ${String(fraction)}`);
      continue;
    }
    if(point&&typeof point==="object"&&"height" in point){
      const {height}=point;
      if(typeof height!=="number"||!Number.isFinite(height)||height<=0)
        throw new RangeError(`Sheet snap height must be a positive number of points, got ${String(height)}`);
      continue;
    }
    throw new RangeError(`Invalid sheet snap point ${JSON.stringify(point)}`);
  }
  return [...snapPoints];
}

/** Returns the trimmed close label. Throws TypeError when it is missing or blank. */
export function requireCloseLabel(closeLabel:string|undefined):string{
  const label=typeof closeLabel==="string"?closeLabel.trim():"";
  if(!label)throw new TypeError("Sheet needs a closeLabel: the close control has no visible name");
  return label;
}

/** Returns the trimmed title. Throws TypeError when it is missing or blank. */
export function requireSheetTitle(title:string|undefined):string{
  const text=typeof title==="string"?title.trim():"";
  if(!text)throw new TypeError("Sheet needs a title: it names the sheet for screen readers");
  return text;
}
