if (!import.meta.vitest) {
  const { test, expect } = await import('@playwright/test');
  test('popup page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=GitHub Settings')).toBeVisible();
  });
}
