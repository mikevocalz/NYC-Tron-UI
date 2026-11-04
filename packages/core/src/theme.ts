/**
 * Native theme-resource adapter input. Tailwind CSS v4/Uniwind remains the
 * consuming app's theme source; this does NOT replace its @theme variables.
 *
 * Every color and radius key corresponds to one CSS variable that component
 * recipes read (docs/THEME_TOKENS.md); TRON_THEME_TOKENS is that mapping.
 */
export interface TronThemeColors {
  readonly primary:string; readonly onPrimary:string;
  readonly surfaceRaised:string; readonly surfaceSunken:string;
  readonly border:string; readonly text:string; readonly textMuted:string;
  readonly focus:string;
  /** Optional: added after the first release; recipes using it stay unstyled without it. */
  readonly danger?:string; readonly onDanger?:string; readonly accent?:string;
}
/** Pre-alignment names, still accepted and still readable on validated themes. */
export interface TronThemeColorAliases {
  /** @deprecated Use `surfaceRaised`. */ readonly surface:string;
  /** @deprecated Use `text`. */ readonly foreground:string;
  /** @deprecated Use `textMuted`. */ readonly muted:string;
  /** @deprecated Use `surfaceSunken`; no component reads a page background. */ readonly background:string;
}
export interface TronThemeShape {
  readonly controlRadius:number; readonly cardRadius:number; readonly borderWidth:number;
  /** @deprecated Use `cardRadius`. */ readonly surfaceRadius:number;
}
export interface TronTheme {
  readonly colors:TronThemeColors&TronThemeColorAliases;
  readonly shape:TronThemeShape;
  readonly density:"comfortable"|"compact"|"touch";
  readonly motion:{readonly fastMs:number;readonly standardMs:number};
}
/** Input accepts either the current key or its deprecated alias for each value. */
export interface TronThemeInput {
  readonly colors:Partial<TronThemeColors>&Partial<TronThemeColorAliases>;
  readonly shape:Partial<TronThemeShape>&{readonly controlRadius:number;readonly borderWidth:number};
  readonly density:TronTheme["density"];
  readonly motion:TronTheme["motion"];
}

/** Theme key -> CSS variable read by component recipes. */
export const TRON_THEME_TOKENS={
  colors:{
    primary:"--color-primary",onPrimary:"--color-on-primary",
    surfaceRaised:"--color-surface-raised",surfaceSunken:"--color-surface-sunken",
    border:"--color-border",text:"--color-text",textMuted:"--color-text-muted",
    danger:"--color-danger",onDanger:"--color-on-danger",accent:"--color-accent",
    focus:"--color-focus",
  },
  shape:{controlRadius:"--radius-control",cardRadius:"--radius-card"},
} as const satisfies {
  colors:Record<keyof TronThemeColors,string>;
  shape:Record<"controlRadius"|"cardRadius",string>;
};
/** Theme values that are native adapter metrics with no CSS class token. */
export const TRON_NATIVE_METRICS=["shape.borderWidth","density","motion.fastMs","motion.standardMs"] as const;

const COLOR_ALIASES=[["surfaceRaised","surface"],["text","foreground"],["textMuted","muted"],["surfaceSunken","background"]] as const;
const REQUIRED_COLORS=["primary","onPrimary","surfaceRaised","surfaceSunken","border","text","textMuted","focus"] as const;
const OPTIONAL_COLORS=["danger","onDanger","accent"] as const;

// The current key wins over its alias. Validated themes expose both names,
// so `{...theme.colors, text: "#111"}` still carries the old `foreground`;
// treating that as a conflict would break the common spread-and-override.
function pick<T>(current:T|undefined,alias:T|undefined):T|undefined{
  return current??alias;
}
const isColor=(c:unknown)=>typeof c==="string"&&c.trim().length>0;

export function validateTheme(theme:TronThemeInput):TronTheme {
  const input=theme.colors as Record<string,string|undefined>;
  const resolved:Record<string,string|undefined>={...input};
  for(const [current,alias] of COLOR_ALIASES)resolved[current]=pick(input[current],input[alias]);
  for(const key of REQUIRED_COLORS)if(!isColor(resolved[key]))throw new TypeError("Invalid semantic color: "+key);
  for(const key of OPTIONAL_COLORS)if(resolved[key]!==undefined&&!isColor(resolved[key]))throw new TypeError("Invalid semantic color: "+key);
  const colors={
    ...Object.fromEntries([...REQUIRED_COLORS,...OPTIONAL_COLORS]
      .filter(k=>resolved[k]!==undefined).map(k=>[k,resolved[k]])),
    surface:resolved.surfaceRaised,foreground:resolved.text,
    muted:resolved.textMuted,background:resolved.surfaceSunken,
  } as TronTheme["colors"];
  const cardRadius=pick(theme.shape.cardRadius,theme.shape.surfaceRadius);
  const shape={controlRadius:theme.shape.controlRadius,cardRadius:cardRadius as number,
    borderWidth:theme.shape.borderWidth,surfaceRadius:cardRadius as number};
  if([shape.controlRadius,shape.cardRadius,shape.borderWidth,theme.motion.fastMs,theme.motion.standardMs]
    .some(n=>typeof n!=="number"||!Number.isFinite(n)||n<0))throw new RangeError("Invalid native theme metric");
  return {colors,shape,density:theme.density,motion:theme.motion};
}

/** CSS custom properties for every token the theme defines. */
export function themeCssVariables(theme:TronTheme):Readonly<Record<string,string>> {
  const out:Record<string,string>={};
  for(const [key,variable] of Object.entries(TRON_THEME_TOKENS.colors)){
    const value=(theme.colors as unknown as Record<string,string|undefined>)[key];
    if(value!==undefined)out[variable]=value;
  }
  out[TRON_THEME_TOKENS.shape.controlRadius]=theme.shape.controlRadius+"px";
  out[TRON_THEME_TOKENS.shape.cardRadius]=theme.shape.cardRadius+"px";
  return Object.freeze(out);
}
