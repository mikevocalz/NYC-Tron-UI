// Serves an exported Expo web build, presses the Tron button twice and checks
// the count (gate T4 install paths). Needs playwright and serve-handler, which
// the workflow installs outside the consumer app.
//   node web-check.mjs <exported-web-dir> <screenshot.png> [path]
import http from "node:http";
import { createRequire } from "node:module";
const require = createRequire(process.env.T4_WEB_TOOLS ? process.env.T4_WEB_TOOLS + "/package.json" : import.meta.url);
const handler = require("serve-handler");
const { chromium } = require("playwright");
const [dir, shot, path = "/"] = process.argv.slice(2);
const server = http.createServer((q, r) => handler(q, r, { public: dir, cleanUrls: true, rewrites: [{ source: "**", destination: "/index.html" }] }));
await new Promise(r => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}${path}`;
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(String(error)));
let text = null;
try {
  await page.goto(url);
  await page.getByTestId("tron-button").click();
  await page.getByTestId("tron-button").click();
  text = await page.getByTestId("tron-presses").textContent();
  await page.screenshot({ path: shot });
} finally {
  await browser.close();
  server.close();
}
console.log(JSON.stringify({ url, text, errors }));
if (text !== "Pressed 2 times" || errors.length) process.exit(1);
