import { test, expect } from "playwright/test";

const read = async page => JSON.parse(await page.getByTestId("pointer-observation").textContent());
const surface = page => page.getByLabel("Input drawing surface", { exact: true });

test.describe("Pointer input browser adapter", () => {
  test.use({ hasTouch: true });

  test("actual mouse capture commits outside the surface with logical coordinates", async ({ page }) => {
    await page.goto("/pointer-input");
    const node = surface(page);
    await expect(node).toBeVisible();
    const bounds = await node.boundingBox();
    await page.mouse.move(bounds.x + 30, bounds.y + 30);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width + 16, bounds.y + 90, { steps: 8 });
    await page.mouse.up();
    await expect.poll(async () => (await read(page)).committed).toBe(1);
    const value = await read(page);
    expect(value.lastStrokePhase).toBe("up");
    expect(value.cancelled).toBe(0);
    expect(value.kind).toBe("mouse");
    expect(value.pressure).toBeNull();
    expect(value.tiltX).toBeNull();
    expect(value.predictions).toBe(0);
    expect(value.x).toBeGreaterThan(bounds.width);
  });

  test("keyboard observation and focus loss cancel an unfinished mouse stroke", async ({ page }) => {
    await page.goto("/pointer-input");
    const node = surface(page);
    await expect(node).toBeVisible();
    await node.focus();
    await page.keyboard.press("a");
    await expect.poll(async () => (await read(page)).key?.key).toBe("a");
    expect((await read(page)).key.phase).toBe("up");
    const bounds = await node.boundingBox();
    await page.mouse.move(bounds.x + 30, bounds.y + 30);
    await page.mouse.down();
    await page.mouse.move(bounds.x + 100, bounds.y + 80);
    await page.keyboard.press("Tab");
    await expect.poll(async () => (await read(page)).cancelled).toBe(1);
    await page.mouse.up();
    expect((await read(page)).committed).toBe(0);
    expect((await read(page)).predictions).toBe(0);
  });

  test("synthetic pen-hover contract clears on unmount before a real browser touch", async ({ page }) => {
    await page.goto("/pointer-input");
    const node = surface(page);
    await expect(node).toBeVisible();
    // This checks adapter cleanup using an injected hover, not physical pen support.
    await node.dispatchEvent("pointermove", { pointerId: 77, pointerType: "pen", clientX: 60, clientY: 180,
      pressure: 0, tiltX: 12, tiltY: -8, buttons: 0, bubbles: true });
    await expect.poll(async () => (await read(page)).hover).toBe("pen");
    await page.getByRole("button", { name: "Remove input surface" }).click();
    await expect(node).toHaveCount(0);
    await expect.poll(async () => (await read(page)).hover).toBeNull();
    await page.getByRole("button", { name: "Mount input surface" }).click();
    const bounds = await surface(page).boundingBox();
    await page.touchscreen.tap(bounds.x + 80, bounds.y + 80);
    await expect.poll(async () => (await read(page)).committed).toBe(1);
    expect((await read(page)).lastStrokePhase).toBe("up");
    expect((await read(page)).kind).toBe("touch");
  });
});
