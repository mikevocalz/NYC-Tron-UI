// Prints the Maestro flow that presses the Tron button in an install-path app.
//   node flow.mjs <bundle-or-package-id> <new|existing> [url-scheme]
// The new app shows the button on launch. The existing app keeps its own
// home screen; the Tron screen is the added route, opened by deep link.
const [appId, kind, scheme] = process.argv.slice(2);
if (!appId || !["new", "existing"].includes(kind)) throw new Error("Usage: flow.mjs <app-id> <new|existing> [scheme]");
if (kind === "existing" && !scheme) throw new Error("The existing app needs its URL scheme to open the added route");
const steps = [
  "- launchApp:",
  "    clearState: true",
  ...(kind === "existing" ? [`- openLink: "${scheme}://tron"`] : []),
  "- extendedWaitUntil:",
  "    visible:",
  "      id: tron-button",
  "    timeout: 60000",
  "- takeScreenshot: before-press",
  "- tapOn:",
  "    id: tron-button",
  "- assertVisible: \"Pressed 1 times\"",
  "- takeScreenshot: after-press",
];
console.log([`appId: ${appId}`, "---", ...steps, ""].join("\n"));
