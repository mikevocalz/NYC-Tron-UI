import {test,expect} from "playwright/test";

// Rendered review captures for the web overlays in both InFraX themes at a
// phone and a tablet width. The assertions keep every surface inside the
// viewport; the PNGs are uploaded by CI for a person to look at.
const sizes=[{name:"phone",width:390,height:844},{name:"tablet",width:820,height:1180}];
const themes=["light","dark"];
const overlays=[
  {name:"popover",open:"Open popover",surface:page=>page.getByRole("dialog",{name:"Layer settings"})},
  {name:"commands",open:"Open commands",surface:page=>page.getByRole("menu",{name:"Clipboard"})},
  {name:"palette",open:"Open palette",surface:page=>page.getByRole("dialog",{name:"Command palette"}),
    after:async page=>{await page.keyboard.type("op");}},
  {name:"tooltip",open:"Save",surface:page=>page.getByRole("tooltip"),focusOnly:true},
  {name:"trigger-popover",open:"Stroke width",surface:page=>page.getByRole("dialog",{name:"Stroke width"})},
];

for(const size of sizes)for(const theme of themes)for(const overlay of overlays){
  test(`${overlay.name} renders inside the viewport (${theme}, ${size.name})`,async({page},info)=>{
    await page.setViewportSize({width:size.width,height:size.height});
    await page.goto(theme==="dark"?"/?theme=dark":"/");
    const opener=page.getByRole("button",{name:overlay.open,exact:true});
    await opener.focus();
    if(!overlay.focusOnly)await page.keyboard.press("Enter");
    const surface=overlay.surface(page);
    await expect(surface).toBeVisible();
    if(overlay.after)await overlay.after(page);
    const box=await surface.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x+box.width).toBeLessThanOrEqual(size.width);
    expect(box.y+box.height).toBeLessThanOrEqual(size.height);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
    expect(overflow).toBe(false);
    await page.screenshot({path:info.outputPath(`${overlay.name}-${theme}-${size.name}.png`)});
  });
}
