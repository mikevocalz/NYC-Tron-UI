import {test} from "playwright/test";
// Review captures of the studio shell layout controls, not pixel goldens.
const sizes=[["phone",{width:390,height:844}],["tablet",{width:834,height:1194}]];
const ready=page=>page.getByRole("toolbar",{name:"Tools"}).waitFor();
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`shell layout ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/shell-layout?theme="+theme);
    await ready(page);
    await page.screenshot({path:`shots/shell-layout-${theme}-${name}.png`,fullPage:true});
    await page.getByRole("button",{name:"Selection: Rectangle marquee"}).focus();
    await page.keyboard.press("ArrowRight");
    await page.getByRole("menu",{name:"Selection tools"}).waitFor();
    await page.screenshot({path:`shots/shell-layout-${theme}-${name}-flyout.png`});
    await page.keyboard.press("Escape");
    await page.getByRole("separator",{name:"Resize reference image"}).focus();
    await page.screenshot({path:`shots/shell-layout-${theme}-${name}-focus.png`,fullPage:true});
  });
}
test("shell layout rtl phone",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/shell-layout?dir=rtl");
  await ready(page);
  await page.screenshot({path:"shots/shell-layout-rtl-phone.png",fullPage:true});
});
test("shell layout rtl tablet",async({page})=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-layout?dir=rtl&theme=dark");
  await ready(page);
  await page.screenshot({path:"shots/shell-layout-rtl-tablet.png",fullPage:true});
});
test("shell layout hinge tablet",async({page})=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-layout?hinge=1");
  await ready(page);
  await page.screenshot({path:"shots/shell-layout-hinge-tablet.png",fullPage:true});
});
test("shell layout forced colors",async({page})=>{
  await page.emulateMedia({forcedColors:"active"});
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-layout");
  await ready(page);
  await page.screenshot({path:"shots/shell-layout-forced-tablet.png",fullPage:true});
});
