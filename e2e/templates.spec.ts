import { test, expect } from '@playwright/test';

test.describe('Template Customization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should browse template gallery', async ({ page }) => {
    await page.goto('/template-gallery');
    
    // Verify gallery loads
    await expect(page.locator('h1:has-text("Template Gallery")')).toBeVisible();
    
    // Check categories
    await expect(page.locator('text=Social')).toBeVisible();
    await expect(page.locator('text=Professional')).toBeVisible();
    await expect(page.locator('text=Family')).toBeVisible();
    
    // Filter by category
    await page.click('text=Family');
    
    // Verify templates are displayed
    const templates = page.locator('[data-testid="template-card"]');
    await expect(templates.first()).toBeVisible();
    
    // Check template count
    const count = await templates.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should preview template on hover', async ({ page }) => {
    await page.goto('/template-gallery');
    
    // Hover over a template
    const template = page.locator('[data-testid="template-card"]').first();
    await template.hover();
    
    // Verify preview modal appears
    await expect(page.locator('[data-testid="template-preview"]')).toBeVisible();
    
    // Check preview content
    await expect(page.locator('.template-preview-content')).toBeVisible();
    
    // Move mouse away
    await page.mouse.move(0, 0);
    
    // Verify preview disappears
    await expect(page.locator('[data-testid="template-preview"]')).not.toBeVisible();
  });

  test('should customize template color scheme', async ({ page }) => {
    await page.goto('/template-gallery');
    
    // Click on a template
    const template = page.locator('[data-testid="template-card"]').first();
    await template.click();
    
    // Navigate to customize tab
    await page.click('text=Customize');
    
    // Select color scheme
    await page.click('[data-testid="color-scheme-ocean"]');
    
    // Verify preview updates
    await expect(page.locator('.template-preview')).toHaveCSS('background-color', /rgb/);
    
    // Select font family
    await page.selectOption('select[name="fontFamily"]', 'serif');
    
    // Verify font changes
    await expect(page.locator('.template-preview')).toHaveCSS('font-family', /serif/);
    
    // Generate shareable link
    await page.click('button:has-text("Generate Link")');
    
    // Verify link is created
    await expect(page.locator('input[readonly]')).toBeVisible();
    
    const linkInput = page.locator('input[readonly]');
    const link = await linkInput.inputValue();
    expect(link).toContain('http');
  });

  test('should use template for new event', async ({ page }) => {
    await page.goto('/template-gallery');
    
    // Select a template
    const template = page.locator('[data-testid="template-card"]').first();
    const templateName = await template.locator('h3').textContent();
    await template.click();
    
    // Use template
    await page.click('button:has-text("Use Template")');
    
    // Verify redirected to event creation
    await expect(page).toHaveURL(/\/events\/create/);
    
    // Verify template is pre-selected
    await expect(page.locator(`text=${templateName}`)).toBeVisible();
    
    // Fill event details
    await page.fill('input[name="title"]', 'My Custom Event');
    await page.fill('input[name="date"]', '2024-12-20');
    
    await page.click('button:has-text("Create Event")');
    
    // Verify event created with template
    await expect(page.locator('text=Event created successfully')).toBeVisible();
  });

  test('should save custom template (premium feature)', async ({ page }) => {
    await page.goto('/template-gallery');
    
    // Click on a template
    await page.locator('[data-testid="template-card"]').first().click();
    
    // Customize template
    await page.click('text=Customize');
    await page.click('[data-testid="color-scheme-sunset"]');
    
    // Try to save (requires premium)
    await page.click('button:has-text("Save Custom Template")');
    
    // Check if user has premium
    const upgradePrompt = page.locator('text=Upgrade to Premium');
    
    if (await upgradePrompt.isVisible()) {
      // Verify upgrade prompt appears
      await expect(upgradePrompt).toBeVisible();
      await expect(page.locator('text=This feature requires a premium subscription')).toBeVisible();
    } else {
      // Premium user - verify save
      await page.fill('input[name="templateName"]', 'My Custom Template');
      await page.click('button:has-text("Save")');
      await expect(page.locator('text=Template saved')).toBeVisible();
    }
  });

  test('should search templates', async ({ page }) => {
    await page.goto('/template-gallery');
    
    // Use search
    await page.fill('input[placeholder*="Search"]', 'wedding');
    
    // Verify filtered results
    const templates = page.locator('[data-testid="template-card"]');
    const count = await templates.count();
    
    // All visible templates should contain "wedding"
    for (let i = 0; i < count; i++) {
      const template = templates.nth(i);
      const text = await template.textContent();
      expect(text?.toLowerCase()).toContain('wedding');
    }
  });
});

