import { test, expect } from '@playwright/test';

test.describe('Complete Event Lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Login (assuming OAuth redirect is mocked or handled)
    await page.waitForSelector('text=Sign in', { timeout: 5000 }).catch(() => {});
  });

  test('should create event, add activities, manage RSVPs, and view analytics', async ({ page }) => {
    // Step 1: Create a new event
    await page.goto('/events');
    await page.click('text=Create Event');
    
    await page.fill('input[name="title"]', 'Annual Company Retreat 2024');
    await page.fill('textarea[name="description"]', 'Team building and planning session');
    await page.fill('input[name="location"]', 'Mountain Resort');
    await page.fill('input[name="date"]', '2024-12-15');
    
    await page.click('button:has-text("Create Event")');
    
    // Verify event was created
    await expect(page.locator('text=Annual Company Retreat 2024')).toBeVisible();
    
    // Step 2: Add activities to the event
    await page.click('text=Activities');
    await page.click('text=Add Activity');
    
    await page.fill('input[name="title"]', 'Team Building Workshop');
    await page.fill('textarea[name="description"]', 'Interactive team exercises');
    await page.selectOption('select[name="type"]', 'workshop');
    await page.fill('input[name="startTime"]', '2024-12-15T09:00');
    await page.fill('input[name="endTime"]', '2024-12-15T12:00');
    
    await page.click('button:has-text("Add Activity")');
    
    // Verify activity was added
    await expect(page.locator('text=Team Building Workshop')).toBeVisible();
    
    // Step 3: Manage RSVPs
    await page.click('text=RSVPs');
    
    // Check RSVP stats
    await expect(page.locator('text=Total RSVPs')).toBeVisible();
    await expect(page.locator('text=Confirmed')).toBeVisible();
    await expect(page.locator('text=Pending')).toBeVisible();
    
    // Step 4: View analytics
    await page.click('text=Analytics');
    
    // Verify analytics dashboard loads
    await expect(page.locator('text=Event Analytics')).toBeVisible();
    await expect(page.locator('text=RSVP Trends')).toBeVisible();
    await expect(page.locator('text=Expense Summary')).toBeVisible();
  });

  test('should handle event editing and deletion', async ({ page }) => {
    // Navigate to events list
    await page.goto('/events');
    
    // Find and click on an existing event
    const eventCard = page.locator('[data-testid="event-card"]').first();
    await eventCard.click();
    
    // Edit event
    await page.click('button:has-text("Edit")');
    
    const newTitle = 'Updated Event Title';
    await page.fill('input[name="title"]', newTitle);
    await page.click('button:has-text("Save Changes")');
    
    // Verify update
    await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    
    // Delete event (with confirmation)
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');
    
    // Verify deletion
    await expect(page.locator(`text=${newTitle}`)).not.toBeVisible();
  });

  test('should manage event tasks with Kanban board', async ({ page }) => {
    await page.goto('/events');
    
    // Open first event
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Navigate to tasks
    await page.click('text=Tasks');
    
    // Create a new task
    await page.click('button:has-text("Add Task")');
    await page.fill('input[name="title"]', 'Book Venue');
    await page.fill('textarea[name="description"]', 'Reserve the main conference room');
    await page.selectOption('select[name="priority"]', 'high');
    await page.click('button:has-text("Create Task")');
    
    // Verify task appears in TODO column
    await expect(page.locator('.kanban-column:has-text("To Do") >> text=Book Venue')).toBeVisible();
    
    // Drag task to In Progress (simulate drag and drop)
    const task = page.locator('text=Book Venue').first();
    const inProgressColumn = page.locator('.kanban-column:has-text("In Progress")');
    
    await task.dragTo(inProgressColumn);
    
    // Verify task moved
    await expect(page.locator('.kanban-column:has-text("In Progress") >> text=Book Venue')).toBeVisible();
  });

  test('should track event expenses and generate financial reports', async ({ page }) => {
    await page.goto('/events');
    await page.locator('[data-testid="event-card"]').first().click();
    
    // Navigate to financial section
    await page.click('text=Financial');
    
    // Add an expense
    await page.click('button:has-text("Add Expense")');
    await page.selectOption('select[name="category"]', 'venue');
    await page.fill('input[name="description"]', 'Venue Rental Fee');
    await page.fill('input[name="amount"]', '5000');
    await page.fill('input[name="date"]', '2024-01-15');
    await page.selectOption('select[name="paymentMethod"]', 'credit_card');
    await page.click('button:has-text("Add Expense")');
    
    // Verify expense appears
    await expect(page.locator('text=Venue Rental Fee')).toBeVisible();
    await expect(page.locator('text=$5,000')).toBeVisible();
    
    // Check financial charts
    await expect(page.locator('canvas')).toBeVisible(); // Chart canvas
    
    // Export to CSV
    await page.click('button:has-text("Export CSV")');
    
    // Verify download initiated
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('.csv');
  });
});

