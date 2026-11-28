import { themeCssVariables, validateTheme, type TronTheme } from "../theme.ts";

/**
 * NYC-Tron's optional default theme: neutral light and dark values that
 * define every required and optional color, for apps that want a working
 * palette before (or instead of) their own. Components never read these
 * values directly; they keep reading the semantic CSS variables, so an app
 * can override single tokens with `createTronTheme` or replace the theme.
 *
 * WCAG 2.1 AA, checked by packages/core/tests/tron-theme.test.mjs: text and
 * textMuted on both surfaces, onPrimary on primary and onDanger on danger
 * are at least 4.5:1; border and focus are at least 3:1 against both
 * surfaces. The colors are the reference values in docs/THEME_TOKENS.md
 * with a darker light border and a lighter dark border, so a bordered input
 * meets WCAG 1.4.11 on its own.
 */
export const tronLightTheme:TronTheme=validateTheme({
  colors:{
    primary:"#1f5fd1",onPrimary:"#ffffff",
    surfaceRaised:"#ffffff",surfaceSunken:"#f1f3f6",
    border:"#7a8799",text:"#15181d",textMuted:"#5a626e",
    danger:"#b42318",onDanger:"#ffffff",accent:"#1f7a6d",
    info:"#1d5fa8",success:"#1e7a3c",focus:"#1f5fd1",
  },
  shape:{controlRadius:8,cardRadius:12,borderWidth:1},
  density:"comfortable",motion:{fastMs:120,standardMs:240},
});

/** Dark counterpart of {@linkcode tronLightTheme}; same shape, density and motion. */
export const tronDarkTheme:TronTheme=validateTheme({
  colors:{
    primary:"#7aa7ff",onPrimary:"#0b1730",
    surfaceRaised:"#1b1f26",surfaceSunken:"#12151a",
    border:"#6b7584",text:"#e8ebf0",textMuted:"#a3abb7",
    danger:"#ff8a80",onDanger:"#2b0703",accent:"#5fd0bf",
    info:"#8ab8ff",success:"#6fd08c",focus:"#7aa7ff",
  },
  shape:{controlRadius:8,cardRadius:12,borderWidth:1},
  density:"comfortable",motion:{fastMs:120,standardMs:240},
});

const block=(indent:string,vars:Readonly<Record<string,string>>)=>
  Object.entries(vars).map(([name,value])=>`${indent}${name}: ${value};`).join("\n");

/**
 * The Uniwind stylesheet for a light and a dark theme: radius tokens in
 * `@theme` (from `light`), and every variable of each theme under Uniwind's
 * `light` and `dark` variants. With the defaults this is exactly the text of
 * `@nyc-tron/core/theme.css`. The `light` variant is registered by Uniwind,
 * so a plain Tailwind v4 app uses the CSS in docs/THEME_TOKENS.md instead.
 */
export function tronThemeStylesheet(light:TronTheme=tronLightTheme,dark:TronTheme=tronDarkTheme):string {
  const lightVars=themeCssVariables(light);
  const radius=Object.fromEntries(Object.entries(lightVars).filter(([name])=>name.startsWith("--radius-")));
  return [
    "/* NYC-Tron default theme (optional). Generated from tronLightTheme and",
    "   tronDarkTheme in @nyc-tron/core/presets/tron; override tokens in your",
    "   own stylesheet after this import, or replace the import entirely. */",
    "@theme {",
    block("  ",radius),
    "}",
    "@layer theme {",
    "  :root {",
    "    @variant light {",
    block("      ",lightVars),
    "    }",
    "    @variant dark {",
    block("      ",themeCssVariables(dark)),
    "    }",
    "  }",
    "}",
    "",
  ].join("\n");
}
