import {test,expect} from 'playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';

// Drawn title-bar controls on a host with no native chrome. Every command goes
// through @nyc-tron/core/window-chrome into the window-lifecycle registry; the
// receipt records the registry before and after each step.
const registry=async page=>JSON.parse(await page.getByTestId('registry').textContent());
const status=(reg,id)=>reg.windows.find(w=>w.id===id)?.status??'closed';
const revision=()=>{
  if(process.env.GITHUB_SHA)return process.env.GITHUB_SHA;
  try{return execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{return 'unknown';}
};

const layouts=[
  {id:'mac',layout:'macos',title:'Q3 report',close:'Close window',minimize:'Minimize window',zoom:'Zoom window',restore:'Restore window'},
  {id:'win',layout:'windows',title:'Budget sheet',close:'Close',minimize:'Minimize',zoom:'Maximize',restore:'Restore'},
];

test('drawn title bars run close, minimize and restore through the registry, with a close guard that cancels and one that proceeds',async({page})=>{
  await page.goto('/window-chrome');
  await mkdir('shots',{recursive:true});
  const receipt={schemaVersion:1,suite:'ui-browser window-chrome',sourceRevision:revision(),capturedAt:new Date().toISOString(),
    browser:page.context().browser()?.version()??'unknown',host:'createPageWindowHost (no native chrome)',layouts:{}};
  for(const l of layouts){
    const bar=page.getByTestId(`titlebar-${l.id}`);
    const steps=[];
    const step=async(name,action,check)=>{
      const before=await registry(page);await action();await expect.poll(async()=>check(await registry(page))).toBe(true);
      steps.push({step:name,before:{status:status(before,l.id),focusedId:before.focusedId},after:await registry(page).then(r=>({status:status(r,l.id),focusedId:r.focusedId,zoomed:r.zoomed.includes(l.id)}))});
    };
    // Order and names: leading controls in macos, trailing in windows.
    const names=await bar.getByRole('button').evaluateAll(els=>els.map(e=>e.getAttribute('aria-label')));
    expect(names).toEqual(l.layout==='macos'?[l.close,l.minimize,l.zoom]:[l.minimize,l.zoom,l.close]);
    for(const name of names){const box=await bar.getByRole('button',{name,exact:true}).boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);}
    await expect(bar.getByRole('heading',{name:`${l.title}, edited`})).toBeVisible();
    await page.screenshot({path:`shots/window-chrome-${l.layout}-rest.png`,clip:await page.getByTestId(`window-${l.id}`).boundingBox()});

    // Keyboard: focus reaches the close control and Enter activates it. Unsaved -> the guard cancels.
    const close=bar.getByRole('button',{name:l.close,exact:true});
    await close.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    const ring=await close.evaluate(el=>getComputedStyle(el).boxShadow);
    expect(ring).not.toBe('none');
    await page.screenshot({path:`shots/window-chrome-${l.layout}-focus.png`,clip:await page.getByTestId(`window-${l.id}`).boundingBox()});
    await step('close-guard-cancels',()=>page.keyboard.press('Enter'),r=>r.log.includes(`${l.id}:close:vetoed`)&&status(r,l.id)==='open');
    expect((await registry(page)).log).toContain(`guard:${l.id}:cancel`);
    await expect(bar.getByText('Window not closed.')).toHaveCount(1);

    await step('zoom',()=>bar.getByRole('button',{name:l.zoom,exact:true}).click(),r=>r.zoomed.includes(l.id));
    if(l.layout==='windows')await expect(bar.getByRole('button',{name:'Restore down',exact:true})).toBeVisible();
    await step('unzoom',()=>bar.getByRole('button',{name:l.layout==='windows'?'Restore down':l.zoom,exact:true}).click(),r=>!r.zoomed.includes(l.id));

    await step('minimize',()=>bar.getByRole('button',{name:l.minimize,exact:true}).click(),r=>status(r,l.id)==='minimized');
    await expect(bar.getByRole('button')).toHaveCount(1);
    await page.screenshot({path:`shots/window-chrome-${l.layout}-minimized.png`,clip:await page.getByTestId(`window-${l.id}`).boundingBox()});
    const restore=bar.getByRole('button',{name:l.restore,exact:true});
    await restore.focus();
    await step('restore',()=>page.keyboard.press(' '),r=>status(r,l.id)==='open'&&r.focusedId===l.id);

    await page.getByRole('button',{name:`Save ${l.title}`,exact:true}).click();
    await expect(bar.getByRole('heading',{name:l.title,exact:true})).toBeVisible();
    await step('close-guard-proceeds',()=>bar.getByRole('button',{name:l.close,exact:true}).click(),r=>status(r,l.id)==='closed');
    expect((await registry(page)).log).toContain(`guard:${l.id}:proceed`);
    await expect(page.getByTestId(`gone-${l.id}`)).toBeVisible();
    receipt.layouts[l.layout]={windowId:l.id,controlOrder:names,steps};
  }
  receipt.finalRegistry=await registry(page);
  expect(receipt.finalRegistry.windows.filter(w=>w.id!=='pad')).toEqual([]);
  receipt.result='passed';
  await writeFile('shots/window-chrome-receipt.json',JSON.stringify(receipt,null,2)+'\n');
});

test('drawn glyph strokes take their colour from the app text-muted token',async({page})=>{
  await page.goto('/window-chrome');
  const bar=page.getByTestId('titlebar-win');
  // Glyph strokes take their colour from the app's text-muted token.
  const stroke=await bar.getByRole('button',{name:'Minimize',exact:true}).evaluate(el=>[...el.querySelectorAll('div')].map(d=>getComputedStyle(d)).find(c=>parseFloat(c.borderTopWidth)>0).borderTopColor);
  const muted=await page.evaluate(()=>{const p=document.createElement('div');p.style.color='var(--color-text-muted)';document.body.append(p);const c=getComputedStyle(p).color;p.remove();return c;});
  expect(stroke).toBe(muted);
});

test('native mode draws no controls and reserves the system inset, as iPadOS window controls need',async({page})=>{
  await page.goto('/window-chrome');
  const bar=page.getByTestId('titlebar-pad');
  await expect(bar.getByRole('button')).toHaveCount(0);
  const geometry=await bar.evaluate(el=>{const c=getComputedStyle(el);return {start:parseFloat(c.paddingLeft),end:parseFloat(c.paddingRight),height:el.getBoundingClientRect().height};});
  expect(geometry).toEqual({start:94,end:0,height:52});
  const title=await bar.getByRole('heading',{name:'Sketchbook',exact:true}).boundingBox();
  const box=await bar.boundingBox();
  expect(title.x-box.x).toBeGreaterThanOrEqual(94);
  await mkdir('shots',{recursive:true});
  await page.screenshot({path:'shots/window-chrome-native-inset.png',clip:await page.getByTestId('window-pad').boundingBox()});
});
