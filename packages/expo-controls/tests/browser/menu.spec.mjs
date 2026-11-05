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
