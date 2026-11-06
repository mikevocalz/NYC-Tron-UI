import {test,expect} from 'playwright/test';
test('disabling a focused numeric field discards its draft before blur',async({page})=>{
 await page.goto('/unit-boundary');const field=page.getByRole('textbox',{name:'Scoped numeric value',exact:true});await field.fill('42');await page.getByRole('button',{name:'Toggle field disabled',exact:true}).evaluate(button=>button.click());await field.blur();await expect(page.getByTestId('unit-state')).toContainText('"commits":0');await page.getByRole('button',{name:'Toggle field disabled',exact:true}).click();await expect(field).toHaveValue('0');
});
test('changing numeric document scope drops a draft even when the committed value is unchanged',async({page})=>{
 await page.goto('/unit-boundary');const field=page.getByRole('textbox',{name:'Scoped numeric value',exact:true});await field.fill('42');await page.getByRole('button',{name:'Change numeric document',exact:true}).evaluate(button=>button.click());await field.blur();await expect(page.getByTestId('unit-state')).toContainText('"scope":"b","disabled":false,"value":0,"commits":0');await expect(field).toHaveValue('0');
});
