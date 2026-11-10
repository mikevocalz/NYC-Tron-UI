import original from "/workspace/scratch/4137c61be495/nyc-tron-web-overlay-receipt/packages/expo-controls/tests/browser/playwright.config.mjs";
const fixture="/workspace/scratch/4137c61be495/nyc-tron-web-overlay-receipt/packages/expo-controls/tests/browser";
export default {
  ...original,
  testDir: fixture,
  outputDir: "/workspace/scratch/4137c61be495/web-overlay-pr60-5a9709-run42912913105/aggregate-system-chromium-results",
  use: {...original.use, launchOptions: {executablePath: "/usr/bin/chromium"}},
  webServer: {...original.webServer, cwd: fixture}
};
