#!/usr/bin/env node
// Reads a uiautomator dump and writes the bounds of the named launcher icons
// in dp. Exits 1 unless all of them are on screen. CI only.
//   android-layout.mjs <ui.xml> <density dpi> "<name>|<name>|..." <out.json>
import { readFileSync, writeFileSync } from "node:fs";

const [file, dpi, names, out] = process.argv.slice(2);
const xml = readFileSync(file, "utf8");
const k = Number(dpi) / 160;
const unescape = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const nodes = [...xml.matchAll(/<node [^>]*>/g)].map(([n]) => ({
  text: unescape(/ text="([^"]*)"/.exec(n)?.[1] ?? ""),
  desc: unescape(/ content-desc="([^"]*)"/.exec(n)?.[1] ?? ""),
  cls: / class="([^"]*)"/.exec(n)?.[1] ?? "",
  bounds: /bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/.exec(n)?.slice(1).map(Number),
}));
const height = Math.max(...nodes.map((n) => n.bounds?.[3] ?? 0));
const icons = [];
for (const name of names.split("|")) {
  const node = nodes.find((n) => (n.text === name || n.desc === name) && n.bounds && n.bounds[3] > n.bounds[1] && n.bounds[1] > 0 && n.bounds[3] < height);
  if (!node) process.exit(1);
  const [x0, y0, x1, y1] = node.bounds;
  icons.push({ name, x: x0 / k, y: y0 / k, width: (x1 - x0) / k, height: (y1 - y0) / k, class: node.cls });
}
writeFileSync(out, JSON.stringify({ unit: "dp", platform: "android", pxPerUnit: k, icons }, null, 2) + "\n");
