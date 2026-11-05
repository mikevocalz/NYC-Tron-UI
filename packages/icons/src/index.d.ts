export type ForgeIconVariant="outline"|"filled";
export type ForgeIconState="idle"|"hover"|"pressed"|"selected"|"disabled"|"loading"|"success"|"error"|"recording";
export type ForgeIconSize="xs"|"sm"|"toolbar"|"default"|"touch"|"feature"|"hero";
export interface ForgeIconOptions {
 selected?:boolean;disabled?:boolean;loading?:boolean;hovered?:boolean;pressed?:boolean;
 status?:"idle"|"success"|"error"|"recording";size?:number|ForgeIconSize;
 color?:string;selectedColor?:string;disabledColor?:string;successColor?:string;
 errorColor?:string;
 /** @deprecated No effect: icons have no built-in light/dark palette. Pass theme colors instead. */
 appearance?:"light"|"dark";reducedMotion?:boolean;
}
export interface ForgeIconPresentation {
 readonly state:ForgeIconState;readonly variant:ForgeIconVariant;readonly color:string;
 readonly size:number;readonly opacity:number;readonly animated:boolean;readonly durationMs:number;
}
export const iconGroups:Readonly<Record<string,string>>;
export const iconCategories:readonly string[];
export const iconIds:readonly string[];
export function hasIconId(id:string):boolean;
export function getIconMetadata(id:string):Readonly<{id:string;category:string;slug:string;label:string}>|undefined;
export function iconsInCategory(category:string):string[];
export function searchIcons(query:string):string[];
export const glyphIds:readonly string[];
/** Namespaced catalog IDs that `getGlyph` resolves to artwork. */
export const glyphCatalogIds:readonly string[];
export const glyphs:Readonly<Record<string,{outline:readonly (readonly string[])[];filled:readonly (readonly string[])[]}>>;
export function getGlyph(id:string,variant?:ForgeIconVariant):readonly (readonly string[])[]|undefined;
/** Icon color option -> `@nyc-tron/core` theme color key. */
export const iconColorTokens:Readonly<{color:"text";selectedColor:"primary";disabledColor:"textMuted";successColor:"accent";errorColor:"danger"}>;
/** Map theme colors to icon color options; unset keys are omitted so `currentColor` applies. */
export function iconColorsFromTheme(colors:Readonly<Partial<Record<"text"|"primary"|"textMuted"|"accent"|"danger",string>>>):Readonly<Pick<ForgeIconOptions,"color"|"selectedColor"|"disabledColor"|"successColor"|"errorColor">>;
export const iconSizes:Readonly<Record<string,number>>;
export const iconStroke:Readonly<{size:number;width:number;cap:string;join:string}>;
export const iconMotion:Readonly<Record<string,number>>;
export const iconStates:readonly ForgeIconState[];
export function resolveIconState(options?:ForgeIconOptions):ForgeIconPresentation;
export function riveIconInputs(options?:ForgeIconOptions):Readonly<Record<string,string|boolean>>;
