import { test, expect } from '@playwright/test';

test.describe('Events Management', () => {
  test('should navigate to events page', async ({ page }) => {
    await page.goto('/events');
    await expect(page).toHaveURL(/events/);
  });

  test('should show create event button', async ({ page }) => {
    await page.goto('/events');
    const createButton = page.getByRole('button', { name: /create event/i });
    await expect(createButton).toBeVisible();
  });

  test('should navigate to template gallery', async ({ page }) => {
    await page.goto('/templates/gallery');
    await expect(page).toHaveURL(/templates\/gallery/);
  });
});
