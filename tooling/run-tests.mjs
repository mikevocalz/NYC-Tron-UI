// Runs every discovered test file in one node --test invocation. CI, the
// release workflow and `pnpm test` all call this, so the lists cannot drift.
import { spawnSync } from "node:child_process";
import { discoverTests } from "./test-files.mjs";

const files = discoverTests();
if (files.length === 0) {
  console.error("run-tests: no test files discovered");
  process.exit(1);
}
const result = spawnSync(process.execPath, ["--experimental-strip-types", "--test", ...files], { stdio: "inherit" });
process.exit(result.status ?? 1);
