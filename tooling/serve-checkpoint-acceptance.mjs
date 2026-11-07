import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  const file = pathname === "/" ? join(root, "packages/platform-services/tests/browser/checkpoints.html")
    : /^\/checkpoints\/[a-z.-]+\.js$/.test(pathname)
      ? join(root, "packages/platform-services/dist", pathname) : undefined;
  if (!file) { response.writeHead(404).end(); return; }
  try {
    response.writeHead(200, { "Content-Type": file.endsWith(".html") ? "text/html" : "text/javascript", "Cache-Control": "no-store" });
    response.end(readFileSync(file));
  } catch { response.writeHead(404).end(); }
});
server.listen(4179, "127.0.0.1", () => console.log("Checkpoint acceptance: http://127.0.0.1:4179"));
