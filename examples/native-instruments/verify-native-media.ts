import { Platform } from "react-native";
import { Asset } from "expo-asset";
import { Directory, File, Paths } from "expo-file-system";
import {
  createPlatformMediaDecoder, MediaDecodeError, MAX_DECODE_DURATION_US,
  type DecodedAudio, type DecodedFrame, type MediaDecodeErrorCode,
} from "@nyc-tron/platform-services/media";
import { MEDIA_FIXTURE, validateMediaAcceptanceReport, type MediaAcceptanceReport } from "./media-acceptance-contract";

// Expo inlines these public values; the native app does not need Node typings.
declare const process: { env: { EXPO_PUBLIC_NYC_TRON_REVISION?: string } };

function check(value: unknown, message: string): asserts value {
  if (!value) throw new Error(`Native media: ${message}`);
}

async function rejects(work: () => Promise<unknown>, codes: readonly MediaDecodeErrorCode[], label: string) {
  try { await work(); }
  catch (error) {
    check(error instanceof MediaDecodeError && codes.includes(error.code), `${label} did not reject with ${codes.join("/")}: ${String(error)}`);
    return;
  }
  throw new Error(`Native media: ${label} unexpectedly succeeded`);
}

/** Inspect actual encoded output, independently of the decoder's metadata. */
async function jpeg(frame: DecodedFrame, width: number, height: number): Promise<Uint8Array> {
  check(frame.timing === "presentation" && frame.uri.startsWith("file://"), "frame did not come from the native file decoder");
  check(frame.width === width && frame.height === height, "frame dimensions exceed the requested box or change aspect ratio");
  const file = new File(frame.uri), bytes = await file.bytes();
  check(file.exists && bytes.length === file.size && bytes.length > 100 && bytes.length < 1_048_576, "JPEG file is missing, empty or unbounded");
  check(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9, "frame is not a complete JPEG");
  for (let offset = 2; offset + 8 < bytes.length;) {
    check(bytes[offset++] === 0xff, "JPEG segment marker is invalid");
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || marker !== undefined && marker >= 0xd0 && marker <= 0xd7) continue;
    const size = (bytes[offset]! << 8) | bytes[offset + 1]!;
    check(size >= 2 && offset + size <= bytes.length, "JPEG segment is truncated");
    if (marker !== undefined && marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      check(size >= 8 && ((bytes[offset + 3]! << 8) | bytes[offset + 4]!) === height &&
        ((bytes[offset + 5]! << 8) | bytes[offset + 6]!) === width, "JPEG pixels disagree with returned dimensions");
      return bytes;
    }
    offset += size;
  }
  throw new Error("Native media: JPEG contains no image dimensions");
}

async function pcm(audio: DecodedAudio, rate: number, maximumFrames: number, expectedFrames?: number) {
  check(audio.sampleRate === rate && audio.channels === MEDIA_FIXTURE.channels, "PCM format differs from the requested rate/source channels");
  check(audio.frames > 0 && audio.frames <= maximumFrames &&
    (expectedFrames === undefined || audio.frames === expectedFrames), "PCM does not cover its requested bounded interval");
  check(audio.pcm.kind === "file" && audio.pcm.uri.startsWith("file://"), "native PCM used a fallback or a sample-array bridge");
  const file = new File(audio.pcm.uri), bytes = await file.bytes();
  check(file.exists && file.size === bytes.length && bytes.length === audio.pcm.byteLength &&
    bytes.length === audio.frames * audio.channels * 4, "PCM file length disagrees with sample-frame ownership");
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let peak = 0, squared = 0;
  for (let offset = 0; offset < bytes.length; offset += 4) {
    const value = view.getFloat32(offset, true);
    check(Number.isFinite(value) && Math.abs(value) <= 1.01, "PCM is non-finite, clipped or not little-endian Float32");
    peak = Math.max(peak, Math.abs(value)); squared += value * value;
  }
  const rms = Math.sqrt(squared / (bytes.length / 4));
  check(peak > 0.01 && rms > 0.005, "the generated sine fixture decoded to silence");
  return { peak, rms };
}

/** Runs only through the installed public Expo native adapter; there is no injectable decoder. */
export async function verifyNativeMedia(): Promise<MediaAcceptanceReport> {
  const started = performance.now(), checks: string[] = [], outputUris: string[] = [], failures: unknown[] = [];
  check(Platform.OS === "ios" || Platform.OS === "android", "an iOS or Android native host is required");
  const decoder = createPlatformMediaDecoder();
  let invalid: File | undefined, source: File | undefined, directory: Directory | undefined;
  let report: MediaAcceptanceReport | undefined;
  try {
    check(decoder.isAvailable, "the installed binary did not link NYCTronMediaDecoder");
    // These optional ABI additions are required in this candidate's actual binary.
    check(decoder.presentationIndexVersion === 1 && decoder.presentationIndex &&
      decoder.indexedFrameVersion === 1 && decoder.decodeIndexedFrame, "the candidate did not link its v1 presentation-index methods");
    await decoder.clearCache();
    const asset = await Asset.fromModule(require("./assets/reference.mp4")).downloadAsync();
    const uri = asset.localUri;
    check(typeof uri === "string" && uri.startsWith("file://"), "the bundled fixture was not materialized as a local file");
    source = new File(uri);
    const identity = source.info({ md5: true });
    check(identity.exists && identity.size === MEDIA_FIXTURE.byteLength && identity.md5 === MEDIA_FIXTURE.md5, "bundled fixture bytes differ from the reviewed generated clip");
    checks.push("fixture-bytes");

    const probe = await decoder.probe(uri);
    check(probe.durationUs === MEDIA_FIXTURE.durationUs && probe.video?.width === MEDIA_FIXTURE.width &&
      probe.video.height === MEDIA_FIXTURE.height && probe.audio?.sampleRate === MEDIA_FIXTURE.sampleRate &&
      probe.audio.channels === MEDIA_FIXTURE.channels, "probe does not describe the H.264/AAC fixture");
    checks.push("native-probe");

    const zero = await decoder.decodeFrame(uri, { timeUs: 0, maxWidth: 96, maxHeight: 64 });
    outputUris.push(zero.uri);
    directory = new Directory(zero.uri.slice(0, zero.uri.lastIndexOf("/")));
    const zeroBytes = await jpeg(zero, 96, 64);
    check(zero.actualTimeUs === 0, "frame zero was replaced by a later keyframe");
    const frame = await decoder.decodeFrame(uri, { timeUs: 500_000, maxWidth: 96, maxHeight: 64 });
    outputUris.push(frame.uri);
    const frameBytes = await jpeg(frame, 96, 64);
    check(frame.actualTimeUs === 500_000, "a decode returned the seek target instead of the fixture's actual presentation frame");
    check(frameBytes.length !== zeroBytes.length || frameBytes.some((value, index) => value !== zeroBytes[index]), "distinct presentation frames have identical JPEG output");
    checks.push("frame-presentation-and-jpeg");
    const unscaled = await decoder.decodeFrame(uri, { timeUs: 500_000, maxWidth: 4096, maxHeight: 4096 });
    outputUris.push(unscaled.uri);
    await jpeg(unscaled, MEDIA_FIXTURE.width, MEDIA_FIXTURE.height);
    checks.push("bounded-frame-scaling");

    const audio = await decoder.decodeAudio(uri, { startUs: 250_000, durationUs: 500_000 });
    if (audio.pcm.kind === "file") outputUris.push(audio.pcm.uri);
    const signal = await pcm(audio, 48_000, 24_000, 24_000);
    checks.push("pcm-bytes-and-signal");
    const resampled = await decoder.decodeAudio(uri, { startUs: 250_000, durationUs: 500_000, sampleRate: 16_000 });
    if (resampled.pcm.kind === "file") outputUris.push(resampled.pcm.uri);
    await pcm(resampled, 16_000, 8_000, 8_000);
    const tail = await decoder.decodeAudio(uri, { startUs: 1_750_000, durationUs: 500_000, sampleRate: 16_000 });
    if (tail.pcm.kind === "file") outputUris.push(tail.pcm.uri);
    await pcm(tail, 16_000, 4_000);
    checks.push("pcm-resampling-and-tail");

    const index = await decoder.presentationIndex(uri, { maxFrames: MEDIA_FIXTURE.frames });
    check(index.durationUs === MEDIA_FIXTURE.durationUs && index.timesUs.length === MEDIA_FIXTURE.frames &&
      index.timesUs.every((value, position) => value === position * MEDIA_FIXTURE.frameIntervalUs), "native index omitted, duplicated or invented fixture PTS values");
    await rejects(() => decoder.presentationIndex!(uri, { maxFrames: 10 }), ["out-of-range"], "an incomplete index cap");
    checks.push("complete-presentation-index");
    const indexed = await decoder.decodeIndexedFrame(uri, { timeUs: index.timesUs[21]!, maxWidth: 96, maxHeight: 64 });
    outputUris.push(indexed.uri);
    await jpeg(indexed, 96, 64);
    check(indexed.actualTimeUs === 1_050_000, "indexed seek did not return the selected presentation timestamp");
    await rejects(() => decoder.decodeIndexedFrame!(uri, { timeUs: 1_050_001 }), ["out-of-range"], "a non-indexed timestamp");
    checks.push("indexed-frame-and-rejection");

    const missing = new File(Paths.cache, `nyc-tron-missing-${Date.now()}.mp4`);
    await rejects(() => decoder.probe(missing.uri), ["not-found"], "a missing native source");
    invalid = new File(Paths.cache, `nyc-tron-invalid-${Date.now()}.bin`);
    invalid.create(); invalid.write("This acceptance file contains no media.");
    await rejects(() => decoder.probe(invalid!.uri), ["unsupported-format", "decode-failed"], "a malformed native source");
    await rejects(() => decoder.decodeFrame(uri, { timeUs: -1 }), ["out-of-range"], "a negative frame time");
    await rejects(() => decoder.decodeFrame(uri, { timeUs: MEDIA_FIXTURE.durationUs }), ["out-of-range"], "a native frame past the end");
    await rejects(() => decoder.decodeAudio(uri, { startUs: 0, durationUs: MAX_DECODE_DURATION_US + 1 }), ["out-of-range"], "an unbounded PCM request");
    await rejects(() => decoder.decodeAudio(uri, { startUs: MEDIA_FIXTURE.durationUs, durationUs: 1_000 }), ["out-of-range"], "native audio past the end");
    checks.push("normalized-errors");

    const admitted = new AbortController(); admitted.abort();
    await rejects(() => decoder.decodeFrame(uri, { timeUs: 0, signal: admitted.signal }), ["cancelled"], "a pre-aborted frame");
    await rejects(() => decoder.presentationIndex!(uri, { signal: admitted.signal }), ["cancelled"], "a pre-aborted index");
    const detached = new AbortController();
    const decoding = decoder.decodeFrame(uri, { timeUs: 1_500_000, signal: detached.signal });
    const cancelled = rejects(() => decoding, ["cancelled"], "a detached frame consumer");
    // Allow the wrapper's admission microtask to submit the native operation.
    // Aborting detaches the consumer; it does not claim to interrupt a codec.
    await Promise.resolve(); detached.abort(); await cancelled;
    await decoder.probe(uri);
    checks.push("cancelled-consumer");

    await decoder.clearCache();
    check(outputUris.every(output => !new File(output).exists) && (!directory.exists || directory.list().length === 0), "clearCache retained generated JPEG/PCM files");
    check(source.exists && source.info({ md5: true }).md5 === MEDIA_FIXTURE.md5, "clearCache removed or changed the source asset");
    await decoder.clearCache();
    const recovered = await decoder.decodeFrame(uri, { timeUs: 0, maxWidth: 96, maxHeight: 64 });
    outputUris.push(recovered.uri); await jpeg(recovered, 96, 64);
    checks.push("cache-deletion-and-recovery");

    report = {
      schema: 1, status: "passed", platform: Platform.OS, platformVersion: String(Platform.Version),
      revision: process.env.EXPO_PUBLIC_NYC_TRON_REVISION ?? "local",
      fixtureMd5: identity.md5!, checks, elapsedMs: Math.round(performance.now() - started),
      observed: { durationUs: probe.durationUs, frameTimeUs: frame.actualTimeUs, indexFrames: index.timesUs.length,
        indexedTimeUs: indexed.actualTimeUs, pcmFrames: audio.frames, resampledFrames: resampled.frames,
        tailFrames: tail.frames, pcmPeak: signal.peak, pcmRms: signal.rms },
    };
  } catch (error) { failures.push(error); }
  finally {
    try {
      await decoder.clearCache();
      check(outputUris.every(output => !new File(output).exists) && (!directory?.exists || directory.list().length === 0), "final decoder cleanup left generated files");
    } catch (error) { failures.push(error); }
    try { if (invalid?.exists) invalid.delete(); } catch (error) { failures.push(error); }
  }
  if (failures.length) throw new Error(failures.map(error => error instanceof Error ? error.message : String(error)).join("; "), { cause: failures[0] });
  check(report, "no runtime evidence was produced");
  return validateMediaAcceptanceReport(report, Platform.OS, process.env.EXPO_PUBLIC_NYC_TRON_REVISION ?? "local");
}
