#!/usr/bin/env node
// Validates registry.json against shadcn's published JSON schemas.
//   node tooling/registry/validate-schema.mjs --ajv <dir with ajv installed> [file]
// The schemas are fetched from ui.shadcn.com. If they cannot be reached the script says so
// and exits 0, because the other half of the schema gate (`shadcn build`, which validates
// every item) does not depend on the network.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(n) ? argv[argv.indexOf(n) + 1] : null);
const ajvDir = flag("--ajv");
const file = path.resolve(root, argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--ajv")[0] || "registry.json");
const REGISTRY = "https://ui.shadcn.com/schema/registry.json";
const ITEM = "https://ui.shadcn.com/schema/registry-item.json";

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.json();
}

let registrySchema;
let itemSchema;
try {
  [registrySchema, itemSchema] = await Promise.all([get(REGISTRY), get(ITEM)]);
} catch (e) {
  console.log(`::notice::schema check skipped, ${REGISTRY} not reachable: ${e.message}`);
  console.log("validate-schema: SKIPPED (network); `shadcn build` still validates every item");
  process.exit(0);
}
if (!ajvDir) { console.error("validate-schema: pass --ajv <dir> with ajv installed"); process.exit(2); }
const require = createRequire(path.join(path.resolve(ajvDir), "package.json"));
const Ajv = require("ajv");
// The published documents name a draft-07 meta schema with an https URL that Ajv does not register.
delete registrySchema.$schema;
delete itemSchema.$schema;
const ajv = new Ajv({ strict: false, allErrors: true });
ajv.addSchema(itemSchema, ITEM);
const validate = ajv.compile(registrySchema);
const doc = JSON.parse(fs.readFileSync(file, "utf8"));
delete doc.$schema;
if (!validate(doc)) {
  for (const err of validate.errors.slice(0, 20)) console.error(`FAIL ${err.instancePath || "/"} ${err.message}`);
  console.error(`validate-schema: ${validate.errors.length} error(s) in ${path.relative(root, file)}`);
  process.exit(1);
}
console.log(`validate-schema: ${path.relative(root, file)} valid against ${REGISTRY} (${doc.items.length} items)`);
