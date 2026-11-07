export type LayerAlphaMode='straight'|'premultiplied';
export interface LayerBlendValue {readonly mode:string;readonly opacity:number;readonly spaceId:string;readonly alphaMode:LayerAlphaMode}
export interface LayerBlendMode {readonly id:string;readonly label:string;readonly unavailableReason?:string}
export interface LayerBlendSpace {
 readonly id:string;readonly label:string;readonly transfer:'linear'|'encoded';
 /** Capabilities supplied by the compositor, never inferred from a profile name. */
 readonly modeIds:readonly string[];readonly unavailableReason?:string;
}
const id=(value:string)=>typeof value==='string'&&!!value.trim()&&value.length<=512;
export function validateLayerBlend(value:LayerBlendValue,modes:readonly LayerBlendMode[],spaces:readonly LayerBlendSpace[]):void {
 if(!Number.isFinite(value.opacity)||value.opacity<0||value.opacity>1||!['straight','premultiplied'].includes(value.alphaMode)||!id(value.mode)||!id(value.spaceId))throw new RangeError('Invalid layer blend value');
 if(!modes.length||modes.length>128||!spaces.length||spaces.length>128)throw new RangeError('Invalid compositing capability count');
 const modesById=new Map<string,LayerBlendMode>(),spacesById=new Set<string>();
 for(const mode of modes){if(!id(mode.id)||!id(mode.label)||modesById.has(mode.id)||mode.unavailableReason!==undefined&&(!mode.unavailableReason.trim()||mode.unavailableReason.length>1024))throw new RangeError('Invalid blend mode');modesById.set(mode.id,mode);}
 for(const space of spaces){if(!id(space.id)||!id(space.label)||spacesById.has(space.id)||!['linear','encoded'].includes(space.transfer)||!space.modeIds.length||space.modeIds.length>modes.length||new Set(space.modeIds).size!==space.modeIds.length||space.modeIds.some(mode=>!modesById.has(mode))||space.unavailableReason!==undefined&&(!space.unavailableReason.trim()||space.unavailableReason.length>1024))throw new RangeError('Invalid compositing space');spacesById.add(space.id);}
 if(!modesById.has(value.mode)||!spacesById.has(value.spaceId))throw new RangeError('Current layer mode and space must remain in the capability catalog');
}
/** A retained imported value can be unavailable; show its reason without pretending to convert it. */
export function layerBlendProblem(value:LayerBlendValue,modes:readonly LayerBlendMode[],spaces:readonly LayerBlendSpace[]):string|undefined {
 validateLayerBlend(value,modes,spaces);const mode=modes.find(mode=>mode.id===value.mode)!,space=spaces.find(space=>space.id===value.spaceId)!;
 return mode.unavailableReason??space.unavailableReason??(!space.modeIds.includes(value.mode)?'This blend mode is unavailable in the selected compositing space':undefined);
}
/** Six-decimal alpha survives percent entry. No pixel channels or profile IDs are converted. */
export function layerOpacityFromPercent(percent:number):number {
 if(!Number.isFinite(percent)||percent<0||percent>100)throw new RangeError('Layer opacity percent must be within 0..100');return Math.round(percent*10000)/1000000;
}
