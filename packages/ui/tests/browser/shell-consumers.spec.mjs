import { test, expect } from "playwright/test";

test("asset search, natural ordering, keyboard selection, navigation and open reach the controlled catalog", async ({ page }) => {
  await page.goto("/shell-consumers");
  const assets = page.getByTestId("assets");
  await assets.getByRole("searchbox", { name: "Search assets" }).fill("wav");
  const checks = assets.getByRole("checkbox");
  await expect(checks).toHaveCount(2);
  await expect(checks.nth(0)).toHaveAccessibleName(/Take 2.wav/);
  await checks.nth(0).click();
  await expect(checks.nth(0)).toBeChecked();
  await page.keyboard.press("Shift+ArrowDown");
  await expect(page.getByTestId("consumer-state")).toContainText('"selected":["take2","take10"]');
  await checks.nth(1).press("Enter");
  await expect(page.getByTestId("consumer-state")).toContainText('"opened":"take10"');
  await assets.getByRole("button", { name: "Clear search" }).click();
  const folder = assets.getByRole("checkbox", { name: /^Audio, folder/ });
  await folder.click(); await folder.press("Enter");
  await expect(page.getByTestId("consumer-state")).toContainText('"location":"audio"');
  await assets.getByRole("button", { name: "Library", exact: true }).click();
  await expect(page.getByTestId("consumer-state")).toContainText('"location":"root"');
});
test("history undo, redo and direct restore use the host cursor and revision", async ({ page }) => {
  await page.goto("/shell-consumers"); await page.getByRole("tab", { name: "History", exact: true }).click();
  const state = page.getByTestId("consumer-state");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(state).toContainText('"text":"Hello world","cursor":1');
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(state).toContainText('"cursor":2');
  await page.getByRole("button", { name: "Restore initial state" }).click();
  await expect(state).toContainText('"text":"Hello","cursor":0');
  await expect(page.getByRole("button", { name: "Undo", exact: true })).toBeDisabled();
});
test("find navigates actual UTF-16 ranges and replacement changes the controlled document", async ({ page }) => {
  await page.goto("/shell-consumers"); await page.getByRole("tab", { name: "Find", exact: true }).click();
  const opener = page.getByRole("button", { name: "Find and replace", exact: true }); await opener.click();
  const popup = page.getByRole("dialog", { name: "Find and replace" });
  await expect(popup.getByText("2 matches", { exact: true })).toBeVisible();
  await popup.getByRole("button", { name: "Next match", exact: true }).click();
  await expect(page.getByTestId("consumer-state")).toContainText('"selection":{"start":13,"end":18}');
  await popup.getByRole("textbox", { name: "Replacement text" }).fill("$&");
  await popup.getByRole("button", { name: "Replace all", exact: true }).click();
  await expect(page.getByTestId("consumer-state")).toContainText('"text":"Hello $&. $& of NYC-Tron."');
  await expect(popup.getByText("0 matches", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape"); await expect(popup).toBeHidden(); await expect(opener).toBeFocused();
});
test("progress stays at its reported value and pause, resume, cancel and dismiss use host actions", async ({ page }) => {
  await page.goto("/shell-consumers"); await page.getByRole("tab", { name: "Jobs", exact: true }).click();
  const progress = page.getByRole("progressbar", { name: "Fixture export" }); await expect(progress).toHaveAttribute("aria-valuenow", "25");
  await page.getByRole("button", { name: "Pause Fixture export" }).click();
  await expect(page.getByText("Fixture export: paused", { exact: true })).toBeVisible();
  await expect(progress).toHaveAttribute("aria-valuenow", "25");
  await page.getByRole("button", { name: "Resume Fixture export" }).click();
  await page.getByRole("button", { name: "Cancel Fixture export" }).click();
  await expect(page.getByText("Fixture export: cancelled", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Show all 4 notifications" }).click();
  await page.getByRole("button", { name: "Dismiss Notification 4" }).click();
  await expect(page.getByText("Notification 4", { exact: true })).toHaveCount(0);
});
for (const dir of ["ltr", "rtl"]) for (const width of [320, 834]) test(`shell consumers fit ${width}px ${dir}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 }); await page.goto(`/shell-consumers?dir=${dir}&theme=dark`);
  for (const tab of ["Assets", "History", "Find", "Jobs"]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  }
});
