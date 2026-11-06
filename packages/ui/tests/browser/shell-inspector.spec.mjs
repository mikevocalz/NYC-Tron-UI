import {test,expect} from "playwright/test";

const open=async(page,query="")=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-inspector"+query);
  await page.getByRole("slider",{name:"Opacity"}).waitFor();
};
const centre=async locator=>{const b=await locator.boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2,box:b};};

test("unit input converts units, steps with arrows and reports parse errors in place",async({page})=>{
  await open(page);
  const x=page.getByRole("textbox",{name:"Position X",exact:true});
  await expect(x).toHaveValue("63.5 mm");
  await x.click();await x.fill("1in + 4mm");await x.press("Enter");
  await expect(page.getByTestId("x")).toHaveText("x 111.12 unit mm");
  await expect(x).toBeFocused();
  await x.press("ArrowUp");
  await expect(page.getByTestId("x")).toHaveText(/^x 114\.9/);
  await x.fill("12mm *");await x.press("Enter");
  await expect(page.getByText("Expression ends early")).toBeVisible();
  await expect(x).toHaveAttribute("aria-invalid","true");
  await x.press("Escape");
  await expect(page.getByText("Expression ends early")).toHaveCount(0);
  await page.getByRole("button",{name:"Position X unit, mm"}).click();
  await page.getByRole("menuitem",{name:"px"}).click();
  await expect(page.getByTestId("x")).toHaveText(/unit px$/);
  await expect(x).toHaveValue(/ px$/);
});

test("time fields accept frames and seconds together",async({page})=>{
  await open(page);
  const d=page.getByRole("textbox",{name:"Duration",exact:true});
  await expect(d).toHaveValue("48 f");
  await d.click();await d.fill("1.5s + 12f");await d.press("Enter");
  await expect(page.getByTestId("duration")).toHaveText("duration 2");
  await d.fill("2s - 6f");await d.press("Enter");
  await expect(page.getByTestId("duration")).toHaveText("duration 1.75");
});

test("slider field drags with one commit, steps by key and resets",async({page})=>{
  await open(page);
  const slider=page.getByRole("slider",{name:"Opacity"});
  const c=await centre(slider);
  await page.mouse.move(c.box.x+20,c.y);await page.mouse.down();
  await page.mouse.move(c.box.x+c.box.width/2,c.y,{steps:6});
  await expect(page.getByTestId("opacity")).toHaveText(/^opacity 86 preview \d+ commits 0$/);
  await page.mouse.up();
  await expect(page.getByTestId("opacity")).toHaveText(/^opacity (49|50|51) preview \d+ commits 1$/);
  await slider.focus();
  await page.keyboard.press("End");
  await expect(page.getByTestId("opacity")).toHaveText("opacity 100 preview 100 commits 2");
  await expect(page.getByRole("button",{name:/^Reset Opacity/})).toHaveCount(0);
  await page.keyboard.press("PageDown");
  await expect(page.getByTestId("opacity")).toHaveText("opacity 90 preview 90 commits 3");
  await page.getByRole("button",{name:/^Reset Opacity/}).click();
  await expect(page.getByTestId("opacity")).toHaveText("opacity 100 preview 100 commits 4");
});

test("slider drag cancels on Escape without committing",async({page})=>{
  await open(page);
  const slider=page.getByRole("slider",{name:"Opacity"});
  await slider.focus();
  const c=await centre(slider);
  await page.mouse.move(c.box.x+c.box.width-20,c.y);await page.mouse.down();
  await page.mouse.move(c.box.x+30,c.y,{steps:5});
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(page.getByTestId("opacity")).toHaveText("opacity 86 preview 86 commits 0");
});

test("range ends move independently, never cross, and accept typed values",async({page})=>{
  await open(page);
  const black=page.getByRole("slider",{name:"Input range Black point"});
  const white=page.getByRole("slider",{name:"Input range White point"});
  await black.focus();
  await page.keyboard.press("PageUp");
  await expect(page.getByTestId("levels")).toHaveText("levels 22-240 commits 1");
  await white.focus();
  await page.keyboard.press("Home");
  await expect(page.getByTestId("levels")).toHaveText("levels 22-24 commits 2");
  const field=page.getByRole("textbox",{name:"Black point",exact:true});
  await field.click();await field.fill("200");await field.press("Enter");
  await expect(page.getByTestId("levels")).toHaveText("levels 22-24 commits 2");
  await expect(field).toHaveValue("22");
  const w=page.getByRole("textbox",{name:"White point",exact:true});
  await w.click();await w.fill("128 + 64");await w.press("Enter");
  await expect(page.getByTestId("levels")).toHaveText("levels 22-192 commits 3");
  const c=await centre(white);
  await page.mouse.move(c.x,c.y);await page.mouse.down();
  await page.mouse.move(c.x+60,c.y,{steps:4});await page.mouse.up();
  await expect(page.getByTestId("levels")).toHaveText(/^levels 22-2\d\d commits 4$/);
});

test("rotary knob drags up to raise, keys step, and the field takes exact entry",async({page})=>{
  await open(page);
  const knob=page.getByRole("slider",{name:"Angle"});
  const c=await centre(knob);
  await page.mouse.move(c.x,c.y);await page.mouse.down();
  await page.mouse.move(c.x,c.y-40,{steps:5});await page.mouse.up();
  await expect(page.getByTestId("angle")).toHaveText(/^angle (4[0-9]|5[0-9]) commits 1$/);
  await knob.focus();
  await page.keyboard.press("Home");
  await expect(page.getByTestId("angle")).toHaveText("angle -180 commits 2");
  const f=page.getByRole("textbox",{name:"Angle value"});
  await f.click();await f.fill("90 / 2");await f.press("Enter");
  await expect(page.getByTestId("angle")).toHaveText("angle 45 commits 3");
  await page.getByRole("button",{name:/^Reset Angle/}).click();
  await expect(page.getByTestId("angle")).toHaveText("angle 0 commits 4");
});

test("sections collapse, switch off their rows, and reset only when modified",async({page})=>{
  await open(page);
  await page.getByRole("button",{name:"Layer",exact:true}).click();
  await expect(page.getByRole("slider",{name:"Opacity"})).toBeHidden();
  await expect(page.getByRole("button",{name:"Layer",exact:true})).toHaveAttribute("aria-expanded","false");
  await page.getByRole("button",{name:"Drop shadow",exact:true}).click();
  const blur=page.getByRole("textbox",{name:"Blur",exact:true});
  await expect(blur).toBeEditable();
  await expect(page.getByRole("button",{name:"Reset Drop shadow"})).toHaveCount(0);
  await page.getByRole("switch",{name:"Enable Drop shadow"}).click();
  await expect(page.getByTestId("shadow")).toHaveText("shadow off blur 8");
  await expect(blur).not.toBeEditable();
  await page.getByRole("switch",{name:"Enable Drop shadow"}).click();
  await page.getByRole("button",{name:"Simulate a blur edit"}).click();
  await page.getByRole("button",{name:"Reset Drop shadow"}).click();
  await expect(page.getByTestId("shadow")).toHaveText("shadow on blur 8");
});

test("search filters rows by label and keywords and opens collapsed sections",async({page})=>{
  await open(page);
  const search=page.getByRole("searchbox",{name:"Search properties"});
  await search.fill("softness");
  await expect(page.getByText("1 property matches")).toBeVisible();
  await expect(page.getByRole("textbox",{name:"Blur",exact:true})).toBeVisible();
  await expect(page.getByRole("slider",{name:"Opacity"})).toBeHidden();
  await search.fill("turn");
  await expect(page.getByRole("slider",{name:"Angle"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Transform",exact:true})).toBeVisible();
  await search.fill("zzz");
  await expect(page.getByText('Nothing matches "zzz".')).toBeVisible();
  await search.press("Escape");
  await expect(search).toHaveValue("");
  await expect(page.getByRole("slider",{name:"Opacity"})).toBeVisible();
});

test("selection states change the heading, the mixed marker and the empty state",async({page})=>{
  await open(page,"?select=multiple");
  await expect(page.getByRole("heading",{name:"3 layers"})).toBeVisible();
  await expect(page.getByRole("group",{name:"Blend mode, mixed values"})).toBeVisible();
  await page.goto("/shell-inspector?select=none");
  await expect(page.getByText("Select an object to see its properties.")).toBeVisible();
  await expect(page.getByRole("searchbox")).toHaveCount(0);
});

test("an overridden row reverts to inherited",async({page})=>{
  await open(page);
  await page.getByRole("button",{name:"Revert Fill"}).click();
  await expect(page.getByRole("group",{name:"Fill, inherited"})).toBeVisible();
});

test("inspector controls are at least 44 by 44 points",async({page})=>{
  await open(page);
  const targets=page.locator("[role=button],[role=slider],[role=switch],input");
  const n=await targets.count();
  for(let i=0;i<n;i++){
    const t=targets.nth(i);
    if(!await t.isVisible())continue;
    const name=(await t.getAttribute("aria-label"))??"";
    // React Native Web's switch input is 20pt tall; the section wraps it in a 44pt pointer target.
    const box=await (await t.getAttribute("role")==="switch"?t.locator("xpath=../.."):t).boundingBox();
    expect(box.height,name).toBeGreaterThanOrEqual(44);
    expect(box.width,name).toBeGreaterThanOrEqual(44);
  }
});
