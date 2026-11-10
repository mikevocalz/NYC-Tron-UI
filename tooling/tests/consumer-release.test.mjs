import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { consumerDependencies, exactPin, releaseChecksums, verifyArchiveHash, verifyInstalledArchive } from "../consumer-model.mjs";

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
