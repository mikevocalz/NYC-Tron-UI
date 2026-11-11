import { createHash } from "node:crypto";
import { basename } from "node:path";

/** Exact release artifacts, never a workspace source alias or registry fallback. */
export function consumerDependencies(dependencies, archives, required = []) {
  const result = { ...dependencies };
  for (const name of new Set([...Object.keys(result), ...required])) {
    if (!name.startsWith("@nyc-tron/")) continue;
    if (name === "@nyc-tron/windows-fluent-fabric") {
      throw new Error("The RNW 0.85 adapter cannot enter an Expo 58 consumer");
    }
    if (name === "@nyc-tron/macos-appkit") {
      throw new Error("The Spark / Expo 55 AppKit adapter cannot enter an Expo 58 consumer");
    }
    const archive = archives.get(name);
    if (!archive) throw new Error("Missing release tarball for consumer dependency " + name);
    result[name] = "file:" + archive.path;
  }
  for (const [name, value] of Object.entries(result)) {
    if (typeof value !== "string" || value.startsWith("workspace:")) {
      throw new Error("Unresolved consumer dependency " + name);
    }
  }
  return result;
}

export function releaseChecksums(text) {
  const hashes = new Map();
  for (const line of text.split(/\r?\n/).filter(Boolean)) {
    const match = /^([a-f0-9]{64})  (.+\.tgz)$/.exec(line);
    if (!match || basename(match[2]) !== match[2] || /[/\\]/.test(match[2])) {
      throw new Error("Invalid release checksum entry: " + line);
    }
    if (hashes.has(match[2])) throw new Error("Duplicate release checksum: " + match[2]);
    hashes.set(match[2], match[1]);
  }
  if (!hashes.size) throw new Error("Release SHA256SUMS contains no tarballs");
  return hashes;
}

export function verifyArchiveHash(file, bytes, expected) {
  if (!expected || createHash("sha256").update(bytes).digest("hex") !== expected) {
    throw new Error("Release tarball checksum mismatch: " + file);
  }
}

/** A basic form must stay usable without these unrelated optional features. */
export const BASIC_ABSENT_PEERS = [
  "@nyc-tron/core", "@expo/ui", "expo", "react-native-skia", "react-native-gesture-handler",
  "@tanstack/react-table", "expo-drag-drop-content-view", "expo-linear-gradient", "uniwind",
];

export function exactPin(name, value) {
  if (typeof value !== "string" || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value)) {
    throw new Error("Consumer tooling requires an existing exact pin for " + name + ": " + value);
  }
  return value;
}
