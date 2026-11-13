import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { MAESTRO, nativeElementCenter, parseHierarchy, requirePassedFlow, requireReferenceHostBounds, requireSemanticLabels } from "./ui-evidence.mjs";
import { recordNativeArtifact } from "./native-artifact.mjs";
import { warmNativeBundle } from "./metro-warmup.mjs";
import { classifyInitialUiTransportFailure, maestroSessionLimits, retainInitialUiTransportFailure, withInitialUiTransportRecovery } from "./ui-transport.mjs";
import { workspaceObservation, requireWorkspaceModeContinuity, requireWorkspaceDocumentReturn, requireWorkspacePresetSave } from "./workspace-evidence.mjs";

const [platform, artifactInput, consumerInput] = process.argv.slice(2);
if (!["ios", "android"].includes(platform) || !artifactInput || !consumerInput) {
  throw new Error("Usage: node tooling/native/run-ui-acceptance.mjs ios|android /built/app.app|app.apk /clean/consumer");
}
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const consumer = realpathSync(consumerInput), app = join(consumer, "app"), artifact = realpathSync(artifactInput);
if (consumer === repo || consumer.startsWith(repo + sep)) throw new Error("Native UI acceptance requires the clean installed-tarball consumer outside this checkout");
const output = resolve(process.env.NYC_TRON_UI_OUTPUT ?? join(consumer, "runtime-ui-" + platform));
mkdirSync(output); // A previous run's reports cannot satisfy this one.
const maestro = process.env.MAESTRO_BIN;
if (!maestro || !existsSync(maestro)) throw new Error("MAESTRO_BIN must name the verified pinned Maestro installation");
const env = { ...process.env, CI: "1", MAESTRO_CLI_NO_ANALYTICS: "1", MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED: "true",
  // Every Maestro CLI session starts its own XCTest runner; see maestroSessionLimits.
  MAESTRO_DRIVER_STARTUP_TIMEOUT: String(maestroSessionLimits.driverStartupMs) };
const json = file => JSON.parse(readFileSync(file, "utf8"));
const hash = file => createHash("sha256").update(readFileSync(file)).digest("hex");
const bundle = "com.nyctron.instruments.example", stages = [], children = [], bundleWarmups = [], transportRecoveries = [];
let metro, bootedSimulator, stopApp, deviceId, host, launcher, capture, recoverAndroidTransport;

function run(file, args, { optional = false, timeout = 30000, log, cwd, extraEnv } = {}) {
  const started = Date.now();
  const result = spawnSync(file, args, { cwd, env: { ...env, ...extraEnv }, encoding: "utf8", timeout, maxBuffer: 32 * 1024 * 1024 });
  appendFileSync(join(output, "commands.jsonl"), JSON.stringify({ file, args, elapsedMs: Date.now() - started,
    status: result.status, error: result.error?.message }) + "\n");
  if (log) writeFileSync(join(output, log), (result.stdout ?? "") + (result.stderr ?? ""));
  if (result.error || result.status !== 0) {
    if (optional) return "";
    throw new Error(file + " failed: " + (result.error?.message ?? result.stderr?.slice(-4000) ?? result.status));
  }
  return result.stdout;
}
async function waitFor(check, label, timeout = 90000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return;
    const stopped = children.find(child => child.launchError || child.exitCode !== null || child.signalCode !== null);
    if (stopped) throw new Error(label + ": owned app or Metro process exited");
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error("Timed out waiting for " + label);
}
async function metroReady() {
  try { return (await (await fetch("http://127.0.0.1:8081/status", { signal: AbortSignal.timeout(1500) })).text()).includes("packager-status:running"); }
  catch { return false; }
}
async function stopMetro() {
  if (!metro) return;
  const child = metro; metro = undefined;
  children.splice(children.indexOf(child), 1);
  if (child.pid && child.exitCode === null && child.signalCode === null) {
    try { process.kill(-child.pid, "SIGTERM"); } catch { /* Already stopped. */ }
    await new Promise(resolve => {
      const timer = setTimeout(resolve, 5000);
      child.once("exit", () => { clearTimeout(timer); resolve(); });
    });
  }
  await waitFor(async () => !await metroReady(), "the owned Metro session to stop", 15000);
}
async function startMetro(entry) {
  if (await metroReady()) throw new Error("Port 8081 already hosts a Metro server; refusing another app's source");
  const descriptor = openSync(join(output, "metro-" + entry + ".log"), "w");
  metro = spawn("npx", ["--no-install", "expo", "start", "--localhost", "--port", "8081", "--max-workers", "1"], {
    cwd: app, detached: true, stdio: ["ignore", descriptor, descriptor],
    env: { ...env, EXPO_NO_TELEMETRY: "1", NYC_TRON_ACCEPTANCE: entry },
  });
  closeSync(descriptor);
  const child = metro;
  child.on("error", error => { child.launchError = error; });
  children.push(metro);
  await waitFor(metroReady, "the clean consumer's " + entry + " Metro server", 60000);
  const warmup = await warmNativeBundle({ platform, entry, evidenceDirectory: output });
  const file = "bundle-warmup-" + entry + ".json";
  bundleWarmups.push({ ...warmup, file, recordSha256: hash(join(output, file)) });
}
function allFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? allFiles(join(directory, entry.name)) : [join(directory, entry.name)]);
}
function initialTransportFailure(name) {
  try {
    const files = allFiles(join(output, name));
    const commands = files.filter(file => file.endsWith(sep + "commands.json"));
    const simulator = files.filter(file => file.endsWith(sep + "device-simulator.log"));
    if (commands.length !== 1 || platform === "ios" && simulator.length !== 1) return null;
    const recorded = json(commands[0]);
    // Maestro's own tree of the failed assertion, at the path that command declares.
    const declared = recorded.filter(entry => entry?.metadata?.status === "FAILED")
      .flatMap(entry => entry.metadata.artifacts ?? []).filter(artifact => artifact?.type === "SCREEN_HIERARCHY");
    const treeFile = declared.length === 1 && /^screen-hierarchy\/[^/]+\.json$/.test(declared[0].path)
      ? join(dirname(commands[0]), declared[0].path) : undefined;
    const failureHierarchy = treeFile && existsSync(treeFile) ? { path: declared[0].path, tree: json(treeFile) } : undefined;
    const eligibility = classifyInitialUiTransportFailure({ platform, flow: name, appId: bundle, deviceId, commands: recorded,
      simulatorLog: simulator[0] ? readFileSync(simulator[0], "utf8") : undefined, failureHierarchy });
    return eligibility ? { ...eligibility, sourceFiles: { commands: commands[0].slice(output.length + 1),
      ...(simulator[0] ? { simulatorLog: simulator[0].slice(output.length + 1) } : {}),
      ...(failureHierarchy ? { failureHierarchy: treeFile.slice(output.length + 1) } : {}) } } : null;
  } catch { return null; } // Missing/ambiguous native evidence must preserve the original failure.
}
function hierarchy(name) {
  const raw = run(maestro, ["--device", deviceId, "--platform", platform, "--no-ansi", "hierarchy", "--no-reinstall-driver"], {
    timeout: maestroSessionLimits.hierarchyTimeoutMs, log: name + "-hierarchy-command.log",
  });
  const tree = parseHierarchy(raw);
  writeFileSync(join(output, name + "-hierarchy.json"), JSON.stringify(tree, null, 2) + "\n");
  return tree;
}
function flow(name, labels, screenshots) {
  const directory = join(output, name), junit = join(directory, "report.xml");
  mkdirSync(directory);
  run(maestro, ["--device", deviceId, "--platform", platform, "--no-ansi", "test",
    // Retain the same native driver for each flow and hierarchy capture. The
    // default iOS close uninstalls XCTest, whose next startup can take focus.
    "--no-reinstall-driver", "--format", "junit", "--output", junit,
    "--test-output-dir", join(directory, "artifacts"), "--debug-output", join(directory, "debug"),
    join(repo, "tooling/native/ui-flows", name + ".yaml")], { timeout: 360000, log: name + "-maestro.log" });
  const result = requirePassedFlow(readFileSync(junit, "utf8"));
  const tree = hierarchy(name);
  requireSemanticLabels(tree, labels);
  const geometry = name === "settings" || name === "editor" ? requireReferenceHostBounds(tree) : undefined;
  const files = allFiles(directory);
  const images = screenshots.map(name => {
    const file = files.find(path => path.endsWith(sep + name + ".png"));
    if (!file || readFileSync(file).subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error("Native screenshot missing: " + name);
    return { file: file.slice(output.length + 1), sha256: hash(file) };
  });
  stages.push({ name, ...result, report: name + "/report.xml", reportSha256: hash(junit),
    hierarchy: name + "-hierarchy.json", hierarchySha256: hash(join(output, name + "-hierarchy.json")), images,
    ...(geometry ? { geometry } : {}) });
  return tree;
}

try {
  const nativeArtifact = recordNativeArtifact(platform, artifact, output);
  const revision = run("git", ["-C", repo, "rev-parse", "HEAD"]).trim();
  const plan = json(join(consumer, "consumer.json"));
  if (plan.kind !== "expo-native" || plan.sourceCommit !== revision) throw new Error("Installed UI consumer belongs to a different candidate");
  run(process.execPath, [join(repo, "tooling/consumer-release.mjs"), "check-install", consumer]);
  const version = run(maestro, ["--version"], { timeout: 60000, log: "maestro-version.log" }).trim().split(/\r?\n/).at(-1);
  if (version !== MAESTRO.version) throw new Error("Native UI acceptance must use Maestro " + MAESTRO.version);
  let launch;
  if (platform === "android") {
    const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
    if (!sdk) throw new Error("ANDROID_HOME must point to the candidate's SDK");
    const adb = join(sdk, "platform-tools/adb");
    deviceId = process.env.NYC_TRON_ANDROID_SERIAL ?? "emulator-5554";
    const args = ["-s", deviceId];
    await waitFor(() => run(adb, [...args, "shell", "getprop", "sys.boot_completed"], { optional: true, timeout: 10000 }).trim() === "1", "Android boot", 180000);
    host = { serial: deviceId, sdk: run(adb, [...args, "shell", "getprop", "ro.build.version.sdk"]).trim() };
    run(adb, [...args, "reverse", "tcp:8081", "tcp:8081"]);
    run(adb, [...args, "install", "-r", artifact], { timeout: 120000, log: "install.log" });
    stopApp = () => { run(adb, [...args, "shell", "am", "force-stop", bundle], { optional: true }); };
    launch = () => { stopApp(); run(adb, [...args, "shell", "am", "start", "-n", bundle + "/.MainActivity"]); };
    recoverAndroidTransport = async () => {
      await waitFor(() => run(adb, [...args, "get-state"], { optional: true, timeout: 5000 }).trim() === "device" &&
        run(adb, [...args, "shell", "getprop", "sys.boot_completed"], { optional: true, timeout: 5000 }).trim() === "1",
      "the same Android emulator's actual ADB transport", 60000);
      run(adb, [...args, "reverse", "tcp:8081", "tcp:8081"]);
      const reverse = run(adb, [...args, "reverse", "--list"]);
      if (!/(?:^|\s)tcp:8081\s+tcp:8081(?:\s|$)/.test(reverse)) throw new Error("Android recovery did not restore the owned Metro reverse mapping");
      // No force-stop, reinstall or data reset: the first flow never reached an
      // app assertion. Resume the same installed candidate before the full rerun.
      run(adb, [...args, "shell", "am", "start", "-n", bundle + "/.MainActivity"]);
      let pid, activity;
      await waitFor(() => {
        pid = run(adb, [...args, "shell", "pidof", bundle], { optional: true, timeout: 5000 }).trim();
        activity = run(adb, [...args, "shell", "dumpsys", "activity", "activities"], { optional: true, timeout: 5000 });
        return /^\d+(?:\s+\d+)*$/.test(pid) && activity.split(/\r?\n/).some(line =>
          /(?:topResumedActivity|mResumedActivity)/.test(line) && line.includes(bundle + "/.MainActivity"));
      }, "the same Android candidate's resumed Activity", 30000);
      const file = "android-transport-recovery-ready.json";
      writeFileSync(join(output, file), JSON.stringify({ platform, deviceId, appId: bundle, pid, reverse,
        resumedActivity: activity.split(/\r?\n/).filter(line => /(?:topResumedActivity|mResumedActivity)/.test(line)),
        observedAt: new Date().toISOString() }, null, 2) + "\n");
      return { file, sha256: hash(join(output, file)) };
    };
    host.cancelPointer = tree => {
      const { x, y } = nativeElementCenter(tree, "Input drawing surface");
      run(adb, [...args, "shell", "input", "touchscreen", "motionevent", "DOWN", String(x), String(y)]);
      const down = hierarchy("pointer-down");
      requireSemanticLabels(down, ["Input source: touch. Last event: down."]);
      // The OS ends the active touch when Home removes the app's input focus.
      // Resuming the same Activity must keep its already committed stroke.
      run(adb, [...args, "shell", "input", "keyevent", "KEYCODE_HOME"]);
      run(adb, [...args, "shell", "am", "start", "-n", bundle + "/.MainActivity"]);
    };
    capture = () => {
      run(adb, [...args, "shell", "screencap", "-p", "/sdcard/nyc-tron-ui-final.png"], { optional: true });
      run(adb, [...args, "pull", "/sdcard/nyc-tron-ui-final.png", join(output, "final.png")], { optional: true });
      writeFileSync(join(output, "logcat.log"), run(adb, [...args, "logcat", "-d", "-t", "2000"], { optional: true }));
      run(adb, [...args, "reverse", "--remove", "tcp:8081"], { optional: true });
    };
  } else {
    const devices = Object.entries(jsonFrom(run("xcrun", ["simctl", "list", "devices", "available", "--json"], { timeout: 90000, log: "simulators.log" })).devices)
      .sort(([left], [right]) => right.localeCompare(left, undefined, { numeric: true })).flatMap(([, list]) => list);
    const specified = process.env.NYC_TRON_IOS_UDID;
    const device = specified ? devices.find(device => device.isAvailable && device.udid === specified) :
      devices.find(device => device.isAvailable && device.name.startsWith("iPhone") && device.state === "Booted") ??
      devices.find(device => device.isAvailable && device.name.startsWith("iPhone"));
    if (!device) throw new Error("No requested/available iPhone simulator runtime is installed");
    deviceId = device.udid;
    if (device.state !== "Booted") { run("xcrun", ["simctl", "boot", deviceId], { timeout: 90000, log: "simulator-boot.log" }); bootedSimulator = deviceId; }
    run("xcrun", ["simctl", "bootstatus", deviceId, "-b"], { timeout: 420000, log: "simulator-bootstatus.log" });
    host = { udid: deviceId, name: device.name };
    launcher = join(artifact, run("/usr/libexec/PlistBuddy", ["-c", "Print :CFBundleExecutable", join(artifact, "Info.plist")]).trim());
    run("xcrun", ["simctl", "install", deviceId, artifact], { timeout: 120000, log: "install.log" });
    stopApp = () => { run("xcrun", ["simctl", "terminate", deviceId, bundle], { optional: true }); };
    launch = () => { run("xcrun", ["simctl", "launch", "--terminate-running-process", deviceId, bundle], { timeout: 90000 }); };
    capture = () => { run("xcrun", ["simctl", "io", deviceId, "screenshot", join(output, "final.png")], { optional: true }); };
  }
  await startMetro("reference"); launch();
  // At most one evidence-bound recovery per flow, each limited to that flow's
  // first tab tap or single stroke (see ui-transport.mjs). Any other failure is final.
  const recoverable = async (name, labels, screenshots) => {
    let recoveryReceipt;
    const tree = await withInitialUiTransportRecovery({
      attempt: () => flow(name, labels, screenshots),
      classify: () => initialTransportFailure(name),
      recover: async (eligibility, error) => {
        recoveryReceipt = retainInitialUiTransportFailure({ output, flow: name, eligibility, error, sourceCommit: revision, nativeArtifact });
        if (platform === "android") recoveryReceipt.readiness = await recoverAndroidTransport();
        // The app counted the OS-cancelled stroke; its counters only reset with a
        // fresh process. Same installed binary and Metro session, no data reset.
        if (name === "pointer") { launch(); recoveryReceipt.relaunch = "simctl launch --terminate-running-process"; }
      },
    });
    if (recoveryReceipt) transportRecoveries.push({ ...recoveryReceipt, flow: name, status: "recovered", attempts: 2 });
    return tree;
  };
  await recoverable("settings", ["Workspace name", "Native UI workspace"], ["settings-saved"]);
  await recoverable("editor", ["Cover headline"], ["editor-draft", "editor-saved"]);
  stopApp(); await stopMetro();
  await startMetro("pointer"); launch();
  const pointer = await recoverable("pointer", ["Input drawing surface", "Input source: touch. Last event: up."], ["pointer-touch"]);
  if (platform === "android") {
    host.cancelPointer(pointer);
    flow("pointer-cancel", ["Input source: touch. Last event: cancel."], ["pointer-cancel"]);
  }
  stopApp(); await stopMetro();
  await startMetro("library"); launch();
  // These are partial A-01/A-02 fixture obligations, not complete row or engine
  // acceptance. No recovery rule is extended to the new workspace flows.
  const observations = [];
  const observeWorkspace = (name, labels, screenshots) => {
    const tree = flow(name, labels, screenshots);
    const state = workspaceObservation(tree);
    observations.push({ name, hierarchy: name + "-hierarchy.json",
      hierarchySha256: hash(join(output, name + "-hierarchy.json")), state });
    writeFileSync(join(output, "workspace-observations.json"), JSON.stringify({ schemaVersion: 1,
      sourceCommit: revision, platform, observedVia: "Maestro native accessibility hierarchy", observations }, null, 2) + "\n");
    return state;
  };
  const workspaceBefore = observeWorkspace("workspace-baseline", ["Harbor", "Canvas edits 1"], ["workspace-baseline"]);
  const workspaceColor = observeWorkspace("workspace-color", ["Harbor", "Canvas edits 1"], ["workspace-color"]);
  requireWorkspaceModeContinuity(workspaceBefore, workspaceColor);
  const workspaceReturned = observeWorkspace("workspace-return", ["Harbor", "Canvas edits 1"],
    ["workspace-document-b", "workspace-document-return"]);
  requireWorkspaceDocumentReturn(workspaceReturned);
  const workspaceSaved = observeWorkspace("workspace-preset", ["Workspace preset: Custom layout copy", "Canvas edits 1"], ["workspace-preset"]);
  requireWorkspacePresetSave(workspaceReturned, workspaceSaved);
  const report = {
    schema: 1, status: "passed", platform, revision, stages,
    provenance: { ...host, nativeArtifact, ...(launcher ? { launcherSha256: hash(launcher) } : {}), sourceCommit: revision, maestro: MAESTRO,
      installedPackages: json(join(consumer, "installed-packages.json")), bundleWarmups, transportRecoveries },
    workspacePilot: { scope: "Controlled native fixture only; partial row obligations, no Rust rendering or processing proof",
      rows: ["A-01", "A-02"], obligations: ["A01.mode-identity", "A01.document-return", "A02.save-color-layout"],
      acceptance: "unverified", observations: "workspace-observations.json", observationsSha256: hash(join(output, "workspace-observations.json")),
      notCovered: ["remaining A-01/A-02 obligations", "A-03 dock targets", "A-04 splitter/minimum/hinge behavior", "iPad-specific execution"] },
    input: platform === "android" ? "Maestro OS touch plus Android touch-down/Home cancellation" : "Maestro XCTest OS touch",
    manualGates: ["physical pen pressure/tilt/hover", "physical palm rejection", "VoiceOver/TalkBack spoken output",
      ...(platform === "ios" ? ["active iOS touch cancellation by OS interruption"] : [])],
  };
  writeFileSync(join(output, "result.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("Native " + platform + " UI passed " + stages.length + " actual OS-driven flows at " + revision + ". Evidence: " + output);
} catch (error) {
  writeFileSync(join(output, "failure.txt"), String(error?.stack ?? error) + "\n");
  if (deviceId) { try { hierarchy("failure"); } catch { /* Preserve the original failure and command log. */ } }
  throw error;
} finally {
  try { capture?.(); } catch (error) { writeFileSync(join(output, "capture-error.txt"), String(error)); }
  stopApp?.();
  await stopMetro();
  if (bootedSimulator) run("xcrun", ["simctl", "shutdown", bootedSimulator], { optional: true, timeout: 90000 });
}

function jsonFrom(value) { return JSON.parse(value); }
