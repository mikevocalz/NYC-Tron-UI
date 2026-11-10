import { test, expect } from "playwright/test";

test("installed UI works without workspace sources and keeps the field through reflow", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const name = page.getByRole("textbox", { name: "Display name", exact: true });
  await expect(name).toBeVisible();
  await name.fill("  Morgan Lee  ");
  await name.focus();
  const original = await name.elementHandle();
  for (const width of [1280, 600, 320, 1024]) {
    await page.setViewportSize({ width, height: 1100 });
    await expect(name).toHaveValue("  Morgan Lee  ");
    await expect(name).toBeFocused();
    expect(await name.evaluate((element, before) => element === before, original)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.getByRole("button", { name: "Save name", exact: true }).click();
  await expect(page.getByTestId("consumer-saved")).toHaveText("Morgan Lee");
  await name.fill(" ");
  await page.getByRole("button", { name: "Save name", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveText("Enter a name.");
  await expect(page.getByTestId("consumer-saved")).toHaveText("Morgan Lee");
  await page.screenshot({ path: "artifacts/consumer-wide.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 1100 });
  await page.screenshot({ path: "artifacts/consumer-narrow.png", fullPage: true });
  expect(errors).toEqual([]);
});

test.describe("Expo browser exports", () => {
  test.skip(process.env.CONSUMER_KIND !== "expo-web", "The basic consumer deliberately omits Expo");
  test("installed picker and panes work through the browser export conditions", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("consumer-workspace").selectOption("library");
    await expect(page.getByTestId("consumer-workspace-value")).toHaveText("Workspace: library");
    await page.getByRole("button", { name: "Toggle appearance" }).click();
    await expect(page.getByTestId("consumer-appearance")).toHaveText("dark");
    await page.setViewportSize({ width: 1000, height: 1100 });
    await expect(page.getByTestId("consumer-master")).toBeVisible();
    await page.setViewportSize({ width: 390, height: 1100 });
    await expect(page.getByTestId("consumer-master")).toBeHidden();
    await expect(page.getByRole("textbox", { name: "Display name", exact: true })).toBeVisible();
  });
});
