// Launches the built Spark coverage harness app and reads its results through
// the Spark test driver (gate T4). The consumer must have been prepared with
// tooling/macos-appkit/prepare-consumer.mjs --native-acceptance (test driver in
// release, private transport repair) and then prepare-ui-coverage.mjs.
//
//   node tooling/desktop-lane/run-macos.mjs <consumer-dir> <evidence-dir>
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { closeSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout as pause } from "node:timers/promises";

const [consumerArgument, evidenceArgument] = process.argv.slice(2);
if (!consumerArgument || !evidenceArgument) throw new Error("Usage: run-macos.mjs <consumer-dir> <evidence-dir>");
const consumer = resolve(consumerArgument), evidence = resolve(evidenceArgument);
if (existsSync(evidence)) throw new Error("Use a fresh evidence directory");
mkdirSync(evidence, { recursive: true });
for (const file of ["preparation.json", "model.json", "resolution.jsonl"]) {
  const source = join(consumer, "tron-ui-coverage", file);
  if (existsSync(source)) copyFileSync(source, join(evidence, file));
}
const { connectDriver } = await import(pathToFileURL(join(consumer, "driver-client.mjs")).href);
const config = JSON.parse(readFileSync(join(consumer, "desktop.config.json"), "utf8"));
if (config.macos?.testDriverInRelease !== true) throw new Error("Prepare the consumer with --native-acceptance so the release app has the test driver");
const app = join(consumer, ".spark/products/macos-arm64/release", `${config.name}.app`);
if (!existsSync(join(app, "Contents/Resources/main.jsbundle"))) throw new Error(`Expected a standalone app with bundled JavaScript at ${app}`);
const info = spawnSync("/usr/bin/plutil", ["-extract", "CFBundleExecutable", "raw", "-o", "-", join(app, "Contents/Info.plist")], { encoding: "utf8" });
if (info.status !== 0) throw new Error(`Cannot read the app executable name: ${info.stderr}`);
const executable = join(app, "Contents/MacOS", info.stdout.trim());

const driverDirectory = mkdtempSync("/tmp/nt-ui-coverage-");
spawnSync("/bin/chmod", ["700", driverDirectory]);
const token = randomBytes(32).toString("hex");
writeFileSync(join(driverDirectory, "token"), token, { mode: 0o600 });
const log = openSync(join(evidence, "app.log"), "w");
const child = spawn(executable, [], { cwd: consumer, env: { ...process.env, SPARK_TEST_DRIVER_DIR: driverDirectory }, stdio: ["ignore", log, log] });
closeSync(log);
let launchError;
child.on("error", error => { launchError = error; });
const alive = () => !launchError && child.exitCode === null && child.signalCode === null;

const outcome = { schema: 1, lane: "macos", startedAt: new Date().toISOString(), status: "running", lastProgress: null };
const save = () => writeFileSync(join(evidence, "run.json"), JSON.stringify(outcome, null, 2) + "\n");
let driver;
try {
  for (const deadline = Date.now() + 60000; !existsSync(join(driverDirectory, "driver.sock"));) {
    if (!alive()) throw new Error(`App exited before the driver started (${launchError?.message ?? child.exitCode ?? child.signalCode})`);
    if (Date.now() > deadline) throw new Error("Spark test driver socket did not appear within 60 s");
    await pause(250);
  }
  driver = connectDriver(join(driverDirectory, "driver.sock"), token, () => {}, { responseTimeoutMs: 60000 });
  await driver.ready;
  await driver.request("ping");
  await driver.request("waitFor", { testID: "tron-ui-coverage-status", timeoutMs: 60000 });
  const label = async testID => (await driver.request("tron.inspect", { window: "main", testID })).label;
  let status;
  for (const deadline = Date.now() + 20 * 60000; ;) {
    if (!alive()) throw new Error(`App exited during the run (${child.exitCode ?? child.signalCode})`);
    status = await label("tron-ui-coverage-status");
    if (status.startsWith("done:")) break;
    if (status !== outcome.lastProgress) { outcome.lastProgress = status; outcome.lastProgressAt = new Date().toISOString(); save(); }
    if (Date.now() > deadline) throw new Error(`Harness did not finish within 20 minutes; last progress ${status}`);
    await pause(1000);
  }
  const chunks = Number(status.split(":").pop());
  if (!Number.isSafeInteger(chunks) || chunks < 1) throw new Error(`Malformed final status ${status}`);
  let payload = "";
  for (let i = 0; i < chunks; i++) payload += await label(`tron-ui-coverage-chunk-${i}`);
  const results = JSON.parse(payload);
  writeFileSync(join(evidence, "results.json"), JSON.stringify(results, null, 2) + "\n");
  outcome.status = "completed"; outcome.finalStatus = status;
  await driver.request("quit").catch(() => {});
} catch (error) {
  outcome.status = "harness-failed";
  outcome.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
} finally {
  outcome.finishedAt = new Date().toISOString();
  outcome.processExit = { code: child.exitCode, signal: child.signalCode };
  save();
  driver?.close();
  if (alive()) child.kill("SIGTERM");
}
console.info(`macOS coverage run ${outcome.status}${outcome.error ? `: ${outcome.error}` : ""}`);
