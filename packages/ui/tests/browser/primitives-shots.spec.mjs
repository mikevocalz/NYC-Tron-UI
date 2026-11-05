import {test,expect} from "playwright/test";
// Review captures of the studio primitives in the InFraX theme, not goldens.
const sizes=[["phone",{width:390,height:844}],["tablet",{width:834,height:1194}]];
for(const theme of ["light","dark"])for(const [name,size] of sizes){
  test(`primitives ${theme} ${name}`,async({page})=>{
    await page.setViewportSize(size);
    await page.goto("/primitives?theme="+theme);
    await page.getByRole("radiogroup",{name:"Dock position for Outline"}).waitFor();
    await page.screenshot({path:`shots/primitives-${theme}-${name}.png`,fullPage:true});
    await page.getByRole("combobox",{name:"Body font"}).click();
    await expect(page.getByRole("listbox",{name:"Body font"})).toBeVisible();
    await page.screenshot({path:`shots/primitives-${theme}-${name}-select-open.png`,fullPage:true});
    await page.keyboard.press("Escape");
    await page.getByRole("radio",{name:"Left"}).focus();
    await page.screenshot({path:`shots/primitives-${theme}-${name}-focus.png`});
  });
}
test("primitives rtl phone",async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto("/primitives?dir=rtl");
  await page.getByRole("radiogroup",{name:"Dock position for Outline"}).waitFor();
  await page.screenshot({path:"shots/primitives-rtl-phone.png",fullPage:true});
});
test("primitives forced colors",async({page})=>{
  await page.emulateMedia({forcedColors:"active"});
  await page.setViewportSize({width:390,height:844});
  await page.goto("/primitives");
  await page.getByRole("radiogroup",{name:"Dock position for Outline"}).waitFor();
  await page.screenshot({path:"shots/primitives-forced-phone.png",fullPage:true});
});
