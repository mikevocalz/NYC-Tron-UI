import { assertRgba, type RgbaColor } from "../color.ts";

/** A selectable, application-supplied profile in ColorSpaceChooser and SoftProofControls. */
export interface ColorProfile {
  /** Stable profile identity; not a display name or inferred ICC conversion. */
  readonly id: string;
  readonly label: string;
  readonly model: "rgb" | "cmyk" | "gray" | "lab";
}
/** Profile-bearing CMYK percentages displayed by PrintColorChannels. */
export interface PrintColor {
  readonly profileId: string;
  /** Cyan, magenta, yellow and black, each 0..100 percent. */
  readonly channels: readonly [number, number, number, number];
  readonly alpha: number;
}
/** Floating RGB values displayed by WideGamutChannels, without clipping or conversion. */
export interface WideGamutColor {
  readonly profileId: string;
  /** Encoded/linear interpretation belongs to the named profile. */
  readonly channels: readonly [number, number, number];
  readonly alpha: number;
}
/** Named reference displayed by ThemeColorReferences. Binding preserves this identity. */
export interface ThemeColorReference {
  readonly id: string;
  readonly label: string;
  readonly source: string;
  /** Current resolved display preview; never replaces the reference in the document. */
  readonly preview: RgbaColor;
}
/** Spot/global definition edited by SpotAndGlobalColorEditor. */
export interface NamedColor {
  readonly id: string;
  readonly name: string;
  readonly kind: "spot" | "global";
  readonly tint: number;
  /** sRGB alternate preview, not an ink/profile conversion. */
  readonly alternate: RgbaColor;
}
/** Engine-produced gamut report rendered by GamutWarning. */
export interface GamutReport {
  readonly sourceProfileId: string;
  readonly destinationProfileId: string;
  readonly outside: number;
  readonly total: number;
  readonly maximumDeltaE?: number;
}
/** Host-owned proof settings consumed by SoftProofControls. */
export interface SoftProofSettings {
  readonly enabled: boolean;
  readonly profileId: string | null;
  readonly intent: "perceptual" | "relative-colorimetric" | "saturation" | "absolute-colorimetric";
  readonly blackPointCompensation: boolean;
  readonly simulatePaper: boolean;
  readonly simulateBlackInk: boolean;
}
/** Checks a named profile collection before presenting choices. */
export function validateProfiles(profiles: readonly ColorProfile[]): void {
  if (profiles.length > 1000) throw new RangeError("Limit profile choices to 1000");
  const ids = new Set<string>();
  for (const profile of profiles) {
    if (!profile.id.trim() || !profile.label.trim() || ids.has(profile.id) || !["rgb", "cmyk", "gray", "lab"].includes(profile.model)) throw new TypeError("Profiles require distinct IDs, labels and a known model");
    ids.add(profile.id);
  }
}
/** Validates profile-preserving numeric channels; rejects invalid edits rather than clipping. */
export function validateColorChannels(color: PrintColor | WideGamutColor, count: number, min: number, max: number): void {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) throw new RangeError("Channel bounds must be finite and increasing");
  if (!color.profileId.trim()) throw new TypeError("Color channels require an explicit profile identity");
  if (color.channels.length !== count || color.channels.some(value => !Number.isFinite(value) || value < min || value > max)) throw new RangeError(`Expected ${count} finite channels in ${min}..${max}`);
  if (!Number.isFinite(color.alpha) || color.alpha < 0 || color.alpha > 1) throw new RangeError("Alpha must be 0..1");
}
/** Validates measured gamut counts and optional delta E. No gamut is inferred from RGB bytes. */
export function validateGamutReport(report: GamutReport): void {
  if (!report.sourceProfileId || !report.destinationProfileId) throw new TypeError("Gamut report requires both profiles");
  if (![report.outside, report.total].every(Number.isSafeInteger) || report.outside < 0 || report.total < report.outside) throw new RangeError("Invalid gamut sample counts");
  if (report.maximumDeltaE !== undefined && (!Number.isFinite(report.maximumDeltaE) || report.maximumDeltaE < 0)) throw new RangeError("Delta E must be nonnegative");
}
/** Checks a named definition before a single host commit. */
export function validateNamedColor(color: NamedColor): void {
  if (!color.id || !color.name.trim() || color.name.length > 256 || !["spot", "global"].includes(color.kind)) throw new TypeError("Named colors require an ID, name and spot/global kind");
  if (!Number.isFinite(color.tint) || color.tint < 0 || color.tint > 100) throw new RangeError("Tint must be 0..100 percent");
  assertRgba(color.alternate);
}
/** Ensures enabled proofing always identifies an available output profile. */
export function validateSoftProof(settings: SoftProofSettings, profiles: readonly ColorProfile[]): void {
  validateProfiles(profiles);
  if (settings.profileId !== null && !profiles.some(profile => profile.id === settings.profileId)) throw new TypeError("Unknown proof profile");
  if (settings.enabled && settings.profileId === null) throw new TypeError("Choose a proof profile before enabling proofing");
  if (!["perceptual", "relative-colorimetric", "saturation", "absolute-colorimetric"].includes(settings.intent)) throw new TypeError("Unknown rendering intent");
}
