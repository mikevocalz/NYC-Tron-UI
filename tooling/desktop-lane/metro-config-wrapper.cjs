// Installed as metro.config.js in a desktop lane coverage consumer (gate T4).
// The lane's own Metro config is kept unchanged as metro.config.lane.js and
// still resolves every request. This wrapper only observes requests made from
// inside the installed @nyc-tron/ui package:
//   - each bare specifier and whether the lane resolved it is appended to
//     tron-ui-coverage/resolution.jsonl;
//   - a bare specifier the lane cannot resolve is replaced by a generated stub
//     that throws when evaluated, so one missing optional peer fails only the
//     exports that import it instead of the whole bundle.
// Requests from every other module keep the lane's exact behavior.
const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const coverage = path.join(root, "tron-ui-coverage");
const stubs = JSON.parse(fs.readFileSync(path.join(coverage, "stubs.json"), "utf8"));
const uiRoot = path.join(root, "node_modules", "@nyc-tron", "ui") + path.sep;
const uiRoots = [uiRoot, fs.realpathSync(uiRoot.slice(0, -1)) + path.sep];
const logFile = path.join(coverage, "resolution.jsonl");
const seen = new Set();

function record(entry) {
  const key = `${entry.platform}\u0000${entry.specifier}\u0000${entry.resolved}`;
  if (seen.has(key)) return;
  seen.add(key);
  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
}

function wrap(config) {
  const laneResolve = config.resolver && config.resolver.resolveRequest;
  const resolveRequest = (context, moduleName, platform) => {
    const fromUi = typeof context.originModulePath === "string" && uiRoots.some(prefix => context.originModulePath.startsWith(prefix)) && !moduleName.startsWith(".");
    const resolveInLane = () => laneResolve ? laneResolve(context, moduleName, platform) : context.resolveRequest(context, moduleName, platform);
    if (!fromUi) return resolveInLane();
    try {
      const result = resolveInLane();
      record({ specifier: moduleName, platform, resolved: true, origin: path.relative(uiRoots.find(prefix => context.originModulePath.startsWith(prefix)), context.originModulePath).split(path.sep).join("/") });
      return result;
    } catch (error) {
      record({ specifier: moduleName, platform, resolved: false, origin: path.relative(uiRoots.find(prefix => context.originModulePath.startsWith(prefix)), context.originModulePath).split(path.sep).join("/"), error: String(error && error.message || error).split("\n")[0].slice(0, 300) });
      if (!stubs[moduleName]) throw error;
      return { type: "sourceFile", filePath: path.join(coverage, stubs[moduleName]) };
    }
  };
  return { ...config, resolver: { ...config.resolver, resolveRequest } };
}

const lane = require("./metro.config.lane.js");
// Keep the lane's export shape: a plain object stays a plain object.
module.exports = typeof lane === "function"
  ? async (...args) => wrap(await lane(...args))
  : lane && typeof lane.then === "function"
    ? async () => wrap(await lane)
    : wrap(lane);
