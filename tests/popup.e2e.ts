if (!import.meta.vitest) {
  const { test, expect } = await import('@playwright/test');

  test('popup page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=GitHub Settings')).toBeVisible();
  });

  test('saving settings shows success messages', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Save Settings');
    await expect(page.locator('text=GitHub token saved successfully!')).toBeVisible();
    await expect(page.locator('text=Settings saved successfully!')).toBeVisible();
  });
}
