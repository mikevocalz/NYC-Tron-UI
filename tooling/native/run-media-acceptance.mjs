import { spawn, spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { MEDIA_FIXTURE, validateMediaAcceptanceReport } from "../../examples/native-instruments/media-acceptance-contract.ts";

const [platform, input, consumerInput] = process.argv.slice(2);
if (!["android", "ios"].includes(platform) || !input || !consumerInput)
  throw new Error("Usage: node tooling/native/run-media-acceptance.mjs android|ios /built/app.apk|app.app /clean/consumer");
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const consumer = realpathSync(consumerInput), app = join(consumer, "app"), artifact = resolve(input);
if (consumer === repo || consumer.startsWith(repo + sep)) throw new Error("Native acceptance requires the clean installed-tarball consumer outside this checkout");
if (!existsSync(artifact)) throw new Error(`Built native consumer is missing: ${artifact}`);
const output = resolve(process.env.NYC_TRON_ACCEPTANCE_OUTPUT ?? join(consumer, `runtime-${platform}`));
mkdirSync(output, { recursive: true });
const json = path => JSON.parse(readFileSync(path, "utf8"));
const hash = (path, algorithm = "sha256") => createHash(algorithm).update(readFileSync(path)).digest("hex");
const children = [];
let bootedSimulator, capture, stopApp;
const pause = () => new Promise(resolve => setTimeout(resolve, 1000));

function run(file, args, { optional = false, timeout = 30000 } = {}) {
  const result = spawnSync(file, args, { encoding: "utf8", timeout, maxBuffer: 16 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    if (optional) return "";
    throw new Error(`${file} failed: ${result.error?.message ?? result.stderr?.slice(-4000) ?? result.status}`);
  }
  return result.stdout;
}
function background(file, args, name, options = {}) {
  const descriptor = openSync(join(output, name), "w");
  const child = spawn(file, args, { detached: true, stdio: ["ignore", descriptor, descriptor], ...options });
  closeSync(descriptor);
  child.on("error", error => { child.launchError = error; });
  children.push(child); return child;
}
async function waitFor(check, label, timeout = 180000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const value = await check(); if (value) return value;
    const failed = children.find(child => child.launchError || child.exitCode !== null || child.signalCode !== null);
    if (failed) throw new Error(`${label}: app or Metro exited (${failed.launchError?.message ?? failed.exitCode ?? failed.signalCode})`);
    await pause();
  }
  throw new Error(`Timed out waiting for ${label}; inspect ${output}`);
}
async function metroReady() {
  try {
    return (await (await fetch("http://127.0.0.1:8081/status", { signal: AbortSignal.timeout(1500) })).text()).includes("packager-status:running");
  } catch { return false; }
}

const revision = run("git", ["-C", repo, "rev-parse", "HEAD"]).trim();
const plan = json(join(consumer, "consumer.json"));
if (plan.kind !== "expo-native" || plan.sourceCommit !== revision) throw new Error("Installed consumer was prepared from a different candidate");
run(process.execPath, [join(repo, "tooling/consumer-release.mjs"), "check-install", consumer]);
const fixture = join(app, "assets/reference.mp4");
if (hash(fixture) !== MEDIA_FIXTURE.sha256 || hash(fixture, "md5") !== MEDIA_FIXTURE.md5)
  throw new Error("The installed acceptance fixture changed after consumer preparation");

// The app posts its own real native results. This receiver never supplies media
// or decoder responses. A fresh, unguessable path prevents stale-run success.
const receiptPath = "/native-media/" + randomBytes(24).toString("hex");
let received, receiptError;
const receiver = createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== receiptPath) { response.writeHead(404).end(); return; }
  try {
    const chunks = []; let length = 0;
    for await (const chunk of request) {
      length += chunk.length;
      if (length > 131072) throw new Error("Native media report exceeded the receipt limit");
      chunks.push(chunk);
    }
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    writeFileSync(join(output, "native-report.json"), JSON.stringify(value, null, 2) + "\n");
    if (value?.status === "failed") throw new Error(`Native media failed: ${String(value.error).slice(0, 8000)}`);
    const valid = validateMediaAcceptanceReport(value, platform, revision);
    if (received && JSON.stringify(received) !== JSON.stringify(valid)) throw new Error("The app emitted conflicting acceptance results");
    received = valid; response.writeHead(200).end("recorded");
  } catch (error) { receiptError = error; response.writeHead(400).end("invalid native result"); }
});
receiver.requestTimeout = 15000;
receiver.headersTimeout = 15000;

try {
  await new Promise((resolve, reject) => {
    receiver.once("error", reject); receiver.listen(0, "127.0.0.1", resolve);
  });
  const receiptPort = receiver.address().port;
  if (await metroReady()) throw new Error("Port 8081 already hosts a Metro server; refusing to use another app's source");
  background("npx", ["--no-install", "expo", "start", "--localhost", "--port", "8081", "--max-workers", "1"], "metro.log", {
    cwd: app,
    env: { ...process.env, CI: "1", EXPO_NO_TELEMETRY: "1", NYC_TRON_ACCEPTANCE: "media",
      EXPO_PUBLIC_NYC_TRON_REVISION: revision,
      EXPO_PUBLIC_NYC_TRON_ACCEPTANCE_URL: `http://127.0.0.1:${receiptPort}${receiptPath}` },
  });
  await waitFor(metroReady, "the clean consumer's Metro server", 60000);
  let binary = artifact, host;
  if (platform === "android") {
    const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
    if (!sdk) throw new Error("ANDROID_HOME must point to the SDK used to build this consumer");
    const adb = join(sdk, "platform-tools", "adb"), serial = process.env.NYC_TRON_ANDROID_SERIAL ?? "emulator-5554";
    const args = ["-s", serial], bundle = "com.nyctron.instruments.example";
    await waitFor(() => run(adb, [...args, "shell", "getprop", "sys.boot_completed"], { optional: true, timeout: 10000 }).trim() === "1", "Android boot");
    host = { serial, sdk: run(adb, [...args, "shell", "getprop", "ro.build.version.sdk"]).trim() };
    capture = () => {
      run(adb, [...args, "shell", "uiautomator", "dump", "/sdcard/nyc-tron-media.xml"], { optional: true, timeout: 10000 });
      writeFileSync(join(output, "screen.xml"), run(adb, [...args, "shell", "cat", "/sdcard/nyc-tron-media.xml"], { optional: true }));
      run(adb, [...args, "shell", "screencap", "-p", "/sdcard/nyc-tron-media.png"], { optional: true });
      run(adb, [...args, "pull", "/sdcard/nyc-tron-media.png", join(output, "screen.png")], { optional: true });
      writeFileSync(join(output, "logcat.log"), run(adb, [...args, "logcat", "-d", "-t", "2000"], { optional: true }));
    };
    stopApp = () => {
      run(adb, [...args, "shell", "am", "force-stop", bundle], { optional: true });
      for (const port of [8081, receiptPort]) run(adb, [...args, "reverse", "--remove", `tcp:${port}`], { optional: true });
    };
    for (const port of [8081, receiptPort]) run(adb, [...args, "reverse", `tcp:${port}`, `tcp:${port}`]);
    run(adb, [...args, "install", "-r", artifact], { timeout: 120000 });
    run(adb, [...args, "shell", "am", "force-stop", bundle]);
    run(adb, [...args, "shell", "am", "start", "-n", `${bundle}/.MainActivity`]);
  } else {
    const devices = Object.entries(jsonFrom(run("xcrun", ["simctl", "list", "devices", "available", "--json"], { timeout: 90000 })).devices)
      .sort(([left], [right]) => right.localeCompare(left, undefined, { numeric: true })).flatMap(([, list]) => list);
    const requested = process.env.NYC_TRON_IOS_UDID;
    const device = requested ? devices.find(device => device.isAvailable && device.udid === requested) :
      devices.find(device => device.isAvailable && device.name.startsWith("iPhone") && device.state === "Booted") ??
      devices.find(device => device.isAvailable && device.name.startsWith("iPhone"));
    if (!device) throw new Error("No available iPhone simulator runtime is installed");
    const bundle = "com.nyctron.instruments.example";
    if (device.state !== "Booted") { run("xcrun", ["simctl", "boot", device.udid], { timeout: 90000 }); bootedSimulator = device.udid; }
    run("xcrun", ["simctl", "bootstatus", device.udid, "-b"], { timeout: 420000 });
    host = { udid: device.udid, name: device.name };
    capture = () => { run("xcrun", ["simctl", "io", device.udid, "screenshot", join(output, "screen.png")], { optional: true }); };
    stopApp = () => { run("xcrun", ["simctl", "terminate", device.udid, bundle], { optional: true }); };
    const executable = run("/usr/libexec/PlistBuddy", ["-c", "Print :CFBundleExecutable", join(artifact, "Info.plist")]).trim();
    binary = join(artifact, executable);
    run("xcrun", ["simctl", "install", device.udid, artifact], { timeout: 120000 });
    background("xcrun", ["simctl", "launch", "--console", "--terminate-running-process", device.udid, bundle], "app.log");
  }
  const report = await waitFor(() => {
    if (receiptError) throw receiptError;
    return received;
  }, "the installed native decoder's actual result");
  writeFileSync(join(output, "result.json"), JSON.stringify({
    ...report,
    provenance: { ...host, sourceCommit: revision, fixtureSha256: hash(fixture), binarySha256: hash(binary),
      installedPackages: json(join(consumer, "installed-packages.json")) },
  }, null, 2) + "\n");
  console.info(`Native ${platform} decoder passed ${report.checks.length} checks at ${revision}. Evidence: ${output}`);
} catch (error) {
  writeFileSync(join(output, "failure.txt"), String(error?.stack ?? error) + "\n");
  throw error;
} finally {
  try { capture?.(); } catch (error) { writeFileSync(join(output, "capture-error.txt"), String(error)); }
  stopApp?.();
  for (const child of children.reverse()) {
    if (child.pid && child.exitCode === null && child.signalCode === null) {
      try { process.kill(-child.pid, "SIGTERM"); } catch { /* Already stopped. */ }
    }
  }
  receiver.closeAllConnections();
  await new Promise(resolve => receiver.close(resolve));
  if (bootedSimulator) run("xcrun", ["simctl", "shutdown", bootedSimulator], { optional: true });
}

function jsonFrom(value) { return JSON.parse(value); }
