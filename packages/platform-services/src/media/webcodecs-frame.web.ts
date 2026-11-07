import { MediaDecodeError, fitWithin, normalizeFrameOptions, type DecodedFrame, type DecodeFrameOptions } from "./decoder.ts";
import { fetchMediaBytes } from "./fetch-media.web.ts";
import type { Input, VideoSample } from "mediabunny";

/** WebCodecs output carries the decoded sample's PTS, independently of a video element's seek target. */
export async function decodeWebCodecsFrame(uri: string, options: DecodeFrameOptions): Promise<DecodedFrame> {
  const request = normalizeFrameOptions(options);
  const cancellation = new AbortController();
  let input: Input | null = null;
  let sample: VideoSample | null = null;
  const abort = () => { cancellation.abort(); input?.dispose(); };
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) abort();
  const deadline = setTimeout(() => { cancellation.abort(); input?.dispose(); }, 30_000);
  try {
    const { Input, BufferSource, ALL_FORMATS, VideoSampleSink } = await import("mediabunny");
    const bytes = await fetchMediaBytes(uri, cancellation.signal);
    input = new Input({ source: new BufferSource(bytes), formats: ALL_FORMATS });
    const durationUs = Math.round(await input.computeDuration() * 1_000_000);
    if (!Number.isSafeInteger(durationUs) || durationUs <= 0) throw new MediaDecodeError("unsupported-format", "The media has no finite duration.");
    if (request.timeUs >= durationUs) throw new MediaDecodeError("out-of-range", "The requested frame is at or past the end.");
    const track = await input.getPrimaryVideoTrack();
    if (!track || !await track.canDecode()) throw new MediaDecodeError("unsupported-format", "WebCodecs cannot decode this video track.");
    const [sourceWidth, sourceHeight] = await Promise.all([track.getCodedWidth(), track.getCodedHeight()]);
    if (sourceWidth * sourceHeight > 33_177_600) throw new MediaDecodeError("out-of-range", "The source frame exceeds 33 megapixels.");
    sample = await new VideoSampleSink(track).getSample(request.timeUs / 1_000_000);
    if (!sample) throw new MediaDecodeError("out-of-range", "The requested time is before the first video frame.");
    if (["pq", "hlg", "smpte2084", "arib-std-b67"].includes(sample.colorSpace.transfer ?? "")) throw new MediaDecodeError("unsupported-format", "HDR frame conversion requires an HDR pipeline.");
    const size = fitWithin(sample.displayWidth, sample.displayHeight, request.maxWidth, request.maxHeight);
    const canvas = document.createElement("canvas");
    canvas.width = size.width; canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new MediaDecodeError("decode-failed", "No 2D canvas is available.");
    sample.draw(context, 0, 0, size.width, size.height);
    const actualTimeUs = sample.microsecondTimestamp;
    if (!Number.isSafeInteger(actualTimeUs) || actualTimeUs < 0) throw new MediaDecodeError("unsupported-format", "The decoded frame has no supported presentation timestamp.");
    return { uri: canvas.toDataURL("image/jpeg", .9), actualTimeUs, timing: "presentation", ...size };
  } finally { clearTimeout(deadline); cancellation.abort(); options.signal?.removeEventListener("abort", abort); sample?.close(); input?.dispose(); }
}
