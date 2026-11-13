#!/usr/bin/env node
// Parses `get {name, position, size} of every UI element of list 1` of the
// Dock, moves the pointer over the named item with a CGEvent and screenshots
// the tooltip. CI only; best effort.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [axFile, name, out] = process.argv.slice(2);
const text = readFileSync(axFile, "utf8").trim();
if (!text) process.exit(1);
// AppleScript prints three flattened lists: names..., x, y..., w, h...
const parts = text.split(", ");
const count = (parts.length) / 5;
if (!Number.isInteger(count)) process.exit(1);
const names = parts.slice(0, count);
const nums = parts.slice(count).map(Number);
const items = names.map((n, i) => ({ name: n, x: nums[i * 2], y: nums[i * 2 + 1], width: nums[count * 2 + i * 2], height: nums[count * 2 + i * 2 + 1] }));
writeFileSync(join(out, "dock-items.json"), JSON.stringify(items, null, 2));
const item = items.find((i) => i.name === name);
if (!item) process.exit(1);
const swift = `import CoreGraphics
import Foundation
let p = CGPoint(x: ${item.x + item.width / 2}, y: ${item.y + item.height / 2})
CGWarpMouseCursorPosition(p)
CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
Thread.sleep(forTimeInterval: 0.3)
CGEvent(mouseEventSource: nil, mouseType: .mouseMoved, mouseCursorPosition: CGPoint(x: p.x + 1, y: p.y), mouseButton: .left)?.post(tap: .cghidEventTap)
`;
writeFileSync(join(out, "hover.swift"), swift);
execFileSync("swift", [join(out, "hover.swift")], { stdio: "inherit" });
execFileSync("sleep", ["2"]);
execFileSync("screencapture", ["-x", join(out, "dock-hover.png")]);
