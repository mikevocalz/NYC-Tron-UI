import {test,expect} from "playwright/test";

test.beforeEach(async({page})=>{await page.goto("/");});

test("keyboard opens at first item, skips disabled branches, wraps, and restores focus on Escape",async({page})=>{
  const trigger=page.getByRole("button",{name:"Document actions",exact:true});
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await expect(trigger).toHaveAttribute("aria-haspopup","menu");
  await trigger.focus();await page.keyboard.press("Enter");
  const first=page.getByRole("menuitem",{name:"Edit",exact:true});
  const share=page.getByRole("menuitem",{name:"Share",exact:true});
  const pin=page.getByRole("menuitemcheckbox",{name:"Pin",exact:true});
  await expect(first).toBeFocused();
  await page.keyboard.press("ArrowDown");await expect(share).toBeFocused();
  await page.keyboard.press("ArrowDown");await expect(pin).toBeFocused();
  await page.keyboard.press("ArrowDown");await expect(first).toBeFocused();
  await page.keyboard.press("ArrowUp");await expect(pin).toBeFocused();
  await page.keyboard.press("Home");await expect(first).toBeFocused();
  await page.keyboard.press("End");await expect(pin).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await expect(page.getByTestId("selection")).toHaveText("none");
});

test("up arrow opens at the last item and Space activates the focused checkbox",async({page})=>{
  const trigger=page.getByRole("button",{name:"Document actions",exact:true});
  await trigger.focus();await page.keyboard.press("ArrowUp");
  const pin=page.getByRole("menuitemcheckbox",{name:"Pin",exact:true});
  await expect(pin).toBeFocused();await expect(pin).toHaveAttribute("aria-checked","false");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("selection")).toHaveText("pin");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(page.getByTestId("action-count")).toHaveText("1");
});

test("pointer cannot invoke disabled actions or descendants and enabled selection closes the menu",async({page})=>{
  await page.getByRole("button",{name:"Document actions",exact:true}).click();
  for(const name of ["Delete","Blocked child"]){
    const disabled=page.getByRole("menuitem",{name,exact:true});
    await expect(disabled).toHaveAttribute("aria-disabled","true");
    await disabled.click({force:true});
    await expect(page.getByTestId("selection")).toHaveText("none");
    await expect(page.getByRole("menu")).toBeVisible();
  }
  await page.getByRole("menuitem",{name:"Share",exact:true}).click();
  await expect(page.getByTestId("selection")).toHaveText("share");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(page.getByTestId("action-count")).toHaveText("1");
});

test("outside close button dismisses without invoking an action",async({page})=>{
  const trigger=page.getByRole("button",{name:"Document actions",exact:true});
  await trigger.click();
  await page.getByRole("button",{name:"Close menu",exact:true}).click({position:{x:1,y:1}});
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(page.getByTestId("selection")).toHaveText("none");
});

test("Tab and Shift+Tab stay inside the open action menu and Escape returns focus to the trigger",async({page})=>{
  const trigger=page.getByRole("button",{name:"Document actions",exact:true});
  await trigger.focus();await page.keyboard.press("Enter");
  const edit=page.getByRole("menuitem",{name:"Edit",exact:true});
  const share=page.getByRole("menuitem",{name:"Share",exact:true});
  const pin=page.getByRole("menuitemcheckbox",{name:"Pin",exact:true});
  await expect(edit).toBeFocused();
  await page.keyboard.press("Tab");await expect(share).toBeFocused();
  await page.keyboard.press("Tab");await expect(pin).toBeFocused();
  await page.keyboard.press("Tab");await expect(edit).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(pin).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("selecting a menu item with the keyboard returns focus to the trigger",async({page})=>{
  const trigger=page.getByRole("button",{name:"Document actions",exact:true});
  await trigger.focus();await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("selection")).toHaveText("edit");
  await expect(trigger).toBeFocused();
});

test("web NativePopover is placed below the anchor, cycles Tab and restores focus",async({page})=>{
  const opener=page.getByRole("button",{name:"Open popover",exact:true});
  await opener.focus();await page.keyboard.press("Enter");
  const dialog=page.getByRole("dialog",{name:"Layer settings"});
  await expect(dialog).toBeVisible();
  const box=await dialog.boundingBox();
  // anchor is y=160..204 with 8pt padding
  expect(box.y).toBeGreaterThanOrEqual(204+8-1);
  const first=page.getByRole("button",{name:"Popover first",exact:true});
  const second=page.getByRole("button",{name:"Popover second",exact:true});
  const done=page.getByRole("button",{name:"Done",exact:true});
  await expect(first).toBeFocused();
  await page.keyboard.press("Tab");await expect(second).toBeFocused();
  await page.keyboard.press("Tab");await expect(done).toBeFocused();
  await page.keyboard.press("Tab");await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(done).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("CommandPopover focuses the first enabled item, skips disabled on Tab and restores focus",async({page})=>{
  const opener=page.getByRole("button",{name:"Open commands",exact:true});
  await opener.focus();await page.keyboard.press("Enter");
  const cut=page.getByRole("menuitem",{name:"Cut"});
  const paste=page.getByRole("menuitem",{name:"Paste"});
  await expect(cut).toBeFocused();
  await page.keyboard.press("Tab");await expect(paste).toBeFocused();
  await page.keyboard.press("Tab");await expect(cut).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(paste).toBeFocused();
  await page.keyboard.press("ArrowDown");await expect(cut).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu",{name:"Clipboard"})).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("CommandPalette filters, moves with arrows, runs with Enter and restores focus",async({page})=>{
  const opener=page.getByRole("button",{name:"Open palette",exact:true});
  await opener.focus();await page.keyboard.press("Enter");
  const search=page.getByRole("combobox",{name:"Command palette"});
  await expect(search).toBeFocused();
  await expect(page.getByRole("option")).toHaveCount(4);
  await page.keyboard.type("op");
  await expect(page.getByRole("option")).toHaveCount(2);
  const open=page.getByRole("option",{name:"File, Open file"});
  const reopen=page.getByRole("option",{name:"View, Reopen closed tab"});
  await expect(open).toHaveAttribute("aria-selected","true");
  await page.keyboard.press("ArrowDown");
  await expect(reopen).toHaveAttribute("aria-selected","true");
  await expect(search).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("selection")).toHaveText("view.reopen");
  await expect(page.getByRole("dialog",{name:"Command palette"})).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test("CommandPalette keeps Tab inside, never activates disabled commands and Escape closes",async({page})=>{
  const opener=page.getByRole("button",{name:"Open palette",exact:true});
  await opener.focus();await page.keyboard.press("Enter");
  const search=page.getByRole("combobox",{name:"Command palette"});
  await expect(search).toBeFocused();
  await page.keyboard.type("delete");
  const disabled=page.getByRole("option",{name:"Edit, Delete selection"});
  await expect(disabled).toHaveAttribute("aria-disabled","true");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("selection")).toHaveText("none");
  await page.keyboard.press("Tab");await expect(search).toBeFocused();
  await search.fill("");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("option",{name:"File, Open file"})).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(search).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("option",{name:"View, Reopen closed tab"})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog",{name:"Command palette"})).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(page.getByTestId("selection")).toHaveText("none");
});

test("tooltip appears after the focus delay, describes the control and hides on Escape and blur",async({page})=>{
  const save=page.getByRole("button",{name:"Save",exact:true});
  await save.focus();
  const tip=page.getByRole("tooltip");
  await expect(tip).toHaveText("Writes the document to disk");
  await expect(save).toHaveAttribute("aria-describedby",await tip.getAttribute("id"));
  await page.keyboard.press("Escape");
  await expect(tip).toHaveCount(0);
  await save.hover();
  await expect(tip).toBeVisible();
  await page.mouse.move(600,600);
  await expect(tip).toHaveCount(0);
});

test("trigger-form popover anchors to its measured trigger and hands focus back",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  const trigger=page.getByRole("button",{name:"Stroke width",exact:true});
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await expect(trigger).toHaveAttribute("aria-haspopup","dialog");
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog=page.getByRole("dialog",{name:"Stroke width"});
  await expect(dialog).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded","true");
  const t=await trigger.boundingBox(),d=await dialog.boundingBox();
  // Below the trigger, starting at its leading edge (clamped into the window).
  expect(d.y).toBeGreaterThanOrEqual(t.y+t.height);
  expect(Math.abs(d.x-Math.max(8,Math.min(t.x,390-8-d.width)))).toBeLessThan(1);
  await expect(dialog.getByRole("button",{name:"Thin"})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("button",{name:"Thick"}).click();
  await expect(page.getByTestId("selection")).toHaveText("thick");
});
