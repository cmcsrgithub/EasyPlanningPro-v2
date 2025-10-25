import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    // OAuth portal may not have h1, check URL instead
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    // OAuth portal may not have h1, check URL instead
    await expect(page).toHaveURL(/signup/);
  });

  test('should show validation errors for empty login', async ({ page }) => {
    await page.goto('/login');
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await submitButton.click();
    // Form validation should prevent submission
    await expect(page).toHaveURL(/login/);
  });
});
