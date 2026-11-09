import { useEffect, useRef, useState, type ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "@nyc-tron/ui/components/Button";
import {
  createPlatformMediaEncoder,
  type EncodedMedia,
  type MediaEncoderProbe,
} from "@nyc-tron/platform-services/encoder";
import {
  createPlatformSpeechRecognizer,
  createSpeechConsent,
  type SpeechRecognitionSession,
  type SpeechRecognizerProbe,
} from "@nyc-tron/platform-services/speech";
import {
  createPlatformAudioDevice,
  type AudioDeviceProbe,
  type AudioStreamStats,
} from "@nyc-tron/platform-services/audio";

// Consumer harness for the three newest platform-services providers
// (encoder, speech, audio — all merged but device-unverified). It exercises
// the real probe() paths and the honest failure paths: every rejection is
// shown with its service error code instead of being swallowed. Nothing here
// is journaled or snapshotted; transcript text stays local demo state.

const colors = { surface: "#20202C", text: "#F6F6FD", muted: "#AAAABB", accent: "#B2A7FF" };

type ProbeState<T> = { status: "idle" | "probing" | "ready" | "error"; value?: T; error?: string };

function describeError(error: unknown): string {
  const code = (error as { code?: unknown })?.code;
  const message = error instanceof Error ? error.message : String(error);
  return typeof code === "string" ? `[${code}] ${message}` : message;
}

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function base64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i]!, b = bytes[i + 1], c = bytes[i + 2];
    out += B64[a >> 2]! + B64[((a & 3) << 4) | ((b ?? 0) >> 4)]! +
      (b === undefined ? "=" : B64[((b & 15) << 2) | ((c ?? 0) >> 6)]!) +
      (c === undefined ? "=" : B64[c & 63]!);
  }
  return out;
}

/** A tiny synthetic clip: 64×64 RGBA8 frames at 30 fps plus 0.5 s of f32 mono PCM. */
function syntheticClip(): { videoUri: string; videoFrames: number; audioUri: string; audioFrames: number } {
  const width = 64, height = 64, frameCount = 15;
  const video = new Uint8Array(width * height * 4 * frameCount);
  for (let f = 0; f < frameCount; f++) {
    for (let p = 0; p < width * height; p++) {
      const o = (f * width * height + p) * 4;
      video[o] = (p % width) * 4;                 // R: horizontal ramp
      video[o + 1] = Math.floor(p / width) * 4;   // G: vertical ramp
      video[o + 2] = f * 16;                      // B: per-frame step
      video[o + 3] = 255;                         // A
    }
  }
  const sampleRate = 22050, audioFrames = 11025; // 0.5 s
  const pcm = new Float32Array(audioFrames);
  for (let i = 0; i < audioFrames; i++) pcm[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.25;
  const pcmBytes = new Uint8Array(pcm.buffer);
  return {
    videoUri: `data:application/octet-stream;base64,${base64(video)}`,
    videoFrames: frameCount,
    audioUri: `data:application/octet-stream;base64,${base64(pcmBytes)}`,
    audioFrames,
  };
}

function ProbeLine({ label, children }: { label: string; children: ReactNode }) {
  return <Text style={{ color: colors.muted }}>{label}: <Text style={{ color: colors.text }}>{children}</Text></Text>;
}

export function PlatformServicesDemo() {
  const encoder = useRef(createPlatformMediaEncoder()).current;
  const consent = useRef(createSpeechConsent()).current;
  const speech = useRef(createPlatformSpeechRecognizer({ consent })).current;
  const audio = useRef(createPlatformAudioDevice()).current;

  const [encoderProbe, setEncoderProbe] = useState<ProbeState<MediaEncoderProbe>>({ status: "idle" });
  const [speechProbe, setSpeechProbe] = useState<ProbeState<SpeechRecognizerProbe>>({ status: "idle" });
  const [audioProbe, setAudioProbe] = useState<ProbeState<AudioDeviceProbe>>({ status: "idle" });

  const [encodeBusy, setEncodeBusy] = useState(false);
  const [encodeResult, setEncodeResult] = useState<string>("");
  const [session, setSession] = useState<SpeechRecognitionSession | null>(null);
  const [, bumpConsent] = useState(0); // consent is not reactive; re-render after an explicit grant
  const sessionRef = useRef<SpeechRecognitionSession | null>(null);
  const setLiveSession = (next: SpeechRecognitionSession | null) => { sessionRef.current = next; setSession(next); };
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState("");
  const [toneBusy, setToneBusy] = useState(false);
  const [toneResult, setToneResult] = useState("");

  useEffect(() => {
    let live = true;
    setEncoderProbe({ status: "probing" });
    encoder.probe()
      .then(value => live && setEncoderProbe({ status: "ready", value }))
      .catch(error => live && setEncoderProbe({ status: "error", error: describeError(error) }));
    setSpeechProbe({ status: "probing" });
    speech.probe()
      .then(value => live && setSpeechProbe({ status: "ready", value }))
      .catch(error => live && setSpeechProbe({ status: "error", error: describeError(error) }));
    setAudioProbe({ status: "probing" });
    audio.probe()
      .then(value => live && setAudioProbe({ status: "ready", value }))
      .catch(error => live && setAudioProbe({ status: "error", error: describeError(error) }));
    return () => { live = false; };
  }, [encoder, speech, audio]);

  // Stop any live session / stream when the tab unmounts.
  useEffect(() => () => {
    void sessionRef.current?.abort().catch(() => undefined);
    void audio.closeOutput("demo-tone").catch(() => undefined);
    void audio.closeInput("demo-capture").catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runEncode() {
    setEncodeBusy(true); setEncodeResult("");
    try {
      const clip = syntheticClip();
      const result: EncodedMedia = await encoder.encode({
        video: { uri: clip.videoUri, width: 64, height: 64, frameRateNum: 30, frameRateDen: 1, frameCount: clip.videoFrames },
        audio: { uri: clip.audioUri, sampleRate: 22050, channels: 1, sampleFormat: "f32", frames: clip.audioFrames },
      });
      setEncodeResult(`Encoded ${result.byteLength} bytes, ${Math.round(result.durationUs / 1000)} ms (${result.uri.slice(0, 32)}…)`);
    } catch (error) {
      // data: sources are web-only; native encoders expect file:// URIs the
      // host wrote. The rejection code is the honest signal either way.
      setEncodeResult(`Encode rejected: ${describeError(error)}`);
    } finally {
      setEncodeBusy(false);
    }
  }

  async function startDictation(onDeviceOnly: boolean) {
    setSpeechError(""); setTranscript("");
    try {
      const next = await speech.start({ locale: "en-US", onDeviceOnly });
      setLiveSession(next);
      next.addListener(event => {
        if (event.type === "partial") setTranscript(event.text);
        else if (event.type === "final") setTranscript(current => current ? `${current} ${event.text}` : event.text);
        else if (event.type === "error") setSpeechError(describeError(event.error));
      });
    } catch (error) {
      setSpeechError(describeError(error));
    }
  }

  async function stopDictation() {
    const current = sessionRef.current;
    setLiveSession(null);
    if (current) await current.stop().catch(error => setSpeechError(describeError(error)));
  }

  async function playTone() {
    setToneBusy(true); setToneResult("");
    const opened: string[] = [];
    try {
      const out = await audio.openOutput({ bufferMs: 500 });
      opened.push(out.stream);
      const { sampleRate, channels, sampleFormat } = out.format;
      const chunkFrames = 512, totalFrames = Math.floor(sampleRate * 0.4);
      const chunks = Math.ceil(totalFrames / chunkFrames);
      for (let c = 0; c < chunks; c++) {
        const frames = Math.min(chunkFrames, totalFrames - c * chunkFrames);
        const values = new Float32Array(frames * channels);
        for (let i = 0; i < frames; i++) {
          const s = Math.sin((2 * Math.PI * 440 * (c * chunkFrames + i)) / sampleRate) * 0.2;
          for (let ch = 0; ch < channels; ch++) values[i * channels + ch] = s;
        }
        let samples: ArrayBuffer | ArrayBufferView = values.buffer;
        if (sampleFormat === "s16") {
          const pcm = new Int16Array(frames * channels);
          for (let i = 0; i < pcm.length; i++) pcm[i] = Math.max(-32768, Math.min(32767, Math.round(values[i]! * 32767)));
          samples = pcm.buffer;
        }
        await audio.writeOutput(out.stream, { samples, frames, sampleFormat });
      }
      // Let the ring drain, then read the honest counters.
      await new Promise(resolve => setTimeout(resolve, 700));
      const stats: AudioStreamStats = await audio.stats(out.stream);
      setToneResult(
        `Played ${out.format.sampleRate} Hz / ${out.format.channels} ch / ${out.format.sampleFormat}; ` +
        `latency ${Math.round(out.latencyMs)} ms; queued ${stats.queuedFrames}, dropped ${stats.droppedFrames}, underruns ${stats.underrunFrames} frames`);
    } catch (error) {
      setToneResult(`Tone rejected: ${describeError(error)}`);
    } finally {
      for (const stream of opened) await audio.closeOutput(stream).catch(() => undefined);
      setToneBusy(false);
    }
  }

  const encoderSummary = encoderProbe.status === "ready" && encoderProbe.value
    ? `mp4 container; H.264 ${encoderProbe.value.video ? "yes" : "no"}, AAC ${encoderProbe.value.audio ? "yes" : "no"}` +
      (encoderProbe.value.hardwareAccelerated === undefined ? "" : `; hardware ${encoderProbe.value.hardwareAccelerated ? "yes" : "no"}`)
    : encoderProbe.status === "error" ? encoderProbe.error : encoderProbe.status;
  const speechSummary = speechProbe.status === "ready" && speechProbe.value
    ? `available ${speechProbe.value.available}; on-device ${speechProbe.value.onDevice}; network possible ${speechProbe.value.networkPossible}`
    : speechProbe.status === "error" ? speechProbe.error : speechProbe.status;
  const audioSummary = audioProbe.status === "ready" && audioProbe.value
    ? `available ${audioProbe.value.available}; ${audioProbe.value.defaultSampleRate} Hz default; ` +
      `${audioProbe.value.outputs.length} output(s), ${audioProbe.value.inputs.length} input(s)`
    : audioProbe.status === "error" ? audioProbe.error : audioProbe.status;

  return <View style={{ gap: 16, padding: 8 }}>
    <Text style={{ color: colors.text, fontWeight: "600", fontSize: 20 }}>Platform services</Text>
    <Text style={{ color: colors.muted }}>
      Encoder, speech and audio device providers. Contract-tested; native paths are device-unverified.
      Rejections show the service error code.
    </Text>

    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>Media encoder</Text>
      <ProbeLine label="Probe">{encoderSummary}</ProbeLine>
      <ProbeLine label="Encoder">{encoder.isAvailable ? "linked" : "not linked in this build"}</ProbeLine>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Button title={encodeBusy ? "Encoding…" : "Encode synthetic clip"} disabled={encodeBusy || !encoder.isAvailable}
          onPress={() => void runEncode()} />
      </View>
      {encodeResult ? <Text style={{ color: colors.muted }}>{encodeResult}</Text> : null}
      <Text style={{ color: colors.muted }}>
        Sources are in-memory data: URLs; native encoders expect file:// URIs the host wrote, so a native rejection is expected here.
      </Text>
    </View>

    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>Speech recognition</Text>
      <ProbeLine label="Probe">{speechSummary}</ProbeLine>
      <ProbeLine label="Recognizer">{speech.isAvailable ? "linked" : "not linked in this build"}</ProbeLine>
      <ProbeLine label="Network consent">{consent.networkRecognition ? "granted this session" : "denied (default)"}</ProbeLine>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Button title={session ? "Stop dictation" : "Dictate on-device"} variant="secondary"
          disabled={!speech.isAvailable}
          onPress={() => void (session ? stopDictation() : startDictation(true))} />
        <Button title="Allow off-device recognition" variant="ghost" disabled={consent.networkRecognition}
          onPress={() => { consent.grantNetworkRecognition(); bumpConsent(v => v + 1); }} />
        <Button title="Dictate (network)" variant="secondary"
          disabled={!speech.isAvailable || !consent.networkRecognition || session !== null}
          onPress={() => void startDictation(false)} />
      </View>
      {speechError ? <Text style={{ color: colors.muted }}>Speech: {speechError}</Text> : null}
      {transcript ? <Text style={{ color: colors.text }}>“{transcript}”</Text> : null}
    </View>

    <View style={{ gap: 8 }}>
      <Text style={{ color: colors.text, fontWeight: "600" }}>Audio device</Text>
      <ProbeLine label="Probe">{audioSummary}</ProbeLine>
      <ProbeLine label="Provider">{audio.isAvailable ? "linked" : "not linked in this build"}</ProbeLine>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <Button title={toneBusy ? "Playing…" : "Play 440 Hz tone"} variant="secondary"
          disabled={toneBusy || !audio.isAvailable} onPress={() => void playTone()} />
      </View>
      {toneResult ? <Text style={{ color: colors.muted }}>{toneResult}</Text> : null}
      <Text style={{ color: colors.muted }}>Capture (openInput) is implemented but unverified on every target; not exercised here.</Text>
    </View>
  </View>;
}
