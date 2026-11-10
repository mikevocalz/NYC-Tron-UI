import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";
const [input, evidenceInput, output] = process.argv.slice(2);
if (!input || !evidenceInput || !output) throw new Error("Usage: retain-tested-package consumer uia-evidence output");
const consumer = resolve(input), evidence = resolve(evidenceInput), destination = resolve(output);
const preparation = JSON.parse(readFileSync(join(consumer, "package-preparation.json"), "utf8"));
const acceptance = JSON.parse(readFileSync(join(evidence, "result.json"), "utf8").replace(/^\uFEFF/, ""));
const required = ["controlled-native-navigation", "shared-runtime-two-windows", "shared-document-state", "native-minimize-restore", "native-close-veto", "native-close-accept", "native-window-reopen"];
if (acceptance.status !== "passed" || acceptance.sourceRevision !== preparation.sourceRevision || required.some(check => !acceptance.checks?.includes(check))) throw new Error("Native Windows acceptance is incomplete or came from a different revision");
const archive = preparation.archives.find(a => a.name === "@nyc-tron/windows-fluent-fabric");
if (!archive || !preparation.installedFromArchives) throw new Error("Missing actual installed package identity");
const source = join(consumer, "vendor", archive.filename), sha = bytes => createHash("sha256").update(bytes).digest("hex");
for (const packed of preparation.archives) {
  if (sha(readFileSync(join(consumer, "vendor", packed.filename))) !== packed.sha256) throw new Error(`Tested package archive changed: ${packed.name}`);
  if (!packed.files?.length) throw new Error(`Installed source receipt is missing: ${packed.name}`);
  for (const file of packed.files) {
    if (sha(readFileSync(join(consumer, "node_modules", packed.name, file.path))) !== file.sha256) throw new Error(`Tested installed source changed: ${packed.name}/${file.path}`);
  }
}
const installed = JSON.parse(readFileSync(join(consumer, "node_modules/@nyc-tron/windows-fluent-fabric/package.json"), "utf8"));
const lock = JSON.parse(readFileSync(join(consumer, "package-lock.json"), "utf8"));
const resolved = lock.packages["node_modules/@nyc-tron/windows-fluent-fabric"];
const bytes = readFileSync(source);
if (resolved.link || resolved.integrity !== "sha512-" + createHash("sha512").update(bytes).digest("base64")) throw new Error("Installed package lock does not identify the original tested archive");
mkdirSync(destination, { recursive: true });
cpSync(source, join(destination, archive.filename));
cpSync(join(consumer, "package-preparation.json"), join(destination, "package-preparation.json"));
cpSync(join(evidence, "result.json"), join(destination, "native-acceptance.json"));
const evidenceHashes = Object.fromEntries(readdirSync(evidence).filter(name => /\.(?:json|png|txt)$/.test(name)).map(name => [name, sha(readFileSync(join(evidence, name)))]));
writeFileSync(join(destination, "SHA256SUMS"), `${archive.sha256}  ${archive.filename}\n`);
const dependencies = preparation.archives.filter(a => a.name !== archive.name).map(a => ({ packageName: a.name, filename: a.filename, sha256: a.sha256 }));
writeFileSync(join(destination, "tested-package.json"), JSON.stringify({ schemaVersion: 1, status: "passed", platform: "windows", packageName: installed.name, version: installed.version, filename: archive.filename, sha256: archive.sha256, sourceRevision: preparation.sourceRevision, checks: required, dependencies, evidenceHashes }, null, 2) + "\n");
