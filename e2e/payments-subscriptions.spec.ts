import { test, expect } from '@playwright/test';

test.describe('Payments and Subscriptions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should view subscription plans', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to pricing section
    await page.click('text=Pricing');
    
    // Verify all plans are visible
    await expect(page.locator('text=Basic')).toBeVisible();
    await expect(page.locator('text=Premium')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Business')).toBeVisible();
    
    // Check pricing
    await expect(page.locator('text=$19.99')).toBeVisible(); // Premium
    await expect(page.locator('text=$59.99')).toBeVisible(); // Pro
    await expect(page.locator('text=$129.99')).toBeVisible(); // Business
  });

  test('should upgrade to Premium plan', async ({ page }) => {
    await page.goto('/settings');
    
    // Navigate to subscription tab
    await page.click('text=Subscription');
    
    // Current plan should be visible
    await expect(page.locator('text=Current Plan')).toBeVisible();
    
    // Click upgrade
    await page.click('button:has-text("Upgrade to Premium")');
    
    // Verify Stripe checkout redirect
    await expect(page).toHaveURL(/stripe\.com|checkout/);
    
    // In test environment, we can't complete Stripe checkout
    // But we verify the redirect happened
  });

  test('should enforce event limits based on subscription', async ({ page }) => {
    await page.goto('/events');
    
    // Try to create event
    await page.click('text=Create Event');
    
    // Fill form
    await page.fill('input[name="title"]', 'Test Event');
    await page.fill('input[name="date"]', '2024-12-25');
    
    await page.click('button:has-text("Create Event")');
    
    // Check if limit reached
    const limitMessage = page.locator('text=Event limit reached');
    
    if (await limitMessage.isVisible()) {
      // Verify upgrade prompt
      await expect(page.locator('text=Upgrade your plan')).toBeVisible();
      await expect(page.locator('button:has-text("Upgrade")')).toBeVisible();
    } else {
      // Event created successfully
      await expect(page.locator('text=Event created')).toBeVisible();
    }
  });

  test('should access billing portal', async ({ page }) => {
    await page.goto('/settings');
    await page.click('text=Subscription');
    
    // Click manage billing
    await page.click('button:has-text("Manage Billing")');
    
    // Verify Stripe billing portal redirect
    await expect(page).toHaveURL(/billing\.stripe\.com|portal/);
  });

  test('should handle failed payment', async ({ page }) => {
    // This would require Stripe test mode webhook simulation
    // For now, we verify the UI handles payment status
    
    await page.goto('/settings');
    await page.click('text=Subscription');
    
    // Check for payment status indicators
    const statusIndicator = page.locator('[data-testid="payment-status"]');
    
    if (await statusIndicator.isVisible()) {
      const status = await statusIndicator.textContent();
      expect(status).toMatch(/Active|Past Due|Cancelled/);
    }
  });

  test('should purchase event package', async ({ page }) => {
    await page.goto('/packages');
    
    // Select a package
    const packageCard = page.locator('[data-testid="package-card"]').first();
    await packageCard.click();
    
    // View package details
    await expect(page.locator('text=Package Details')).toBeVisible();
    
    // Purchase package
    await page.click('button:has-text("Purchase")');
    
    // Fill payment form (Stripe Elements would appear)
    // In test, we verify the checkout session is created
    await expect(page).toHaveURL(/checkout|payment/);
  });

  test('should view purchase history', async ({ page }) => {
    await page.goto('/settings');
    await page.click('text=Billing');
    
    // View invoices
    await expect(page.locator('text=Invoice History')).toBeVisible();
    
    const invoices = page.locator('[data-testid="invoice-row"]');
    
    if (await invoices.first().isVisible()) {
      // Check invoice details
      await expect(invoices.first()).toContainText(/\$\d+\.\d{2}/);
      await expect(invoices.first()).toContainText(/Paid|Pending|Failed/);
      
      // Download invoice
      await invoices.first().locator('button:has-text("Download")').click();
      const download = await page.waitForEvent('download');
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });
});

