/**
 * Forge original 24x24 bold glyph paths. Each tuple is [SVG path, paint mode].
 * paint=stroke draws a rounded line, paint=fill draws a filled silhouette,
 * paint=knockout cuts detail out of the glyph through an SVG mask.
 * This is a curated artwork set, NOT a placeholder for all catalog IDs.
 */
const S=(...d)=>d.map(p=>[p,"stroke"]);
const F=(...d)=>d.map(p=>[p,"fill"]);
const K=(...d)=>d.map(p=>[p,"knockout"]);
const both=(outline,filled)=>Object.freeze({outline:Object.freeze(outline),filled:Object.freeze(filled)});
export const glyphs=Object.freeze({
// Navigation and adaptive-device artwork: authored as distinct silhouettes.
"chevron-left":both(S("M15.5 5 8.5 12l7 7"),F("M14.5 3.5 6 12l8.5 8.5 3-3L12 12l5.5-5.5z")),
"chevron-right":both(S("m8.5 5 7 7-7 7"),F("M9.5 3.5 18 12l-8.5 8.5-3-3L12 12 6.5 6.5z")),
"chevron-up":both(S("m5 15.5 7-7 7 7"),F("M3.5 14.5 12 6l8.5 8.5-3 3L12 12l-5.5 5.5z")),
"chevron-down":both(S("m5 8.5 7 7 7-7"),F("M3.5 9.5 12 18l8.5-8.5-3-3L12 12 6.5 6.5z")),
"arrow-left":both(S("M21 12H3","m10 5-7 7 7 7"),F("M10 2 0 12l10 10 3-3-5-5h15v-4H8l5-5z")),
"arrow-right":both(S("M3 12h18","m14 5 7 7-7 7"),F("M14 2 24 12 14 22l-3-3 5-5H1v-4h15l-5-5z")),
"arrow-up":both(S("M12 21V3","m5 10 7-7 7 7"),F("M2 10 12 0l10 10-3 3-5-5v15h-4V8l-5 5z")),
"arrow-down":both(S("M12 3v18","m5 14 7 7 7-7"),F("M2 14 12 24l10-10-3-3-5 5V1h-4v15l-5-5z")),
"more-horizontal":both(
 S("M3 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0z","M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0z","M19 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0z"),
 F("M1.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z","M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z","M17.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z")),
"more-vertical":both(
 S("M11 4a1 1 0 1 0 2 0 1 1 0 1 0-2 0z","M11 12a1 1 0 1 0 2 0 1 1 0 1 0-2 0z","M11 20a1 1 0 1 0 2 0a1 1 0 1 0-2 0z"),
 F("M9.5 4a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z","M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z","M9.5 20a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z")),
"sidebar-left":both(S("M3 4h18v16H3z","M9 4v16","M5.5 8h1","M5.5 12h1"),
 [...F("M2 3h20v18H2z"),...K("M10 5h10v14H10z","M5 8h2","M5 12h2")]),
"sidebar-right":both(S("M3 4h18v16H3z","M15 4v16","M17.5 8h1","M17.5 12h1"),
 [...F("M2 3h20v18H2z"),...K("M4 5h10v14H4z","M17 8h2","M17 12h2")]),
"split-view":both(S("M3 4h7v16H3z","M14 4h7v16h-7z"),F("M2 3h9v18H2z","M13 3h9v18h-9z")),
"grid-view":both(S("M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"),
 F("M2 2h9v9H2z","M13 2h9v9h-9z","M2 13h9v9H2z","M13 13h9v9h-9z")),
"list-view":both(S("M4 5h1","M9 5h11","M4 12h1","M9 12h11","M4 19h1","M9 19h11"),
 F("M2 3h4v4H2z","M9 3h13v4H9z","M2 10h4v4H2z","M9 10h13v4H9z","M2 17h4v4H2z","M9 17h13v4H9z")),
"external-link":both(S("M14 3h7v7","M21 3 11 13","M10 4H3v17h17v-7"),
 F("M12 1h11v11h-4V8l-8 8-3-3 8-8h-4z","M1 3h8v4H5v12h12v-4h4v8H1z")),
"pin":both(S("M9 3h6","M10 3v6l-4 5v2h12v-2l-4-5V3","M12 16v6"),
 F("M7 2h10v3h-1v4l4 5v4h-6v5h-4v-5H4v-4l4-5V5H7z")),
"unpin":both(S("M12 3h3","M14 3v6l4 5v2h-4","M7 12l-1 2v2h4","M12 18v4","M3 3l18 18"),
 [...F("M10 2h7v3h-1v4l4 5v2l-7-7V5h-3z","M6 11l5 5H4v-2z","M10 18h4v5h-4z"),...S("M3 3l18 18")]),
"device-phone":both(S("M7 2h10v20H7z","M10 5h4","M11 19h2"),
 [...F("M6 1h12v22H6z"),...K("M9 5h6v11H9z","M11 19h2")]),
"device-tablet":both(S("M4 2h16v20H4z","M7 5h10v12H7z","M11 20h2"),
 [...F("M3 1h18v22H3z"),...K("M6 4h12v13H6z","M11 20h2")]),
"device-foldable":both(S("M3 3h18v18H3z","M12 3v18","M5.5 6h3","M15.5 18h3"),
 [...F("M2 2h20v20H2z"),...K("M5 5h5v14H5z","M14 5h5v14h-5z")]),
"device-duo":both(S("M2 3h8v18H2z","M14 3h8v18h-8z","M10 8h4","M10 16h4"),
 [...F("M1 2h10v20H1z","M13 2h10v20H13z"),...K("M4 5h4v14H4z","M16 5h4v14h-4z"),...S("M11 8h2","M11 16h2")]),
"device-desktop":both(S("M2 3h20v14H2z","M9 21h6","M12 17v4"),
 [...F("M1 2h22v16H1z","M10 18h4v2h4v3H6v-3h4z"),...K("M4 5h16v10H4z")]),
"device-watch":both(S("M7 6h10v12H7z","M9 6V2h6v4","M9 18v4h6v-4","M12 9v3l2 1"),
 [...F("M6 5h12v14H6z","M8 1h8v4H8z","M8 19h8v4H8z"),...K("M12 8v4l3 2")]),
"folding-book":both(S("M2 5 10 3v18l-8-2z","M14 3l8 2v14l-8 2z","M10 8h4","M10 16h4"),
 [...F("M1 4 11 1v22L1 20z","M13 1l10 3v16l-10 3z"),...K("M4 7l4-1v12l-4-1z","M16 6l4 1v10l-4 1z"),...S("M11 8h2","M11 16h2")]),
"folding-tabletop":both(S("M6 2h12v9H6z","M6 14h12l4 7H2z","M9 11v3","M15 11v3"),
 [...F("M5 1h14v11H5z","M5 13h14l5 10H0z"),...K("M8 4h8v5H8z","M7 16h10l2 4H5z")]),
lock:both(S("M5 10h14v12H5z","M8 10V6a4 4 0 0 1 8 0v4","M12 15v3"),
 [...F("M4 9h16v14H4z"),...S("M8 9V6a4 4 0 0 1 8 0v3"),...K("M12 14v4")]),
unlock:both(S("M5 10h14v12H5z","M8 10V6a4 4 0 0 1 7.5-2","M12 15v3"),
 [...F("M4 9h16v14H4z"),...S("M8 9V6a4 4 0 0 1 7.5-2"),...K("M12 14v4")]),
download:both(S("M12 2v13","m7 10 5 5 5-5","M3 16v5h18v-5"),
 F("M10 1h4v9l3-3 3 3-8 8-8-8 3-3 3 3z","M1 16h4v3h14v-3h4v7H1z")),
upload:both(S("M12 15V2","m7 7 5-5 5 5","M3 16v5h18v-5"),
 F("M12 0 20 8l-3 3-3-3v9h-4V8l-3 3-3-3z","M1 16h4v3h14v-3h4v7H1z")),

home:both(S("M3 11.2 12 3.5l9 7.7v9.1a1 1 0 0 1-1 1h-5.2v-6.7H9.2v6.7H4a1 1 0 0 1-1-1z"),
  [...F("M2.6 10.6 11.2 3a1.2 1.2 0 0 1 1.6 0l8.6 7.6c.3.3.5.7.5 1.1v8.7c0 .8-.6 1.4-1.4 1.4h-5.8v-7.2H9.3v7.2H3.4c-.8 0-1.4-.6-1.4-1.4v-8.7c0-.4.2-.8.6-1.1z")]),
dashboard:both(S("M3.5 3.5h7v7h-7z","M13.5 3.5h7v4h-7z","M13.5 10.5h7v10h-7z","M3.5 13.5h7v7h-7z"),
  F("M2.5 2.5h9v9h-9z","M12.5 2.5h9v6h-9z","M12.5 9.5h9v12h-9z","M2.5 12.5h9v9h-9z")),
menu:both(S("M3 6h18","M3 12h18","M3 18h18"),F("M2 4.4h20v3.2H2z","M2 10.4h20v3.2H2z","M2 16.4h20v3.2H2z")),
search:both(S("M10.7 18a7.3 7.3 0 1 0 0-14.6 7.3 7.3 0 0 0 0 14.6z","m16 16 5 5"),
  [...F("M10.5 2a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z"),...K("M10.5 5.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"),...S("m16.6 16.6 4.8 4.8")]),
save:both(S("M4 3h13l4 4v14H3V4a1 1 0 0 1 1-1z","M7 3v7h10V3","M7 21v-7h10v7"),
  [...F("M3.5 2h13.8L22 6.7v14c0 .7-.6 1.3-1.3 1.3H3.3C2.6 22 2 21.4 2 20.7V3.5C2 2.7 2.7 2 3.5 2z"),
    ...K("M6 3.2h11v7H6z","M7 14h10v7H7z")]),
file:both(S("M6 2.8h8l5 5V21H6z","M14 2.8v5h5"),
  [...F("M5 2h10l5 5v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"),...K("M14 2.5v5h5")]),
folder:both(S("M2.5 6h7l2 2h10v12h-19z"),
  F("M2 5h7.7l2.3 2.2H21a2 2 0 0 1 2 2V20a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 1-2z")),
undo:both(S("M10 7 5 12l5 5","M5 12h10a5.5 5.5 0 0 1 0 11"),
  [...F("M2 12 11 3v5h4a8 8 0 0 1 0 16h-3v-4h3a4 4 0 0 0 0-8H11v5z")]),
redo:both(S("m14 7 5 5-5 5","M19 12H9a5.5 5.5 0 0 0 0 11"),
  F("M22 12 13 3v5H9a8 8 0 0 0 0 16h3v-4H9a4 4 0 0 1 0-8h4v5z")),
pen:both(S("m4.5 19 5.5-1.5L20 7.5a2.1 2.1 0 0 0 0-3l-.5-.5a2.1 2.1 0 0 0-3 0L6.5 14z","m14.5 6.5 3 3","M4 21h16"),
  [...F("M3.2 20.8 5.3 13 16.7 1.8a2.5 2.5 0 0 1 3.5 0l2 2a2.5 2.5 0 0 1 0 3.5L10.9 18.6z"),...K("M15.4 5.3 18.8 8.7")]),
pencil:both(S("m4 20 4.2-1L20 7.1a2.2 2.2 0 0 0-3.1-3.1L5 16z","m14.9 6 3.1 3.1"),
  F("M2 22 4.8 14 16.5 2.4a2.6 2.6 0 0 1 3.7 0l1.4 1.4a2.6 2.6 0 0 1 0 3.7L9.9 19.2z")),
brush:both(S("M15 3c1.9.8 4 2.7 5 4.4L12 15","M12 15c-2-1.9-5.8-1-6 2.3-.1 1.9-.9 2.7-3 3.7 5.3.9 8.5-.6 9-6z"),
  F("M15.5 1.8c2.9 1.2 5.7 3.7 7 6L13.7 16l-4.5-4.5z","M11.5 13.5c-4-1.5-7 .9-7.2 4.2-.1 1.4-.8 2.9-2.8 4.2 6.6 1.1 11.7-1.3 10-8.4z")),
eraser:both(S("M3.7 14.7 13.6 4.8a2.8 2.8 0 0 1 4 0l2 2a2.8 2.8 0 0 1 0 4l-10 10H7.4l-3.7-3.7a1.7 1.7 0 0 1 0-2.4z","M11 7.5 17 13.5","M10 21h11"),
  [...F("M2.4 14.4 13.5 3.3a3 3 0 0 1 4.2 0l3.1 3.1a3 3 0 0 1 0 4.2L10.6 21H6.9l-4.5-4.5a1.5 1.5 0 0 1 0-2.1z"),...K("m10 8 6 6"),...S("M11 21h10")]),
highlighter:both(S("m3 16 9-9 5 5-9 9H3z","m12 7 3-3 5 5-3 3","M2 22h20"),
  [...F("m2 16 10-10 6 6-10 10H2z","m12 6 2.8-2.8a2 2 0 0 1 2.9 0l3.1 3.1a2 2 0 0 1 0 2.9L18 12z"),...S("M2 22h20")]),
hand:both(S("M8 13V5a1.4 1.4 0 0 1 2.8 0v6V3.7a1.4 1.4 0 0 1 2.8 0V11 5a1.4 1.4 0 0 1 2.8 0v7.5-4.1a1.4 1.4 0 0 1 2.8 0V16c0 3.4-2.5 6-6 6H10c-2.1 0-3.8-.9-4.8-2.5L2 14.7a1.6 1.6 0 0 1 2.5-2z"),
 F("M7 11V5a2 2 0 0 1 4 0v6-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v6-2a2 2 0 0 1 4 0v6a8 8 0 0 1-8 8h-4a8 8 0 0 1-6.3-3.1l-3.3-4.3a2.1 2.1 0 0 1 3.2-2.7z")),
move:both(S("M12 3v18","M3 12h18","M9.5 5.5 12 3l2.5 2.5","M9.5 18.5 12 21l2.5-2.5","M5.5 9.5 3 12l2.5 2.5","M18.5 9.5 21 12l-2.5 2.5"),
 F("M12 1 7 7h3v3H7V7l-6 5 6 5v-3h3v3H7l5 6 5-6h-3v-3h3v3l6-5-6-5v3h-3V7h3z")),
pointer:both(S("M4.5 2 20 12l-7 1-3.2 7.5z"),
 F("M3.3 1.8a1.1 1.1 0 0 1 1.2.1l16.8 10.6a1 1 0 0 1-.3 1.8l-7 1-3.4 6.1a1 1 0 0 1-1.9-.2z")),
lasso:both(S("M20.5 11c0 4.2-3.8 6.5-8.5 6.5s-8.5-2.3-8.5-6.5S7.3 4.5 12 4.5s8.5 2.3 8.5 6.5z","M12 17.5c-.3 2.5-2.1 3.5-3.3 4.1"),
 [...F("M12 3C6.2 3 2 6.4 2 11s4.2 8 10 8 10-3.4 10-8S17.8 3 12 3z"),...K("M12 6.6c-4 0-6.4 1.8-6.4 4.4s2.4 4.4 6.4 4.4 6.4-1.8 6.4-4.4S16 6.6 12 6.6z"),...S("M12 17c-.3 2.5-2.1 3.7-3.4 4.5")]),
rectangle:both(S("M3.5 4.5h17v15h-17z"),F("M2 3h20v18H2z")),
ellipse:both(S("M21 12c0 4.7-4 8-9 8s-9-3.3-9-8 4-8 9-8 9 3.3 9 8z"),
 F("M22 12c0 5.5-4.5 9.5-10 9.5S2 17.5 2 12s4.5-9.5 10-9.5S22 6.5 22 12z")),
text:both(S("M3 6V4h18v2","M12 4v17","M8.5 21h7"),
 F("M2 3h20v6h-3V6h-5v13h3v3H7v-3h3V6H5v3H2z")),
image:both(S("M3 3h18v18H3z","M7.5 8a1.2 1.2 0 1 0 2.4 0 1.2 1.2 0 0 0-2.4 0z","m3 18 5-6 4 4 3-3 6 6"),
 [...F("M2 2h20v20H2z"),...K("M6.5 6.2a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0z","m3 18 5-6 4 4 3-3 6 6")]),
layers:both(S("M12 2.5 22 8l-10 5.5L2 8z","m2 12.5 10 5.5 10-5.5","m2 17 10 5.5L22 17"),
 [...F("M12 1 23 8 12 15 1 8z"),...S("m2 13 10 6 10-6","m2 18 10 5 10-5")]),
comment:both(S("M3 4h18v13H8l-5 4z"),
 [...F("M3 3h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9l-6.5 4V5A2 2 0 0 1 3 3z"),...K("M6.5 9h11","M6.5 13h8")]),
play:both(S("M7 3.5 20 12 7 20.5z"),F("M6 2.5c0-.9 1-1.4 1.8-.9l14.3 9.5a1 1 0 0 1 0 1.8l-14.3 9.5c-.8.5-1.8 0-1.8-.9z")),
pause:both(S("M6 4h4v16H6z","M14 4h4v16h-4z"),F("M5 3h6v18H5z","M13 3h6v18h-6z")),
stop:both(S("M5 5h14v14H5z"),F("M4 4h16v16H4z")),
scissors:both(S("m6 6 12 12","m18 6-12 12","M3 6a3 3 0 1 0 6 0 3 3 0 0 0-6 0z","M3 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"),
 [...F("M3 3.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z","M3 16.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z"),...S("m9 8 12 13","m9 16 12-13")]),
table:both(S("M3 4h18v16H3z","M3 10h18","M3 15h18","M10 4v16","M16 10v10"),
 [...F("M2 3h20v18H2z"),...K("M4 9h16","M4 15h16","M10 4v16","M16 10v10")]),
chart:both(S("M4 21V13h4v8","M10 21V4h4v17","M16 21v-9h4v9"),
 F("M3 12h6v10H3z","M9 2h6v20H9z","M15 11h6v11h-6z")),
slide:both(S("M3 4h18v14H3z","M12 18v4","M7 22h10","M7 8h10","M7 12h7"),
 [...F("M2 3h20v16H2z"),...K("M6 8h12","M6 12h9"),...S("M12 19v3","M7 22h10")]),
pdf:both(S("M5 2h10l4 4v16H5z","M15 2v5h4","M7.5 12h9","M7.5 16h6"),
 [...F("M4 1h12l5 5v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"),...K("M15 2v5h5","M7 12h10","M7 16h7")]),
video:both(S("M3 5h14v14H3z","m17 10 5-3v10l-5-3"),
 F("M2 4h15v16H2z","m17 9 6-4v14l-6-4z")),
audio:both(S("m4 9 4 0 4-4v14l-4-4H4z","M16 9c2 2 2 4 0 6","M19 6c4 3 4 9 0 12"),
 [...F("M3 8h4l6-5v18l-6-5H3z"),...S("M16 9c2 2 2 4 0 6","M19 6c4 3 4 9 0 12")]),
music:both(S("M10 18V5l11-2v13","M10 5l11-2","M4 19a3 2 0 1 0 6 0 3 2 0 0 0-6 0z","M15 17a3 2 0 1 0 6 0 3 2 0 0 0-6 0z"),
 F("M9 4 22 1v16h-3V7l-7 1.6V20H9z","M3 18c0-2 2.2-3 5-3s5 1 5 3-2.2 3-5 3-5-1-5-3z","M14 16c0-2 2.2-3 5-3s5 1 5 3-2.2 3-5 3-5-1-5-3z")),
bluetooth:both(S("M12 2v20l6-5-12-10","M12 2l6 5L6 17"),
 [...F("M11 1h2.5L21 7.5 15.5 12l5.5 4.5-7.5 6.5H11v-8l-5.3 4.5-2.2-2.4 6-5.1-6-5.1 2.2-2.4L11 9z"),...K("M14 6v4l2.5-2z","M14 14v4l2.5-2z")]),
check:both(S("m4 12 5.5 5.5L20 6"),S("m3 12 6 6L21 5")),
close:both(S("M5 5 19 19","M19 5 5 19"),S("M4.5 4.5 19.5 19.5","M19.5 4.5 4.5 19.5")),
plus:both(S("M12 3v18","M3 12h18"),S("M12 2v20","M2 12h20")),
minus:both(S("M3 12h18"),S("M2 12h20")),
share:both(S("M12 15V3","m7 8 5-5 5 5","M4 14v7h16v-7"),
 [...S("M12 15V2","m-6 7 6-7 6 7"),...F("M2 13h4v6h12v-6h4v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z")]),
export:both(S("M12 15V3","m-5 7 5-5 5 5","M4 13v8h16v-8"),
 [...S("M12 16V2","m-6 7 6-7 6 7"),...F("M2 13h4v6h12v-6h4v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z")]),
settings:both(S("M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z","M9 2h6l.7 2.6 2 1.2 2.6-.7 3 5.2-1.9 1.9v2.4l1.9 1.9-3 5.2-2.6-.7-2 1.2L15 22H9l-.7-2.6-2-1.2-2.6.7-3-5.2 1.9-1.9V9.4L.7 7.5l3-5.2 2.6.7 2-1.2z"),
 [...F("M9.3 1h5.4l1 3 2 1 3.1-.6 2.7 4.7-2 2.4v2.6l2 2.4-2.7 4.7-3.1-.6-2 1-1 3H9.3l-1-3-2-1-3.1.6L.5 16.5l2-2.4v-2.6l-2-2.4 2.7-4.7 3.1.6 2-1z"),...K("M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z")]),
sparkles:both(S("m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z","m19 2 .8 2.2L22 5l-2.2.8L19 8"),
 F("m12 1 3 8 8 3-8 3-3 8-3-8-8-3 8-3z","m19 1 .8 2.2L22 4l-2.2.8L19 7z")),
microphone:both(S("M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z","M5 11a7 7 0 0 0 14 0","M12 18v4","M8 22h8"),
 [...F("M12 2a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"),...S("M5 11a7 7 0 0 0 14 0","M12 18v4","M8 22h8")]),
timeline:both(S("M3 5h18v14H3z","M3 10h18","M8 10v9","M14 10v9","M6 14h3","M12 14h4"),
 [...F("M2 4h20v16H2z"),...K("M4 9h16","M8 10v9","M15 10v9")]),
"color-wheel":both(S("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 3v9l8 4","M12 12l-8 4"),
 F("M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22z")),
});
/**
 * Catalog IDs whose slug is an artwork key (`navigation/home` draws `home`).
 * Listed here instead of importing the 1,463-ID catalog so a renderer only
 * ships glyph data; a test keeps this list in step with `iconIds`.
 */
const slugCatalogIds=`
navigation/home navigation/dashboard navigation/menu navigation/sidebar-left navigation/sidebar-right navigation/layers
navigation/search navigation/settings navigation/split-view navigation/grid-view navigation/list-view navigation/more-horizontal
navigation/more-vertical navigation/chevron-left navigation/chevron-right navigation/chevron-up navigation/chevron-down navigation/arrow-left
navigation/arrow-right navigation/arrow-up navigation/arrow-down navigation/external-link navigation/close navigation/check
navigation/plus navigation/minus navigation/pin navigation/unpin file/save file/file
file/folder file/download file/upload file/export file/share edit/undo
edit/redo edit/lock edit/unlock selection/pointer selection/move selection/hand
selection/lasso vector/pen vector/pencil vector/rectangle vector/ellipse paint/highlighter
paint/eraser paint/color-wheel color/color-wheel typography/text layout/folding-book layout/folding-tabletop
image/image charts/chart video/video video/timeline video/play video/pause
video/stop video/slide audio/audio audio/microphone collaboration/comment spatial/bluetooth
devices/device-phone devices/device-tablet devices/device-desktop devices/device-foldable devices/device-duo devices/device-watch
`.trim().split(/\s+/);
/** Artwork keys that are not catalog slugs, mapped to the IDs they draw. */
const artworkAliases=Object.freeze({
 brush:["paint/paintbrush"],
 scissors:["edit/cut"],
 table:["spreadsheet/sheet"],
 pdf:["file/document-pdf"],
 music:["audio/note"],
 sparkles:["ai/ai-sparkle"],
});
const artworkById=new Map();
for(const id of slugCatalogIds){
 const slug=id.slice(id.indexOf("/")+1);
 if(!Object.hasOwn(glyphs,slug))throw new Error("Glyph catalog ID "+id+" has no artwork key "+slug);
 artworkById.set(id,glyphs[slug]);
}
for(const [key,ids] of Object.entries(artworkAliases)){
 if(!Object.hasOwn(glyphs,key))throw new Error("Glyph alias names missing artwork "+key);
 for(const id of ids){
  if(artworkById.has(id))throw new Error("Glyph alias "+key+" collides with "+id);
  artworkById.set(id,glyphs[key]);
 }
}
const drawn=new Set(artworkById.values());
for(const key of Object.keys(glyphs)){
 if(!drawn.has(glyphs[key]))throw new Error("Glyph artwork "+key+" is not reachable from any catalog ID");
}
/** Catalog IDs (`category/slug`) that have finished outline and filled artwork. */
export const glyphIds=Object.freeze([...artworkById.keys()]);
/**
 * Paths for a catalog ID such as `vector/pen`, or `undefined` when the ID is
 * unknown or has no finished artwork. Bare slugs (`"pen"`) and IDs in the
 * wrong category (`"bogus/home"`) are rejected so a backlog name never
 * borrows another glyph.
 */
export function getGlyph(id,variant="outline"){
 if(variant!=="outline"&&variant!=="filled")return undefined;
 return typeof id==="string"?artworkById.get(id)?.[variant]:undefined;
}
