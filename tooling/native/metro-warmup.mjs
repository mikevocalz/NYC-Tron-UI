import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// This is the development bundle URL requested by the pinned Expo 58 native
// host. Compile that actual entry before starting the separate native-result
// deadline; a healthy /status response does not mean its bundle is ready.
export function nativeBundleUrl(platform) {
  if (platform !== "ios" && platform !== "android") throw new Error("Unsupported native bundle platform");
  const url = new URL("http://localhost:8081/.expo/.virtual-metro-entry.bundle");
  for (const [key, value] of Object.entries({ platform, dev: "true", lazy: "true", minify: "false",
    inlineSourceMap: "false", modulesOnly: "false", runModule: "true", excludeSource: "true",
    sourcePaths: "url-server", app: "com.nyctron.instruments.example" })) url.searchParams.set(key, value);
  return url.toString();
}

export async function warmNativeBundle({ platform, entry, evidenceDirectory,
  timeoutMs = 360000, maxBytes = 64 * 1024 * 1024, fetchImpl = fetch }) {
  if (!/^[a-z][a-z0-9-]*$/.test(entry)) throw new Error("Invalid native bundle entry label");
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || !Number.isSafeInteger(maxBytes) || maxBytes <= 0)
    throw new Error("Native bundle warmup requires positive finite limits");
  const url = nativeBundleUrl(platform), started = performance.now();
  const record = { schema: 1, phase: "metro-bundle-warmup", platform, entry, url,
    startedAt: new Date().toISOString(), timeoutMs, maxBytes, status: "pending", bytes: 0 };
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), redirect: "error" });
    record.httpStatus = response.status;
    record.contentType = response.headers.get("content-type");
    if (!response.ok || !/^(?:application|text)\/(?:javascript|x-javascript)(?:\s*;|$)/i.test(record.contentType ?? "")) {
      await response.body?.cancel();
      throw new Error("Native bundle warmup did not receive JavaScript: HTTP " + response.status + " " + record.contentType);
    }
    if (!response.body) throw new Error("Native bundle warmup received no body");
    const digest = createHash("sha256");
    for await (const chunk of response.body) {
      record.bytes += chunk.byteLength;
      if (record.bytes > maxBytes) throw new Error("Native bundle exceeded the warmup byte limit");
      digest.update(chunk);
    }
    if (!record.bytes) throw new Error("Native bundle warmup received an empty bundle");
    record.sha256 = digest.digest("hex");
    record.status = "ready";
    return record;
  } catch (error) {
    record.status = "failed";
    record.error = String(error?.message ?? error);
    throw error;
  } finally {
    record.elapsedMs = Math.round(performance.now() - started);
    writeFileSync(join(evidenceDirectory, "bundle-warmup-" + entry + ".json"), JSON.stringify(record, null, 2) + "\n");
  }
}
