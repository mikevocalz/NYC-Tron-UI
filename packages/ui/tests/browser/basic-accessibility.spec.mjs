import { test, expect } from 'playwright/test';
test.beforeEach(async ({ page }) => { await page.goto('/basic-accessibility'); });

test('loading state is exposed to the DOM and the action remains disabled until ready', async ({ page }) => {
  const action = page.getByTestId('busy-action');
  await expect(action).toHaveAttribute('aria-busy', 'true');
  await expect(action).toHaveAttribute('aria-disabled', 'true');
  await expect(action).toBeDisabled();
  await page.getByRole('button', { name: 'Finish loading', exact: true }).click();
  await expect(action).toHaveAttribute('aria-busy', 'false');
  await expect(action).toBeEnabled();
  await action.focus(); await page.keyboard.press('Enter');
  await expect(page.getByTestId('fixture-count')).toHaveText('1');
});

test('rail selection and disabled destinations have real DOM states', async ({ page }) => {
  const first = page.getByRole('tab', { name: 'First', exact: true });
  const second = page.getByRole('tab', { name: 'Second', exact: true });
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await expect(second).toHaveAttribute('aria-selected', 'false');
  await expect(page.getByTestId('decorative-rail-icon').locator('..')).toHaveAttribute('aria-hidden', 'true');
  await second.click();
  await expect(first).toHaveAttribute('aria-selected', 'false');
  await expect(second).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tab', { name: 'Disabled destination', exact: true })).toBeDisabled();
});

test('field error and helper descriptions are associated without stale error state', async ({ page }) => {
  const input = page.getByTestId('validated-field');
  await expect(input).toHaveAccessibleName('Project');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveAttribute('aria-describedby', 'validated-description');
  await expect(input).toHaveAccessibleDescription('A project name is required.');
  await page.getByRole('button', { name: 'Clear field error', exact: true }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'false');
  await expect(input).toHaveAccessibleDescription('Use a descriptive name.');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByTestId('disabled-field')).toHaveAttribute('aria-disabled', 'true');
  await expect(page.getByTestId('disabled-field')).toHaveAttribute('readonly', '');
});
