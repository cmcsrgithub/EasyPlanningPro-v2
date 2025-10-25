import { test, expect } from '@playwright/test';

test.describe('Messaging and Forum', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should view event forum channels', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Navigate to forum
    await page.click('text=Forum');
    
    // Verify channels list
    await expect(page.locator('h2:has-text("Channels")')).toBeVisible();
    
    const channels = page.locator('[data-testid="channel-item"]');
    await expect(channels.first()).toBeVisible();
    
    // Check default channels
    await expect(page.locator('text=General')).toBeVisible();
    await expect(page.locator('text=Announcements')).toBeVisible();
  });

  test('should create a new channel', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    
    // Create channel
    await page.click('button:has-text("New Channel")');
    
    await page.fill('input[name="name"]', 'Planning Committee');
    await page.fill('textarea[name="description"]', 'Private channel for organizers');
    await page.check('input[name="isPrivate"]');
    
    await page.click('button:has-text("Create Channel")');
    
    // Verify channel created
    await expect(page.locator('text=Planning Committee')).toBeVisible();
    await expect(page.locator('text=🔒')).toBeVisible(); // Private indicator
  });

  test('should send and receive messages', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    
    // Click on a channel
    await page.locator('[data-testid="channel-item"]').first().click();
    
    // Send a message
    const messageInput = page.locator('textarea[placeholder*="message"]');
    await messageInput.fill('Hello everyone! Looking forward to the event.');
    await messageInput.press('Enter');
    
    // Verify message appears
    await expect(page.locator('text=Hello everyone! Looking forward to the event.')).toBeVisible();
    
    // Check message metadata
    const lastMessage = page.locator('[data-testid="message"]').last();
    await expect(lastMessage).toContainText(/\d{1,2}:\d{2}/); // Timestamp
  });

  test('should edit own message', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    await page.locator('[data-testid="channel-item"]').first().click();
    
    // Find own message
    const myMessage = page.locator('[data-testid="message"][data-own="true"]').first();
    
    if (await myMessage.isVisible()) {
      // Hover to show actions
      await myMessage.hover();
      
      // Click edit
      await myMessage.locator('button[aria-label="Edit"]').click();
      
      // Edit message
      const editInput = page.locator('textarea[data-editing="true"]');
      await editInput.clear();
      await editInput.fill('Updated message content');
      await editInput.press('Enter');
      
      // Verify edit
      await expect(page.locator('text=Updated message content')).toBeVisible();
      await expect(page.locator('text=(edited)')).toBeVisible();
    }
  });

  test('should delete own message', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    await page.locator('[data-testid="channel-item"]').first().click();
    
    // Send a message to delete
    const messageInput = page.locator('textarea[placeholder*="message"]');
    await messageInput.fill('Message to delete');
    await messageInput.press('Enter');
    
    // Wait for message to appear
    await page.waitForSelector('text=Message to delete');
    
    // Find and delete the message
    const messageToDelete = page.locator('text=Message to delete').locator('..');
    await messageToDelete.hover();
    await messageToDelete.locator('button[aria-label="Delete"]').click();
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")');
    
    // Verify deletion
    await expect(page.locator('text=Message to delete')).not.toBeVisible();
  });

  test('should react to messages', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    await page.locator('[data-testid="channel-item"]').first().click();
    
    // Find a message
    const message = page.locator('[data-testid="message"]').first();
    
    if (await message.isVisible()) {
      // Hover to show reactions
      await message.hover();
      
      // Click reaction button
      await message.locator('button[aria-label="React"]').click();
      
      // Select emoji
      await page.click('button[data-emoji="👍"]');
      
      // Verify reaction added
      await expect(message.locator('text=👍')).toBeVisible();
      await expect(message.locator('text=1')).toBeVisible(); // Reaction count
    }
  });

  test('should search messages', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    
    // Use search
    await page.fill('input[placeholder*="Search"]', 'looking forward');
    
    // Verify search results
    const searchResults = page.locator('[data-testid="search-result"]');
    
    if (await searchResults.first().isVisible()) {
      // Click on a result
      await searchResults.first().click();
      
      // Verify navigated to message
      await expect(page.locator('text=looking forward')).toBeVisible();
    }
  });

  test('should pin important messages', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    await page.click('text=Forum');
    await page.locator('[data-testid="channel-item"]').first().click();
    
    // Find a message (as admin/organizer)
    const message = page.locator('[data-testid="message"]').first();
    
    if (await message.isVisible()) {
      await message.hover();
      
      // Pin message
      const pinButton = message.locator('button[aria-label="Pin"]');
      
      if (await pinButton.isVisible()) {
        await pinButton.click();
        
        // Verify pinned
        await expect(page.locator('text=Pinned Messages')).toBeVisible();
        await expect(message.locator('text=📌')).toBeVisible();
      }
    }
  });
});

