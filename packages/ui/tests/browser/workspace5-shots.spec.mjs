import {test,expect} from 'playwright/test';
for(const theme of ['light','dark'])for(const [size,width,height] of [['phone',390,844],['tablet',834,1194]])test(`workspace5 capture ${theme} ${size}`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/workspace5?theme='+theme);await expect(page.getByTestId('canvas-mounts')).toHaveText('Canvas mounts 1');await page.screenshot({path:`shots/workspace5-${theme}-${size}.png`,fullPage:true});
 await page.getByRole('button',{name:'Export file',exact:true}).click();await page.screenshot({path:`shots/workspace5-${theme}-${size}-transfer.png`});
});
test('workspace5 RTL capture',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/workspace5?dir=rtl');await page.screenshot({path:'shots/workspace5-rtl-phone.png',fullPage:true});});
