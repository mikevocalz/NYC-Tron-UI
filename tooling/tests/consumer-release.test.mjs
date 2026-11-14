import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { consumerDependencies, exactPin, releaseChecksums, verifyArchiveHash, verifyInstalledArchive } from "../consumer-model.mjs";
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { copyNativeHost } from "../consumer-release.mjs";

test("consumer peers resolve to artifacts, including undeclared additional package coverage", () => {
  const archives = new Map([
    ["@nyc-tron/ui", { path: "/packs/ui.tgz" }],
    ["@nyc-tron/panes", { path: "/packs/panes.tgz" }],
  ]);
  const input = { "@nyc-tron/ui": "workspace:*", react: "19.3.0" };
  assert.deepEqual(consumerDependencies(input, archives, ["@nyc-tron/panes"]), {
    "@nyc-tron/ui": "file:/packs/ui.tgz", "@nyc-tron/panes": "file:/packs/panes.tgz", react: "19.3.0",
  });
  assert.equal(input["@nyc-tron/ui"], "workspace:*");
});

test("missing tarballs and incompatible runtime lanes cannot silently install from npm", () => {
  assert.throws(() => consumerDependencies({ "@nyc-tron/ui": "^1.0.0" }, new Map()), /Missing release tarball/);
  assert.throws(() => consumerDependencies({ "@nyc-tron/windows-fluent-fabric": "1.0.0" }, new Map()), /RNW 0.85/);
  assert.throws(() => consumerDependencies({ "@nyc-tron/macos-appkit": "1.0.0" }, new Map()), /Spark \/ Expo 55/);
  assert.throws(() => consumerDependencies({ other: "workspace:*" }, new Map()), /Unresolved consumer dependency/);
});

test("artifact corruption and omitted checksum evidence stop the consumer run", () => {
  const bytes = Buffer.from("release archive bytes");
  const hash = createHash("sha256").update(bytes).digest("hex");
  const hashes = releaseChecksums(hash + "  ui.tgz\r\n");
  assert.doesNotThrow(() => verifyArchiveHash("ui.tgz", bytes, hashes.get("ui.tgz")));
  assert.throws(() => verifyArchiveHash("ui.tgz", Buffer.from("changed archive"), hash), /checksum mismatch/);
  assert.throws(() => verifyArchiveHash("ui.tgz", bytes, undefined), /checksum mismatch/);
});

test("checksum lists reject traversal, duplicate artifacts and empty manifests", () => {
  const hash = "0".repeat(64);
  for (const file of ["../ui.tgz", "dir/ui.tgz", "dir\\ui.tgz"]) {
    assert.throws(() => releaseChecksums(hash + "  " + file), /Invalid release checksum/);
  }
  assert.throws(() => releaseChecksums(hash + "  ui.tgz\n" + hash + "  ui.tgz"), /Duplicate/);
  assert.throws(() => releaseChecksums(""), /no tarballs/);
});

test("clean consumer runtime dependencies use existing exact pins", () => {
  assert.equal(exactPin("react", "19.3.0"), "19.3.0");
  assert.equal(exactPin("example", "1.0.0-rc.1"), "1.0.0-rc.1");
  for (const value of ["latest", "^19.3.0", "~19.3.0", "workspace:*", undefined]) {
    assert.throws(() => exactPin("react", value), /existing exact pin/);
  }
});

test("installed npm lock identifies the exact canonical file bytes instead of a same-version registry package", () => {
  const bytes = Buffer.from("canonical archive");
  const archive = { path: "/candidate/ui.tgz", version: "1.0.0", sha256: createHash("sha256").update(bytes).digest("hex") };
  const entry = { version: archive.version, resolved: "file:../../candidate/ui.tgz",
    integrity: "sha512-" + createHash("sha512").update(bytes).digest("base64") };
  const check = value => verifyInstalledArchive("@nyc-tron/ui", archive, bytes, value, "/consumer/app");
  assert.doesNotThrow(() => check(entry));
  for (const mutation of [{ version: "0.9.0" }, { resolved: "https://registry.example/ui.tgz" },
    { resolved: "file:../../other/ui.tgz" }, { link: true }, { integrity: "sha512-wrong" }]) {
    assert.throws(() => check({ ...entry, ...mutation }), /lock differs from the canonical archive/);
  }
  assert.throws(() => check(undefined), /lock differs from the canonical archive/);
  assert.throws(() => verifyInstalledArchive("@nyc-tron/ui", archive, Buffer.from("repacked archive"), entry, "/consumer/app"), /checksum mismatch/);
});

// Run the actual copied Metro config and entry hook without installing Expo or
// Uniwind. These adapters observe configuration only, not CSS/native rendering.
test("authored and clean-consumer Metro route each acceptance entry to its owned stylesheet", t => {
  const repo = fileURLToPath(new URL("../..", import.meta.url));
  const temporary = mkdtempSync(join(tmpdir(), "tron-native-host-"));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const project = join(temporary, "app");
  mkdirSync(project);
  copyNativeHost(project);
  const priorMode = process.env.NYC_TRON_ACCEPTANCE;
  t.after(() => {
    if (priorMode === undefined) delete process.env.NYC_TRON_ACCEPTANCE;
    else process.env.NYC_TRON_ACCEPTANCE = priorMode;
  });
  const cases = [
    ["library", "library-acceptance", "global.css"],
    ["reference", "reference-app", "reference.css"],
    ["media", "media-acceptance", "reference.css"],
    ["pointer", "pointer-acceptance", "reference.css"],
    [undefined, "index", "global.css"],
  ];
  for (const directory of [join(repo, "examples/native-instruments"), project]) {
    const localRequire = createRequire(join(directory, "metro.config.js"));
    for (const [mode, entry, css] of cases) {
      if (mode === undefined) delete process.env.NYC_TRON_ACCEPTANCE;
      else process.env.NYC_TRON_ACCEPTANCE = mode;
      const module = { exports: {} };
      const requests = [];
      runInNewContext(readFileSync(join(directory, "metro.config.js"), "utf8"), {
        module, __dirname: directory, process,
        require(name) {
          requests.push(name);
          if (name === "expo/metro-config") return { getDefaultConfig(root) {
            assert.equal(root, directory);
            return { resolver: {}, server: { rewriteRequestUrl: url => url.replace("old.bundle", "index.bundle") } };
          } };
          if (name === "uniwind/metro") return { withUniwindConfig(config, options) { return { ...config, uniwind: options }; } };
          return localRequire(name);
        },
      }, { filename: join(directory, "metro.config.js") });
      const config = module.exports;
      assert.equal(config.uniwind.cssEntryFile, "./" + css, `${directory}: ${mode}`);
      assert.equal(config.uniwind.dtsFile, "./uniwind-types.d.ts");
      assert.equal(config.server.rewriteRequestUrl("/old.bundle?platform=android"), `/${entry}.bundle?platform=android`);
      if (mode !== undefined) {
        assert.equal(config.server.rewriteRequestUrl("http://localhost:8081/.expo/.virtual-metro-entry.bundle?platform=ios"),
          `http://localhost:8081/${entry}.bundle?platform=ios`);
        assert.equal(config.server.rewriteRequestUrl("/assets/icon.png"), "/assets/icon.png");
      }
      if (directory === project) {
        assert.equal(config.watchFolders, undefined, "consumer must not watch repository sources");
        assert.equal(config.resolver.resolveRequest, undefined, "consumer must retain installed dependency resolution");
        assert.deepEqual(requests, ["expo/metro-config", "uniwind/metro", "./acceptance-entry.cjs"]);
      }
    }
  }
  // The selected CSS must agree with the actual authored entry imports.
  for (const [file, css] of [["LibraryAcceptance.tsx", "global.css"], ["MediaAcceptance.tsx", "reference.css"],
    ["pointer-acceptance.js", "reference.css"], ["ReferenceApp.tsx", "reference.css"]]) {
    assert.match(readFileSync(join(project, file), "utf8"), new RegExp(`import ["']\\./${css.replace(".", "\\.")}["']`));
  }
  for (const css of ["global.css", "reference.css"]) {
    const original = readFileSync(join(repo, "examples/native-instruments", css), "utf8");
    const copied = readFileSync(join(project, css), "utf8");
    assert.equal(copied, original.replaceAll("../native-feel", "./reference")
      .replaceAll("../../packages/ui/dist/components", "./node_modules/@nyc-tron/ui/dist/components")
      .replaceAll("../../packages/expo-controls/dist/components", "./node_modules/@nyc-tron/expo-controls/dist/components")
      .replaceAll("../../packages/panes/dist/components", "./node_modules/@nyc-tron/panes/dist/components"), "preserve the authored theme bytes");
    for (const [, source] of copied.matchAll(/@source ['"]([^'"]+)['"]/g)) {
      assert.ok(source.startsWith("./node_modules/@nyc-tron/") || source === "./reference", source);
    }
  }
});
