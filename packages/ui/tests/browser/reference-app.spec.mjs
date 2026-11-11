import { test, expect } from "playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { cpus, platform, release, totalmem } from "node:os";

const routeTitle = { library: "Library", editor: "Quiet forms", media: "Motion study", settings: "Settings" };
const ready = async (page, route = "library") => {
  await expect(page.getByRole("heading", { name: routeTitle[route], exact: true })).toBeVisible();
  await expect(page.getByTestId("reference-pane-host")).toBeVisible();
};
const navigate = async (page, route) => {
  await page.getByRole("tab", { name: route[0].toUpperCase() + route.slice(1), exact: true }).click();
  await ready(page, route);
};
async function expectBounded(page, route) {
  const bounds = await page.getByTestId(`reference-${route}-columns`).evaluate(columns => {
    const root = columns.closest('[data-testid="reference-app"]');
    const outer = root.getBoundingClientRect();
    const inner = columns.getBoundingClientRect();
    const shown = [...columns.children].map(child => child.getBoundingClientRect());
    return { left: outer.left, right: outer.right, width: outer.width,
      content: { left: inner.left, right: inner.right, width: inner.width },
      items: shown.map(r => ({ left: r.left, right: r.right })),
      documentWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth };
  });
  expect(bounds.width).toBeGreaterThan(0);
  expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.documentWidth + 1);
  expect(bounds.content.width).toBeLessThanOrEqual(1121);
  expect(bounds.content.left).toBeGreaterThanOrEqual(bounds.left - 1);
  expect(bounds.content.right).toBeLessThanOrEqual(bounds.right + 1);
  for (const item of bounds.items) {
    expect(item.left).toBeGreaterThanOrEqual(bounds.content.left - 1);
    expect(item.right).toBeLessThanOrEqual(bounds.content.right + 1);
  }
}

test.describe("Complete native feel reference", () => {
  test("library shows loading, failure recovery, selection and saved empty state", async ({ page }) => {
    await page.goto("/reference-app?loading=1");
    await ready(page);
    await expect(page.getByTestId("reference-library-loading")).toBeVisible();
    await page.evaluate(() => window.completeReferenceLibrary());
    const cover = page.getByRole("radio", { name: /^Quiet forms, file/ });
    await expect(cover).toBeVisible();
    await page.getByRole("radio", { name: "Saved", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Keep a favorite close" })).toBeVisible();
    await page.getByRole("button", { name: "Browse all work" }).click();
    await cover.click();
    await expect(page.getByTestId("reference-item-title")).toHaveText("Quiet forms");
    await page.getByRole("button", { name: "Save to collection" }).click();
    await page.getByRole("radio", { name: "Saved", exact: true }).click();
    await expect(cover).toBeVisible();
    await page.getByRole("button", { name: "Remove from saved" }).click();
    await expect(page.getByRole("heading", { name: "Keep a favorite close" })).toBeVisible();
    await page.goto("/reference-app?library-error=1");
    await expect(page.getByTestId("reference-library-error")).toBeVisible();
    await page.getByRole("button", { name: "Try library again" }).click();
    await expect(page.getByRole("radio", { name: /^Motion study, file/ })).toBeVisible();
    await page.goto("/reference-app?empty=1");
    await expect(page.getByRole("heading", { name: "Your library is empty" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Refresh empty library" })).toBeEnabled();
  });

  test("editor keeps the same draft input across routes and viewport changes", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/reference-app?route=editor");
    await ready(page, "editor");
    const input = page.getByRole("textbox", { name: "Cover headline", exact: true });
    const original = await input.elementHandle();
    await input.fill("A quieter place.");
    await input.focus();
    for (const width of [834, 390, 680, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(input).toBeFocused();
      await expect(input).toHaveValue("A quieter place.");
      expect(await original.evaluate(node => node.isConnected && node === document.activeElement)).toBe(true);
      await expectBounded(page, "editor");
    }
    await navigate(page, "library");
    await navigate(page, "editor");
    expect(await input.evaluate((node, before) => node === before, original)).toBe(true);
    await expect(input).toHaveValue("A quieter place.");
    await page.getByRole("button", { name: "Save cover", exact: true }).click();
    await expect(page.getByTestId("reference-cover-status")).toHaveText("Cover saved for this session.");
    await input.fill("");
    await page.getByRole("button", { name: "Save cover", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Add a headline before saving." }).first()).toBeVisible();
    await page.getByRole("button", { name: "Restore saved cover" }).click();
    await expect(input).toHaveValue("A quieter place.");
    await page.getByRole("searchbox", { name: "Search properties" }).fill("opacity");
    await expect(input).toBeHidden();
    await expect(page.getByRole("slider", { name: "Text opacity", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Clear search", exact: true }).click();
    await expect(input).toBeVisible();
    // Shared shell continuity with an explicit capability input. This is a
    // browser geometry check, not evidence of a native foldable adapter.
    await page.goto("/reference-app?route=editor&native-shell=1&dir=rtl");
    await ready(page, "editor");
    const retained = await input.elementHandle();
    await input.fill("Keep the same editor.");
    await input.focus();
    await page.evaluate(() => window.setReferenceFamily("foldable"));
    await expect(page.getByTestId("reference-right-rail")).toBeVisible();
    await expect(input).toBeFocused();
    expect(await input.evaluate((node, before) => node === before, retained)).toBe(true);
    await page.setViewportSize({ width: 390, height: 1000 });
    const rail = await page.getByTestId("reference-right-rail").boundingBox();
    const app = await page.getByTestId("reference-app").boundingBox();
    expect(Math.abs(rail.x + rail.width - app.x - app.width)).toBeLessThanOrEqual(1);
    await expect(input).toHaveValue("Keep the same editor.");
    await page.evaluate(() => window.setReferenceFamily("phone"));
    await expect(page.getByTestId("reference-bottom-tabs")).toBeVisible();
    expect(await input.evaluate((node, before) => node === before, retained)).toBe(true);
  });

  test("settings validate, save, restore and carry appearance through navigation", async ({ page }) => {
    await page.goto("/reference-app?route=settings&theme=light");
    await ready(page, "settings");
    const name = page.getByRole("textbox", { name: "Workspace name", exact: true });
    await name.fill(" ");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByRole("alert")).toHaveText("Enter a workspace name before saving.");
    await name.fill("  North room  ");
    await page.getByRole("button", { name: "Save settings" }).click();
    await expect(page.getByTestId("reference-workspace-title")).toHaveText("North room");
    await expect(name).toHaveValue("North room");
    const dark = page.getByRole("radio", { name: "Dark", exact: true });
    await dark.click();
    await expect(dark).toHaveAttribute("aria-checked", "true");
    const color = await page.getByTestId("reference-app").evaluate(node => getComputedStyle(node).backgroundColor);
    await navigate(page, "editor");
    expect(await page.getByTestId("reference-app").evaluate(node => getComputedStyle(node).backgroundColor)).toBe(color);
    await navigate(page, "settings");
    await page.getByRole("button", { name: "Reset settings" }).click();
    await expect(page.getByRole("radio", { name: "Light", exact: true })).toHaveAttribute("aria-checked", "true");
    expect(await page.getByTestId("reference-app").evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(color);
  });

  test("real browser frame decode recovers and saves a note against decoded time", async ({ page }) => {
    await page.goto("/reference-app?route=media&frame-error=1");
    await ready(page, "media");
    await expect(page.getByRole("alert")).toHaveText("The sample frame could not be decoded. Try again.");
    await page.getByRole("button", { name: "Try frame again" }).click();
    await expect(page.getByTestId("reference-frame-status")).toContainText("Frame ready at");
    await expect(page.getByRole("img", { name: /^Decoded frame at/ })).toBeVisible();
    await page.getByRole("button", { name: "Save review note" }).click();
    await expect(page.getByRole("alert")).toHaveText("Write a review note before saving.");
    const note = page.getByRole("textbox", { name: "Note for this frame", exact: true });
    await note.fill("Keep this opening frame.");
    await page.getByRole("button", { name: "Save review note" }).click();
    await expect(page.getByTestId("reference-saved-note")).toHaveText("Keep this opening frame.");
    const originalFrame = await page.getByRole("img", { name: /^Decoded frame at/ }).elementHandle();
    await navigate(page, "library");
    await navigate(page, "media");
    expect(await page.getByRole("img", { name: /^Decoded frame at/ }).evaluate((node, original) => node === original, originalFrame)).toBe(true);
    await expect(note).toHaveValue("Keep this opening frame.");
    const slider = page.getByRole("slider", { name: "Review position", exact: true });
    await slider.focus();
    await slider.press("PageUp");
    await expect(page.getByTestId("reference-frame-status")).toContainText("Frame ready at");
    await expect(slider).toHaveAttribute("aria-valuenow", "10");
  });

  test("all routes stay bounded at narrow, intermediate and wide sizes", async ({ page }) => {
    await page.goto("/reference-app");
    for (const width of [320, 390, 680, 834, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ["library", "editor", "settings"]) {
        await navigate(page, route);
        await expectBounded(page, route);
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/reference-app?nested=1&route=editor");
    await ready(page, "editor");
    await expectBounded(page, "editor");
    const canvas = await page.getByTestId("reference-canvas-column").boundingBox();
    const inspector = await page.getByTestId("reference-inspector-column").boundingBox();
    expect(inspector.y).toBeGreaterThan(canvas.y + canvas.height);
  });

  test("large text and RTL retain reachable actions", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await page.goto("/reference-app?dir=rtl&large-text=1&route=settings");
    await ready(page, "settings");
    await expectBounded(page, "settings");
    await page.getByRole("textbox", { name: "Workspace name" }).fill("مساحة العمل");
    const save = page.getByRole("button", { name: "Save settings" });
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
    await save.click();
    await expect(page.getByTestId("reference-workspace-title")).toHaveText("مساحة العمل");
    await expectBounded(page, "settings");
  });

  test("records repeatable development render p50 and p95 without an invented budget", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/reference-app");
    await ready(page);
    // Warm each screen once; frame decoding is not included in this render-work measurement.
    for (const route of ["editor", "settings", "library"]) await navigate(page, route);
    await page.evaluate(() => { window.referenceRenderSamples.length = 0; });
    for (let round = 0; round < 10; round++) {
      for (const route of ["editor", "settings", "library"]) await navigate(page, route);
    }
    const samples = await page.evaluate(() => window.referenceRenderSamples);
    const summary = Object.fromEntries(["library", "editor", "settings"].map(route => {
      const values = samples.filter(sample => sample.route === route && sample.phase !== "mount").map(sample => sample.durationMs).sort((a, b) => a - b);
      expect(values.length).toBeGreaterThanOrEqual(10);
      expect(values.every(value => Number.isFinite(value) && value >= 0)).toBe(true);
      const percentile = p => values[Math.max(0, Math.ceil(values.length * p) - 1)];
      return [route, { sampleCount: values.length, p50Ms: percentile(0.5), p95Ms: percentile(0.95) }];
    }));
    const revision = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const fixtureSha256 = createHash("sha256").update(readFileSync(new URL("./fixtures/reference-app.tsx", import.meta.url))).digest("hex");
    const report = { metric: "React Profiler actualDuration per committed update", build: "development", browser: "Chromium", viewport: { width: 1440, height: 1000 },
      provenance: { revision, fixtureSha256, workflowRun: process.env.GITHUB_RUN_ID ?? null,
        browserVersion: page.context().browser()?.version() ?? null, nodeVersion: process.version,
        os: { platform: platform(), release: release() },
        hardware: { cpuModel: cpus()[0]?.model ?? "unreported", logicalCpus: cpus().length, memoryBytes: totalmem() } },
      repetitions: 10, interpretation: "React render work only; excludes native GPU presentation, production startup and physical-device performance.", summary, samples };
    await mkdir("shots", { recursive: true });
    await writeFile("shots/reference-render-timings.json", JSON.stringify(report, null, 2) + "\n");
    await testInfo.attach("reference-render-timings", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
  });

  for (const route of ["library", "editor", "media", "settings"]) {
    test(`capture reference ${route} in light and dark`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 1000 });
      for (const theme of ["light", "dark"]) {
        await page.goto(`/reference-app?route=${route}&theme=${theme}`);
        await ready(page, route);
        if (route === "library") {
          await page.getByRole("radio", { name: /^Quiet forms, file/ }).click();
        }
        if (route === "media") await expect(page.getByTestId("reference-frame-status")).toContainText("Frame ready at");
        await expectBounded(page, route);
        await page.screenshot({ path: `shots/reference-${route}-desktop-${theme}.png`, fullPage: true });
      }
    });
  }
  for (const theme of ["light", "dark"]) {
    test(`capture reference phone ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 1000 });
      await page.goto(`/reference-app?route=editor&theme=${theme}`);
      await ready(page, "editor");
      await expect(page.getByTestId("reference-bottom-tabs")).toBeVisible();
      await expectBounded(page, "editor");
      await page.screenshot({ path: `shots/reference-editor-phone-${theme}.png`, fullPage: true });
    });
  }
});
