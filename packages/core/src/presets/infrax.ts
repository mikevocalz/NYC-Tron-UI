import { validateTheme, type TronTheme } from '../theme.ts';

/**
 * Brand-specific preset built on NYC-Tron primitives.
 * Consumers own Tailwind v4 / Uniwind CSS; this is the semantic/native resource
 * map, not a hardcoded theme inside Button/Card/NavigationRail.
 *
 * Labels on the brand orange use navy: white on #f37021 is 2.94:1 and fails
 * WCAG AA, navy is 6.67:1.
 */
export const INFRAX_THEME: TronTheme = validateTheme({
 colors: {
  background:'#ffffff', surface:'#f8fafc', foreground:'#000d1a',
  muted:'#64748b',border:'#dbe3eb',primary:'#f37021',
  onPrimary:'#000d1a',focus:'#b04d0c'
 },
 shape:{controlRadius:4,surfaceRadius:6,borderWidth:1},
 density:'comfortable',motion:{fastMs:120,standardMs:240}
});
export const INFRAX_DARK_THEME: TronTheme = validateTheme({
 colors:{
  background:'#000d1a',surface:'#071b2e',foreground:'#ffffff',
  muted:'#94a3b8',border:'#21384a',primary:'#f37021',
  onPrimary:'#000d1a',focus:'#ff9c64'
 },
 shape:{controlRadius:4,surfaceRadius:6,borderWidth:1},
 density:'comfortable',motion:{fastMs:120,standardMs:240}
});
export const INFRAX_THEME_NAME='InFraX Signal / Infrastructure Orange' as const;

/** Status and accent colors the component recipes need beyond TronTheme. */
export interface InfraxStatusColors {
 readonly danger:string;
 readonly onDanger:string;
 /** Wires, knob rings, waveform bars: must reach 3:1 against the sunken surface. */
 readonly accent:string;
}
export const INFRAX_STATUS:InfraxStatusColors=Object.freeze({
 danger:'#b42318',onDanger:'#ffffff',accent:'#b04d0c'
});
export const INFRAX_DARK_STATUS:InfraxStatusColors=Object.freeze({
 danger:'#ff8a80',onDanger:'#000d1a',accent:'#f37021'
});

export interface InfraxTokenOptions {
 /** Which plane is raised. Defaults to dark for INFRAX_DARK_THEME, else light. */
 readonly appearance?:'light'|'dark';
 readonly status?:InfraxStatusColors;
}
/**
 * CSS custom properties for the variables NYC-Tron components read (see
 * docs/THEME_TOKENS.md). Raised surfaces are the lighter plane in light mode
 * and the lifted navy in dark mode; sunken is the opposite plane.
 */
export function infraxTokens(theme:TronTheme=INFRAX_THEME,options:InfraxTokenOptions={}) {
 const t=validateTheme(theme);
 const appearance=options.appearance??(theme===INFRAX_DARK_THEME?'dark':'light');
 const status=options.status??(appearance==='dark'?INFRAX_DARK_STATUS:INFRAX_STATUS);
 if(Object.values(status).some(c=>typeof c!=='string'||!c.trim()))throw new TypeError('Invalid status color');
 const dark=appearance==='dark';
 return Object.freeze({
  '--color-primary':t.colors.primary,
  '--color-on-primary':t.colors.onPrimary,
  '--color-surface-raised':dark?t.colors.surface:t.colors.background,
  '--color-surface-sunken':dark?t.colors.background:t.colors.surface,
  '--color-border':t.colors.border,
  '--color-text':t.colors.foreground,
  '--color-text-muted':t.colors.muted,
  '--color-danger':status.danger,
  '--color-on-danger':status.onDanger,
  '--color-accent':status.accent,
  '--color-focus':t.colors.focus,
  '--radius-control':t.shape.controlRadius+'px',
  '--radius-card':t.shape.surfaceRadius+'px',
 });
}
