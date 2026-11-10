import type { TooltipProps } from "./Tooltip.types.ts";
export type { TooltipProps } from "./Tooltip.types.ts";

/** Importing this leaf is safe; requesting its unsupported surface is explicit. */
export function Tooltip(_props:TooltipProps):never {
  throw new Error("Tooltip has no QNX/Marathon implementation yet. Render persistent help text beside the control.");
}
