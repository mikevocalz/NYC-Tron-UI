import {test,expect} from "playwright/test";

test.beforeEach(async({page})=>{await page.goto("/");});
const scale=page=>page.getByRole("slider",{name:"Layer opacity"});
async function dragFrom(page,locator,moves){
  const box=await locator.boundingBox();
  const x=box.x+box.width/2, y=box.y+box.height/2;
  await page.mouse.move(x,y);await page.mouse.down();
  for(const [dx,dy] of moves)await page.mouse.move(x+dx,y+dy,{steps:4});
  return {x,y};
}

test("a horizontal drag previews and commits once on release",async({page})=>{
  await dragFrom(page,scale(page),[[40,0],[80,0]]);
  await expect(page.getByTestId("preview")).toHaveText("preview 50");
  await expect(page.getByTestId("commits")).toHaveText("commits 0");
  await page.mouse.up();
  await expect(page.getByTestId("value")).toHaveText("value 50");
  await expect(page.getByTestId("commits")).toHaveText("commits 1");
  await expect(scale(page)).toHaveAttribute("aria-valuenow","50");
});

test("moving up switches to fine precision and shows it",async({page})=>{
  await dragFrom(page,scale(page),[[0,-40],[16,-40]]);
  await expect(page.getByText("Fine precision")).toBeVisible();
  await expect(page.getByTestId("preview")).toHaveText("preview 40.2");
  await page.mouse.up();
  await expect(page.getByTestId("value")).toHaveText("value 40.2");
});

test("Escape mid-drag restores the value without committing",async({page})=>{
  await scale(page).focus();
  await dragFrom(page,scale(page),[[80,0]]);
  await expect(page.getByTestId("preview")).not.toHaveText("preview 40");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("preview")).toHaveText("preview 40");
  await page.mouse.up();
  await expect(page.getByTestId("commits")).toHaveText("commits 0");
  await expect(page.getByTestId("value")).toHaveText("value 40");
});

test("arrow keys, buttons and text entry each commit once",async({page})=>{
  await scale(page).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("value")).toHaveText("value 41");
  await page.getByRole("button",{name:"Decrease Layer opacity"}).click();
  await expect(page.getByTestId("value")).toHaveText("value 40");
  const input=page.getByLabel("Layer opacity value");
  await input.fill("72");await input.press("Enter");
  await expect(page.getByTestId("value")).toHaveText("value 72");
  await expect(page.getByTestId("commits")).toHaveText("commits 3");
});

test("disabled scrubber exposes its state and ignores input",async({page})=>{
  const disabled=page.getByRole("slider",{name:"Exposure"});
  await expect(disabled).toHaveAttribute("aria-disabled","true");
  await expect(page.getByRole("button",{name:"Increase Exposure"})).toBeDisabled();
});

test("grab handle reorders on release and Escape cancels",async({page})=>{
  const handle=page.getByLabel("Reorder Background",{exact:true});
  await dragFrom(page,handle,[[0,60],[0,112]]);
  await page.mouse.up();
  await expect(page.getByTestId("order")).toHaveText("order bca");
  await expect(page.getByTestId("handle")).toHaveText("handle 1/0");
  const title=page.getByLabel("Reorder Title",{exact:true});
  await title.focus();
  await dragFrom(page,title,[[0,-60]]);
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(page.getByTestId("order")).toHaveText("order bca");
  await expect(page.getByTestId("handle")).toHaveText("handle 1/1");
});
