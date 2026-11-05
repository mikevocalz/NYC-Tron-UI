import { themeCssVariables, validateTheme, type TronTheme } from '../theme.ts';

/**
 * Brand-specific preset built on NYC-Tron primitives.
 * Consumers own Tailwind v4 / Uniwind CSS; this is the semantic/native resource
 * map, not a hardcoded theme inside Button/Card/NavigationRail.
 *
 * Labels on the brand orange use navy: white on #f37021 is 2.94:1 and fails
 * WCAG AA, navy is 6.67:1. The light accent is the darker #b04d0c so wires,
 * knob rings and waveform bars reach 3:1 on the sunken surface.
 */
export const INFRAX_THEME: TronTheme = validateTheme({
 colors: {
  primary:'#f37021',onPrimary:'#000d1a',
  surfaceRaised:'#ffffff',surfaceSunken:'#f8fafc',
  border:'#dbe3eb',text:'#000d1a',textMuted:'#64748b',
  danger:'#b42318',onDanger:'#ffffff',accent:'#b04d0c',focus:'#b04d0c',
  info:'#1d5fa8',success:'#1e7a3c'
 },
 shape:{controlRadius:4,cardRadius:6,borderWidth:1},
 density:'comfortable',motion:{fastMs:120,standardMs:240}
});
export const INFRAX_DARK_THEME: TronTheme = validateTheme({
 colors:{
  primary:'#f37021',onPrimary:'#000d1a',
  surfaceRaised:'#071b2e',surfaceSunken:'#000d1a',
  border:'#21384a',text:'#ffffff',textMuted:'#94a3b8',
  danger:'#ff8a80',onDanger:'#000d1a',accent:'#f37021',focus:'#ff9c64',
  info:'#8ab8ff',success:'#6fd08c'
 },
 shape:{controlRadius:4,cardRadius:6,borderWidth:1},
 density:'comfortable',motion:{fastMs:120,standardMs:240}
});
export const INFRAX_THEME_NAME='InFraX Signal / Infrastructure Orange' as const;

/** Status colors a host may swap without rebuilding the whole theme. */
export interface InfraxStatusColors {
 readonly danger:string;
 readonly onDanger:string;
 readonly accent:string;
}
export interface InfraxTokenOptions {
 readonly status?:InfraxStatusColors;
}

/** CSS custom properties for the 15 variables NYC-Tron components read. */
export function infraxTokens(theme:TronTheme=INFRAX_THEME,options:InfraxTokenOptions={}) {
 const colors=options.status?{...theme.colors,...options.status}:theme.colors;
 return themeCssVariables(validateTheme({...theme,colors}));
}
