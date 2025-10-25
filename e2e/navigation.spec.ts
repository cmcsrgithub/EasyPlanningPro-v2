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

  test('should load on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify page loads successfully on mobile
    await expect(page).toHaveTitle(/EasyPlanningPro/i);
    await page.waitForLoadState('networkidle');
  });
});
