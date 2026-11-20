// BM25 retrieval check over registry title + description. No dependencies.
// Usage: node docs/agent-native/retrieval-eval.mjs [--copy copy.json] [--verbose]
// It is a proxy: `shadcn search` does its own matching, and an agent may use semantic search. A low BM25
// score means the words are not there; it does not prove an embedding search would miss.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {generate} from "./tier2-describe.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > -1 ? process.argv[i + 1] : d;
};
const copyFile = path.resolve(here, arg("--copy", "copy.json"));
const verbose = process.argv.includes("--verbose");
const K1 = 1.2, B = 0.75;

const STOP = new Set("a an the for of to and or with in on at by is it that this as from into using use need want i my me our".split(" "));
// Tokens: lowercase, camelCase and digit-letter splits, plural and -ing/-ed stripped. Same function for docs and queries.
function stem(w) {
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.length > 4 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 3 && w.endsWith("es") && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}
export function tokens(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !STOP.has(w))
    .map(stem);
}

export function buildIndex(docs) {
  const rows = docs.map((d) => {
    const t = tokens(d.title + " " + d.description);
    const tf = new Map();
    for (const w of t) tf.set(w, (tf.get(w) || 0) + 1);
    return {id: d.id, len: t.length, tf};
  });
  const N = rows.length;
  const avg = rows.reduce((a, r) => a + r.len, 0) / N;
  const df = new Map();
  for (const r of rows) for (const w of r.tf.keys()) df.set(w, (df.get(w) || 0) + 1);
  return {rows, N, avg, df};
}
export function search(ix, q) {
  const qt = [...new Set(tokens(q))];
  const scored = ix.rows.map((r) => {
    let s = 0;
    for (const w of qt) {
      const f = r.tf.get(w);
      if (!f) continue;
      const n = ix.df.get(w);
      const idf = Math.log(1 + (ix.N - n + 0.5) / (n + 0.5));
      s += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * r.len) / ix.avg));
    }
    return {id: r.id, s};
  });
  // Stable order: score desc, then id asc. Zero scores are not results.
  return scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s || (a.id < b.id ? -1 : 1));
}

function evaluate(ix, queries, label) {
  const res = {label, n: 0, hit3: 0, hit5: 0, rec3: 0, rec5: 0, misses: [], rows: []};
  for (const q of queries) {
    if (!q.relevant.length) continue;
    const r = search(ix, q.query);
    const rel = new Set(q.relevant);
    const top = (k) => r.slice(0, k).map((x) => x.id);
    const f = (k) => top(k).filter((id) => rel.has(id)).length;
    res.n++;
    res.hit3 += f(3) > 0 ? 1 : 0;
    res.hit5 += f(5) > 0 ? 1 : 0;
    res.rec3 += f(3) / rel.size;
    res.rec5 += f(5) / rel.size;
    const ranks = q.relevant.map((id) => {
      const i = r.findIndex((x) => x.id === id);
      return i < 0 ? "none" : i + 1;
    });
    res.rows.push({id: q.id, query: q.query, ranks, top3: top(3), top1score: r[0] ? +r[0].s.toFixed(1) : 0});
    if (f(3) < rel.size) res.misses.push({id: q.id, query: q.query, relevant: q.relevant, ranks, top3: top(3)});
  }
  res.recall3 = res.rec3 / res.n;
  res.recall5 = res.rec5 / res.n;
  res.hit3r = res.hit3 / res.n;
  res.hit5r = res.hit5 / res.n;
  return res;
}

const copyRaw = JSON.parse(fs.readFileSync(copyFile, "utf8"));
const copy = Array.isArray(copyRaw) ? copyRaw : copyRaw.items;
const tier1 = copy.map((c) => ({id: c.id, title: c.title, description: c.description}));
const tier2 = generate().map(({id, title, description}) => ({id, title, description}));
const QF = JSON.parse(fs.readFileSync(path.join(here, "retrieval-queries.json"), "utf8"));
const Q = QF.queries;
const QS = QF.stress ?? [];
const q1 = Q.filter((q) => q.tier === 1);
const q2 = Q.filter((q) => q.tier === 2);

const out = [
  evaluate(buildIndex(tier1), q1, `tier 1 queries vs tier 1 corpus (${tier1.length} items)`),
  evaluate(buildIndex([...tier1, ...tier2]), q1, `tier 1 queries vs full corpus (${tier1.length + tier2.length} items)`),
  evaluate(buildIndex([...tier1, ...tier2]), q2, `tier 2 queries vs full corpus`),
  evaluate(buildIndex([...tier1, ...tier2]), QS, `stress paraphrases (tier 1 items) vs full corpus`),
];
const pct = (x) => (100 * x).toFixed(1) + "%";
for (const r of out) {
  console.log(`\n## ${r.label}  (${r.n} queries with an expected item)`);
  console.log(`recall@3 ${pct(r.recall3)}   recall@5 ${pct(r.recall5)}   any-hit@3 ${pct(r.hit3r)}   any-hit@5 ${pct(r.hit5r)}`);
  if (r.misses.length) {
    console.log("misses at 3 (expected item not in top 3):");
    for (const m of r.misses) console.log(`  ${m.id} "${m.query}" expected ${m.relevant.join(" + ")} ranks=${m.ranks.join(",")} top3=${m.top3.join(" | ")}`);
  }
  if (verbose) for (const x of r.rows) console.log(`  ${x.id} ranks=${x.ranks.join(",")} top1=${x.top1score} "${x.query}"`);
}
const full = buildIndex([...tier1, ...tier2]);
console.log("\n## unsatisfiable queries (no relevant item exists), top 3 from the full corpus");
for (const q of [...Q, ...QS].filter((q) => !q.relevant.length)) {
  const r = search(full, q.query).slice(0, 3);
  console.log(`  ${q.id} "${q.query}" -> ${r.map((x) => `${x.id} (${x.s.toFixed(1)})`).join(" | ") || "no match"}`);
}
if (process.argv.includes("--json")) fs.writeFileSync(path.join(here, "retrieval-results.json"), JSON.stringify(out, null, 1) + "\n");
