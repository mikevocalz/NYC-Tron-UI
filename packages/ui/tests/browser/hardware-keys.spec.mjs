import {test,expect} from "playwright/test";
// @nyc-tron/hardware-keys on web: document keydown through createKeyboardMap
// into the fixture's command handler. Real Chromium key events; the native
// iOS and Android sources are not exercised here.
const last=page=>page.getByTestId("last");
const open=async page=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-commands");
  await page.getByRole("tablist",{name:"Ribbon"}).waitFor();
};

test("a bound chord runs its command from anywhere on the page",async({page})=>{
  await open(page);
  await page.keyboard.press("Control+B");
  await expect(last(page)).toHaveText("last key:bold");
  await page.keyboard.press("Alt+B");
  await expect(last(page)).toHaveText("last key:brush");
  await page.keyboard.press("H");
  await expect(last(page)).toHaveText("last key:hand");
});

test("a focused text field keeps typing and editing keys but still saves",async({page})=>{
  await open(page);
  const field=page.getByRole("textbox",{name:"Layer name"});
  await field.click();
  await field.press("End");
  await page.keyboard.type(" h");
  await expect(field).toHaveValue("Harbor photo h");
  await expect(last(page)).toHaveText("last none");
  await page.keyboard.press("Control+S");
  await expect(last(page)).toHaveText("last key:save");
});

test("rebinding in the sheet changes what the key does; the sheet owns keys while open",async({page})=>{
  await open(page);
  await page.getByRole("button",{name:"Keyboard shortcuts"}).click();
  await page.getByRole("dialog",{name:"Keyboard shortcuts"}).waitFor();
  await page.getByRole("button",{name:"Change shortcut for Brush tool"}).click();
  await page.keyboard.press("Control+Alt+R");
  await expect(page.getByTestId("bindings")).toContainText("brush=Mod+Alt+R");
  await expect(last(page)).toHaveText("last none");
  await page.getByRole("button",{name:"Close",exact:true}).click();
  await page.keyboard.press("Control+Alt+R");
  await expect(last(page)).toHaveText("last key:brush");
  await page.keyboard.press("Control+B");
  await expect(last(page)).toHaveText("last key:bold");
  await page.keyboard.press("Alt+B");
  await expect(last(page)).toHaveText("last key:bold","the old binding no longer runs Brush");
});
