import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { MEDIA_ACCEPTANCE_CHECKS, MEDIA_FIXTURE, validateMediaAcceptanceReport } from "../../examples/native-instruments/media-acceptance-contract.ts";

const revision = "a".repeat(40);
const valid = () => ({ schema: 1, status: "passed", platform: "ios", platformVersion: "26.0", revision,
  fixtureMd5: MEDIA_FIXTURE.md5, checks: [...MEDIA_ACCEPTANCE_CHECKS], elapsedMs: 100,
  observed: { durationUs: 2_000_000, frameTimeUs: 500_000, indexFrames: 40, indexedTimeUs: 1_050_000,
    pcmFrames: 24_000, resampledFrames: 8_000, tailFrames: 4_000, pcmPeak: 0.13, pcmRms: 0.09 } });

test("the runtime contract identifies the actual bundled video bytes", () => {
  const bytes = readFileSync(new URL("../../examples/native-instruments/assets/reference.mp4", import.meta.url));
  assert.equal(bytes.length, MEDIA_FIXTURE.byteLength);
  for (const algorithm of ["sha256", "md5"]) assert.equal(createHash(algorithm).update(bytes).digest("hex"), MEDIA_FIXTURE[algorithm]);
});

test("runtime acceptance rejects stale provenance, omitted checks and fabricated timing/audio", () => {
  const complete = valid();
  assert.equal(validateMediaAcceptanceReport(complete, "ios", revision), complete);
  const mutations = [
    report => { report.platform = "android"; }, report => { report.revision = "b".repeat(40); },
    report => { report.status = "failed"; }, report => { report.fixtureMd5 = "0".repeat(32); },
    report => { report.checks.pop(); }, report => { report.checks[0] = report.checks[1]; },
    report => { report.observed.indexedTimeUs = 1_050_001; }, report => { report.observed.pcmPeak = 0; },
    report => { report.observed.pcmRms = Number.NaN; }, report => { report.observed.pcmFrames = 24_001; },
    report => { report.observed.tailFrames = 8_000; }, report => { report.observed.indexFrames = 10; },
  ];
  for (const mutate of mutations) {
    const report = valid(); mutate(report);
    assert.throws(() => validateMediaAcceptanceReport(report, "ios", revision));
  }
});

test("the clean native host selects media acceptance without a source resolver", () => {
  const { withAcceptanceEntry } = createRequire(import.meta.url)("../../examples/native-instruments/acceptance-entry.cjs");
  const previous = process.env.NYC_TRON_ACCEPTANCE;
  try {
    process.env.NYC_TRON_ACCEPTANCE = "media";
    const config = withAcceptanceEntry({ server: { rewriteRequestUrl: url => url.replace("initial=1", "rewritten=1") } }, "/clean/consumer/app");
    for (const entry of ["index", "reference-app", ".expo/.virtual-metro-entry"]) {
      assert.equal(config.server.rewriteRequestUrl(`http://localhost:8081/${entry}.bundle?platform=ios&initial=1`),
        "http://localhost:8081/media-acceptance.bundle?platform=ios&rewritten=1");
    }
    assert.equal(config.server.rewriteRequestUrl("/assets/reference.mp4"), "/assets/reference.mp4");
    assert.equal(config.resolver, undefined); assert.equal(config.watchFolders, undefined);
    delete process.env.NYC_TRON_ACCEPTANCE;
    const normal = {}; assert.equal(withAcceptanceEntry(normal, "/clean/consumer/app"), normal);
  } finally {
    if (previous === undefined) delete process.env.NYC_TRON_ACCEPTANCE; else process.env.NYC_TRON_ACCEPTANCE = previous;
  }
});
