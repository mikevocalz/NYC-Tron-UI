import {test,expect} from "playwright/test";

// Builds a File inside the page and dispatches the drag sequence a browser
// sends for an OS drop: dragenter, dragover, drop.
async function dropFiles(page,testID,files){
  await page.getByTestId(testID).evaluate((zone,files)=>{
    const data=new DataTransfer();
    for(const f of files)data.items.add(new File(["x"],f.name,{type:f.type}));
    for(const type of ["dragenter","dragover","drop"])
      zone.dispatchEvent(new DragEvent(type,{bubbles:true,cancelable:true,dataTransfer:data}));
  },files);
}

test.describe("content and feedback primitives",()=>{
  test.beforeEach(async({page})=>{await page.goto("/primitives");});

  test("the semantic set renders real landmarks, headings, paragraphs and links",async({page})=>{
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main")).toHaveAttribute("data-theme","light");
    await expect(page.getByRole("navigation",{name:"App navigation"})).toBeVisible();
    await expect(page.locator("section")).toHaveCount(6);
    // A header nested in a section is not a second page banner.
    await expect(page.locator("header").first()).not.toHaveAttribute("role",/.+/);
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.locator("h1#notices-heading")).toHaveText("Notices");
    await expect(page.getByRole("heading",{level:2,name:"Badges"})).toBeVisible();
    await expect(page.locator("p")).toContainText(["Every tone, with and without actions."]);
    await expect(page.getByRole("link",{name:/NitroForge/})).toHaveAttribute("href","#/");
    await expect(page.getByRole("link",{name:"Help"})).toHaveAttribute("rel","noopener noreferrer");
    const hidden=page.locator('[data-host-width="phone"]');
    await expect(hidden).toHaveAttribute("hidden","");
    await expect(hidden).toBeHidden();
  });

  test("banners announce politely unless asked, and close from a 44pt control",async({page})=>{
    await expect(page.getByRole("status").filter({hasText:"Saved 18,204 bytes"})).toBeVisible();
    await expect(page.getByRole("alert").filter({hasText:"Couldn't open essay.docx"})).toBeVisible();
    const close=page.getByRole("button",{name:"Dismiss"});
    const box=await close.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    await close.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Word document exported")).toHaveCount(0);
    await expect(page.getByTestId("counts")).toContainText("dismissed 1");
    await page.getByRole("button",{name:"Try again"}).click();
    await expect(page.getByTestId("counts")).toContainText("retries 1");
  });

  test("an error message renders only with a message and is an alert",async({page})=>{
    await expect(page.getByRole("alert").filter({hasText:"Apply your text changes"})).toBeVisible();
    await expect(page.getByRole("alert")).toHaveCount(2);
  });

  test("empty state has a heading and a live exit",async({page})=>{
    await expect(page.getByRole("heading",{name:"No layers"})).toBeVisible();
    await page.getByRole("button",{name:"Add rectangle"}).click();
    await expect(page.getByTestId("counts")).toContainText("exits 1");
  });

  test("drops are filtered by accept and report one enter",async({page})=>{
    await dropFiles(page,"drop-default",[
      {name:"essay.docx",type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"},
      {name:"photo.png",type:"image/png"},{name:"draft.nfd",type:""},
    ]);
    await expect(page.getByTestId("dropped")).toHaveText("dropped essay.docx,draft.nfd");
    await expect(page.getByTestId("counts")).toContainText("entered 1");
  });

  test("the browse path opens the system chooser and delivers files",async({page})=>{
    const chooser=page.waitForEvent("filechooser");
    await page.getByRole("button",{name:"Open",exact:true}).click();
    const picker=await chooser;
    expect(picker.isMultiple()).toBe(false);
    await picker.setFiles({name:"board.nfd",mimeType:"application/octet-stream",buffer:Buffer.from("x")});
    await expect(page.getByTestId("picked")).toHaveText("picked board.nfd");
    // The transient input is removed after the pick.
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    // The default zone's own browse control is keyboard reachable.
    const second=page.waitForEvent("filechooser");
    await page.getByRole("button",{name:"Choose a file"}).focus();
    await page.keyboard.press("Enter");
    await (await second).setFiles({name:"essay.docx",mimeType:"application/octet-stream",buffer:Buffer.from("x")});
    await expect(page.getByTestId("dropped")).toHaveText("dropped essay.docx");
  });

  test("NightScope keeps its subtree dark on a light page",async({page})=>{
    const color=await page.getByTestId("night-text").evaluate(el=>getComputedStyle(el).color);
    expect(color).toBe("rgb(232, 235, 240)");
    const outside=await page.getByRole("heading",{name:"Notices"}).evaluate(el=>getComputedStyle(el).color);
    expect(outside).toBe("rgb(21, 24, 29)");
  });

  test("key/value pairs go two-up only in a wide pane",async({page})=>{
    const tops=async()=>page.getByTestId("kv").getByRole("listitem").evaluateAll(items=>items.map(i=>Math.round(i.getBoundingClientRect().top)));
    await page.setViewportSize({width:834,height:1194});
    await expect.poll(async()=>{const t=await tops();return t[0]===t[1];}).toBe(true);
    await page.setViewportSize({width:390,height:844});
    await expect.poll(async()=>{const t=await tops();return t[1]>t[0];}).toBe(true);
    await expect(page.getByTestId("kv").getByText("Not set")).toBeVisible();
  });
});

test("right-to-left mirrors the banner and record layout",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/primitives?dir=rtl");
  const banner=page.getByRole("status").filter({hasText:"Saved 18,204 bytes"});
  const b=await banner.boundingBox();
  const title=await banner.getByText("Saved 18,204 bytes").boundingBox();
  // The status mark sits at the start edge, which is the right in RTL.
  expect(title.x+title.width).toBeLessThan(b.x+b.width-24);
  await page.screenshot({path:"shots/primitives-rtl-phone.png",fullPage:true});
});

const sizes=[["phone",{width:390,height:844}],["tablet",{width:834,height:1194}]];
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`capture primitives ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/primitives?theme="+theme);
    await page.getByRole("heading",{name:"Notices"}).waitFor();
    await page.screenshot({path:`shots/primitives-${theme}-${name}.png`,fullPage:true});
    await page.getByRole("button",{name:"Dismiss"}).focus();
    await page.keyboard.press("Tab");
    await page.screenshot({path:`shots/primitives-${theme}-${name}-focus.png`});
    // Drag-over state of the default drop zone.
    await page.getByTestId("drop-default").evaluate(zone=>{
      zone.dispatchEvent(new DragEvent("dragenter",{bubbles:true,cancelable:true,dataTransfer:new DataTransfer()}));
      zone.scrollIntoView({block:"center"});
    });
    await page.screenshot({path:`shots/primitives-${theme}-${name}-dragover.png`});
  });
}
test("capture primitives forced colors",async({page})=>{
  await page.emulateMedia({forcedColors:"active"});
  await page.setViewportSize({width:390,height:844});
  await page.goto("/primitives");
  await page.getByRole("heading",{name:"Notices"}).waitFor();
  await page.screenshot({path:"shots/primitives-forced-phone.png",fullPage:true});
});
