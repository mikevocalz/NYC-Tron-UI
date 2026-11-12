// Gate T4 item 1: the two documented ways to add NYC-Tron UI to an Expo app,
// run end to end from release tarballs on a clean runner.
//
//   node tooling/install-paths/install-path.mjs prepare <new|existing> <dir> (--release <tag> | --packs <dir>) [--gesture]
//   node tooling/install-paths/web-check.mjs <exported-web-dir> <screenshot.png> [path]
//
// prepare:
//   new       create-expo-app blank-typescript, then the one install command,
//             then App.tsx renders a Tron Button.
//   existing  create-expo-app default template (expo-router, its own screens
//             and native peers), committed as the "existing app"; then the one
//             install command and one new route file, app/tron.tsx. The record
//             lists every tracked file the install changed, so "without
//             disturbing it" is checked against git, not asserted.
//   --gesture (existing only) adds a second route, app/gesture.tsx, that
//             drives GestureHandlerDrag with the gesture handler the app
//             template installed (Expo 58 pins ~3.3.0).
// The one command is plain npm with the release tarball URLs:
//   npm install --allow-remote=all <core.tgz> <ui.tgz>
// npm 12 refuses remote tarballs unless allow-remote permits them; npm 11
// ignores the flag. No peer override is passed: a peer conflict is a result.
//
// Native setup comes only from `expo prebuild`; nothing here edits ios/ or
// android/. The workflow builds and drives the native apps.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const CREATE_EXPO_APP = "create-expo-app@5.0.0";
const REPOSITORY = "mikevocalz/NYC-Tron-UI";
const env = { ...process.env, CI: "1", EXPO_NO_TELEMETRY: "1", npm_config_yes: "true" };
const run = (command, args, cwd, options = {}) => spawnSync(command, args, { cwd, env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, shell: process.platform === "win32", ...options });
const must = (result, what) => {
  if (result.error || result.status !== 0) throw new Error(`${what} failed (${result.error?.message ?? result.status})\n${(result.stdout ?? "").slice(-4000)}\n${(result.stderr ?? "").slice(-4000)}`);
  return result;
};
const git = (cwd, ...args) => must(run("git", args, cwd), "git " + args.join(" ")).stdout;

// Same test IDs as the Button screen, so web-check.mjs drives both routes.
// GestureHandlerDrag reports one onRelease per completed tap or drag.
const GESTURE_SCREEN = `import { useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GestureHandlerDrag } from "@nyc-tron/ui/components/gestures/GestureHandlerDrag";

export default function TronGestureScreen() {
  const [presses, setPresses] = useState(0);
  return (
    <GestureHandlerRootView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <GestureHandlerDrag onBegin={() => {}} onMove={() => {}} onCancel={() => {}} onRelease={() => setPresses(count => count + 1)}>
        <View testID="tron-button" accessibilityLabel="Tron gesture target" style={{ width: 160, height: 64, backgroundColor: "#0aa" }} />
      </GestureHandlerDrag>
      <Text testID="tron-presses">Pressed {presses} times</Text>
    </GestureHandlerRootView>
  );
}
`;

const BUTTON_SCREEN = `import { useState } from "react";
import { Text, View } from "react-native";
import { Button } from "@nyc-tron/ui/components/Button";

export default function TronScreen() {
  const [presses, setPresses] = useState(0);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Button testID="tron-button" title="Tron button" onPress={() => setPresses(count => count + 1)} />
      <Text testID="tron-presses">Pressed {presses} times</Text>
    </View>
  );
}
`;

function tarballs(args) {
  const release = args.indexOf("--release"), packs = args.indexOf("--packs");
  if (release >= 0) {
    const tag = args[release + 1], version = tag.replace(/^v/, "");
    const base = `https://github.com/${REPOSITORY}/releases/download/${tag}`;
    return { source: { release: tag }, specs: ["core", "ui"].map(name => `${base}/nyc-tron-${name}-${version}.tgz`) };
  }
  if (packs >= 0) {
    const directory = resolve(args[packs + 1]);
    const specs = ["core", "ui"].map(name => {
      const file = readdirSync(directory).find(f => f.startsWith(`nyc-tron-${name}-`) && f.endsWith(".tgz"));
      if (!file) throw new Error(`Missing nyc-tron-${name} archive in ${directory}`);
      return join(directory, file);
    });
    return { source: { packs: directory }, specs };
  }
  throw new Error("Pass --release <tag> or --packs <dir>");
}

function prepare([kind, dirArgument, ...rest]) {
  if (!["new", "existing"].includes(kind) || !dirArgument) throw new Error("Usage: prepare <new|existing> <dir> (--release <tag> | --packs <dir>) [--gesture]");
  const gesture = rest.includes("--gesture");
  if (gesture && kind !== "existing") throw new Error("--gesture applies to the existing app only");
  const dir = resolve(dirArgument);
  if (existsSync(dir)) throw new Error("Use a fresh directory");
  mkdirSync(dirname(dir), { recursive: true });
  const { source, specs } = tarballs(rest);
  const record = { schema: 1, kind, startedAt: new Date().toISOString(), source, node: process.version };
  record.npm = must(run("npm", ["--version"], dirname(dir)), "npm --version").stdout.trim();
  const template = kind === "new" ? ["--template", "blank-typescript"] : [];
  must(run("npx", ["--yes", CREATE_EXPO_APP, dir.split(/[\\/]/).pop(), ...template, "--yes"], dirname(dir)), "create-expo-app");
  if (!existsSync(join(dir, ".git"))) {
    git(dir, "init", "-q");
  }
  git(dir, "add", "-A");
  git(dir, "-c", "user.name=install-path", "-c", "user.email=install-path@localhost", "commit", "-q", "--allow-empty", "-m", "app before NYC-Tron");
  const before = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  record.app = { template: kind === "new" ? "blank-typescript" : "default", expo: before.dependencies.expo, reactNative: before.dependencies["react-native"], dependencies: before.dependencies };

  record.command = ["npm", "install", "--allow-remote=all", ...specs].join(" ");
  const install = run("npm", ["install", "--allow-remote=all", ...specs], dir);
  writeFileSync(join(dir, "..", `${kind}-install.log`), (install.stdout ?? "") + (install.stderr ?? ""));
  record.install = { exit: install.status };
  if (install.status !== 0) {
    const text = (install.stdout ?? "") + (install.stderr ?? "");
    record.install.code = /npm error code (\w+)/.exec(text)?.[1] ?? null;
    record.install.conflict = text.split(/\r?\n/).filter(line => /Found:|Could not resolve dependency|^npm error (peer|peerOptional) /.test(line)).slice(0, 6);
    record.result = "install-failed";
    writeFileSync(join(dir, "..", `${kind}-record.json`), JSON.stringify(record, null, 2) + "\n");
    console.error(`${kind}: the one install command failed (${record.install.code}). See ${kind}-record.json.`);
    process.exit(1);
  }
  const screen = kind === "new" ? "App.tsx" : (existsSync(join(dir, "src/app")) ? "src/app/tron.tsx" : "app/tron.tsx");
  writeFileSync(join(dir, screen), BUTTON_SCREEN);
  record.screen = screen;
  const gestureScreen = gesture ? screen.replace(/tron\.tsx$/, "gesture.tsx") : null;
  if (gestureScreen) {
    writeFileSync(join(dir, gestureScreen), GESTURE_SCREEN);
    record.gestureScreen = gestureScreen;
  }
  const installedVersion = name => {
    const file = join(dir, "node_modules", name, "package.json");
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")).version : null;
  };
  record.installed = Object.fromEntries(["@nyc-tron/core", "@nyc-tron/ui", "react-native", "react-native-gesture-handler"].map(name => [name, installedVersion(name)]));
  record.uiPeers = JSON.parse(readFileSync(join(dir, "node_modules/@nyc-tron/ui/package.json"), "utf8")).peerDependencies ?? null;
  const changed = git(dir, "status", "--porcelain").split(/\r?\n/).filter(Boolean).map(line => line.slice(3));
  record.changedFiles = changed;
  const allowed = new Set(["package.json", "package-lock.json", screen, ...(gestureScreen ? [gestureScreen] : [])]);
  record.disturbed = changed.filter(file => !allowed.has(file));
  const after = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  record.dependencyChanges = Object.keys({ ...before.dependencies, ...after.dependencies })
    .filter(name => before.dependencies[name] !== after.dependencies[name])
    .map(name => ({ name, before: before.dependencies[name] ?? null, after: after.dependencies[name] ?? null }));
  const unexpected = record.dependencyChanges.filter(change => !change.name.startsWith("@nyc-tron/"));
  if (kind === "new") {
    // App.tsx is the blank template's own screen; replacing it is the step.
    record.disturbed = record.disturbed.filter(file => file !== "App.tsx");
  }
  const typecheck = run("npx", ["--no-install", "tsc", "--noEmit"], dir);
  record.typecheck = { exit: typecheck.status, output: ((typecheck.stdout ?? "") + (typecheck.stderr ?? "")).slice(-2000) };
  record.result = record.disturbed.length || unexpected.length || typecheck.status !== 0 ? "failed" : "prepared";
  record.unexpectedDependencyChanges = unexpected;
  writeFileSync(join(dir, "..", `${kind}-record.json`), JSON.stringify(record, null, 2) + "\n");
  console.info(`${kind}: ${record.result}; ${record.command}`);
  if (record.result !== "prepared") process.exit(1);
}

const [command, ...args] = process.argv.slice(2);
if (command === "prepare") prepare(args);
else throw new Error("Usage: install-path.mjs prepare <new|existing> <dir> (--release <tag> | --packs <dir>)");
