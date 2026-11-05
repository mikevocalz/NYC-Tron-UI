import {test} from "playwright/test";
// Review captures of the inspector and input controls, not pixel goldens.
const sizes=[["phone",{width:390,height:844}],["tablet",{width:834,height:1194}]];
const ready=page=>page.getByRole("adjustable").or(page.getByRole("slider")).first().waitFor();
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`shell inspector ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/shell-inspector?theme="+theme);
    await ready(page);
    await page.screenshot({path:`shots/shell-inspector-${theme}-${name}.png`,fullPage:true});
    await page.getByRole("slider",{name:"Opacity"}).focus();
    await page.screenshot({path:`shots/shell-inspector-${theme}-${name}-focus.png`});
    await page.getByRole("searchbox",{name:"Search properties"}).fill("alpha");
    await page.screenshot({path:`shots/shell-inspector-${theme}-${name}-search.png`});
    await page.getByRole("searchbox",{name:"Search properties"}).fill("");
    const x=page.getByRole("textbox",{name:"Position X",exact:true});
    await x.click();await x.fill("12mm +");await x.press("Enter");
    await page.screenshot({path:`shots/shell-inspector-${theme}-${name}-error.png`});
  });
}
for(const select of ["none","multiple"])test(`shell inspector ${select} selection`,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/shell-inspector?select="+select);
  await page.getByRole("heading").first().waitFor();
  await page.screenshot({path:`shots/shell-inspector-${select}-phone.png`,fullPage:true});
});
test("shell inspector rtl phone",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/shell-inspector?dir=rtl&theme=dark");
  await ready(page);
  await page.screenshot({path:"shots/shell-inspector-rtl-phone.png",fullPage:true});
});
test("shell inspector forced colors",async({page})=>{
  await page.emulateMedia({forcedColors:"active"});
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-inspector");
  await ready(page);
  await page.screenshot({path:"shots/shell-inspector-forced-tablet.png",fullPage:true});
});
