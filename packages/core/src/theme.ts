/**
 * Native theme-resource adapter input. Tailwind CSS v4/Uniwind remains the
 * consuming app's theme source; this does NOT replace its @theme variables.
 */
export interface TronTheme {
  readonly colors: {
    readonly background:string; readonly surface:string; readonly foreground:string;
    readonly muted:string; readonly border:string; readonly primary:string;
    readonly onPrimary:string; readonly focus:string;
  };
  readonly shape: {
    readonly controlRadius:number;readonly surfaceRadius:number;readonly borderWidth:number;
  };
  readonly density:"comfortable"|"compact"|"touch";
  readonly motion:{readonly fastMs:number;readonly standardMs:number};
}
export function validateTheme(theme:TronTheme):TronTheme {
  if(Object.values(theme.colors).some(c=>typeof c!=="string"||!c.trim()))throw new TypeError("Invalid semantic color");
  if([...Object.values(theme.shape),...Object.values(theme.motion)].some(n=>!Number.isFinite(n)||n<0))throw new RangeError("Invalid native theme metric");
  return theme;
}
