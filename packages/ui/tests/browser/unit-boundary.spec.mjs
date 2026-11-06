import {test,expect} from 'playwright/test';
test('disabling a focused numeric field discards its draft before blur',async({page})=>{
 await page.goto('/unit-boundary');const field=page.getByRole('textbox',{name:'Scoped numeric value',exact:true});await field.fill('42');await page.getByRole('button',{name:'Toggle field disabled',exact:true}).evaluate(button=>button.click());await field.blur();await expect(page.getByTestId('unit-state')).toContainText('"commits":0');await page.getByRole('button',{name:'Toggle field disabled',exact:true}).click();await expect(field).toHaveValue('0');
});
test('changing numeric document scope drops a draft even when the committed value is unchanged',async({page})=>{
 await page.goto('/unit-boundary');const field=page.getByRole('textbox',{name:'Scoped numeric value',exact:true});await field.fill('42');await page.getByRole('button',{name:'Change numeric document',exact:true}).evaluate(button=>button.click());await field.blur();await expect(page.getByTestId('unit-state')).toContainText('"scope":"b","disabled":false,"value":0,"commits":0');await expect(field).toHaveValue('0');
});


test('focus/blur and Enter without editing preserve full precision behind rounded display text',async({page})=>{
 await page.goto('/unit-boundary?precise=1');const field=page.getByRole('textbox',{name:'Scoped numeric value',exact:true});await expect(field).toHaveValue('1.23');await field.focus();await field.blur();await field.focus();await field.press('Enter');await expect(page.getByTestId('unit-state')).toContainText('"value":1.234567890123,"commits":0');
});
test('arrow stepping starts from a valid typed draft and commits once',async({page})=>{
 await page.goto('/unit-boundary');const field=page.getByRole('textbox',{name:'Scoped numeric value',exact:true});await field.fill('40 + 2');await field.press('ArrowUp');await field.blur();await expect(page.getByTestId('unit-state')).toContainText('"value":43,"commits":1');
});
