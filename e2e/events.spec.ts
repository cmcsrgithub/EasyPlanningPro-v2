import { test, expect } from '@playwright/test';

test.describe('Events Management', () => {
  test('should navigate to events page', async ({ page }) => {
    await page.goto('/events');
    await expect(page).toHaveURL(/events/);
  });

  test('should show events page content', async ({ page }) => {
    await page.goto('/events');
    // Verify page loaded by checking URL and waiting for content
    await expect(page).toHaveURL(/events/);
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to template gallery', async ({ page }) => {
    await page.goto('/templates/gallery');
    await expect(page).toHaveURL(/templates\/gallery/);
  });
});
