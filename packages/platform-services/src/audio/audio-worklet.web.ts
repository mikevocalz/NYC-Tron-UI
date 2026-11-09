/**
 * AudioWorklet processor source for the web audio backend. Loaded through a
 * Blob URL at runtime so the tsc-only build needs no extra asset pipeline.
 *
 * Two processors share one bounded interleaved-f32 ring design:
 *
 * - `nyc-tron-playback` — the main thread posts PCM chunks
 *   (`{type:"write",buffer}`); `process()` pops frames into the output.
 *   Empty reads emit silence and count underruns; a full ring drops the
 *   incoming tail and counts dropped frames. Counters are reported through
 *   `{type:"stats",...}` replies and `{type:"event",kind:"underrun"}`
 *   messages when a dry spell starts.
 * - `nyc-tron-capture` — `process()` pushes input frames into a second
 *   ring; the main thread polls with `{type:"read",requestId,maxFrames}`
 *   and gets chunked `{type:"input-part",requestId,buffer,frames}` replies
 *   (bounded transferred slices off a preallocated scratch) closed by
 *   `{type:"input-end",requestId}`. Parts keep every port message small and
 *   allocation-bounded on the audio thread.
 *
 * Both rings are plain Float32Arrays touched only on the audio thread;
 * main-thread writes arrive as port messages, which the worklet applies
 * between quanta — the realtime callback itself never allocates or waits.
 */
export const AUDIO_WORKLET_SOURCE=`
class NycTronPlaybackProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const o = (options && options.processorOptions) || {};
    this.channels = Math.max(1, Math.min(8, o.channels | 0 || 2));
    this.capacity = Math.max(1024, (o.capacityFrames | 0) || 131072);
    this.ring = new Float32Array(this.capacity * this.channels);
    this.head = 0;   // write index in frames, audio thread only
    this.tail = 0;   // read index in frames, audio thread only
    this.count = 0;  // queued frames
    this.dropped = 0;
    this.underrun = 0;
    this.dry = 0;    // consecutive silent quanta
    this.port.onmessage = (e) => {
      const m = e.data || {};
      const incoming = m.buffer instanceof ArrayBuffer ? new Float32Array(m.buffer)
        : ArrayBuffer.isView(m.buffer) ? new Float32Array(m.buffer.buffer, m.buffer.byteOffset, m.buffer.byteLength / Float32Array.BYTES_PER_ELEMENT)
        : null;
      if (m.type === "write" && incoming) {
        // Chunked copy: contiguous runs between ring wrap and capacity are
        // moved with typed-array set() instead of a per-frame JS loop, so a
        // max-size chunk cannot stall the audio thread. A full ring drops
        // the whole remaining tail and counts every dropped frame.
        const totalFrames = (incoming.length / this.channels) | 0;
        let f = 0;
        while (f < totalFrames) {
          const free = this.capacity - this.count;
          if (free <= 0) { this.dropped += totalFrames - f; break; }
          const run = Math.min(totalFrames - f, free, this.capacity - this.head);
          const src = f * this.channels, dst = this.head * this.channels, len = run * this.channels;
          this.ring.set(incoming.subarray(src, src + len), dst);
          this.head = (this.head + run) % this.capacity;
          this.count += run;
          f += run;
        }
      } else if (m.type === "stats") {
        this.port.postMessage({ type: "stats", requestId: m.requestId, queuedFrames: this.count,
          capacityFrames: this.capacity, droppedFrames: this.dropped, underrunFrames: this.underrun });
      } else if (m.type === "reset") {
        this.head = 0; this.tail = 0; this.count = 0; this.dry = 0;
      }
    };
  }
  process(inputs, outputs) {
    const out = outputs[0];
    if (!out || !out[0]) return true;
    const n = out[0].length;
    const chans = Math.min(out.length, this.channels);
    let dry = true;
    for (let i = 0; i < n; i++) {
      if (this.count > 0) {
        const base = this.tail * this.channels;
        for (let c = 0; c < chans; c++) {
          const dst = out[c];
          if (dst) dst[i] = this.ring[base + c] || 0;
        }
        for (let c = chans; c < out.length; c++) { const dst = out[c]; if (dst) dst[i] = 0; }
        this.tail = (this.tail + 1) % this.capacity;
        this.count -= 1;
        dry = false;
      } else {
        for (let c = 0; c < out.length; c++) { const dst = out[c]; if (dst) dst[i] = 0; }
      }
    }
    if (dry) {
      this.underrun += n;
      this.dry += 1;
      if (this.dry === 4) this.port.postMessage({ type: "event", kind: "underrun", frames: this.underrun });
    } else this.dry = 0;
    return true;
  }
}

class NycTronCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const o = (options && options.processorOptions) || {};
    this.channels = Math.max(1, Math.min(8, o.channels | 0 || this.outputChannelCount || 1));
    this.capacity = Math.max(1024, (o.capacityFrames | 0) || 131072);
    this.ring = new Float32Array(this.capacity * this.channels);
    this.head = 0; this.tail = 0; this.count = 0;
    this.dropped = 0; // overwritten oldest frames on overflow
    // Preallocated staging for read replies: each part copies ring→scratch
    // with set() runs, then slice()+transfer hands an exact-size buffer to
    // the main thread — no unbounded allocation on the audio thread.
    this.readScratchFrames = Math.min(this.capacity, 16384);
    this.readScratch = new Float32Array(this.readScratchFrames * this.channels);
    this.port.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === "read" && typeof m.requestId === "number") {
        let remaining = Math.max(0, Math.min(m.maxFrames | 0, this.count, this.capacity));
        while (remaining > 0) {
          const n = Math.min(remaining, this.readScratchFrames);
          let left = n, dst = 0;
          while (left > 0) {
            const run = Math.min(left, this.capacity - this.tail);
            const len = run * this.channels;
            this.readScratch.set(this.ring.subarray(this.tail * this.channels, this.tail * this.channels + len), dst * this.channels);
            this.tail = (this.tail + run) % this.capacity;
            dst += run; left -= run;
          }
          this.count -= n;
          remaining -= n;
          const part = this.readScratch.slice(0, n * this.channels);
          this.port.postMessage({ type: "input-part", requestId: m.requestId, buffer: part.buffer, frames: n }, [part.buffer]);
        }
        this.port.postMessage({ type: "input-end", requestId: m.requestId });
      } else if (m.type === "stats") {
        this.port.postMessage({ type: "stats", requestId: m.requestId, queuedFrames: this.count,
          capacityFrames: this.capacity, droppedFrames: this.dropped, underrunFrames: 0 });
      }
    };
  }
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      const n = input[0].length;
      const channels = Math.min(this.channels, input.length);
      for (let i = 0; i < n; i++) {
        if (this.count >= this.capacity) {
          // Full: drop the incoming tail so queued audio stays contiguous,
          // matching the native rings.
          this.dropped += n - i;
          break;
        }
        const base = this.head * this.channels;
        for (let c = 0; c < this.channels; c++)
          this.ring[base + c] = c < channels ? (input[c][i] || 0) : 0;
        this.head = (this.head + 1) % this.capacity;
        this.count += 1;
      }
    }
    return true;
  }
}

registerProcessor("nyc-tron-playback", NycTronPlaybackProcessor);
registerProcessor("nyc-tron-capture", NycTronCaptureProcessor);
`;
