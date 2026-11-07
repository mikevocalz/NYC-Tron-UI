import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = join(root, "packages/platform-services");
const fixture = readFileSync(join(pkg, "tests/fixtures/decoder.mp4"));
let aborted = 0;
createServer((request, response) => {
  const path = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
  if (path === "/denied") { response.writeHead(403).end(); return; }
  if (path === "/oversized") { response.writeHead(200, { "Content-Length": 64*1024*1024+1 }).end("oversized"); return; }
  if (path === "/corrupt") { response.writeHead(200).end("Not a media container"); return; }
  if (path === "/metrics") { response.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ aborted })); return; }
  if (path === "/source.mp4" || path === "/slow") {
    response.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": fixture.byteLength, "Cache-Control": "no-store" });
    if (path === "/slow") {
      response.flushHeaders();
      const timer = setTimeout(() => response.end(fixture), 2000);
      response.on("close", () => { clearTimeout(timer); if (!response.writableEnded) aborted++; });
    } else response.end(fixture);
    return;
  }
  const file = path === "/" ? join(pkg, "tests/browser/media.html")
    : path === "/module-names.js" ? join(pkg, "dist/module-names.js")
    : path === "/mediabunny.mjs" ? join(pkg, "node_modules/mediabunny/dist/bundles/mediabunny.mjs")
      : /^\/media\/[a-z.-]+\.js$/.test(path) ? join(pkg, "dist", path) : undefined;
  if (!file) { response.writeHead(404).end(); return; }
  try { response.writeHead(200, { "Content-Type": file.endsWith(".html") ? "text/html" : "text/javascript", "Cache-Control": "no-store" }).end(readFileSync(file)); }
  catch { response.writeHead(404).end(); }
}).listen(4189, "127.0.0.1", () => console.log("Media acceptance: http://127.0.0.1:4189"));
