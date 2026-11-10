import assert from "node:assert/strict";
import test from "node:test";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectApiSignatures, diffApiSignatures } from "../api-signatures.mjs";

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "nyc-tron-public-api-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, "widgets");
  mkdirSync(join(directory, "dist"), { recursive: true });
  writeFileSync(join(directory, "package.json"), JSON.stringify({
    name: "@fixture/widgets", version: "1.0.0", type: "module",
    exports: { "./Widget": { types: "./dist/index.d.ts", default: "./dist/index.js" } },
  }));
  const write = (name, source) => writeFileSync(join(directory, "dist", name), source);
  write("config.d.ts", 'export interface Config { size: number; }');
  write("index.d.ts", 'export { Widget as PrimaryWidget } from "./widget.js"; export type { Props } from "./widget.js";');
  const component = ({ optional = "?", value = "string", returns = "boolean" } = {}) => `
    import type { Config } from "./config.js";
    type Unused = { ignored: string };
    export interface Props { value${optional}: ${value}; config: Config; onChange: (value: Config) => boolean; }
    export declare function Widget(props: Props): ${returns};
  `;
  write("widget.d.ts", component());
  return { directory, write, component, collect: () => collectApiSignatures([directory]) };
}

test("public aliases resolve to declarations and include private reachable props, not unused helpers", t => {
  const files = fixture(t), result = files.collect();
  const entry = result.packages["@fixture/widgets"]["./Widget"][0];
  assert.deepEqual(entry.symbols.PrimaryWidget, ["@fixture/widgets/dist/widget.d.ts#Widget"]);
  const props = result.declarations["@fixture/widgets/dist/widget.d.ts#Props"];
  assert.match(props.signatures[0], /value\?: string/);
  assert.ok(props.references.includes("@fixture/widgets/dist/config.d.ts#Config"));
  assert.ok(!Object.keys(result.declarations).some(name => name.endsWith("#Unused")));
});

test("prop requiredness, prop type and return signature changes fail with unchanged export names", t => {
  const files = fixture(t), before = files.collect();
  for (const [options, changed] of [[{ optional: "" }, "Props"], [{ value: "number" }, "Props"], [{ returns: "void" }, "Widget"]]) {
    files.write("widget.d.ts", files.component(options));
    const after = files.collect();
    assert.deepEqual(after.packages, before.packages, "the public subpath and exported names did not change");
    assert.ok(diffApiSignatures(before, after).includes("declarations: changed @fixture/widgets/dist/widget.d.ts#" + changed));
  }
});

test("a type change behind an imported prop fails even when the component declaration is unchanged", t => {
  const files = fixture(t), before = files.collect();
  files.write("config.d.ts", 'export interface Config { size: string; }');
  const after = files.collect();
  assert.deepEqual(before.declarations["@fixture/widgets/dist/widget.d.ts#Props"], after.declarations["@fixture/widgets/dist/widget.d.ts#Props"]);
  assert.ok(diffApiSignatures(before, after).includes("declarations: changed @fixture/widgets/dist/config.d.ts#Config"));
});

test("declaration comments and whitespace do not require an API baseline update", t => {
  const files = fixture(t), before = files.collect();
  files.write("config.d.ts", '/** New documentation. */\nexport interface Config {\n  /* Still the same property. */ size : number ;\n}\n');
  files.write("widget.d.ts", files.component().replace("ignored: string", "ignored: number"));
  assert.deepEqual(diffApiSignatures(before, files.collect()), []);
});

test("unresolvable public dependencies fail instead of silently becoming an incomplete snapshot", t => {
  const files = fixture(t);
  files.write("widget.d.ts", 'import type { Props } from "./missing.js"; export declare function Widget(props: Props): void; export type { Props };');
  assert.throws(() => files.collect(), /Unresolved public/);
});

test("inline import types reject a missing module, missing qualified type and missing namespace", t => {
  const files = fixture(t);
  for (const type of ['import("./missing.js").Missing', 'import("./config.js").Missing', 'typeof import("./missing.js")']) {
    files.write("index.d.ts", 'export type Broken = ' + type + ';');
    assert.throws(() => files.collect(), /Unresolved public import type/);
  }
});

test("platform export routing changes fail even when declaration symbols stay identical", t => {
  const files = fixture(t), manifestFile = join(files.directory, "package.json");
  const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
  const entry = manifest.exports["./Widget"];
  entry["react-native"] = entry.default;
  delete entry.default;
  writeFileSync(manifestFile, JSON.stringify(manifest));
  const before = files.collect();
  entry.browser = entry["react-native"];
  delete entry["react-native"];
  writeFileSync(manifestFile, JSON.stringify(manifest));
  const after = files.collect();
  assert.deepEqual(before.declarations, after.declarations);
  assert.deepEqual(diffApiSignatures(before, after), ["packages: changed @fixture/widgets"]);
});

test("installed external prop declarations and their exact package versions are tracked", t => {
  const files = fixture(t), dependency = join(files.directory, "node_modules/host-types");
  mkdirSync(dependency, { recursive: true });
  const manifest = version => writeFileSync(join(dependency, "package.json"), JSON.stringify({ name: "host-types", version, types: "index.d.ts" }));
  manifest("1.0.0");
  writeFileSync(join(dependency, "index.d.ts"), 'export interface HostProps { testID?: string; } export interface Result { ok: boolean; }');
  files.write("widget.d.ts", 'import type { HostProps } from "host-types"; export interface Props extends HostProps { value: string; } export declare function Widget(props: Props): import("host-types").Result;');
  const before = files.collect();
  assert.match(before.externalTypes["host-types@1.0.0/index.d.ts#HostProps"].signatures[0], /testID\?: string/);
  const relocated = mkdtempSync(join(tmpdir(), "nyc-tron-relocated-api-"));
  t.after(() => rmSync(relocated, { recursive: true, force: true }));
  cpSync(files.directory, join(relocated, "widgets"), { recursive: true });
  assert.deepEqual(before, collectApiSignatures([join(relocated, "widgets")]), "install paths must not enter the snapshot");
  writeFileSync(join(dependency, "index.d.ts"), 'export interface HostProps { testID: string; } export interface Result { ok: boolean; }');
  assert.ok(diffApiSignatures(before, files.collect()).includes("externalTypes: changed host-types@1.0.0/index.d.ts#HostProps"));
  manifest("1.0.1");
  assert.ok(diffApiSignatures(before, files.collect()).includes("externalTypes: added host-types@1.0.1/index.d.ts#HostProps"));
});
