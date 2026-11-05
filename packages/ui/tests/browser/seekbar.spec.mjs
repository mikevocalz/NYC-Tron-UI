import {test,expect} from "playwright/test";

// Guards #27: the frame-step buttons and the timecode sit on one row under the
// slider, as in the Forge original, at phone and tablet widths.
for(const width of [390,834]){
  test(`transport is one row under the slider at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto("/");
    const seek=page.getByTestId("seek");
    const slider=await seek.getByRole("slider").boundingBox();
    const back=await seek.getByRole("button",{name:"−1 frame"}).boundingBox();
    const fwd=await seek.getByRole("button",{name:"+1 frame"}).boundingBox();
    const time=await seek.getByText("00:00:05:00 / 00:00:10:00").boundingBox();
    const mid=b=>b.y+b.height/2;
    for(const b of [back,fwd,time])expect(b.y).toBeGreaterThanOrEqual(slider.y+slider.height);
    expect(Math.abs(mid(back)-mid(fwd))).toBeLessThanOrEqual(1);
    expect(Math.abs(mid(back)-mid(time))).toBeLessThanOrEqual(2);
    expect(back.x+back.width).toBeLessThanOrEqual(time.x);
    expect(time.x+time.width).toBeLessThanOrEqual(fwd.x);
  });
}

test("frame buttons step the controlled frame",async({page})=>{
  await page.goto("/");
  const seek=page.getByTestId("seek");
  await seek.getByRole("button",{name:"+1 frame"}).click();
  await expect(page.getByTestId("frame")).toHaveText("frame 121");
  await expect(seek.getByText("00:00:05:01 / 00:00:10:00")).toBeVisible();
  await seek.getByRole("button",{name:"−1 frame"}).click();
  await seek.getByRole("button",{name:"−1 frame"}).click();
  await expect(page.getByTestId("frame")).toHaveText("frame 119");
});
