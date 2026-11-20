// Generates llms.txt (llmstxt.org format, small) and llms-full.txt (the whole corpus) from docs/components/*.md.
//   node tooling/docs/build-llms.mjs            write both files
//   node tooling/docs/build-llms.mjs --check    exit 1 if either would change
// URLs point at raw.githubusercontent.com pinned to one tag: releaseTag() in lib.mjs reads tooling/registry/config.json
// and falls back to v1.0.0-rc.2. Nothing here reads a clock or the network.
import fs from "node:fs";
import path from "node:path";
import {ROOT, AN, PAGES, read, readJson, exists, parsePage, releaseTag, rawUrl, REPO, registryExcludedEntries} from "./lib.mjs";
import {buildModel} from "./model.mjs";
import {GROUPS} from "../../docs/agent-native/tier2-describe.mjs";

const CHECK = process.argv.includes("--check");
const TAG = releaseTag();
const U = (p) => rawUrl(TAG, p);
const model = buildModel();
const copy1 = new Map(readJson(`${AN}/copy.json`).items.map((i) => [i.id, i]));
const copy2 = new Map(readJson(`${AN}/tier2-copy.json`).map((i) => [i.id, i]));
const a11y = readJson(`${AN}/a11y-status.json`);
const tokens = readJson(`${AN}/tokens.json`).tokens;
const uiVersion = readJson("packages/ui/package.json").version;

const pageText = new Map();
for (const it of model.items) pageText.set(it.id, read(`${PAGES}/${it.id}.md`));
const meta = new Map(model.items.map((it) => [it.id, parsePage(pageText.get(it.id)).fm]));
const desc = (it) => (it.tier === 1 ? copy1.get(it.id)?.description : copy2.get(it.id === "root" ? "." : it.id)?.description) ?? "";
const titleOf = (it) => (it.tier === 1 ? copy1.get(it.id)?.title : copy2.get(it.id === "root" ? "." : it.id)?.title) ?? it.name;

const t1 = model.items.filter((i) => i.tier === 1);
const t2 = model.items.filter((i) => i.tier === 2);
const counts = {PASS: 0, FAIL: 0, UNVERIFIED: 0};
for (const v of Object.values(a11y)) counts[v.status]++;
const excl = registryExcludedEntries();
const exclPkgs = {};
for (const e of excl) exclPkgs[e.package] = (exclPkgs[e.package] ?? 0) + 1;
const hasPrimitives = ["Stack", "Row", "Spacer", "Divider", "Text"].map((n) => [n, exists(`packages/ui/src/components/layout/${n}.tsx`) || exists(`packages/ui/src/components/${n}.tsx`)]);
const primitivesPresent = hasPrimitives.filter(([, ok]) => ok).map(([n]) => n);
const primitivesMissing = hasPrimitives.filter(([, ok]) => !ok).map(([n]) => n);
const f08 = (read(`${AN}/05-accessibility-review.md`).match(/Items with a 44 literal under the 48dp guideline \(F08\): ([^\n]+)\./) ?? [, ""])[1].split(",").filter((x) => x.trim()).length;
const col = tokens.filter((t) => t.category === "color");
const rad = tokens.filter((t) => /^radius\.(control|card)$/.test(t.name));

// ---------------- llms.txt ----------------
const groupOf = (it) => {
  if (it.pkg !== "@nyc-tron/ui") return "core";
  if (it.id === "root") return "root";
  return it.id.includes("/") ? it.id.split("/").slice(0, -1).join("/") : "components";
};
const groups = new Map();
for (const it of t2) {
  const g = groupOf(it);
  if (!groups.has(g)) groups.set(g, []);
  groups.get(g).push(it);
}
const groupPhrase = (g) => (g === "core" ? "@nyc-tron/core support modules the registry copies next to ui items" : g === "root" ? "root barrel" : g === "components" ? "UI" : GROUPS[g] ?? g.replace(/[-/]/g, " "));

const L = [];
L.push("# NYC-Tron UI");
L.push("");
L.push(`> Themeable React Native and Expo component library (${uiVersion}, release candidate, not on npm). ${model.items.length} documentation pages: ${t1.length} hand-reviewed, ${t2.length} generated from type declarations. The app owns the theme: components read 13 colour variables and 2 radius variables.`);
L.push("");
L.push(`Each page is raw markdown at \`${U("docs/components/<id>.md")}\`, where \`<id>\` is the registry item id (the path under \`components/\`, for example \`shell/UnitInput\`). Every page has the same eight sections: Purpose, Install, Props, Variants, States, A11y, Example, Do/Don't. Pages marked \`docs: "generated"\` in their front matter were produced from \`docs/api-signatures.json\` and the source, not written by a person.`);
L.push("");
L.push("## Install and conventions");
L.push(`- [SKILL.md](${U("SKILL.md")}): how to find an item, the token rules, provider and peers, the six states, what not to do.`);
L.push(`- [AGENTS.md](${U("AGENTS.md")}): repository rules and the Agent-native section.`);
L.push(`- [README, Installing from a release](${U("README.md")}): the tarball install, which is the install path that works today.`);
L.push(`- [Theme tokens](${U("docs/THEME_TOKENS.md")}): the 13 colour variables and 2 radii the consuming app must define. A missing variable fails silently.`);
L.push(`- [components-contract.md](${U(`${AN}/components-contract.md`)}): where installed files land (\`@components/nyc-tron/ui\`, \`@lib/nyc-tron/core\`), since components.json rejects unknown keys.`);
L.push(`- [tokens.json](${U(`${AN}/tokens.json`)}): every token with its value, status (existing, proposed, proposed-scoped) and source.`);
L.push(`- [registry.json](${U("registry.json")}): the shadcn registry index. Item JSON is at \`${U("r/{name}.json")}\`.`);
L.push("");
L.push("Registry install, once the CLI check passes: `npx shadcn@latest add @nyc-tron/<id>`. Find an item with `npx shadcn@latest search @nyc-tron -q \"<what it does>\"`. The namespace entry in `components.json` is `\"@nyc-tron\": \"" + U("r/{name}.json") + "\"`.");
L.push("");
L.push("Rules in one paragraph: use token names, never colour or spacing literals; spacing keys are unit multiples (`space.2` is 8px, `space.1.5` is 6px) from a closed scale; render every component inside the app's theme CSS; handle default, loading, error, empty, success and offline states yourself, the library draws only what its props say.");
L.push("");
L.push("## Layout primitives");
if (primitivesPresent.length === hasPrimitives.length) L.push(`Stack, Row, Spacer, Divider and Text exist under \`packages/ui/src/components/layout/\`. Use them before hand-rolled \`View\` rows.`);
else L.push(`Planned and not in this tree at the tagged commit: ${primitivesMissing.join(", ")}${primitivesPresent.length ? ` (present: ${primitivesPresent.join(", ")})` : ""}. Until they land, use \`layout/ContentFrame\` and \`layout/AdaptiveColumns\`, which exist.`);
L.push("");
L.push(`## Components, hand-reviewed (${t1.length})`);
for (const it of t1) L.push(`- [${titleOf(it)}](${U(`${PAGES}/${it.id}.md`)}): ${desc(it)} a11y ${meta.get(it.id).a11yStatus}.`);
L.push("");
L.push(`## Components, generated (${t2.length}, one line per group)`);
L.push(`These pages are generated. Each group line names how many pages it holds and links to one of them; replace the file name to read another.`);
for (const [g, list] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const comps = list.filter((i) => i.kind === "component");
  const first = (comps[0] ?? list[0]);
  const ex = (comps.length ? comps : list).slice(0, 3).map((i) => i.name.replace(/Module$/, "")).join(", ");
  L.push(`- [${g}](${U(`${PAGES}/${first.id}.md`)}): ${list.length} pages (${comps.length} components, ${list.length - comps.length} modules), ${groupPhrase(g)}. For example ${ex}.`);
}
L.push("");
L.push("## Limits stated plainly");
L.push(`- **Native-only packages are not installable by shadcn.** ${excl.length} subpaths in ${Object.keys(exclPkgs).length} packages ship native code (${Object.entries(exclPkgs).map(([p, n]) => `${p.replace("@nyc-tron/", "")} ${n}`).join(", ")}). A registry add copies files and cannot run pod install, gradle, CMake, nitrogen or a WinUI build. Install them from the release tarball. List: [registry-excluded.json](${U("registry-excluded.json")}).`);
L.push(`- **Engine facades are not registry items.** cadence, folio, pitch, prism, quill, splice, tally and studio-layout need the Rust engine, which ships as a GitHub release tarball.`);
L.push(`- **Registry install is unverified until the live check.** The CLI's acceptance of raw.githubusercontent.com content types was checked against a local server only. Until the item JSON is pushed under tag ${TAG} and a clean app installs from it, use the tarball path.`);
L.push(`- **Accessibility statuses come from reading source, not from rendering.** Of the ${t1.length} hand-reviewed items: ${counts.PASS} reviewed-pass, ${counts.FAIL} reviewed-fail, ${counts.UNVERIFIED} unverified. Nothing was rendered and no screen reader was run. \`verified\` is reserved for a rendered check and no page has it. The ${t2.length} generated pages say \`declared\` when the source sets an accessibility prop and \`unverified\` when it sets none.`);
L.push(`- **Touch targets: 44pt passes Apple, 44dp is 4dp under Android's 48dp guideline.** ${f08} hand-reviewed items size a control with the literal 44 (finding F08 in docs/agent-native/05-accessibility-review.md). WCAG 2.1 AA has no target-size criterion, so this is a guideline finding, not a conformance failure.`);
L.push(`- **Icons: 47 glyphs are drawn; 42 of 1,463 catalog ids resolve to one; 6 drawn glyphs are not catalog ids.** An unresolved icon name renders nothing. Do not read the catalog size as availability.`);
L.push(`- **No component preview exists.** The components are React Native, and nothing here renders them. Pages carry types, props, tokens and a type-checked example only.`);
L.push(`- **Tier 1 prose reflects source at commit b91dfc3 (1.0.0-rc.2).** Token names in the front matter are what the source maps to today. They do not claim the literal-to-token codemod has run.`);
L.push("");
L.push("## Optional");
if (excl.length) {
  L.push(`- Native packages, ${excl.length} subpaths, install from the release tarball and rebuild the native app. A registry add cannot install them, so they have no component pages and no \`shadcn add\` command:`);
  for (const e of excl) L.push(`  - [${e.subpath}](${U("README.md")}): ${e.description}`);
}
L.push(`- [llms-full.txt](${U("llms-full.txt")}): every page in one file. Large; read single pages instead when you know the item.`);
L.push(`- [Design system audit](${U(`${AN}/02-design-system.md`)}): token inventory, closed scale and the proposed layout primitives.`);
L.push(`- [Accessibility review](${U(`${AN}/05-accessibility-review.md`)}): per-item findings for the ${t1.length} hand-reviewed components.`);
L.push(`- [Doc template](${U(`${AN}/doc-template.md`)}): the page format CI enforces.`);
const llms = L.join("\n") + "\n";

// ---------------- llms-full.txt ----------------
const F = [];
F.push("# NYC-Tron UI, full documentation");
F.push("");
F.push(`> Every documentation page in one file (${model.items.length} pages, tag ${TAG}). This file is large. For one component, fetch its page: ${U("docs/components/<id>.md")}. The short index is ${U("llms.txt")}.`);
F.push("");
F.push("## Theme contract");
F.push("");
F.push("Components ship no colours. The app defines these variables for light and dark. A missing variable does not fail the build; the utility silently produces no style.");
F.push("");
F.push("| Token | CSS variable | Light | Dark |");
F.push("|---|---|---|---|");
for (const t of col) F.push(`| ${t.name} | ${t.cssVariable} | ${t.value.reference_light} | ${t.value.reference_dark} |`);
for (const t of rad) F.push(`| ${t.name} | ${t.cssVariable} | ${t.value.reference}px (InFraX preset ${t.value.infrax}px) | same |`);
F.push("");
F.push("Reference values are neutral, not a brand. The required variables are primary, onPrimary, surfaceRaised, surfaceSunken, border, text, textMuted and focus. danger, onDanger, accent, info and success are optional.");
F.push("");
F.push("## Pages");
for (const it of [...t1, ...t2]) {
  F.push("");
  F.push(`<!-- page id=${it.id} tier=${it.tier} url=${U(`${PAGES}/${it.id}.md`)} -->`);
  F.push(pageText.get(it.id).replace(/\n+$/, ""));
}
const full = F.join("\n") + "\n";

const out = [["llms.txt", llms], ["llms-full.txt", full]];
let changed = 0;
for (const [f, text] of out) {
  const p = path.join(ROOT, f);
  const cur = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
  if (cur !== text) {
    changed++;
    if (!CHECK) fs.writeFileSync(p, text);
  }
}
const est = (s) => Math.round(Buffer.byteLength(s) / 4);
console.log(`llms.txt: ${Buffer.byteLength(llms)} bytes, about ${est(llms)} tokens (bytes/4); ${t1.length} tier 1 lines, ${groups.size} group lines`);
console.log(`llms-full.txt: ${Buffer.byteLength(full)} bytes, about ${est(full)} tokens (bytes/4). This is large.`);
console.log(`tag: ${TAG}; ${CHECK ? "would change" : "written"}: ${changed} file(s)`);
if (CHECK && changed) process.exit(1);
