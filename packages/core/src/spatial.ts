/**
 * Spatial scene coordinates are meters; React Native window units are not.
 * Specs do not create Viro/Meta/PICO/visionOS compositor panels by themselves.
 */
export interface SpatialPanelSpec {
  readonly id: string;
  readonly role: "stage" | "toolbar" | "inspector" | "secondary";
  readonly anchor: "world" | "head" | "hand" | "app-window";
  readonly units: "meters";
  readonly width: number;
  readonly height: number;
  readonly distance: number;
  readonly curveRadius?: number | null;
}
export function validateSpatialPanel(spec:SpatialPanelSpec):SpatialPanelSpec {
  if(typeof spec.id!=="string" || !spec.id.trim())throw new TypeError("Stable panel id required");
  if(spec.units!=="meters" || ![spec.width,spec.height,spec.distance].every(Number.isFinite) ||
    spec.width<=0 || spec.height<=0 || spec.distance<=0)throw new RangeError("Panel dimensions require positive meters");
  if(spec.curveRadius!==undefined && spec.curveRadius!==null &&
    (!Number.isFinite(spec.curveRadius)||spec.curveRadius<=0))throw new RangeError("Invalid curve radius");
  return spec;
}
export function validateSpatialPanelSet(specs:readonly SpatialPanelSpec[]):void {
  const ids=new Set<string>();
  for(const spec of specs) {
    validateSpatialPanel(spec);
    if(ids.has(spec.id))throw new TypeError("Duplicate spatial panel id");
    ids.add(spec.id);
  }
}
