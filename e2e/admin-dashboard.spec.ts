import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should access admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    
    // Verify admin dashboard loads
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
    
    // Check stats cards
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Total Events')).toBeVisible();
    await expect(page.locator('text=Active Subscriptions')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();
    
    // Verify numbers are displayed
    const statsCards = page.locator('[data-testid="stat-card"]');
    const count = await statsCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should manage users', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Verify users list
    await expect(page.locator('h1:has-text("User Management")')).toBeVisible();
    
    const userRows = page.locator('[data-testid="user-row"]');
    await expect(userRows.first()).toBeVisible();
    
    // Search for a user
    await page.fill('input[placeholder*="Search"]', 'test@example.com');
    
    // Click on a user
    await userRows.first().click();
    
    // View user details
    await expect(page.locator('text=User Details')).toBeVisible();
    
    // Change user role
    await page.selectOption('select[name="role"]', 'admin');
    await page.click('button:has-text("Save")');
    
    // Verify update
    await expect(page.locator('text=User updated')).toBeVisible();
  });

  test('should suspend user account', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Find a user
    const userRow = page.locator('[data-testid="user-row"]').first();
    await userRow.click();
    
    // Suspend user
    await page.click('button:has-text("Suspend")');
    
    // Fill suspension form
    await page.fill('textarea[name="reason"]', 'Violation of terms');
    await page.fill('input[name="duration"]', '7');
    
    await page.click('button:has-text("Confirm Suspension")');
    
    // Verify suspension
    await expect(page.locator('text=User suspended')).toBeVisible();
    await expect(page.locator('text=Suspended')).toBeVisible();
  });

  test('should monitor system health', async ({ page }) => {
    await page.goto('/admin/monitoring');
    
    // Verify monitoring dashboard
    await expect(page.locator('h1:has-text("System Monitoring")')).toBeVisible();
    
    // Check health metrics
    await expect(page.locator('text=System Health')).toBeVisible();
    await expect(page.locator('text=Database Status')).toBeVisible();
    await expect(page.locator('text=API Response Time')).toBeVisible();
    
    // View logs
    await page.click('text=Logs');
    
    const logEntries = page.locator('[data-testid="log-entry"]');
    await expect(logEntries.first()).toBeVisible();
    
    // Filter logs by level
    await page.selectOption('select[name="level"]', 'error');
    
    // Verify filtered logs
    const errorLogs = page.locator('[data-testid="log-entry"]:has-text("ERROR")');
    if (await errorLogs.first().isVisible()) {
      expect(await errorLogs.count()).toBeGreaterThan(0);
    }
  });

  test('should moderate content', async ({ page }) => {
    await page.goto('/admin/moderation');
    
    // Verify moderation dashboard
    await expect(page.locator('h1:has-text("Content Moderation")')).toBeVisible();
    
    // Check flagged content
    const flaggedItems = page.locator('[data-testid="flagged-item"]');
    
    if (await flaggedItems.first().isVisible()) {
      // Review flagged content
      await flaggedItems.first().click();
      
      // View details
      await expect(page.locator('text=Flagged Content Details')).toBeVisible();
      
      // Take action
      await page.click('button:has-text("Approve")');
      
      // Verify action
      await expect(page.locator('text=Content approved')).toBeVisible();
    }
  });

  test('should configure system settings', async ({ page }) => {
    await page.goto('/admin/configuration');
    
    // Verify configuration page
    await expect(page.locator('h1:has-text("System Configuration")')).toBeVisible();
    
    // Check configuration categories
    await expect(page.locator('text=General Settings')).toBeVisible();
    await expect(page.locator('text=Email Settings')).toBeVisible();
    await expect(page.locator('text=Payment Settings')).toBeVisible();
    
    // Update a setting
    await page.click('text=General Settings');
    await page.fill('input[name="siteName"]', 'EasyPlanningPro Updated');
    await page.click('button:has-text("Save Settings")');
    
    // Verify update
    await expect(page.locator('text=Settings saved')).toBeVisible();
  });

  test('should view analytics and reports', async ({ page }) => {
    await page.goto('/admin/analytics');
    
    // Verify analytics dashboard
    await expect(page.locator('h1:has-text("Analytics & Reports")')).toBeVisible();
    
    // Check charts
    const charts = page.locator('canvas');
    expect(await charts.count()).toBeGreaterThan(0);
    
    // Select date range
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="endDate"]', '2024-12-31');
    await page.click('button:has-text("Apply")');
    
    // Export report
    await page.click('button:has-text("Export Report")');
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});

