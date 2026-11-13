// Prints the Maestro flow that presses the Tron button in an install-path app.
//   node flow.mjs <bundle-or-package-id> <new|existing> [url-scheme] [ios|android]
// The new app shows the button on launch. The existing app keeps its own
// home screen; the Tron screen is the added route, opened by deep link once
// the app has finished starting.
const [appId, kind, scheme, platform] = process.argv.slice(2);
if (!appId || !["new", "existing"].includes(kind)) throw new Error("Usage: flow.mjs <app-id> <new|existing> [scheme] [ios|android]");
if (kind === "existing" && !scheme) throw new Error("The existing app needs its URL scheme to open the added route");
if (kind === "existing" && !["ios", "android"].includes(platform)) throw new Error("The existing app flow needs the platform, ios or android");
// Run 43208989075 (head 12ef8e4), existing app, cold-start link after stopApp:
//   Android: the link reached MainActivity before JavaScript ran, so
//     expo-router never routed to /tron and the app stayed on Home.
//   iOS: "Open in app?" appeared about 29 s after the link on the slow
//     runner; a `when: visible` check ran at about 8 s and skipped it.
// So the flow waits for the template's own home screen ("Welcome to Expo" in
// the Android hierarchy and the iOS screenshot; "Explore" is the tab label on
// both), sends the link to the running app, and on iOS waits for the dialog.
const steps = [
  "- launchApp:",
  "    clearState: true",
  ...(kind === "existing" ? [
    "- extendedWaitUntil:",
    "    visible: \"Welcome to Expo|Explore\"",
    "    timeout: 60000",
    `- openLink: "${scheme}://tron"`,
    ...(platform === "ios" ? [
      "- extendedWaitUntil:",
      "    visible: \"Open\"",
      "    timeout: 60000",
      "- tapOn: \"Open\"",
    ] : []),
  ] : []),
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
