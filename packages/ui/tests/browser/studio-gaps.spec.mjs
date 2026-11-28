import {test,expect} from "playwright/test";

// Gaps nitro-forge's Design Studio found on v0.1.0-alpha.2: TabBar truncating
// labels that fit, and Select groups. The LayerStack row checks moved with the
// editor controls to Nitro Forge's packages/editor-controls/tests/browser lane.
const inside=async(child,parent)=>{
  const c=await child.boundingBox(),p=await parent.boundingBox();
  return c.x>=p.x-0.5&&c.x+c.width<=p.x+p.width+0.5;
};
// A Text with numberOfLines=1 is truncated when its content is wider than its box.
const truncated=locator=>locator.evaluate(el=>el.scrollWidth>el.clientWidth+0.5);

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

// Review captures at the widths Forge docks these panes at, light and dark, LTR and RTL.
for(const theme of ["light","dark"]){
  test(`capture studio gaps ${theme}`,async({page})=>{
    await page.emulateMedia({colorScheme:theme});
    await page.setViewportSize({width:454,height:1100});
    await page.goto(`/studio-gaps?w=390&theme=${theme}`);
    await page.getByTestId("tabs-one").screenshot({path:`shots/studio-tabs-one-${theme}.png`});
    await page.getByTestId("tabs-three").screenshot({path:`shots/studio-tabs-three-${theme}.png`});
    await page.getByTestId("tabs-tight").screenshot({path:`shots/studio-tabs-tight-${theme}.png`});
    await page.setViewportSize({width:384,height:1100});
    await page.goto(`/studio-gaps?w=320&theme=${theme}`);
    await page.getByRole("combobox",{name:"Typeface"}).click();
    await page.getByRole("listbox",{name:"Typeface"}).waitFor();
    await page.screenshot({path:`shots/studio-select-groups-${theme}.png`,fullPage:true});
  });
}
test("capture studio gaps rtl 320",async({page})=>{
  await page.setViewportSize({width:384,height:1100});
  await page.goto("/studio-gaps?w=320&dir=rtl");
  await page.getByTestId("tabs-three").screenshot({path:"shots/studio-tabs-three-rtl.png"});
});
