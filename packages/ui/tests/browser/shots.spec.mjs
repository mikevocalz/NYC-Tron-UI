import {test} from "playwright/test";
// Review captures, not pixel goldens: CI fonts differ from local ones.
const sizes=[["phone",{width:390,height:844}],["tablet",{width:834,height:1194}]];
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`capture ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/?theme="+theme);
    const scale=page.getByRole("slider",{name:"Layer opacity"});
    await page.screenshot({path:`shots/${theme}-${name}.png`,fullPage:true});
    await scale.focus();
    await page.screenshot({path:`shots/${theme}-${name}-focus.png`});
    const box=await scale.boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
    await page.mouse.move(box.x+box.width/2+24,box.y+box.height/2-40,{steps:4});
    await page.screenshot({path:`shots/${theme}-${name}-drag.png`});
    await page.mouse.up();
  });
  test(`capture seek bar ${theme} ${name}`,async({page})=>{
    // @expo/ui Text follows the OS scheme, so match it to the app theme.
    await page.emulateMedia({colorScheme:theme});
    await page.setViewportSize(size);
    await page.goto("/?theme="+theme);
    await page.getByTestId("seek").screenshot({path:`shots/${theme}-${name}-seek.png`});
  });
}
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`capture layers ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/?theme="+theme);
    const stack=page.getByLabel("Layers",{exact:true});
    await stack.scrollIntoViewIfNeeded();
    await stack.screenshot({path:`shots/layers-${theme}-${name}.png`});
    await page.getByRole("button",{name:"Remove Badge"}).focus();
    await stack.screenshot({path:`shots/layers-${theme}-${name}-remove-focus.png`});
  });
}
test("capture layers rtl phone",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/?dir=rtl");
  const stack=page.getByLabel("Layers",{exact:true});
  await stack.scrollIntoViewIfNeeded();
  await stack.screenshot({path:"shots/layers-light-phone-rtl.png"});
});
test("capture forced colors",async({page})=>{
  await page.emulateMedia({forcedColors:"active"});
  await page.setViewportSize({width:390,height:844});
  await page.goto("/");
  await page.getByRole("slider",{name:"Layer opacity"}).waitFor();
  await page.screenshot({path:"shots/forced-phone.png",fullPage:true});
});
