/** Identity of the bundled generated H.264/AAC fixture, verified independently with ffprobe. */
export const MEDIA_FIXTURE = Object.freeze({
  md5: "f3124067a1a9bb9c06b1283c673cef39",
  sha256: "4c9905522ec7710bbe0a7f02404cc2a957b037c2de3c67c4469df904b7207b0a",
  byteLength: 26740,
  durationUs: 2_000_000,
  width: 192,
  height: 128,
  frameIntervalUs: 50_000,
  frames: 40,
  sampleRate: 48_000,
  channels: 1,
});

export const MEDIA_ACCEPTANCE_CHECKS = Object.freeze([
  "fixture-bytes", "native-probe", "frame-presentation-and-jpeg", "bounded-frame-scaling",
  "pcm-bytes-and-signal", "pcm-resampling-and-tail", "complete-presentation-index",
  "indexed-frame-and-rejection", "normalized-errors", "cancelled-consumer",
  "cache-deletion-and-recovery",
] as const);

export interface MediaAcceptanceReport {
  readonly schema: 1;
  readonly status: "passed";
  readonly platform: "ios" | "android";
  readonly platformVersion: string;
  readonly revision: string;
  readonly fixtureMd5: string;
  readonly checks: readonly string[];
  readonly elapsedMs: number;
  readonly observed: {
    readonly durationUs: number;
    readonly frameTimeUs: number;
    readonly indexFrames: number;
    readonly indexedTimeUs: number;
    readonly pcmFrames: number;
    readonly resampledFrames: number;
    readonly upsampledFrames: number;
    readonly fullResampledFrames: number;
    readonly tailFrames: number;
    readonly pcmPeak: number;
    readonly pcmRms: number;
  };
}

/** Reject stale, incomplete and mismatched reports before a CI job can pass. */
export function validateMediaAcceptanceReport(value: unknown, platform: string, revision: string): MediaAcceptanceReport {
  if (!value || typeof value !== "object") throw new Error("Native media acceptance returned no report");
  const report = value as MediaAcceptanceReport;
  if (report.schema !== 1 || report.status !== "passed" || report.platform !== platform ||
      report.revision !== revision || report.fixtureMd5 !== MEDIA_FIXTURE.md5 ||
      typeof report.platformVersion !== "string" || !report.platformVersion ||
      !Number.isFinite(report.elapsedMs) || report.elapsedMs < 0 || !Array.isArray(report.checks) ||
      report.checks.length !== MEDIA_ACCEPTANCE_CHECKS.length || new Set(report.checks).size !== report.checks.length ||
      MEDIA_ACCEPTANCE_CHECKS.some(check => !report.checks.includes(check))) {
    throw new Error("Native media acceptance has incomplete checks or different platform/source/fixture provenance");
  }
  const observed = report.observed;
  if (!observed || observed.durationUs !== MEDIA_FIXTURE.durationUs || observed.frameTimeUs !== 500_000 ||
      observed.indexFrames !== MEDIA_FIXTURE.frames || observed.indexedTimeUs !== 1_050_000 ||
      observed.pcmFrames !== 24_000 || observed.resampledFrames !== 8_000 || observed.upsampledFrames !== 48_000 ||
      observed.fullResampledFrames !== 32_000 || observed.tailFrames !== 4_000 ||
      !Number.isFinite(observed.pcmPeak) || observed.pcmPeak <= 0.01 || observed.pcmPeak > 1.01 ||
      !Number.isFinite(observed.pcmRms) || observed.pcmRms <= 0.005 || observed.pcmRms > observed.pcmPeak) {
    throw new Error("Native media acceptance did not observe the fixture's decoded timestamps and PCM");
  }
  return report;
}
