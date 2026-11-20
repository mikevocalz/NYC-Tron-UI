// Emits the static docs site to docs/site/. Dependency-free, built from the doc pages, tokens.json and the README.
//   node tooling/docs/build-site.mjs            write docs/site/
//   node tooling/docs/build-site.mjs --check    write nothing, exit 1 if anything would change
// Files: index.html (home), c.html (one component page, rendered in the browser from assets/pages.js),
// tokens.html and tokens.md, install.html, search.html, search-index.json, assets/site.css, assets/site.js, assets/pages.js.
// Why c.html and not 560 files: 560 static pages cost about 5 MB of generated HTML that repeats docs/components/*.md.
// One pages.js (the markdown, markers stripped) is about 2 MB and opens from file://, where fetch() of a sibling file is blocked.
// Raw markdown for every page stays at ../components/<id>.md (relative) and at the raw.githubusercontent.com URL at the registry ref.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {ROOT, AN, PAGES, read, readJson, exists, parsePage, registryRef, isMovingRef, refNote, rawUrl, REPO, mdTable, tarballToRegistry} from "./lib.mjs";
import {buildModel} from "./model.mjs";

const CHECK = process.argv.includes("--check");
const OUT = "docs/site";
const TAG = registryRef();
const model = buildModel();
const BUDGET = {css: 24 * 1024, js: 32 * 1024, search: 400 * 1024, c: 24 * 1024};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// ---------------- data ----------------
const copy1 = new Map(readJson(`${AN}/copy.json`).items.map((i) => [i.id, i]));
const copy2 = new Map(readJson(`${AN}/tier2-copy.json`).map((i) => [i.id === "." ? "root" : i.id, i]));
const tokens = readJson(`${AN}/tokens.json`).tokens;
const uiPkg = readJson("packages/ui/package.json");
const verified = exists(`${OUT}/registry-verified.json`) ? !!readJson(`${OUT}/registry-verified.json`).registryVerified : false;
const items = model.items.map((it) => {
  const text = read(`${PAGES}/${it.id}.md`);
  const fm = parsePage(text).fm;
  const c = (it.tier === 1 ? copy1.get(it.id) : copy2.get(it.id)) ?? {title: it.name, description: ""};
  return {i: it.id, n: it.name, t: c.title, d: c.description, c: fm.category, k: it.tier, a: fm.a11yStatus, p: fm.platforms, md: text, deps: fm.registryDependencies};
});
const catOrder = ["primitive", "input", "display", "feedback", "navigation", "overlay", "layout", "data", "shell", "forge"];
const cats = catOrder.filter((c) => items.some((i) => i.c === c));
const t1 = items.filter((i) => i.k === 1);
const t2 = items.filter((i) => i.k === 2);

// ---------------- themes ----------------
function infrax() {
  const t = read("packages/core/src/presets/infrax.ts");
  const grab = (name) => {
    const a = t.indexOf(`export const ${name}`);
    const b = t.indexOf("});", a);
    const blk = t.slice(a, b);
    const colors = {};
    for (const m of blk.matchAll(/(\w+):'(#[0-9a-fA-F]{6})'/g)) colors[m[1]] = m[2];
    const sh = blk.match(/controlRadius:(\d+),cardRadius:(\d+)/);
    return {colors, control: +sh[1], card: +sh[2]};
  };
  return {light: grab("INFRAX_THEME:"), dark: grab("INFRAX_DARK_THEME:")};
}
const INF = infrax();
const colorTokens = tokens.filter((t) => t.category === "color");
const camelKey = (n) => n.replace(/^color\./, "");
const kebab = (k) => k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
const ref = {light: {}, dark: {}};
for (const t of colorTokens) {
  ref.light[camelKey(t.name)] = t.value.reference_light;
  ref.dark[camelKey(t.name)] = t.value.reference_dark;
}
const radiusRef = {control: tokens.find((t) => t.name === "radius.control").value, card: tokens.find((t) => t.name === "radius.card").value};
const THEMES = {
  "reference-light": {c: ref.light, control: radiusRef.control.reference, card: radiusRef.card.reference},
  "reference-dark": {c: ref.dark, control: radiusRef.control.reference, card: radiusRef.card.reference},
  "infrax-light": {c: INF.light.colors, control: INF.light.control, card: INF.light.card},
  "infrax-dark": {c: INF.dark.colors, control: INF.dark.control, card: INF.dark.card},
};
const block = (t, scheme) => {
  const th = THEMES[t];
  return Object.keys(ref.light).map((k) => `--color-${kebab(k)}:${th.c[k]}`).join(";") + `;--radius-control:${th.control}px;--radius-card:${th.card}px;color-scheme:${scheme}`;
};
const themeCss = [
  `:root{${block("reference-light", "light")}}`,
  `@media (prefers-color-scheme:dark){:root:not([data-scheme="light"]){${block("reference-dark", "dark")}}}`,
  `:root[data-scheme="dark"]{${block("reference-dark", "dark")}}`,
  `:root[data-theme="infrax"]{${block("infrax-light", "light")}}`,
  `@media (prefers-color-scheme:dark){:root[data-theme="infrax"]:not([data-scheme="light"]){${block("infrax-dark", "dark")}}}`,
  `:root[data-theme="infrax"][data-scheme="dark"]{${block("infrax-dark", "dark")}}`,
].join("\n");

// contrast
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => {
  const x = lum(hex(a));
  const y = lum(hex(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const contrastFails = [];
const contrastRows = [];
for (const [name, th] of Object.entries(THEMES)) {
  const c = th.c;
  const checks = [
    ["text", "surfaceRaised", 4.5, "body text on the reading column"],
    ["text", "surfaceSunken", 4.5, "code and field text"],
    ["textMuted", "surfaceRaised", 4.5, "secondary text"],
    ["textMuted", "surfaceSunken", 4.5, "secondary text on sunken surface"],
    ["focus", "surfaceRaised", 4.5, "link text (--color-focus)"],
    ["focus", "surfaceSunken", 4.5, "link text on sunken surface"],
    ["onPrimary", "primary", 4.5, "primary button label"],
    ["textMuted", "surfaceSunken", 3, "input edge"],
    ["border", "surfaceRaised", 1, "divider only"],
    ["accent", "surfaceRaised", 4.5, "hand-reviewed badge"],
    ["danger", "surfaceRaised", 4.5, "error text"],
    ["success", "surfaceRaised", 4.5, "success text"],
    ["onPrimary", "primary", 4.5, "current-page marker"],
    ["surfaceRaised", "text", 4.5, "pressed toggle label"],
  ];
  for (const [f, b, min, what] of checks) {
    const r = ratio(c[f], c[b]);
    contrastRows.push([name, f, b, r]);
    if (r < min) contrastFails.push(`${name}: ${f} on ${b} is ${r.toFixed(2)}:1, needs ${min} (${what})`);
  }
}
if (contrastFails.length) {
  console.error("contrast failures:\n" + contrastFails.join("\n"));
  process.exit(1);
}

// ---------------- markdown renderer (shared with the browser) ----------------
const mdSrc = fs.readFileSync(path.join(ROOT, "tooling/docs/site/md.js"), "utf8");
const ctx = vm.createContext({});
vm.runInContext(mdSrc + "\nthis.renderMarkdown = renderMarkdown;", ctx);
const renderMd = (m, o) => ctx.renderMarkdown(m, o);

// ---------------- html shell ----------------
const VER = uiPkg.version;
const REPO_URL = `https://github.com/${REPO}`;
const LLMS = rawUrl(TAG, "llms.txt");
const head = (title, desc, extra = "") => `<!doctype html>
<html lang="en" data-theme="reference" data-scheme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="stylesheet" href="assets/site.css">
<link rel="alternate" type="text/plain" href="../../llms.txt" title="llms.txt">
<script>(function(){var r=document.documentElement;r.className="js";try{var t=localStorage.getItem("nyc-docs-theme"),s=localStorage.getItem("nyc-docs-scheme");if(t)r.setAttribute("data-theme",t);if(s)r.setAttribute("data-scheme",s)}catch(e){}})()</script>${extra}
</head>`;
const header = () => `<a class="skip" href="#main">Skip to content</a>
<header class="hd"><div class="hd-in">
<a class="brand" href="index.html">NYC-Tron UI</a><span class="ver">${esc(VER)}</span><span class="sp"></span>
<button class="btn" type="button" data-cycle="theme" aria-label="Theme: Reference. Press to change.">Reference</button><button class="btn" type="button" data-cycle="scheme" aria-label="Mode: Auto. Press to change.">Auto</button>
<form action="search.html" method="get" role="search"><label class="vh" for="hq">Search components</label><input class="field" id="hq" name="q" type="search" placeholder="Search components" autocomplete="off"><button class="btn primary" type="submit">Search</button></form>
</div></header>`;
const siteNav = (cur) => {
  const l = (href, text, key) => `<li><a href="${href}"${cur === key ? ' aria-current="page"' : ""}>${text}</a></li>`;
  return `<p class="navh">Site</p><ul class="navlist">${l("index.html", "Home", "home")}${l("install.html", "Install", "install")}${l("tokens.html", "Theme tokens", "tokens")}${l("search.html", "Search", "search")}</ul>
<p class="navh">For agents</p><ul class="navlist"><li><a href="../../llms.txt">llms.txt</a></li><li><a href="../../SKILL.md">SKILL.md</a></li><li><a href="../components/Button.md">Raw page example</a></li></ul>`;
};
const footer = () => `<footer class="ft"><p><a href="tokens.html">Theme tokens</a>, <a href="install.html">install</a>, <a href="${REPO_URL}">source repository</a>, ${isMovingRef(TAG) ? `ref <a href="${REPO_URL}/tree/${TAG}">${esc(TAG)}</a>` : `release <a href="${REPO_URL}/releases/tag/${TAG}">${esc(TAG)}</a>`}.</p>
<p>${t1.length} pages are hand-reviewed. ${t2.length} are generated from type declarations and source, and say so in their front matter. Accessibility statuses come from reading source, not from rendering.</p></footer>
<div class="vh" id="live" aria-live="polite" role="status"></div>
<script src="assets/site.js"></script>`;
const page = (o) => `${head(o.title, o.desc, o.extra ?? "")}
<body>
${header()}
<div class="frame${o.rail ? "" : " norail"}">
<details class="navbox"><summary class="btn">Menu</summary><div>${o.nav}</div></details>
<main id="main" class="col${o.prose === false ? "" : " prose"}"${o.attrs ?? ""}>
${o.body}
</main>${o.rail ? `\n<aside class="rail" id="crail" aria-label="On this page"></aside>` : ""}
</div>
${footer()}
</body>
</html>
`;
const installBox = (id) => `<div class="install"><button class="btn primary" type="button" data-copy="npx shadcn@latest add @nyc-tron/${esc(id)}">Copy</button><pre><code>npx shadcn@latest add @nyc-tron/${esc(id)}</code></pre></div>
${verified ? "" : `<p class="small muted">Registry install is unverified until a clean app installs from the live URL. ${esc(refNote(TAG))} Use the <a href="install.html#tarball">release tarball</a> until then.</p>`}
<p class="small muted" data-offline hidden>You are offline. The install command needs a connection.</p>`;

// ---------------- home ----------------
const readme = read("README.md");
const statement = (readme.match(/^\*\*(.+)\*\*$/m) ?? [0, "Themeable UI for React Native and Expo."])[1];
const catNav = `<p class="navh">Categories</p><ul class="navlist">${cats.map((c) => `<li><a href="#cat-${c}">${cap(c)}</a></li>`).join("")}</ul>` + siteNav("home");
const rowsFor = (c) =>
  t1.filter((i) => i.c === c).map((i) => `<li><div class="a"><a href="c.html?id=${esc(i.i)}">${esc(i.t)}</a><div class="d">${esc(i.d)}</div></div><div class="m">${i.a === "reviewed-fail" ? "Accessibility: reviewed-fail" : "Accessibility: " + esc(i.a)}</div></li>`).join("\n");
const groups = cats.filter((c) => t1.some((i) => i.c === c));
const home = page({
  title: "NYC-Tron UI documentation",
  desc: statement,
  nav: catNav,
  rail: false,
  body: `<h1>NYC-Tron UI</h1>
<p>${esc(statement)}</p>
<form action="search.html" method="get" role="search" class="actions"><label class="vh" for="bq">Search ${items.length} pages by name or by what the component does</label><input class="field" id="bq" name="q" type="search" placeholder="Name or what it does" autocomplete="off"><button class="btn primary" type="submit">Search</button></form>
${installBox("Button")}
<p class="actions"><a class="btn" href="../../llms.txt">llms.txt</a><a class="btn" href="../components/Button.md">Raw page: Button.md</a><button class="btn" type="button" data-copy="Read ${LLMS} first, then fetch one page at ${rawUrl(TAG, "docs/components/<id>.md")} where &lt;id&gt; is the registry item id, for example shell/UnitInput. Install with npx shadcn@latest add @nyc-tron/&lt;id&gt;.">Copy for agent</button></p>
<h2>Hand-reviewed components</h2>
${groups.map((c) => `<h3 id="cat-${c}">${cap(c)} (${t1.filter((i) => i.c === c).length})</h3>\n<ul class="rows">\n${rowsFor(c)}\n</ul>`).join("\n")}
<h2>Generated pages</h2>
<p>${t2.length} more pages are generated from the type declarations and the source. They have the same eight sections, and a section holds "Not documented." where the source gave nothing. <a href="search.html?tier=2">Browse them in search</a>.</p>`,
});

// ---------------- search ----------------
const plats = [...new Set(items.flatMap((i) => i.p))].sort();
let rowN = 0;
const searchRows = cats
  .map((c) => {
    const list = items.filter((i) => i.c === c).sort((a, b) => a.k - b.k || a.i.localeCompare(b.i));
    return `<section data-group="${c}"><h2>${cap(c)}</h2><ul class="rows">\n${list
      .map((i) => `<li id="r-${rowN++}" data-id="${esc(i.i)}" data-t="${esc(i.t)}" data-d="${esc(i.d)}" data-c="${c}" data-k="${i.k}" data-p="${i.p.join(" ")}"><div class="a"><a href="c.html?id=${esc(i.i)}">${esc(i.t)}</a><div class="d">${esc(i.d)}</div></div><div class="m">${cap(i.c)}. ${i.k === 1 ? "Hand-reviewed" : "Generated"}. Accessibility: ${esc(i.a)}</div><div class="act"><button class="btn" type="button" data-copy="npx shadcn@latest add @nyc-tron/${esc(i.i)}">Copy install</button></div></li>`)
      .join("\n")}\n</ul></section>`;
  })
  .join("\n");
const search = page({
  title: "Search | NYC-Tron UI",
  desc: "Search the NYC-Tron UI documentation by name or by what a component does.",
  nav: siteNav("search"),
  rail: false,
  attrs: " data-search-page",
  body: `<h1>Search</h1>
<form data-search-form action="search.html" method="get" role="search"><label for="q" class="vh">Search components</label><input class="field" id="q" name="q" type="search" placeholder="Search components" autocomplete="off" aria-controls="results" style="width:100%;margin-bottom:16px"></form>
<details class="f"><summary>Filters<span id="fcount"></span></summary><div class="filters">
<label>Tier<select class="field" id="tier"><option value="">All</option><option value="1">Hand-reviewed</option><option value="2">Generated</option></select></label>
<label>Category<select class="field" id="cat"><option value="">All</option>${cats.map((c) => `<option value="${c}">${cap(c)}</option>`).join("")}</select></label>
<label>Platform<select class="field" id="plat"><option value="">All</option>${plats.map((p) => `<option value="${p}">${p}</option>`).join("")}</select></label>
</div></details>
<p class="nojs muted">Ranking needs JavaScript. The list below is unranked.</p>
<p id="count" class="muted" role="status" aria-live="polite">${items.length} results</p>
<p id="weak" class="small muted" hidden>No page matches every word. Pages that match some of the words come first, each marked with how many.</p>
<div id="empty" class="status" hidden><p>No match for "<span id="emptyq"></span>". Try a component name or what it does, for example "segmented control" or "context menu".</p><button class="btn" type="button" id="clear">Clear filters</button></div>
<div id="err" class="status err" hidden>Search could not read its index. The list below is unranked.</div>
<div id="results">
${searchRows}
</div>
<p class="hint"><kbd>Up</kbd> <kbd>Down</kbd> move, <kbd>Enter</kbd> open, <kbd>/</kbd> focus search</p>`,
});

// ---------------- tokens ----------------
const themeMd = read("docs/THEME_TOKENS.md");
const utilByKey = {};
for (const l of themeMd.split("\n")) {
  const m = l.match(/^\| `(\w+)` \| `(--[\w-]+)` \| ([^|]+) \|/);
  if (m) utilByKey[m[1]] = m[3].trim().replace(/`/g, "");
}
const sentence = themeMd.split("\n").slice(2, 8).join(" ").replace(/\s+/g, " ").match(/^(.*?\.)\s/)?.[1] ?? "NYC-Tron components ship no colors.";
const cr = (a, b) => ratio(a, b).toFixed(2);
// An on-colour is drawn on its fill, never on the page surface, so its ratio is taken against that fill.
const fillOf = {onPrimary: "primary", onDanger: "danger"};
const colorRows = colorTokens.map((t) => {
  const k = camelKey(t.name);
  const req = ["primary", "onPrimary", "surfaceRaised", "surfaceSunken", "border", "text", "textMuted", "focus"].includes(k);
  const cells = [
    `<span class="sw" style="background:var(--color-${kebab(k)})" role="img" aria-label="${esc(t.name)} swatch"></span>`,
    `<code>${esc(t.name)}</code>`,
    `<code>${esc(t.cssVariable)}</code>`,
    esc(utilByKey[k] ?? ""),
    req ? "required" : "optional",
    `<code>${THEMES["reference-light"].c[k]}</code>`,
    `<code>${THEMES["reference-dark"].c[k]}</code>`,
    `<code>${THEMES["infrax-light"].c[k]}</code>`,
    `<code>${THEMES["infrax-dark"].c[k]}</code>`,
    k === "surfaceRaised" ? "n/a" : `${cr(THEMES["reference-light"].c[k], THEMES["reference-light"].c[fillOf[k] ?? "surfaceRaised"])} / ${cr(THEMES["reference-dark"].c[k], THEMES["reference-dark"].c[fillOf[k] ?? "surfaceRaised"])}${fillOf[k] ? " on " + fillOf[k] : ""}`,
  ];
  return `<tr class="tokrow" data-tok="${esc(t.name.toLowerCase() + " " + t.cssVariable)}">${cells.map((c, j) => `<td data-label="${["Swatch", "Name", "CSS variable", "Utilities in use", "Required", "Reference light", "Reference dark", "InFraX light", "InFraX dark", "Contrast (Reference, light / dark)"][j]}">${c}</td>`).join("")}</tr>`;
});
const colHead = ["Swatch", "Name", "CSS variable", "Utilities in use", "Required", "Reference light", "Reference dark", "InFraX light", "InFraX dark", "Contrast (Reference, light / dark)"];
const tokenGroups = [
  ["Spacing", "spacing", "Unit multiples of 4px. `space.2` is 8px."],
  ["Radius steps", "radius", "Steps for literal radii. The theme radii are `radius.control` and `radius.card` above."],
  ["Font size and line height", ["fontSize", "lineHeight"], "Steps keyed by px. The library has no font tokens today; these are proposed."],
  ["Border width, opacity, scrim, elevation, size", ["borderWidth", "opacity", "scrim", "elevation", "size"], ""],
  ["Native-only metrics, motion and icons", ["border", "density", "motion", "icon-size", "icon-stroke", "scale", "duration", "native-default", "color-literal"], "Read by native adapters and the icon package, not by Tailwind classes."],
];
const valOf = (t) => {
  const v = t.value;
  if (!v) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (v.value !== undefined) return `${v.value}${v.unit ? " " + v.unit : ""}`;
  if (v.reference !== undefined) return `${v.reference}px (InFraX ${v.infrax}px)`;
  return JSON.stringify(v);
};
const tokenTable = (cs) => {
  const list = tokens.filter((t) => (Array.isArray(cs) ? cs : [cs]).includes(t.category) && !/^color\./.test(t.name) && !/^radius\.(control|card)$/.test(t.name));
  if (!list.length) return "";
  return `<div class="tw"><table class="stack"><thead><tr><th scope="col">Name</th><th scope="col">Value</th><th scope="col">Status</th><th scope="col">Source</th></tr></thead><tbody>${list
    .map((t) => `<tr class="tokrow" data-tok="${esc(t.name.toLowerCase())}"><td data-label="Name"><code>${esc(t.name)}</code></td><td data-label="Value">${esc(valOf(t))}</td><td data-label="Status">${esc(t.status)}</td><td data-label="Source">${esc(t.source ?? "")}${t.occurrences ? `, ${t.occurrences} literals in ${t.files} files` : ""}</td></tr>`)
    .join("")}</tbody></table></div>`;
};
const radiusRows = ["radius.control", "radius.card"].map((n) => {
  const t = tokens.find((x) => x.name === n);
  return `<tr class="tokrow" data-tok="${n} ${t.cssVariable}"><td data-label="Name"><code>${n}</code></td><td data-label="CSS variable"><code>${t.cssVariable}</code></td><td data-label="Reference">${t.value.reference}px</td><td data-label="InFraX">${t.value.infrax}px</td><td data-label="Source">${esc(t.source)}</td></tr>`;
});
const fallbackCss = `@theme {\n${Object.keys(ref.light).map((k) => `  --color-${kebab(k)}: ${ref.light[k]};`).join("\n")}\n  --radius-control: ${radiusRef.control.reference}px;\n  --radius-card: ${radiusRef.card.reference}px;\n}\n/* Reference, light */`;
const tokensPage = page({
  title: "Theme tokens | NYC-Tron UI",
  desc: "The 13 colour variables and 2 radii an app defines for NYC-Tron UI, with values for the Reference and InFraX themes.",
  nav: siteNav("tokens"),
  rail: false,
  body: `<h1>Theme tokens</h1>
<p>${esc(sentence)} A missing variable does not fail the build: the utility silently produces no style.</p>
<p class="seghead" id="th-l">Theme</p>
<div class="themebar" role="group" aria-labelledby="th-l"><span class="seg"><button class="btn" type="button" data-theme-set="reference" aria-pressed="true">Reference</button><button class="btn" type="button" data-theme-set="infrax" aria-pressed="false">InFraX</button></span>
<span class="seg" role="group" aria-label="Mode"><button class="btn" type="button" data-scheme-set="auto" aria-pressed="true">Auto</button><button class="btn" type="button" data-scheme-set="light" aria-pressed="false">Light</button><button class="btn" type="button" data-scheme-set="dark" aria-pressed="false">Dark</button></span>
<button class="btn primary" type="button" data-copy-target="themecss">Copy CSS</button></div>
<pre><code data-theme-css id="themecss">${esc(fallbackCss)}</code></pre>
<p class="small muted">The block above and the Copy CSS button follow the active theme and mode. Reference values are neutral, not a brand. InFraX is the one other fully specified palette in the repo.</p>
<label class="vh" for="tokfilter">Filter tokens by name</label><input class="field" id="tokfilter" type="search" placeholder="Filter tokens by name" autocomplete="off" style="width:100%;margin:8px 0 16px">
<div id="tokempty" class="status" hidden><p>No token matches "<span id="tokq"></span>". Clear the filter to see all <span id="tokall"></span>.</p><button class="btn" type="button" id="tokclear">Clear filter</button></div>
<h2>Colour</h2>
<div class="tw"><table class="stack"><thead><tr>${colHead.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${colorRows.join("")}</tbody></table></div>
<p class="small muted">Contrast is against <code>surfaceRaised</code>, except <code>onPrimary</code> and <code>onDanger</code>, which are against the fill they sit on.</p>
<p class="small muted">Source: <code>packages/core/src/theme.ts</code>, <code>docs/THEME_TOKENS.md</code>, <code>packages/core/src/presets/infrax.ts</code>. <code>border</code> is 1.58:1 on the raised surface, below the 3:1 that WCAG 1.4.11 asks of an input edge, so this site draws input edges with <code>textMuted</code>.</p>
<h2>Radius</h2>
<div class="tw"><table class="stack"><thead><tr><th scope="col">Name</th><th scope="col">CSS variable</th><th scope="col">Reference</th><th scope="col">InFraX</th><th scope="col">Source</th></tr></thead><tbody>${radiusRows.join("")}</tbody></table></div>
${tokenGroups
  .map(([h, cs, note]) => {
    const t = tokenTable(cs);
    return t ? `<h2>${h}</h2>${note ? `<p class="small muted">${esc(note.replace(/`/g, ""))}</p>` : ""}${t}` : "";
  })
  .join("\n")}
<h2>Status key</h2>
<ul><li><code>existing</code>: defined in the repo today.</li><li><code>proposed</code>: a step of the closed scale that the literal-to-token codemod adds. Rows say so in words, not only by position.</li><li><code>proposed-scoped</code>: a component-scoped token with the value of the literal it replaces, such as <code>&lt;Component&gt;.radius.11</code>.</li></ul>
<p>The machine-readable files are <a href="../agent-native/tokens.json">tokens.json</a> and <a href="tokens.md">tokens.md</a>.</p>`,
});

// tokens.md
const tokensMd = [
  "# Theme tokens",
  "",
  `Generated by tooling/docs/build-site.mjs from docs/agent-native/tokens.json and packages/core/src/presets/infrax.ts. ${sentence}`,
  "",
  "## Colour",
  "",
  mdTable(["Name", "CSS variable", "Required", "Reference light", "Reference dark", "InFraX light", "InFraX dark"], colorTokens.map((t) => {
    const k = camelKey(t.name);
    const req = ["primary", "onPrimary", "surfaceRaised", "surfaceSunken", "border", "text", "textMuted", "focus"].includes(k) ? "required" : "optional";
    return [t.name, t.cssVariable, req, THEMES["reference-light"].c[k], THEMES["reference-dark"].c[k], THEMES["infrax-light"].c[k], THEMES["infrax-dark"].c[k]];
  })),
  "",
  "## Radius",
  "",
  mdTable(["Name", "CSS variable", "Reference", "InFraX"], ["radius.control", "radius.card"].map((n) => {
    const t = tokens.find((x) => x.name === n);
    return [n, t.cssVariable, t.value.reference + "px", t.value.infrax + "px"];
  })),
  "",
  "## Other tokens",
  "",
  mdTable(["Name", "Category", "Value", "Status"], tokens.filter((t) => !/^color\./.test(t.name) && !/^radius\.(control|card)$/.test(t.name)).map((t) => [t.name, t.category, valOf(t), t.status])),
  "",
].join("\n");

// ---------------- install ----------------
const section = (s, a, b) => {
  const i = s.indexOf(a);
  const j = s.indexOf(b, i);
  return s.slice(i, j < 0 ? undefined : j);
};
const tarball = section(readme, "## Installing from a release", "### macOS through Spark").replace(/^## Installing from a release\n/, "").replace(/\]\((docs\/|README|LICENSE|examples\/)/g, "](../../$1");
const compJson = readJson("components.json");
const peers = Object.keys(uiPkg.peerDependencies ?? {}).filter((p) => p !== "@nyc-tron/core");
const peersOpt = peers.filter((p) => uiPkg.peerDependenciesMeta?.[p]?.optional);
const peersReq = peers.filter((p) => !peersOpt.includes(p));
const agentParagraph = `Read ${LLMS} first. It lists every page. Fetch one page at ${rawUrl(TAG, "docs/components/<id>.md")}, where <id> is the registry item id (for example shell/UnitInput). Use the token names in the page front matter; never colour or spacing literals. Install with npx shadcn@latest add @nyc-tron/<id> once the registry check passes, otherwise use the release tarball. Imports differ by install: after a registry install use ${tarballToRegistry("@nyc-tron/ui/components/<id>")}, after a tarball install use @nyc-tron/ui/components/<id>. Examples use the registry form.`;
const install = page({
  title: "Install | NYC-Tron UI",
  desc: "Install NYC-Tron UI into an Expo app from the shadcn registry or from a release tarball.",
  nav: siteNav("install"),
  rail: false,
  body: `<h1>Install</h1>
<p data-offline hidden class="status">You are offline. Both install methods download from GitHub, so they need a connection. Everything on this page stays readable.</p>
<p class="actions"><a class="btn" href="#registry">Registry (shadcn CLI)</a><a class="btn" href="#tarball">Release tarball</a></p>
<h2 id="registry">Registry (shadcn CLI)</h2>
<p>Each item is copied into your app as source, with the items it depends on. Peers are not installed for you; each page lists them.</p>
${installBox("Button")}
<p>Add the namespace to <code>components.json</code>. shadcn rejects unknown keys, so platform targets are not in this file; see <a href="../agent-native/components-contract.md">components-contract.md</a>.</p>
<pre><code>${esc(JSON.stringify({registries: compJson.registries}, null, 2))}</code></pre>
<p>Item JSON is served at <code>${esc(rawUrl(TAG, "r/{name}.json"))}</code>, ${isMovingRef(TAG) ? `on the moving ref <code>${esc(TAG)}</code> until a release tag is cut. It resolves only after this branch is merged to ${esc(TAG)}; before that, test against a local server` : `pinned to tag <code>${esc(TAG)}</code>`}, where <code>{name}</code> keeps its slashes (<code>shell/UnitInput</code>). Find an item with <code>npx shadcn@latest search @nyc-tron -q "context menu"</code>.</p>
<p>After a registry install, import from the installed path, for example <code>${esc(tarballToRegistry("@nyc-tron/ui/components/Button"))}</code>. <code>shadcn add</code> rewrites the <code>@/components</code> prefix to <code>aliases.components</code>. The tarball package <code>@nyc-tron/ui</code> does not exist in that app. Every component page shows both imports under "Registry install" and "Tarball install", and its example uses the registry one.</p>
<p>Native packages cannot be added this way. A registry add copies files and cannot run pod install, gradle, CMake, nitrogen or a WinUI build. They install from the tarball and are listed in <a href="../../registry-excluded.json">registry-excluded.json</a>.</p>
<h2 id="tarball">Release tarball</h2>
<p>This is the install path that works today. Copied from the README, section "Installing from a release".</p>
${renderMd(tarball, {shift: 1, idPrefix: "tb-", codeCopy: true})}
<h2 id="peers">Peers and theme</h2>
<p>Required peers: ${peersReq.map((p) => `<code>${esc(p)}</code>`).join(", ")}. Optional peers, needed only by the subpaths that import them: ${peersOpt.map((p) => `<code>${esc(p)}</code>`).join(", ")}. Each component page lists the ones it uses on its <code>Peers:</code> line.</p>
<p>The app defines 13 colour variables and 2 radii. <a href="tokens.html">See the tokens page</a>. A missing variable does not fail the build.</p>
<h2 id="agents">For agents</h2>
<p>Paste this into an agent that has a terminal and a URL fetcher:</p>
<pre><code id="agentp">${esc(agentParagraph)}</code></pre>
<p class="actions"><button class="btn primary" type="button" data-copy-target="agentp">Copy for agent</button><a class="btn" href="../../llms.txt">llms.txt</a></p>`,
});

// ---------------- component page shell ----------------
const comp = page({
  title: "Component | NYC-Tron UI",
  desc: "A NYC-Tron UI component page.",
  nav: `<div id="cnav"></div>${siteNav("")}`,
  rail: true,
  attrs: " data-component-page",
  extra: `\n<script src="assets/pages.js"></script>`,
  body: `<p class="crumb" id="ccrumb"><a href="index.html">Components</a></p>
<h1 id="cname">Component</h1>
<ul class="facts" id="cfacts"></ul>
<div id="cerr" class="status err" hidden><p>No page for "<span id="cerrid"></span>". Check the id, or find it in search.</p><p><a class="btn" href="search.html">Search</a></p></div>
<noscript><div class="status"><p>This page renders from <code>assets/pages.js</code> and needs JavaScript. The raw markdown for each page is in <code>docs/components/&lt;id&gt;.md</code>, which is readable without a script.</p></div></noscript>
<div class="install" id="cinst" hidden><button class="btn primary" type="button" id="ccopy" data-copy="">Copy</button><pre><code id="ccmd"></code></pre></div>
<p class="small muted" id="cnote" hidden>${verified ? "" : `Registry install is unverified until a clean app installs from the live URL. ${esc(refNote(TAG))} The release tarball works today (<a href="install.html#tarball">steps</a>).`}</p>
<p class="small muted" data-offline hidden>You are offline. The install command needs a connection.</p>
<p class="actions" id="cact" hidden><button class="btn" type="button" data-copy-agent>Copy for agent</button><a class="btn" id="craw" href="../components/Button.md">View as markdown</a></p>
<div id="cbody"></div>
<nav class="pager" id="cpager" aria-label="Pages in this category"></nav>`,
});

// ---------------- assets ----------------
const css = fs.readFileSync(path.join(ROOT, "tooling/docs/site/site.css"), "utf8").replace("/*@themes*/", themeCss);
const js = mdSrc + "\n" + fs.readFileSync(path.join(ROOT, "tooling/docs/site/site.js"), "utf8");
const strip = (md) => md.replace(/^<!-- generated:(begin|end) .*-->\n/gm, "");
const pagesJs =
  "window.NYC_DOCS=" +
  JSON.stringify({
    ref: TAG,
    rawBase: `https://raw.githubusercontent.com/${REPO}/${TAG}`,
    verified,
    items: items.map((i) => ({i: i.i, n: i.n, t: i.t, d: i.d, c: i.c, k: i.k, a: i.a, p: i.p})),
    pages: Object.fromEntries(items.map((i) => [i.i, strip(i.md)])),
  }) +
  ";\n";
const searchIndex = JSON.stringify(items.map((i) => ({id: i.i, name: i.n, title: i.t, description: i.d, category: i.c, tier: i.k, a11yStatus: i.a, platforms: i.p, markdown: `docs/components/${i.i}.md`})), null, 1) + "\n";

const files = {
  "index.html": home, "c.html": comp, "tokens.html": tokensPage, "tokens.md": tokensMd, "install.html": install, "search.html": search,
  "search-index.json": searchIndex, "assets/site.css": css, "assets/site.js": js, "assets/pages.js": pagesJs,
};
if (!exists(`${OUT}/registry-verified.json`)) files["registry-verified.json"] = JSON.stringify({registryVerified: false, note: "Set to true after a clean Expo app installs from the pushed r/ files at the registry ref (decisions 28 and 45). The site drops the unverified lines when it is true."}, null, 1) + "\n";

// budgets
const bytes = (s) => Buffer.byteLength(s);
const over = [];
if (bytes(css) > BUDGET.css) over.push(`site.css ${bytes(css)} > ${BUDGET.css}`);
if (bytes(js) > BUDGET.js) over.push(`site.js ${bytes(js)} > ${BUDGET.js}`);
if (bytes(search) > BUDGET.search) over.push(`search.html ${bytes(search)} > ${BUDGET.search}`);
if (bytes(comp) > BUDGET.c) over.push(`c.html ${bytes(comp)} > ${BUDGET.c}`);
if (over.length) {
  console.error("budget exceeded:\n" + over.join("\n"));
  process.exit(1);
}

// link check on emitted html (relative hrefs and srcs, query strings and fragments ignored)
const broken = [];
for (const [f, text] of Object.entries(files)) {
  if (!f.endsWith(".html")) continue;
  for (const m of text.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const h = m[1];
    if (/^(https?:|mailto:|data:)/.test(h)) continue;
    const target = path.posix.normalize(path.posix.join(OUT, path.posix.dirname(f), h));
    const known = target.startsWith(OUT + "/") && Object.keys(files).includes(target.slice(OUT.length + 1));
    if (!known && !exists(target)) broken.push(`${f}: ${h}`);
  }
}

// duplicate ids and dead CSS selectors (a class in site.css that no page, script or renderer ever emits)
const dupIds = [];
for (const [f, text] of Object.entries(files)) {
  if (!f.endsWith(".html")) continue;
  const seen = new Set();
  for (const m of text.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(m[1])) dupIds.push(`${f}: id="${m[1]}"`);
    seen.add(m[1]);
  }
}
const emitted = Object.entries(files).filter(([f]) => /\.(html|js)$/.test(f) && f !== "assets/pages.js").map(([, t]) => t).join("\n");
const emittedWords = new Set(emitted.split(/[^\w-]+/));
const deadCss = [...new Set([...css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\[[^\]]*\]/g, "").matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]))].filter((c) => !emittedWords.has(c));
let changed = 0;
let total = 0;
for (const [f, text] of Object.entries(files)) {
  total += bytes(text);
  const p = path.join(ROOT, OUT, f);
  const cur = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (cur !== text) {
    changed++;
    if (!CHECK) {
      fs.mkdirSync(path.dirname(p), {recursive: true});
      fs.writeFileSync(p, text);
    }
  }
}
const sizes = Object.entries(files).map(([f, t]) => `${f} ${bytes(t)}`).join(", ");
console.log(`site: ${Object.keys(files).length} files, ${total} bytes (${(total / 1048576).toFixed(2)} MB); component pages render from one pages.js (${items.length} pages)`);
console.log(sizes);
console.log(`duplicate ids: ${dupIds.length}${dupIds.length ? "\n  " + dupIds.slice(0, 10).join("\n  ") : ""}`);
console.log(`dead css classes: ${deadCss.length}${deadCss.length ? " " + deadCss.join(", ") : ""}`);
console.log(`broken relative links: ${broken.length}${broken.length ? "\n  " + broken.slice(0, 10).join("\n  ") : ""}`);
console.log(`${CHECK ? "would change" : "written"}: ${changed} file(s)`);
if (broken.length || dupIds.length || deadCss.length || (CHECK && changed)) process.exit(1);
