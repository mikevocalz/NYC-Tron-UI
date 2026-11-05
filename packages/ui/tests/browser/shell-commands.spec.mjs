import {test,expect} from "playwright/test";

const open=async(page,query="")=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-commands"+query);
  await page.getByRole("tablist",{name:"Ribbon"}).waitFor();
};
const last=page=>page.getByTestId("last");

test("ribbon tabs switch by arrow keys, toggles report state, galleries pick inline and from More",async({page})=>{
  await open(page);
  await expect(page.getByRole("tab",{name:"Format, Picture tools"})).toBeVisible();
  await page.getByRole("button",{name:"Bold"}).click();
  await expect(page.getByRole("button",{name:"Bold"})).toHaveAttribute("aria-pressed","true");
  await page.getByRole("radio",{name:"Title"}).click();
  await expect(last(page)).toHaveText("last style:title");
  await page.getByRole("button",{name:"More Text styles"}).click();
  await page.getByRole("menuitem",{name:"Caption"}).click();
  await expect(last(page)).toHaveText("last style:caption");
  await expect(page.getByRole("radio",{name:"Caption"})).toHaveAttribute("aria-checked","true");
  await page.getByRole("tab",{name:"Home"}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab",{name:"Insert"})).toHaveAttribute("aria-selected","true");
  await page.getByRole("button",{name:"More Image options"}).click();
  await page.getByRole("menuitem",{name:"From camera"}).click();
  await expect(last(page)).toHaveText("last image:camera");
  await page.getByRole("button",{name:"Image",exact:true}).click();
  await expect(last(page)).toHaveText("last image");
  await page.getByRole("button",{name:"Hide ribbon commands"}).click();
  await expect(page.getByRole("tabpanel")).toHaveCount(0);
  await page.getByRole("tab",{name:"Home"}).click();
  await expect(page.getByRole("tabpanel")).toBeVisible();
});

test("split button primary and flyout are separate targets",async({page})=>{
  await open(page);
  const primary=await page.getByRole("button",{name:"Export",exact:true}).boundingBox();
  const flyout=await page.getByRole("button",{name:"More Export options"}).boundingBox();
  expect(flyout.x).toBeGreaterThanOrEqual(primary.x+primary.width);
  await page.getByRole("button",{name:"Export",exact:true}).click();
  await expect(last(page)).toHaveText("last export");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await page.getByRole("button",{name:"More Export options"}).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem",{name:"Export as PNG"})).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(last(page)).toHaveText("last export:pdf");
  await expect(page.getByRole("button",{name:"More Export options"})).toBeFocused();
});

test("context menu opens from right-click, Shift+F10 and the Menu key, and the target keeps its press",async({page})=>{
  await open(page);
  const target=page.getByRole("button",{name:"Harbor photo layer"});
  await target.click();
  await expect(last(page)).toHaveText("last layer:select");
  const box=await target.boundingBox();
  await page.mouse.click(box.x+300,box.y+20,{button:"right"});
  const menu=page.getByRole("menu",{name:"Actions for Harbor photo layer"});
  await expect(menu).toBeVisible();
  const m=await menu.boundingBox();
  expect(Math.abs(m.x-(box.x+300))).toBeLessThan(12);
  await page.getByRole("menuitem",{name:"Rename"}).click();
  await expect(last(page)).toHaveText("last layer:rename");
  await target.focus();
  await page.keyboard.press("Shift+F10");
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(target).toBeFocused();
  await page.keyboard.press("ContextMenu");
  await expect(menu).toBeVisible();
});

test("presets preview on hover and focus, select, favorite and filter",async({page})=>{
  await open(page);
  const cool=page.getByRole("radio",{name:"Cool dusk"});
  await cool.hover();
  await expect(page.getByTestId("preset")).toHaveText("preset warm preview cool favorites warm");
  await page.mouse.move(5,5);
  await expect(page.getByTestId("preset")).toHaveText("preset warm preview none favorites warm");
  await page.getByRole("radio",{name:"Warm film, favorite"}).focus();
  await page.keyboard.press("ArrowRight");
  await expect(cool).toBeFocused();
  await expect(page.getByTestId("preset")).toHaveText(/preview cool/);
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("preset")).toHaveText(/^preset cool /);
  await page.getByRole("button",{name:"Add Silver mono to favorites"}).click();
  await page.getByRole("button",{name:"Favorites",exact:true}).click();
  await expect(page.getByRole("radiogroup",{name:"Color grade presets"}).getByRole("radio")).toHaveCount(2);
  await page.getByRole("button",{name:"Remove Warm film from favorites"}).click();
  await page.getByRole("button",{name:"Remove Silver mono from favorites"}).click();
  await expect(page.getByText("No favorite presets yet.")).toBeVisible();
});

test("shortcut sheet searches, records a binding, refuses bare keys and asks before replacing",async({page})=>{
  await open(page);
  await page.getByRole("button",{name:"Keyboard shortcuts"}).click();
  const sheet=page.getByRole("dialog",{name:"Keyboard shortcuts"});
  await expect(sheet).toBeVisible();
  await page.getByRole("searchbox",{name:"Search shortcuts"}).fill("strong");
  await expect(page.getByText("1 shortcut",{exact:true})).toBeVisible();
  await page.getByRole("searchbox",{name:"Search shortcuts"}).fill("");
  await page.getByRole("button",{name:"Change shortcut for Bold"}).click();
  await page.keyboard.press("j");
  await expect(page.getByText(/so it does not fire while typing/)).toBeVisible();
  await page.keyboard.press("Control+Shift+J");
  await expect(page.getByTestId("bindings")).toHaveText(/bold=Mod\+Shift\+J /);
  await page.getByRole("button",{name:"Change shortcut for Brush tool"}).click();
  await page.keyboard.press("Control+s");
  await expect(page.getByText(/Control S is already used by Save/)).toBeVisible();
  await page.getByRole("button",{name:"Replace shortcut for Save"}).click();
  await expect(page.getByTestId("bindings")).toHaveText(/save=- .*brush=Mod\+S$/);
  await page.getByRole("button",{name:"Reset shortcut for Save"}).click();
  await expect(page.getByTestId("bindings")).toHaveText(/save=Mod\+S .*brush=-$/);
  await page.getByRole("button",{name:"Change shortcut for Zoom in"}).click();
  await page.keyboard.press("Escape");
  await expect(sheet).toBeVisible();
  await expect(page.getByRole("button",{name:"Change shortcut for Zoom in"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(page.getByRole("button",{name:"Keyboard shortcuts"})).toBeFocused();
});

test("the a11y layer tracks input modality and announces through a live region",async({page})=>{
  await open(page);
  await page.mouse.click(5,600);
  await expect(page.getByTestId("prefs")).toHaveText(/input pointer$/);
  await page.keyboard.press("Tab");
  await expect(page.getByTestId("prefs")).toHaveText(/input keyboard$/);
  await expect(page.locator("html")).toHaveAttribute("data-input-modality","keyboard");
  await page.getByRole("button",{name:"Export",exact:true}).click();
  await expect(page.locator("[aria-live]",{hasText:"Exported Harbor poster.png"})).toHaveCount(1);
});

test("the a11y layer follows reduced motion and forced colors",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce",forcedColors:"active"});
  await open(page);
  await expect(page.getByTestId("prefs")).toHaveText(/^motion reduced contrast high /);
});

test("command controls are at least 44 by 44 points",async({page})=>{
  await open(page);
  const targets=page.locator("[role=button],[role=tab],[role=radio]");
  const n=await targets.count();
  for(let i=0;i<n;i++){
    const t=targets.nth(i);
    if(!await t.isVisible())continue;
    const box=await t.boundingBox();
    const name=(await t.getAttribute("aria-label"))??"";
    expect(box.height,name).toBeGreaterThanOrEqual(44);
    expect(box.width,name).toBeGreaterThanOrEqual(44);
  }
});
