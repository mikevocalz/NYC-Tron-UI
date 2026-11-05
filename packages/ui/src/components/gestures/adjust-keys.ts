/** What a key press asks an adjustable control to do; see {@linkcode adjustKey}. */
export type AdjustIntent=
  |{readonly kind:"step";readonly direction:-1|1}
  |{readonly kind:"page";readonly direction:-1|1}
  |{readonly kind:"min"}
  |{readonly kind:"max"}
  |{readonly kind:"cancel"};

/**
 * Maps a key name to an adjustable-control intent, following the ARIA slider
 * pattern: arrows step, Page Up/Down take a large step, Home/End jump to the ends,
 * Escape cancels a drag. With `rtl`, Left increases and Right decreases, so the
 * arrow keys follow a track drawn right to left. Up/Down never flip.
 */
export function adjustKey(key:string|undefined,rtl=false):AdjustIntent|undefined{
  switch(key){
    case "ArrowRight":return {kind:"step",direction:rtl?-1:1};
    case "ArrowLeft":return {kind:"step",direction:rtl?1:-1};
    case "ArrowUp":return {kind:"step",direction:1};
    case "ArrowDown":return {kind:"step",direction:-1};
    case "PageUp":return {kind:"page",direction:1};
    case "PageDown":return {kind:"page",direction:-1};
    case "Home":return {kind:"min"};
    case "End":return {kind:"max"};
    case "Escape":return {kind:"cancel"};
    default:return undefined;
  }
}
