import { test, expect } from '@playwright/test';

test.describe('Sponsors Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and authenticate
    await page.goto('/');
    // Assume user is logged in or handle login flow
  });

  test('should display sponsors page', async ({ page }) => {
    await page.goto('/sponsors');
    
    await expect(page.locator('h1')).toContainText('Sponsors');
    await expect(page.locator('[data-testid="sponsors-list"]')).toBeVisible();
  });

  test('should create a new sponsor', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Click add sponsor button
    await page.click('[data-testid="add-sponsor-btn"]');
    
    // Fill sponsor form
    await page.fill('[name="name"]', 'Tech Corp');
    await page.fill('[name="website"]', 'https://techcorp.com');
    await page.fill('[name="contactEmail"]', 'contact@techcorp.com');
    await page.selectOption('[name="tier"]', 'gold');
    await page.fill('[name="contributionAmount"]', '5000');
    await page.fill('[name="description"]', 'Leading technology company');
    
    // Upload logo
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-fixtures/sponsor-logo.png');
    
    // Submit form
    await page.click('[data-testid="submit-sponsor-btn"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Sponsor added successfully');
    await expect(page.locator('text=Tech Corp')).toBeVisible();
  });

  test('should edit existing sponsor', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Click edit on first sponsor
    await page.click('[data-testid="sponsor-item"]:first-child [data-testid="edit-sponsor-btn"]');
    
    // Update sponsor details
    await page.fill('[name="name"]', 'Tech Corp Updated');
    await page.fill('[name="contributionAmount"]', '7500');
    
    // Submit changes
    await page.click('[data-testid="submit-sponsor-btn"]');
    
    // Verify update
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Sponsor updated successfully');
    await expect(page.locator('text=Tech Corp Updated')).toBeVisible();
  });

  test('should delete sponsor', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Get initial sponsor count
    const initialCount = await page.locator('[data-testid="sponsor-item"]').count();
    
    // Click delete on first sponsor
    await page.click('[data-testid="sponsor-item"]:first-child [data-testid="delete-sponsor-btn"]');
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-btn"]');
    
    // Verify deletion
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Sponsor deleted successfully');
    
    const newCount = await page.locator('[data-testid="sponsor-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should filter sponsors by tier', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Select gold tier filter
    await page.selectOption('[data-testid="tier-filter"]', 'gold');
    
    // Verify only gold sponsors are shown
    const sponsors = page.locator('[data-testid="sponsor-item"]');
    const count = await sponsors.count();
    
    for (let i = 0; i < count; i++) {
      const tier = await sponsors.nth(i).locator('[data-testid="sponsor-tier"]').textContent();
      expect(tier).toContain('Gold');
    }
  });

  test('should search sponsors by name', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Enter search query
    await page.fill('[data-testid="sponsor-search"]', 'Tech');
    
    // Verify filtered results
    const sponsors = page.locator('[data-testid="sponsor-item"]');
    const count = await sponsors.count();
    
    for (let i = 0; i < count; i++) {
      const name = await sponsors.nth(i).locator('[data-testid="sponsor-name"]').textContent();
      expect(name?.toLowerCase()).toContain('tech');
    }
  });

  test('should display sponsor tiers (Platinum, Gold, Silver, Bronze)', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Verify tier sections exist
    await expect(page.locator('text=Platinum Sponsors')).toBeVisible();
    await expect(page.locator('text=Gold Sponsors')).toBeVisible();
    await expect(page.locator('text=Silver Sponsors')).toBeVisible();
    await expect(page.locator('text=Bronze Sponsors')).toBeVisible();
  });

  test('should display sponsor logo and details', async ({ page }) => {
    await page.goto('/sponsors');
    
    const firstSponsor = page.locator('[data-testid="sponsor-item"]').first();
    
    // Verify sponsor card contains required elements
    await expect(firstSponsor.locator('[data-testid="sponsor-logo"]')).toBeVisible();
    await expect(firstSponsor.locator('[data-testid="sponsor-name"]')).toBeVisible();
    await expect(firstSponsor.locator('[data-testid="sponsor-tier"]')).toBeVisible();
    await expect(firstSponsor.locator('[data-testid="sponsor-website"]')).toBeVisible();
  });

  test('should validate required fields when creating sponsor', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Click add sponsor button
    await page.click('[data-testid="add-sponsor-btn"]');
    
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-sponsor-btn"]');
    
    // Verify validation errors
    await expect(page.locator('text=Name is required')).toBeVisible();
    await expect(page.locator('text=Tier is required')).toBeVisible();
  });

  test('should sort sponsors by contribution amount', async ({ page }) => {
    await page.goto('/sponsors');
    
    // Click sort by contribution
    await page.click('[data-testid="sort-by-contribution"]');
    
    // Get all contribution amounts
    const amounts = await page.locator('[data-testid="sponsor-contribution"]').allTextContents();
    
    // Verify they are sorted in descending order
    const numericAmounts = amounts.map(a => parseFloat(a.replace(/[^0-9.]/g, '')));
    const sortedAmounts = [...numericAmounts].sort((a, b) => b - a);
    
    expect(numericAmounts).toEqual(sortedAmounts);
  });
});

