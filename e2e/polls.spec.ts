import { test, expect } from '@playwright/test';

test.describe('Polls Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Assume user is logged in
  });

  test('should display polls page', async ({ page }) => {
    await page.goto('/polls');
    
    await expect(page.locator('h1')).toContainText('Polls');
    await expect(page.locator('[data-testid="polls-list"]')).toBeVisible();
  });

  test('should create a new poll', async ({ page }) => {
    await page.goto('/polls');
    
    // Click create poll button
    await page.click('[data-testid="create-poll-btn"]');
    
    // Fill poll form
    await page.fill('[name="question"]', 'What time works best for the event?');
    await page.fill('[name="description"]', 'Please vote for your preferred time');
    
    // Add poll options
    await page.fill('[name="option1"]', '10:00 AM');
    await page.fill('[name="option2"]', '2:00 PM');
    await page.click('[data-testid="add-option-btn"]');
    await page.fill('[name="option3"]', '6:00 PM');
    
    // Set poll settings
    await page.check('[name="allowMultipleVotes"]');
    await page.fill('[name="endDate"]', '2024-11-30');
    
    // Submit poll
    await page.click('[data-testid="submit-poll-btn"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Poll created successfully');
    await expect(page.locator('text=What time works best for the event?')).toBeVisible();
  });

  test('should vote on a poll', async ({ page }) => {
    await page.goto('/polls');
    
    // Click on first poll
    await page.click('[data-testid="poll-item"]:first-child');
    
    // Select an option
    await page.click('[data-testid="poll-option"]:first-child');
    
    // Submit vote
    await page.click('[data-testid="submit-vote-btn"]');
    
    // Verify vote was recorded
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Vote recorded');
    await expect(page.locator('[data-testid="poll-results"]')).toBeVisible();
  });

  test('should display poll results after voting', async ({ page }) => {
    await page.goto('/polls');
    
    // Click on a poll that user has already voted on
    await page.click('[data-testid="poll-item"]:first-child');
    
    // Verify results are displayed
    await expect(page.locator('[data-testid="poll-results"]')).toBeVisible();
    
    // Verify percentage bars
    const resultBars = page.locator('[data-testid="result-bar"]');
    const count = await resultBars.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify vote counts
    await expect(page.locator('[data-testid="vote-count"]').first()).toBeVisible();
  });

  test('should edit poll before votes are cast', async ({ page }) => {
    await page.goto('/polls');
    
    // Click edit on first poll
    await page.click('[data-testid="poll-item"]:first-child [data-testid="edit-poll-btn"]');
    
    // Update poll question
    await page.fill('[name="question"]', 'Updated Poll Question');
    
    // Submit changes
    await page.click('[data-testid="submit-poll-btn"]');
    
    // Verify update
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Poll updated successfully');
    await expect(page.locator('text=Updated Poll Question')).toBeVisible();
  });

  test('should close poll manually', async ({ page }) => {
    await page.goto('/polls');
    
    // Click on first poll
    await page.click('[data-testid="poll-item"]:first-child');
    
    // Click close poll button
    await page.click('[data-testid="close-poll-btn"]');
    
    // Confirm closure
    await page.click('[data-testid="confirm-close-btn"]');
    
    // Verify poll is closed
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Poll closed');
    await expect(page.locator('[data-testid="poll-status"]')).toContainText('Closed');
  });

  test('should filter polls by status (Active, Closed, Upcoming)', async ({ page }) => {
    await page.goto('/polls');
    
    // Filter by active polls
    await page.click('[data-testid="filter-active"]');
    
    // Verify only active polls are shown
    const polls = page.locator('[data-testid="poll-item"]');
    const count = await polls.count();
    
    for (let i = 0; i < count; i++) {
      const status = await polls.nth(i).locator('[data-testid="poll-status"]').textContent();
      expect(status).toContain('Active');
    }
  });

  test('should prevent voting twice on single-vote poll', async ({ page }) => {
    await page.goto('/polls');
    
    // Click on first poll
    await page.click('[data-testid="poll-item"]:first-child');
    
    // If already voted, verify message
    const alreadyVoted = await page.locator('text=You have already voted').isVisible();
    
    if (alreadyVoted) {
      // Verify vote button is disabled or not present
      const voteButton = page.locator('[data-testid="submit-vote-btn"]');
      const isDisabled = await voteButton.isDisabled().catch(() => true);
      expect(isDisabled).toBe(true);
    }
  });

  test('should delete poll', async ({ page }) => {
    await page.goto('/polls');
    
    // Get initial poll count
    const initialCount = await page.locator('[data-testid="poll-item"]').count();
    
    // Click delete on first poll
    await page.click('[data-testid="poll-item"]:first-child [data-testid="delete-poll-btn"]');
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-btn"]');
    
    // Verify deletion
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Poll deleted successfully');
    
    const newCount = await page.locator('[data-testid="poll-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });
});

