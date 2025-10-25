import { test, expect } from '@playwright/test';

test.describe('Donations Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Assume user is logged in
  });

  test('should display donations page', async ({ page }) => {
    await page.goto('/donations');
    
    await expect(page.locator('h1')).toContainText('Donations');
    await expect(page.locator('[data-testid="donations-list"]')).toBeVisible();
  });

  test('should create a donation campaign', async ({ page }) => {
    await page.goto('/donations');
    
    // Click create campaign button
    await page.click('[data-testid="create-campaign-btn"]');
    
    // Fill campaign form
    await page.fill('[name="title"]', 'Community Center Fundraiser');
    await page.fill('[name="description"]', 'Help us build a new community center');
    await page.fill('[name="goalAmount"]', '50000');
    await page.fill('[name="endDate"]', '2024-12-31');
    
    // Submit form
    await page.click('[data-testid="submit-campaign-btn"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Campaign created successfully');
    await expect(page.locator('text=Community Center Fundraiser')).toBeVisible();
  });

  test('should make a donation to campaign', async ({ page }) => {
    await page.goto('/donations');
    
    // Click on first campaign
    await page.click('[data-testid="campaign-item"]:first-child');
    
    // Click donate button
    await page.click('[data-testid="donate-btn"]');
    
    // Fill donation form
    await page.fill('[name="amount"]', '100');
    await page.fill('[name="donorName"]', 'John Doe');
    await page.fill('[name="donorEmail"]', 'john@example.com');
    await page.check('[name="anonymous"]'); // Make donation anonymous
    
    // Submit donation
    await page.click('[data-testid="submit-donation-btn"]');
    
    // Verify success (would redirect to payment in real scenario)
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Thank you for your donation');
  });

  test('should display donation progress bar', async ({ page }) => {
    await page.goto('/donations');
    
    const campaign = page.locator('[data-testid="campaign-item"]').first();
    
    // Verify progress bar exists
    await expect(campaign.locator('[data-testid="progress-bar"]')).toBeVisible();
    
    // Verify goal and current amount are displayed
    await expect(campaign.locator('[data-testid="current-amount"]')).toBeVisible();
    await expect(campaign.locator('[data-testid="goal-amount"]')).toBeVisible();
  });

  test('should filter donations by status (Active, Completed, Upcoming)', async ({ page }) => {
    await page.goto('/donations');
    
    // Filter by active campaigns
    await page.click('[data-testid="filter-active"]');
    
    // Verify only active campaigns are shown
    const campaigns = page.locator('[data-testid="campaign-item"]');
    const count = await campaigns.count();
    
    for (let i = 0; i < count; i++) {
      const status = await campaigns.nth(i).locator('[data-testid="campaign-status"]').textContent();
      expect(status).toContain('Active');
    }
  });

  test('should display top donors list', async ({ page }) => {
    await page.goto('/donations');
    
    // Click on first campaign
    await page.click('[data-testid="campaign-item"]:first-child');
    
    // Verify top donors section
    await expect(page.locator('[data-testid="top-donors"]')).toBeVisible();
    
    // Verify donor items
    const donors = page.locator('[data-testid="donor-item"]');
    const count = await donors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should edit donation campaign', async ({ page }) => {
    await page.goto('/donations');
    
    // Click edit on first campaign
    await page.click('[data-testid="campaign-item"]:first-child [data-testid="edit-campaign-btn"]');
    
    // Update campaign details
    await page.fill('[name="title"]', 'Updated Campaign Title');
    await page.fill('[name="goalAmount"]', '75000');
    
    // Submit changes
    await page.click('[data-testid="submit-campaign-btn"]');
    
    // Verify update
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Campaign updated successfully');
    await expect(page.locator('text=Updated Campaign Title')).toBeVisible();
  });

  test('should close donation campaign', async ({ page }) => {
    await page.goto('/donations');
    
    // Click on first campaign
    await page.click('[data-testid="campaign-item"]:first-child');
    
    // Click close campaign button
    await page.click('[data-testid="close-campaign-btn"]');
    
    // Confirm closure
    await page.click('[data-testid="confirm-close-btn"]');
    
    // Verify campaign is closed
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Campaign closed successfully');
    await expect(page.locator('[data-testid="campaign-status"]')).toContainText('Closed');
  });

  test('should export donation report', async ({ page }) => {
    await page.goto('/donations');
    
    // Click on first campaign
    await page.click('[data-testid="campaign-item"]:first-child');
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-donations-btn"]');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('donations');
    expect(download.suggestedFilename()).toMatch(/\.(csv|xlsx)$/);
  });

  test('should validate minimum donation amount', async ({ page }) => {
    await page.goto('/donations');
    
    // Click on first campaign
    await page.click('[data-testid="campaign-item"]:first-child');
    
    // Click donate button
    await page.click('[data-testid="donate-btn"]');
    
    // Try to donate less than minimum
    await page.fill('[name="amount"]', '0.50');
    await page.click('[data-testid="submit-donation-btn"]');
    
    // Verify validation error
    await expect(page.locator('text=Minimum donation amount is')).toBeVisible();
  });

  test('should display donation statistics', async ({ page }) => {
    await page.goto('/donations');
    
    // Verify statistics cards
    await expect(page.locator('[data-testid="total-raised"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-donors"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-campaigns"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-donation"]')).toBeVisible();
  });
});

