import { validateTheme, type TronTheme } from '../theme.ts';

/**
 * Brand-specific preset built on NYC-Tron primitives.
 * Consumers own Tailwind v4 / Uniwind CSS; this is the semantic/native resource
 * map, not a hardcoded theme inside Button/Card/NavigationRail.
 */
export const INFRAX_THEME: TronTheme = validateTheme({
 colors: {
  background:'#ffffff', surface:'#f8fafc', foreground:'#000d1a',
  muted:'#64748b',border:'#dbe3eb',primary:'#f37021',
  onPrimary:'#ffffff',focus:'#b04d0c'
 },
 shape:{controlRadius:4,surfaceRadius:6,borderWidth:1},
 density:'comfortable',motion:{fastMs:120,standardMs:240}
});
export const INFRAX_DARK_THEME: TronTheme = validateTheme({
 colors:{
  background:'#000d1a',surface:'#071b2e',foreground:'#ffffff',
  muted:'#94a3b8',border:'#21384a',primary:'#f37021',
  onPrimary:'#ffffff',focus:'#ff9c64'
 },
 shape:{controlRadius:4,surfaceRadius:6,borderWidth:1},
 density:'comfortable',motion:{fastMs:120,standardMs:240}
});
export const INFRAX_THEME_NAME='InFraX Signal / Infrastructure Orange' as const;
/** Host can spread this into CSS custom properties or native resource mappings. */
export function infraxTokens(theme:TronTheme=INFRAX_THEME) {
 const t=validateTheme(theme);
 return Object.freeze({
  '--color-background':t.colors.background,'--color-surface':t.colors.surface,
  '--color-foreground':t.colors.foreground,'--color-muted':t.colors.muted,
  '--color-border':t.colors.border,'--color-primary':t.colors.primary,
  '--color-on-primary':t.colors.onPrimary,'--color-focus':t.colors.focus,
  '--radius-control':t.shape.controlRadius+'px',
  '--radius-surface':t.shape.surfaceRadius+'px'
 });
}
