import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to features
    await page.click('text=Features');
    await expect(page).toHaveURL(/features/);
    
    // Navigate to pricing
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/pricing/);
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu should be present
    const mobileMenu = page.locator('[aria-label="Menu"]');
    await expect(mobileMenu).toBeVisible();
  });
});
