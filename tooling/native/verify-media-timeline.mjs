import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const output = mkdtempSync(join(tmpdir(), "nyc-tron-media-timeline-"));
function run(command, args) {
  const result = spawnSync(command, args, { cwd: repo, stdio: "inherit", timeout: 60_000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed with ${result.status ?? result.signal}`);
}
try {
  run("java", ["-m", "jdk.compiler/com.sun.tools.javac.Main", "-source", "8", "-target", "8", "-d", output,
    "packages/platform-services/android/src/main/java/com/nyctron/platformservices/IsoBmffTimeline.java",
    "tooling/native/IsoBmffTimelineTest.java"]);
  run("java", ["-cp", output, "com.nyctron.platformservices.IsoBmffTimelineTest",
    join(repo, "examples/native-instruments/assets/reference.mp4"), output]);
} finally { rmSync(output, { recursive: true, force: true }); }
