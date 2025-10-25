import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/EasyPlanningPro/i);
  });

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have CTA buttons', async ({ page }) => {
    await page.goto('/');
    // Multiple 'Get Started' buttons exist, check the first one
    const getStartedButton = page.getByRole('button', { name: /get started/i }).first();
    await expect(getStartedButton).toBeVisible();
  });
});
