import {test} from "playwright/test";
// Review captures of the ribbon, menus, presets and shortcut sheet, not pixel goldens.
const sizes=[["phone",{width:390,height:844}],["tablet",{width:834,height:1194}]];
const ready=page=>page.getByRole("tablist",{name:"Ribbon"}).waitFor();
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`shell commands ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/shell-commands?theme="+theme);
    await ready(page);
    await page.screenshot({path:`shots/shell-commands-${theme}-${name}.png`,fullPage:true});
    await page.getByRole("button",{name:"More Export options"}).click();
    await page.getByRole("menu").waitFor();
    await page.screenshot({path:`shots/shell-commands-${theme}-${name}-split.png`});
    await page.keyboard.press("Escape");
    await page.getByRole("button",{name:"Harbor photo layer"}).click({button:"right"});
    await page.getByRole("menu").waitFor();
    await page.screenshot({path:`shots/shell-commands-${theme}-${name}-context.png`});
    await page.keyboard.press("Escape");
    await page.getByRole("button",{name:"Keyboard shortcuts"}).click();
    await page.getByRole("dialog",{name:"Keyboard shortcuts"}).waitFor();
    await page.getByRole("button",{name:"Change shortcut for Bold"}).click();
    await page.screenshot({path:`shots/shell-commands-${theme}-${name}-hud.png`});
  });
}
test("shell commands rtl phone",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/shell-commands?dir=rtl&theme=dark");
  await ready(page);
  await page.screenshot({path:"shots/shell-commands-rtl-phone.png",fullPage:true});
});
test("shell commands forced colors",async({page})=>{
  await page.emulateMedia({forcedColors:"active"});
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-commands");
  await ready(page);
  await page.screenshot({path:"shots/shell-commands-forced-tablet.png",fullPage:true});
});
test("shell commands apple keycaps",async({page})=>{
  await page.setViewportSize({width:834,height:1194});
  await page.goto("/shell-commands?apple=1&hud=1");
  await page.getByRole("dialog",{name:"Keyboard shortcuts"}).waitFor();
  await page.screenshot({path:"shots/shell-commands-hud-apple.png"});
});
