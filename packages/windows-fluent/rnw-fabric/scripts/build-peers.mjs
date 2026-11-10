import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
for (const path of ["../../core", ".."]) {
  const result = spawnSync(process.execPath, [resolve(root, "node_modules/typescript/bin/tsc"), "-p", resolve(root, path, "tsconfig.build.json")], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
