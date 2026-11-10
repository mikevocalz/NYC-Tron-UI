import { spawnSync } from "node:child_process";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const output = resolve(process.env.RUNNER_TEMP ?? "/tmp", "nyc-tron-ios-boot");
mkdirSync(output, { recursive: true });
function run(args, name, timeout) {
  const result = spawnSync("xcrun", args, { encoding: "utf8", timeout, maxBuffer: 16 * 1024 * 1024 });
  writeFileSync(join(output, name + ".log"), (result.stdout ?? "") + (result.stderr ?? ""));
  if (result.error || result.status !== 0) throw new Error("iOS prewarm failed at " + name + ": " + (result.error?.message ?? result.status));
  return result.stdout;
}
try {
  const devices = Object.entries(JSON.parse(run(["simctl", "list", "devices", "available", "--json"], "devices", 90000)).devices)
    .sort(([left], [right]) => right.localeCompare(left, undefined, { numeric: true })).flatMap(([, list]) => list);
  const requested = process.env.NYC_TRON_IOS_UDID;
  const device = requested ? devices.find(device => device.isAvailable && device.udid === requested) :
    devices.find(device => device.isAvailable && device.name.startsWith("iPhone") && device.state === "Booted") ??
    devices.find(device => device.isAvailable && device.name.startsWith("iPhone"));
  if (!device) throw new Error("The requested/available iPhone simulator runtime is missing");
  if (device.state !== "Booted") run(["simctl", "boot", device.udid], "boot", 90000);
  run(["simctl", "bootstatus", device.udid, "-b"], "bootstatus", 420000);
  writeFileSync(join(output, "device.json"), JSON.stringify(device, null, 2) + "\n");
  if (process.env.GITHUB_ENV) appendFileSync(process.env.GITHUB_ENV, "NYC_TRON_IOS_UDID=" + device.udid + "\n");
  console.log("Prepared " + device.name + " (" + device.udid + ") for native media and UI acceptance.");
} catch (error) {
  writeFileSync(join(output, "failure.txt"), String(error?.stack ?? error) + "\n");
  throw error;
}
