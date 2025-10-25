import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText(/sign in|login/i);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h1')).toContainText(/sign up|create account/i);
  });

  test('should show validation errors for empty login', async ({ page }) => {
    await page.goto('/login');
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    // Form validation should prevent submission
    await expect(page).toHaveURL(/login/);
  });
});
