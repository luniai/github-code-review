import { test, expect } from '@playwright/test';

test('popup page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=GitHub Settings')).toBeVisible();
});
