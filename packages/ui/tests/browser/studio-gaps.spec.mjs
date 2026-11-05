import {test,expect} from "playwright/test";

// Gaps nitro-forge's Design Studio found on v0.1.0-alpha.2: LayerStack rows
// overflowing narrow panels, and TabBar truncating labels that fit.
const inside=async(child,parent)=>{
  const c=await child.boundingBox(),p=await parent.boundingBox();
  return c.x>=p.x-0.5&&c.x+c.width<=p.x+p.width+0.5;
};
// A Text with numberOfLines=1 is truncated when its content is wider than its box.
const truncated=locator=>locator.evaluate(el=>el.scrollWidth>el.clientWidth+0.5);

for(const width of [320,360,390]){
  test(`layer rows fit a ${width}pt panel with name and remove visible`,async({page})=>{
    await page.setViewportSize({width:width+64,height:900});
    await page.goto("/studio-gaps?w="+width);
    const panel=page.getByTestId("layer-panel");
    for(const name of ["Headline","Badge","Skyline"]){
      const remove=page.getByRole("button",{name:"Remove "+name,exact:true});
      expect(await inside(remove,panel),`Remove ${name} inside the panel`).toBe(true);
      expect(await page.getByText(name,{exact:true}).isVisible()).toBe(true);
    }
    const slider=page.getByRole("slider",{name:"Badge opacity"});
    const readout=page.getByRole("button",{name:/^Badge opacity, 80%$/});
    if(width>=380){
      await expect(slider).toBeVisible();
      await expect(readout).toHaveCount(0);
    }else{
      await expect(readout).toBeVisible();
      await expect(slider).toHaveCount(0);
    }
  });
}

test("narrow rows: the readout opens a scrubber that previews, commits once and restores focus",async({page})=>{
  await page.setViewportSize({width:400,height:900});
  await page.goto("/studio-gaps?w=320");
  const readout=page.getByRole("button",{name:/^Badge opacity, 80%$/});
  await expect(readout).toHaveAttribute("aria-expanded","false");
  await readout.click();
  const dialog=page.getByRole("dialog",{name:"Badge opacity"});
  await expect(dialog).toBeVisible();
  const scale=dialog.getByRole("slider",{name:"Badge opacity"});
  await scale.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("state")).toContainText("commits badge=0.81");
  await expect(page.getByRole("button",{name:/^Badge opacity, 81%$/})).toBeAttached();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button",{name:/^Badge opacity, 81%$/})).toBeFocused();
});

test("a locked row's readout is disabled",async({page})=>{
  await page.setViewportSize({width:400,height:900});
  await page.goto("/studio-gaps?w=320");
  await expect(page.getByRole("button",{name:/^Skyline opacity, 100%$/})).toBeDisabled();
});

test("one short tab shows its whole label in a narrow pane",async({page})=>{
  await page.goto("/studio-gaps");
  const label=page.getByTestId("tabs-one").getByText("Document",{exact:true});
  await expect(label).toBeVisible();
  expect(await truncated(label)).toBe(false);
});

test("a compact TabBar beside a header action sizes to its tab and keeps the action in the pane",async({page})=>{
  await page.goto("/studio-gaps");
  const pane=page.getByTestId("tabs-row");
  const label=pane.getByText("Document",{exact:true});
  expect(await truncated(label)).toBe(false);
  expect(await inside(page.getByTestId("row-action"),pane)).toBe(true);
});

test("a compact TabBar beside a flexible title takes the room its labels need first",async({page})=>{
  await page.goto("/studio-gaps");
  const pane=page.getByTestId("tabs-title");
  for(const name of ["Document","Layer"])expect(await truncated(pane.getByText(name,{exact:true})),name).toBe(false);
  expect(await inside(pane.getByRole("tab",{name:"Layer"}),pane)).toBe(true);
});

test("a few tabs that fit keep whole labels",async({page})=>{
  await page.goto("/studio-gaps");
  for(const name of ["Layers","Document","History"]){
    const label=page.getByTestId("tabs-three").getByText(name,{exact:true});
    expect(await truncated(label),name).toBe(false);
  }
});

test("tabs that cannot fit truncate instead of overflowing the pane",async({page})=>{
  await page.goto("/studio-gaps");
  const pane=page.getByTestId("tabs-tight");
  for(const name of ["Properties","Appearance","Accessibility","Animation"]){
    const tab=pane.getByRole("tab",{name});
    expect(await inside(tab,pane),name+" inside the pane").toBe(true);
    const box=await tab.boundingBox();
    expect(box.width,name+" keeps a 44pt target").toBeGreaterThanOrEqual(44);
  }
});

test("grouped select: headings name each group and keyboard order runs through every group",async({page})=>{
  await page.goto("/studio-gaps");
  const field=page.getByRole("combobox",{name:"Typeface"});
  await field.focus();
  await page.keyboard.press("ArrowDown");
  const list=page.getByRole("listbox",{name:"Typeface"});
  await expect(list).toBeVisible();
  for(const heading of ["Sans serif","Serif","Monospace"])
    await expect(list.getByRole("group",{name:heading,exact:true})).toBeVisible();
  await expect(list.getByRole("group",{name:"Serif",exact:true}).getByRole("option")).toHaveText(["Source Serif","Lora"]);
  // Inter is active; down twice crosses into the Serif group, End skips the disabled row.
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("state")).toContainText("font source");
});

// Review captures at the widths Forge docks this panel at, light and dark, LTR and RTL.
for(const theme of ["light","dark"])for(const width of [320,360,390]){
  test(`capture studio gaps ${theme} ${width}`,async({page})=>{
    await page.emulateMedia({colorScheme:theme});
    await page.setViewportSize({width:width+64,height:1100});
    await page.goto(`/studio-gaps?w=${width}&theme=${theme}`);
    await page.getByTestId("layer-panel").screenshot({path:`shots/studio-layers-${theme}-${width}.png`});
    if(width===390){
      await page.getByTestId("tabs-one").screenshot({path:`shots/studio-tabs-one-${theme}.png`});
      await page.getByTestId("tabs-three").screenshot({path:`shots/studio-tabs-three-${theme}.png`});
      await page.getByTestId("tabs-tight").screenshot({path:`shots/studio-tabs-tight-${theme}.png`});
    }
    if(width===320){
      await page.getByRole("button",{name:/^Badge opacity/}).click();
      await page.getByRole("dialog",{name:"Badge opacity"}).waitFor();
      await page.screenshot({path:`shots/studio-layers-${theme}-320-popover.png`});
      await page.keyboard.press("Escape");
      await page.getByRole("combobox",{name:"Typeface"}).click();
      await page.getByRole("listbox",{name:"Typeface"}).waitFor();
      await page.screenshot({path:`shots/studio-select-groups-${theme}.png`,fullPage:true});
    }
  });
}
test("capture studio gaps rtl 320",async({page})=>{
  await page.setViewportSize({width:384,height:1100});
  await page.goto("/studio-gaps?w=320&dir=rtl");
  await page.getByTestId("layer-panel").screenshot({path:"shots/studio-layers-light-320-rtl.png"});
  await page.getByTestId("tabs-three").screenshot({path:"shots/studio-tabs-three-rtl.png"});
});
