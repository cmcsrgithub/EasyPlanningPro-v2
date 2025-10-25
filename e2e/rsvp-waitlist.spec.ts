import { test, expect } from '@playwright/test';

test.describe('RSVP and Waitlist Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should submit RSVP for an event', async ({ page }) => {
    await page.goto('/events');
    
    // Click on an event
    const event = page.locator('[data-testid="event-card"]').first();
    await event.click();
    
    // Click RSVP button
    await page.click('button:has-text("RSVP")');
    
    // Fill RSVP form
    await page.selectOption('select[name="status"]', 'confirmed');
    await page.fill('input[name="guestCount"]', '2');
    await page.fill('textarea[name="dietaryRestrictions"]', 'Vegetarian');
    await page.fill('textarea[name="notes"]', 'Looking forward to it!');
    
    await page.click('button:has-text("Submit RSVP")');
    
    // Verify RSVP submitted
    await expect(page.locator('text=RSVP submitted successfully')).toBeVisible();
    await expect(page.locator('text=Confirmed')).toBeVisible();
    await expect(page.locator('text=2 guests')).toBeVisible();
  });

  test('should update existing RSVP', async ({ page }) => {
    await page.goto('/events');
    
    // Open event with existing RSVP
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Click Edit RSVP
    await page.click('button:has-text("Edit RSVP")');
    
    // Change guest count
    await page.fill('input[name="guestCount"]', '3');
    await page.fill('textarea[name="notes"]', 'Bringing one more person');
    
    await page.click('button:has-text("Update RSVP")');
    
    // Verify update
    await expect(page.locator('text=RSVP updated')).toBeVisible();
    await expect(page.locator('text=3 guests')).toBeVisible();
  });

  test('should decline event invitation', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Decline RSVP
    await page.click('button:has-text("RSVP")');
    await page.selectOption('select[name="status"]', 'declined');
    await page.fill('textarea[name="notes"]', 'Unable to attend');
    
    await page.click('button:has-text("Submit RSVP")');
    
    // Verify decline
    await expect(page.locator('text=RSVP submitted')).toBeVisible();
    await expect(page.locator('text=Declined')).toBeVisible();
  });

  test('should join waitlist when event is full', async ({ page }) => {
    await page.goto('/events');
    
    // Find a full event
    const fullEvent = page.locator('[data-testid="event-card"]:has-text("Full")').first();
    
    if (await fullEvent.isVisible()) {
      await fullEvent.click();
      
      // Verify RSVP button is disabled
      await expect(page.locator('button:has-text("RSVP")')).toBeDisabled();
      
      // Join waitlist
      await page.click('button:has-text("Join Waitlist")');
      
      // Fill waitlist form
      await page.fill('input[name="email"]', 'user@example.com');
      await page.fill('textarea[name="notes"]', 'Hope to attend!');
      
      await page.click('button:has-text("Join")');
      
      // Verify joined waitlist
      await expect(page.locator('text=Added to waitlist')).toBeVisible();
      await expect(page.locator('text=Position:')).toBeVisible();
    }
  });

  test('should manage waitlist as event organizer', async ({ page }) => {
    await page.goto('/waitlist-management');
    
    // Verify page loads
    await expect(page.locator('h1:has-text("Waitlist Management")')).toBeVisible();
    
    // Select an event
    await page.selectOption('select[name="eventId"]', { index: 1 });
    
    // View waitlist entries
    const waitlistEntries = page.locator('[data-testid="waitlist-entry"]');
    
    if (await waitlistEntries.first().isVisible()) {
      // Offer spot to first person
      await waitlistEntries.first().locator('button:has-text("Offer Spot")').click();
      
      // Confirm offer
      await page.click('button:has-text("Confirm")');
      
      // Verify offer sent
      await expect(page.locator('text=Spot offered')).toBeVisible();
      await expect(page.locator('text=Offered')).toBeVisible();
    }
  });

  test('should accept waitlist offer', async ({ page }) => {
    // Assuming user has a waitlist offer
    await page.goto('/my-waitlist');
    
    // Find an offered spot
    const offer = page.locator('[data-testid="waitlist-offer"]').first();
    
    if (await offer.isVisible()) {
      // Accept offer
      await offer.locator('button:has-text("Accept")').click();
      
      // Verify acceptance
      await expect(page.locator('text=Offer accepted')).toBeVisible();
      
      // Should now appear in RSVPs
      await page.goto('/events');
      await expect(page.locator('text=Confirmed')).toBeVisible();
    }
  });

  test('should view RSVP statistics as organizer', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Navigate to RSVPs tab
    await page.click('text=RSVPs');
    
    // Verify statistics
    await expect(page.locator('text=Total RSVPs')).toBeVisible();
    await expect(page.locator('text=Confirmed')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
    await expect(page.locator('text=Declined')).toBeVisible();
    
    // Check RSVP list
    const rsvpList = page.locator('[data-testid="rsvp-entry"]');
    await expect(rsvpList.first()).toBeVisible();
    
    // Export RSVPs
    await page.click('button:has-text("Export")');
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('.csv');
  });
});

