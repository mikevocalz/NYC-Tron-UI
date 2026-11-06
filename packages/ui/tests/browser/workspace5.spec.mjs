import {test,expect} from 'playwright/test';
test.beforeEach(async({page})=>{await page.setViewportSize({width:834,height:1194});await page.goto('/workspace5');});
test('workspace changes modes and sizes without remounting its document canvas',async({page})=>{
 await expect(page.getByTestId('canvas-mounts')).toHaveText('Canvas mounts 1');
 await page.getByRole('tab',{name:'Color',exact:true}).click();await expect(page.getByTestId('log')).toContainText('mode color');
 await expect(page.getByTestId('canvas-mounts')).toHaveText('Canvas mounts 1');
 await page.setViewportSize({width:390,height:844});await expect(page.getByTestId('canvas-mounts')).toHaveText('Canvas mounts 1');
 await page.getByRole('tab',{name:'Edit',exact:true}).focus();await page.keyboard.press('Control+2');await expect(page.getByRole('tab',{name:'Color',exact:true})).toHaveAttribute('aria-selected','true');
});
test('presets save, rename validation and delete respect built-in boundaries',async({page})=>{
 await page.getByRole('button',{name:'Workspace preset: Edit',exact:true}).click();
 await expect(page.getByRole('menuitem',{name:/Rename/})).toBeDisabled();
 await page.getByRole('menuitem',{name:'Save layout as new preset…',exact:true}).click();
 await page.getByLabel('Preset name', {exact:true}).fill('My layout');await page.getByRole('button',{name:'Save preset',exact:true}).click();
 await expect(page.getByTestId('log')).toContainText('save My layout');
 await page.getByRole('button',{name:'Workspace preset: My layout',exact:true}).click();await page.getByRole('menuitem',{name:'Delete “My layout”…',exact:true}).click();await page.getByRole('button',{name:'Delete',exact:true}).click();await expect(page.getByTestId('log')).toContainText('delete custom');await expect(page.getByRole('button',{name:'Workspace preset: Custom layout'})).toBeVisible();
});
test('contextual actions overflow and change with selection',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'More actions',exact:true}).click();await expect(page.getByRole('menuitem',{name:/^Lock/})).toBeDisabled();await page.getByRole('menuitem',{name:'Duplicate',exact:true}).click();await expect(page.getByTestId('log')).toContainText('action duplicate');
 await page.getByRole('button',{name:'Select text',exact:true}).click();await expect(page.getByRole('button',{name:'Crop',exact:true})).toHaveCount(0);
});
test('export validates names, unavailable destinations and duplicate submission',async({page})=>{
 await page.getByRole('button',{name:'Export file',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Export file'});await expect(dialog.getByRole('radio',{name:'Share',exact:true})).toBeDisabled();await dialog.getByLabel('File name', {exact:true}).fill('bad/name.nfd');await expect(dialog.getByRole('button',{name:'Export',exact:true})).toBeDisabled();await dialog.getByLabel('File name', {exact:true}).fill('Harbor.nfd');await dialog.getByRole('button',{name:'Export',exact:true}).click();await expect(page.getByTestId('log')).toHaveText('export Harbor.nfd');await expect(dialog.getByRole('button',{name:'Export',exact:true})).toBeDisabled();
});
test('import opens the actual web picker and hands selected files to the host',async({page})=>{
 await page.getByRole('button',{name:'Import file',exact:true}).click();const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Choose file to import',exact:true}).click();await (await chooser).setFiles({name:'Harbor.nfd',mimeType:'application/octet-stream',buffer:Buffer.from('NFD1')});await expect(page.getByTestId('log')).toHaveText('import Harbor.nfd');
});
test('color draft cancel and apply each close once',async({page})=>{
 await page.getByRole('button',{name:'Pick color',exact:true}).click();await expect.poll(()=>page.getByRole('slider',{name:'Saturation and brightness',exact:true}).evaluate(el=>Array.from(el.querySelectorAll('*')).some(child=>getComputedStyle(child).backgroundImage.includes('linear-gradient')))).toBe(true);await page.getByRole('button',{name:'Cancel',exact:true}).click();await expect(page.getByTestId('log')).toContainText('cancel color');await page.getByRole('button',{name:'Pick color',exact:true}).click();await page.getByRole('button',{name:'Apply color',exact:true}).click();await expect(page.getByTestId('log')).toContainText('commit color');
});
test('presenter stroke commits once; Escape cancels and eraser removes one gesture',async({page})=>{
 const overlay=page.getByTestId('ink-overlay');await overlay.scrollIntoViewIfNeeded();const b=await overlay.boundingBox();const x=b.x+80,y=b.y+70;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+90,y+30,{steps:8});await expect(page.getByTestId('stroke-count')).toHaveText('Strokes 0');await page.mouse.up();await expect(page.getByTestId('stroke-count')).toHaveText('Strokes 1');
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+30,y+20,{steps:3});await page.keyboard.press('Escape');await page.mouse.up();await expect(page.getByTestId('stroke-count')).toHaveText('Strokes 1');
 await page.getByRole('button',{name:'Eraser',exact:true}).click();await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+70,y+25,{steps:5});await page.mouse.up();await expect(page.getByTestId('stroke-count')).toHaveText('Strokes 0');await expect(page.getByTestId('log')).toContainText('erase 1');
});
test('phone and RTL remain contained',async({page})=>{for(const dir of ['ltr','rtl']){await page.setViewportSize({width:390,height:844});await page.goto('/workspace5?dir='+dir);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}});
