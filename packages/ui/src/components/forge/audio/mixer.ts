/**
 * Mixer state helpers for {@linkcode MixingConsole} and
 * {@linkcode SoloMuteButtons}. Pure; no React or engine imports.
 */

/** One channel as the engine reports it. All values are committed state. */
export interface MixerChannel {
  /** Stable engine id; also the React key. */
  readonly id: string | number;
  readonly name: string;
  /** Linear gain, 0 (silence) .. 1 (0 dB). */
  readonly gain: number;
  /** Mono pan, -1 .. 1. */
  readonly pan: number;
  readonly muted: boolean;
  readonly solo: boolean;
}

/**
 * Why a channel is or is not heard. Solo takes precedence over mute, the
 * same rule as the Cadence engine's render: with any channel soloed only
 * soloed channels sound, and a soloed channel sounds even when muted.
 */
export type Audibility =
  | "audible"
  | "muted"
  /** Silent because another channel is soloed. */
  | "silenced-by-solo";

/** Audibility of each channel, in input order. */
export function audibility(channels: readonly Pick<MixerChannel, "muted" | "solo">[]): Audibility[] {
  const anySolo = channels.some(c => c.solo);
  return channels.map(c => {
    if (anySolo) return c.solo ? "audible" : "silenced-by-solo";
    return c.muted ? "muted" : "audible";
  });
}

/** Spoken summary for a strip, e.g. `"Bass, muted"`. */
export function describeAudibility(name: string, state: Audibility, solo: boolean): string {
  const parts = [name];
  if (solo) parts.push("soloed");
  if (state === "muted") parts.push("muted");
  if (state === "silenced-by-solo") parts.push("silent while another channel is soloed");
  return parts.join(", ");
}
