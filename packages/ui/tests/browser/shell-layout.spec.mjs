import {test,expect} from "playwright/test";

const open=async(page,query="")=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-layout"+query);
  await page.getByRole("toolbar",{name:"Tools"}).waitFor();
};
const divider=page=>page.getByRole("separator",{name:"Resize reference image"});

test("splitter keys step, jump to limits and commit once each",async({page})=>{
  await open(page);
  await divider(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("split")).toHaveText("split 336 preview 336 commits 1");
  await expect(divider(page)).toHaveAttribute("aria-valuenow","336");
  await page.keyboard.press("Home");
  await expect(page.getByTestId("split")).toHaveText(/^split 120 .* commits 2$/);
  await page.keyboard.press("End");
  await expect(divider(page)).toHaveAttribute("aria-valuenow",await divider(page).getAttribute("aria-valuemax"));
});

test("splitter drag previews, commits on release, and Escape cancels",async({page})=>{
  await open(page);
  const box=await divider(page).boundingBox();
  const x=box.x+box.width/2,y=box.y+box.height/2;
  await page.mouse.move(x,y);await page.mouse.down();
  await page.mouse.move(x+60,y,{steps:5});
  await expect(page.getByTestId("split")).toHaveText("split 320 preview 380 commits 0");
  await page.mouse.up();
  await expect(page.getByTestId("split")).toHaveText("split 380 preview 380 commits 1");
  await divider(page).focus();
  const again=await divider(page).boundingBox();
  await page.mouse.move(again.x+again.width/2,y);await page.mouse.down();
  await page.mouse.move(again.x+again.width/2-80,y,{steps:5});
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(page.getByTestId("split")).toHaveText("split 380 preview 380 commits 1");
});

test("the divider seats on a hinge and steps clear of it",async({page})=>{
  await open(page,"?hinge=1");
  await expect(divider(page)).toHaveAttribute("aria-valuenow","316");
  await divider(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("split")).toHaveText(/^split 356 /);
  // One step back stops beside the hinge; the next one seats on it again.
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("split")).toHaveText(/^split 340 /);
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("split")).toHaveText(/^split 316 /);
});

test("in RTL the start pane is on the right and ArrowLeft grows it",async({page})=>{
  await open(page,"?dir=rtl");
  const reference=await page.getByText("Reference",{exact:true}).boundingBox();
  const canvas=await page.getByText("Canvas",{exact:true}).boundingBox();
  expect(reference.x).toBeGreaterThan(canvas.x);
  await divider(page).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("split")).toHaveText(/^split 336 /);
});

test("document tabs move focus, reorder, close and announce unsaved changes",async({page})=>{
  await open(page);
  const poster=page.getByRole("tab",{name:"Harbor poster.psd, unsaved changes"});
  await expect(poster).toHaveAttribute("aria-selected","true");
  await poster.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("tabs")).toHaveText("tabs poster,logo,scan,grid active logo closed 0");
  await expect(page.getByRole("tab",{name:"Logo mark.svg"})).toBeFocused();
  await page.keyboard.press("Control+Shift+ArrowRight");
  await expect(page.getByTestId("tabs")).toHaveText("tabs poster,scan,logo,grid active logo closed 0");
  await page.keyboard.press("Delete");
  await expect(page.getByTestId("tabs")).toHaveText("tabs poster,scan,grid active grid closed 1");
  await page.getByRole("button",{name:"Close Archive scan 1931.tif"}).click();
  await expect(page.getByTestId("tabs")).toHaveText("tabs poster,grid active grid closed 2");
});

test("tool rail selects tools and opens a variant flyout from the keyboard",async({page})=>{
  await open(page);
  const move=page.getByRole("button",{name:"Move"});
  await expect(move).toHaveAttribute("aria-pressed","true");
  await move.focus();
  await page.keyboard.press("ArrowDown");
  const select=page.getByRole("button",{name:"Selection: Rectangle marquee"});
  await expect(select).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("menuitem",{name:/Lasso/}).click();
  await expect(page.getByTestId("tool")).toHaveText("tool lasso");
  await expect(page.getByRole("button",{name:"Selection: Lasso"})).toHaveAttribute("aria-pressed","true");
  await expect(page.getByRole("button",{name:"Crop"})).toBeDisabled();
});

test("dock stacks switch tabs and move panels through the options menu",async({page})=>{
  await open(page);
  await page.getByRole("tab",{name:"Channels"}).click();
  await expect(page.getByText("Green",{exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Options for Channels"}).click();
  await page.getByRole("menuitem",{name:"Move to right dock"}).click();
  await expect(page.getByTestId("dock")).toHaveText("dock left layers right properties+channels floating -");
  await page.getByRole("button",{name:"Options for Layers"}).click();
  await page.getByRole("menuitem",{name:"Float"}).click();
  await expect(page.getByTestId("dock")).toHaveText("dock left - right properties+channels floating layers");
  await expect(page.getByRole("region",{name:"Layers"})).toBeVisible();
  await page.getByRole("button",{name:"Options for Layers"}).click();
  await page.getByRole("menuitem",{name:"Move to left dock"}).click();
  await expect(page.getByTestId("dock")).toHaveText("dock left layers right properties+channels floating -");
});

test("dragging a floating panel's grip onto an edge docks it",async({page})=>{
  await open(page);
  await page.getByRole("button",{name:"Options for Properties"}).click();
  await page.getByRole("menuitem",{name:"Float"}).click();
  await expect(page.getByTestId("dock")).toHaveText("dock left layers+channels right - floating properties");
  const grip=await page.getByLabel("Move Properties").boundingBox();
  const dock=await page.getByLabel("Workspace").boundingBox();
  await page.mouse.move(grip.x+grip.width/2,grip.y+grip.height/2);await page.mouse.down();
  await page.mouse.move(grip.x+20,grip.y+20,{steps:3});
  await page.mouse.move(dock.x+dock.width-30,grip.y+120,{steps:6});
  await page.mouse.up();
  await expect(page.getByTestId("dock")).toHaveText("dock left layers+channels right properties floating -");
});

test("status bar zoom steps, zoom presets and unit menu commit",async({page})=>{
  await open(page);
  await page.getByRole("button",{name:"Zoom in"}).click();
  await expect(page.getByTestId("status")).toHaveText("zoom 200 units px");
  await page.getByRole("button",{name:"Zoom 200%"}).click();
  await page.getByRole("menuitem",{name:"50%"}).click();
  await expect(page.getByTestId("status")).toHaveText("zoom 50 units px");
  await page.getByRole("button",{name:"Units: Pixels"}).click();
  await page.getByRole("menuitem",{name:/Millimeters/}).click();
  await expect(page.getByTestId("status")).toHaveText("zoom 50 units mm");
  await expect(page.getByRole("progressbar",{name:"Exporting preview"})).toHaveAttribute("aria-valuenow","42");
});

test("phone width merges every panel into one stack under the workspace",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/shell-layout");
  const tabs=page.getByRole("tablist",{name:"Panels"}).getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await page.getByRole("tab",{name:"Layers"}).click();
  await expect(page.getByText("Paper texture")).toBeVisible();
});

test("every shell control is at least 44 by 44 points",async({page})=>{
  await open(page);
  const targets=page.locator("[role=tab],[role=button],[role=separator]");
  const n=await targets.count();
  expect(n).toBeGreaterThan(15);
  for(let i=0;i<n;i++){
    const t=targets.nth(i);
    if(!await t.isVisible())continue;
    const box=await t.boundingBox();
    expect(box.height,await t.getAttribute("aria-label")??"").toBeGreaterThanOrEqual(44);
    expect(box.width,await t.getAttribute("aria-label")??"").toBeGreaterThanOrEqual(44);
  }
});
