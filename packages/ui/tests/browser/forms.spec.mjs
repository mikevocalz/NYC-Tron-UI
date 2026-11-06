import {test,expect} from "playwright/test";
const state=page=>page.getByTestId("state");

test("segmented control is a radio group with roving focus and arrow selection",async({page})=>{
  await page.goto("/forms");
  const group=page.getByRole("radiogroup",{name:"Dock position for Outline"});
  await expect(group.getByRole("radio",{name:"Left"})).toHaveAttribute("aria-checked","true");
  await expect(group.getByRole("radio",{name:"Right"})).toHaveAttribute("tabindex","-1");
  await group.getByRole("radio",{name:"Left"}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(state(page)).toContainText("dock right");
  await expect(group.getByRole("radio",{name:"Right"})).toBeFocused();
  await page.keyboard.press("End");
  await expect(state(page)).toContainText("dock bottom");
  await page.keyboard.press("ArrowRight");
  await expect(state(page)).toContainText("dock left");
});
test("RTL flips horizontal arrows",async({page})=>{
  await page.goto("/forms?dir=rtl");
  await page.getByRole("radio",{name:"Left"}).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(state(page)).toContainText("dock right");
});
test("pane tabs: tablist with selection following arrows",async({page})=>{
  await page.goto("/forms");
  const list=page.getByRole("tablist",{name:"Left dock panels"});
  await expect(list.getByRole("tab",{name:"Outline"})).toHaveAttribute("aria-selected","true");
  await list.getByRole("tab",{name:"Outline"}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(state(page)).toContainText("tab properties");
  await expect(list.getByRole("tab",{name:"Properties"})).toBeFocused();
});
test("navigation tabs are links with aria-current, not tabs",async({page})=>{
  await page.goto("/forms");
  const nav=page.getByRole("navigation",{name:"Studios"});
  await expect(nav.getByRole("tab")).toHaveCount(0);
  await expect(nav.getByRole("link",{name:"Docs"})).toHaveAttribute("aria-current","page");
  await expect(nav.getByRole("link",{name:"Sheets"})).toHaveAttribute("href","#sheets");
});
test("select: keyboard open, move, typeahead, pick, escape",async({page})=>{
  await page.goto("/forms");
  const box=page.getByRole("combobox",{name:"Body font"});
  await box.focus();
  await page.keyboard.press("ArrowDown");
  await expect(box).toHaveAttribute("aria-expanded","true");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(state(page)).toContainText("font plex");
  await expect(box).toHaveAttribute("aria-expanded","false");
  await page.keyboard.press("Enter");
  await page.keyboard.press("s");
  await page.keyboard.press(" ");
  await expect(state(page)).toContainText("font source");
  // The disabled option is skipped by End.
  await page.keyboard.press("Enter");
  await page.keyboard.press("End");
  const active=await box.getAttribute("aria-activedescendant");
  await expect(page.locator(`[id="${active}"]`)).toHaveText("Source Serif");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(state(page)).toContainText("font source");
  // A pointer press after keyboard use still toggles the list.
  await box.click();
  await expect(box).toHaveAttribute("aria-expanded","true");
  await page.getByRole("option",{name:"Inter"}).click();
  await expect(state(page)).toContainText("font inter");
  await box.focus();await page.keyboard.press(" ");
  await expect(box).toHaveAttribute("aria-expanded","true");
  await page.keyboard.press(" ");
  await box.click();
  await expect(box).toHaveAttribute("aria-expanded","true");
  await expect(page.getByRole("combobox",{name:"Locked template"})).toBeDisabled();
});
test("list rows, icon toggle and toolbar arrows",async({page})=>{
  await page.goto("/forms");
  await page.getByRole("button",{name:"Table, 12 rows, 4 columns"}).click();
  await expect(state(page)).toContainText("row 2");
  await expect(page.getByRole("list",{name:"Document blocks"}).getByRole("listitem")).toHaveCount(4);
  const bold=page.getByRole("button",{name:"Bold"});
  await expect(bold).toHaveAttribute("aria-pressed","false");
  await bold.click();
  await expect(bold).toHaveAttribute("aria-pressed","true");
  await bold.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button",{name:"Hide outline"})).toBeFocused();
  await expect(page.getByRole("toolbar",{name:"Document outline actions"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Document outline"})).toBeVisible();
  await expect(page.getByRole("group",{name:"Document details"})).toBeVisible();
});
test("every interactive primitive is at least 44px",async({page})=>{
  for(const width of [390,834]){
    await page.setViewportSize({width,height:900});
    await page.goto("/forms");
    for(const role of ["radio","tab","link","combobox","button"]){
      for(const el of await page.getByRole(role).all()){
        const b=await el.boundingBox();
        if(!b)continue;
        expect(Math.round(b.height),role+" height").toBeGreaterThanOrEqual(44);
        expect(Math.round(b.width),role+" width").toBeGreaterThanOrEqual(44);
      }
    }
  }
});
