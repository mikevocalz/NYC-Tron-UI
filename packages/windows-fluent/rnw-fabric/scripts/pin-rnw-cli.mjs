// Pins the @react-native-community/cli major that react-native-windows (RNW)
// shells out to, and fails when the consumer resolves anything else.
//
// RNW 0.85.0 runs `npx --yes --no-workspaces @react-native-community/cli ...`
// from PropertySheets/Codegen.props (CodegenCommand), Bundle.props
// (BundleCliCommand) and Autolink.props (AutolinkCommand). A bare package name
// resolves the registry "latest" tag, not the consumer's local copy. cli 21.0.0
// was published 2026-11-12T10:31:04Z and runs 43198587705 and 43200211081
// failed with ETARGET while it propagated. Each property is overridable
// through an environment variable (MSBuild exposes environment variables as
// properties), so this script emits versioned replacements.
//
// Source of truth: example/package.json devDependencies. Pinned and reviewed
// 2026-11-12. Reconsider when RNW publishes a release that declares cli 21 or
// later, or by 2026-12-12, whichever comes first.
//
// Usage: node pin-rnw-cli.mjs <consumer-directory> [github-env-file]
import { appendFileSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const consumer = process.argv[2] && resolve(process.argv[2]);
const envFile = process.argv[3];
if (!consumer) throw new Error("Usage: pin-rnw-cli <consumer-directory> [github-env-file]");
const CLI = "@react-native-community/cli";
const read = path => JSON.parse(readFileSync(path, "utf8"));
const fail = message => { console.error(`pin-rnw-cli: ${message}`); process.exit(1); };

const pin = read(join(root, "example/package.json")).devDependencies?.[CLI];
if (!/^\d+\.\d+\.\d+$/.test(pin ?? "")) fail(`example/package.json must pin ${CLI} to an exact version, found ${pin}`);
const library = read(join(root, "package.json")).devDependencies?.[CLI];
if (library !== pin) fail(`rnw-fabric/package.json pins ${library}, example pins ${pin}`);
const major = pin.split(".")[0];

const installed = read(join(consumer, "node_modules", CLI, "package.json")).version;
if (installed !== pin) fail(`consumer installed ${CLI}@${installed}, pinned ${pin}`);

// --no-install forbids a registry fetch, so success proves local resolution.
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const probe = spawnSync(npx, ["--no-install", "--no-workspaces", `${CLI}@${pin}`, "--version"], { cwd: consumer, encoding: "utf8", shell: process.platform === "win32" });
const resolved = probe.stdout?.trim().split(/\r?\n/).pop();
if (probe.status !== 0 || resolved?.split(".")[0] !== major) fail(`npx resolved ${CLI} ${resolved ?? "nothing"} (exit ${probe.status}), expected major ${major}\n${probe.stderr}`);

const base = `npx --yes --no-workspaces ${CLI}@${pin}`;
const env = { CodegenCommand: `${base} codegen-windows`, BundleCliCommand: `${base} bundle`, AutolinkCommand: `${base} autolink-windows` };
if (envFile) appendFileSync(envFile, Object.entries(env).map(([k, v]) => `${k}=${v}\n`).join(""));
console.info(`RNW CLI pinned to ${pin} (major ${major}); consumer resolves ${resolved}`);
for (const [k, v] of Object.entries(env)) console.info(`  ${k}=${v}`);
