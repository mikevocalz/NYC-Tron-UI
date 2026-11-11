import { test, expect } from "playwright/test";

// Browser acceptance for the real shared recipe. These captures and checks
// do not establish native SwiftUI/Compose or device acceptance.
const input = page => page.getByRole("textbox", { name: "Display name", exact: true });
const ready = async page => {
  await expect(page.getByRole("heading", { name: "Account", exact: true })).toBeVisible();
  await expect(input(page)).toBeVisible();
};

async function geometry(page) {
  return page.getByTestId("native-feel-columns").evaluate(columns => {
    const rect = element => {
      const r = element.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom };
    };
    return {
      columns: rect(columns),
      profile: rect(columns.querySelector('[data-testid="native-feel-profile"]')),
      preview: rect(columns.querySelector('[data-testid="native-feel-preview"]')),
      documentWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
    };
  });
}

async function expectBounded(page) {
  const g = await geometry(page);
  expect(g.documentScrollWidth, "the page has no horizontal overflow").toBeLessThanOrEqual(g.documentWidth + 1);
  expect(g.columns.width, "content respects its 1024-unit cap").toBeLessThanOrEqual(1025);
  for (const name of ["profile", "preview"]) {
    expect(g[name].x, `${name} stays within the usable content box`).toBeGreaterThanOrEqual(g.columns.x - 1);
    expect(g[name].right, `${name} stays within the usable content box`).toBeLessThanOrEqual(g.columns.right + 1);
  }
  return g;
}

async function expectArrangement(page) {
  const g = await expectBounded(page);
  // Use the measured content box: window scrollbars, outer padding and a
  // nested host all reduce available width. 320 + 280 + 32 = 632.
  if (g.columns.width >= 632 - 0.1) {
    expect(Math.abs(g.preview.y - g.profile.y), "both columns share the same row").toBeLessThanOrEqual(1);
  } else {
    expect(g.preview.y, "preview wraps below the form").toBeGreaterThanOrEqual(g.profile.bottom + 31);
  }
  return g;
}

async function expectSurfaceCoverage(page) {
  const bounds = await page.getByTestId("native-feel-surface").evaluate(surface => {
    const host = surface.closest('[data-testid="native-feel-host"]');
    const s = surface.getBoundingClientRect(), h = host.getBoundingClientRect();
    return {
      surface: { top: s.top, bottom: s.bottom, left: s.left, right: s.right },
      host: { top: h.top, bottom: h.bottom, left: h.left, right: h.right },
      viewportHeight: window.innerHeight,
      backgroundColor: getComputedStyle(surface).backgroundColor,
    };
  });
  expect(bounds.surface.bottom, "the themed surface reaches the viewport bottom even when content is short")
    .toBeGreaterThanOrEqual(bounds.viewportHeight - 1);
  expect(bounds.surface.top).toBeLessThanOrEqual(bounds.host.top + 1);
  expect(bounds.surface.bottom).toBeGreaterThanOrEqual(bounds.host.bottom - 1);
  expect(Math.abs(bounds.surface.left - bounds.host.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(bounds.surface.right - bounds.host.right)).toBeLessThanOrEqual(1);
  expect(bounds.backgroundColor, "the surface itself paints the app theme").not.toBe("rgba(0, 0, 0, 0)");
}

test.describe("Native feel reference", () => {

test("account content fits intermediate widths and changes arrangement at its measured content boundary", async ({ page }) => {
  await page.goto("/native-feel?theme=light");
  await ready(page);
  for (const width of [320, 390, 679, 680, 681, 834, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expectArrangement(page);
  }
});

test("a narrow pane in a desktop window keeps its single-column arrangement", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/native-feel?nested=1&theme=light");
  await ready(page);
  const host = await page.getByTestId("native-feel-host").boundingBox();
  expect(host.width).toBeCloseTo(390, 0);
  const g = await expectArrangement(page);
  expect(g.columns.width).toBeLessThan(632);
  expect(g.preview.y).toBeGreaterThan(g.profile.bottom);
  await expectSurfaceCoverage(page);
});

test("resizing retains the actual input element, focus and an unsaved draft", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/native-feel?theme=light");
  await ready(page);
  const field = input(page);
  await field.fill("Draft that survives resizing");
  await field.focus();
  const original = await field.elementHandle();
  expect(original).not.toBeNull();
  for (const width of [390, 834, 320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expectArrangement(page);
    await expect(field).toHaveValue("Draft that survives resizing");
    await expect(field).toBeFocused();
    expect(await original.evaluate(node => node.isConnected && document.activeElement === node),
      "the original DOM input remains mounted and focused").toBe(true);
  }
  await expect(page.getByTestId("native-feel-saved-name")).toHaveText("Alex Morgan");
});

test("blank-name validation recovers, local save updates the preview and reset restores the saved draft", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1000 });
  await page.goto("/native-feel?theme=light");
  await ready(page);
  const field = input(page);
  const workspace = page.getByRole("combobox");
  const save = page.getByRole("button", { name: "Save preferences", exact: true });
  await field.fill("   ");
  await save.click();
  await expect(page.getByRole("alert")).toHaveText("Enter a display name before saving.");
  await expect(page.getByTestId("native-feel-save-status")).toHaveText("Your changes have not been saved.");
  await expect(page.getByTestId("native-feel-saved-name")).toHaveText("Alex Morgan");

  await field.fill("  Maya Chen  ");
  await workspace.selectOption("projects");
  await save.click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(field).toHaveValue("Maya Chen");
  await expect(page.getByTestId("native-feel-saved-name")).toHaveText("Maya Chen");
  await expect(page.getByTestId("native-feel-preview").getByText("Projects", { exact: true })).toBeVisible();
  await expect(page.getByTestId("native-feel-save-status")).toHaveText("Preferences saved for this demo session.");

  await field.fill("Unsaved replacement");
  await workspace.selectOption("library");
  await page.getByRole("radio", { name: "Dark", exact: true }).click();
  await page.getByRole("button", { name: "Reset changes", exact: true }).click();
  await expect(field).toHaveValue("Maya Chen");
  await expect(workspace).toHaveValue("projects");
  await expect(page.getByRole("radio", { name: "Light", exact: true })).toBeChecked();
  await expect(page.getByTestId("native-feel-save-status")).toHaveText("Restored your last saved preferences.");
});

test("appearance supports radio-keyboard navigation, explicit native Host themes and returning to system", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/native-feel");
  await ready(page);
  const system = page.getByRole("radio", { name: "System", exact: true });
  const light = page.getByRole("radio", { name: "Light", exact: true });
  const dark = page.getByRole("radio", { name: "Dark", exact: true });
  const hostScheme = () => page.getByRole("combobox").evaluate(node => node.closest("[data-theme]")?.getAttribute("data-theme") ?? null);
  const scopeIs = scheme => page.getByTestId("native-feel-surface").evaluate((node, scheme) => !!node.closest("." + scheme), scheme);
  await expect(system).toBeChecked();
  await expect.poll(() => scopeIs("dark")).toBe(true);
  expect(await hostScheme()).toBeNull();

  await system.focus();
  await page.keyboard.press("ArrowRight");
  await expect(light).toBeChecked();
  await expect(light).toBeFocused();
  await expect.poll(hostScheme).toBe("light");
  await expect.poll(() => scopeIs("light")).toBe(true);
  await page.keyboard.press("ArrowRight");
  await expect(dark).toBeChecked();
  await expect.poll(hostScheme).toBe("dark");
  await page.keyboard.press("Home");
  await expect(system).toBeChecked();
  await expect.poll(hostScheme).toBeNull();
  await expect.poll(() => scopeIs("dark")).toBe(true);
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(() => scopeIs("light")).toBe(true);
});

for (const width of [390, 1440]) {
  test(`RTL account content remains bounded at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/native-feel?dir=rtl&theme=light");
    await ready(page);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expectArrangement(page);
    const save = page.getByRole("button", { name: "Save preferences", exact: true });
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
    await expect(save).toBeEnabled();
  });
}

for (const width of [390, 834]) {
  test(`large text preserves bounded content and reachable actions at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/native-feel?large-text=1&theme=light");
    await ready(page);
    expect(await page.locator("html").evaluate(node => getComputedStyle(node).fontSize)).toBe("32px");
    await expectBounded(page);
    await input(page).fill("Large text profile");
    const save = page.getByRole("button", { name: "Save preferences", exact: true });
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeInViewport();
    await save.click();
    await expect(page.getByTestId("native-feel-saved-name")).toHaveText("Large text profile");
    await expectBounded(page);
  });
}

// Requested reference screenshots, captured from the working recipe rather
// than generated imagery. They are review artifacts, not pixel goldens.
for (const [size, viewport] of [
  ["desktop", { width: 1440, height: 1000 }],
  ["phone", { width: 390, height: 1000 }],
]) for (const theme of ["light", "dark"]) {
  test(`capture native feel ${size} ${theme}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(`/native-feel?theme=${theme}`);
    await ready(page);
    await expectArrangement(page);
    await expectSurfaceCoverage(page);
    await page.screenshot({ path: `shots/native-feel-${size}-${theme}.png`, fullPage: true });
  });
}

});
