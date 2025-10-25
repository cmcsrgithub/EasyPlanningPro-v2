import { test, expect } from '@playwright/test';

test.describe('Activity Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should browse and register for activities', async ({ page }) => {
    await page.goto('/activities');
    
    // Verify activities list loads
    await expect(page.locator('h1:has-text("Activities")')).toBeVisible();
    
    // Filter activities by type
    await page.selectOption('select[name="type"]', 'workshop');
    
    // Click on an activity
    const activity = page.locator('[data-testid="activity-card"]').first();
    await activity.click();
    
    // Verify activity details page
    await expect(page.locator('text=Activity Details')).toBeVisible();
    await expect(page.locator('text=Register')).toBeVisible();
    
    // Register for activity
    await page.click('button:has-text("Register")');
    await page.fill('textarea[name="notes"]', 'Looking forward to this!');
    await page.click('button:has-text("Confirm Registration")');
    
    // Verify registration success
    await expect(page.locator('text=Successfully registered')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel Registration")')).toBeVisible();
  });

  test('should view my registrations', async ({ page }) => {
    await page.goto('/my-registrations');
    
    // Verify page loads
    await expect(page.locator('h1:has-text("My Registrations")')).toBeVisible();
    
    // Check tabs
    await expect(page.locator('text=Upcoming')).toBeVisible();
    await expect(page.locator('text=Past')).toBeVisible();
    await expect(page.locator('text=Cancelled')).toBeVisible();
    
    // Click on upcoming tab
    await page.click('text=Upcoming');
    
    // Verify upcoming activities are displayed
    const upcomingActivities = page.locator('[data-testid="registration-card"]');
    await expect(upcomingActivities.first()).toBeVisible();
  });

  test('should cancel activity registration', async ({ page }) => {
    await page.goto('/my-registrations');
    
    // Find a registration
    const registration = page.locator('[data-testid="registration-card"]').first();
    await registration.click();
    
    // Cancel registration
    await page.click('button:has-text("Cancel Registration")');
    await page.click('button:has-text("Confirm")');
    
    // Verify cancellation
    await expect(page.locator('text=Registration cancelled')).toBeVisible();
    
    // Check it appears in cancelled tab
    await page.click('text=Cancelled');
    await expect(page.locator('[data-testid="registration-card"]').first()).toBeVisible();
  });

  test('should respect activity capacity limits', async ({ page }) => {
    await page.goto('/activities');
    
    // Find a full activity (capacity reached)
    const fullActivity = page.locator('[data-testid="activity-card"]:has-text("Full")').first();
    
    if (await fullActivity.isVisible()) {
      await fullActivity.click();
      
      // Verify registration button is disabled
      await expect(page.locator('button:has-text("Register")')).toBeDisabled();
      await expect(page.locator('text=Capacity Reached')).toBeVisible();
      
      // Check for waitlist option
      const waitlistButton = page.locator('button:has-text("Join Waitlist")');
      if (await waitlistButton.isVisible()) {
        await waitlistButton.click();
        await expect(page.locator('text=Added to waitlist')).toBeVisible();
      }
    }
  });

  test('should create activity as event organizer', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Navigate to activities
    await page.click('text=Activities');
    await page.click('button:has-text("Add Activity")');
    
    // Fill activity form
    await page.fill('input[name="title"]', 'Morning Yoga Session');
    await page.fill('textarea[name="description"]', 'Start your day with relaxation');
    await page.selectOption('select[name="type"]', 'sports');
    await page.fill('input[name="startTime"]', '2024-12-15T07:00');
    await page.fill('input[name="endTime"]', '2024-12-15T08:00');
    await page.fill('input[name="capacity"]', '20');
    await page.check('input[name="requiresRegistration"]');
    await page.fill('input[name="cost"]', '15');
    
    await page.click('button:has-text("Create Activity")');
    
    // Verify activity was created
    await expect(page.locator('text=Morning Yoga Session')).toBeVisible();
    await expect(page.locator('text=$15')).toBeVisible();
  });
});

