import { test, expect } from '@playwright/test';

test.describe('Custom Forms Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Assume user is logged in
  });

  test('should display custom forms page', async ({ page }) => {
    await page.goto('/custom-forms');
    
    await expect(page.locator('h1')).toContainText('Custom Forms');
    await expect(page.locator('[data-testid="forms-list"]')).toBeVisible();
  });

  test('should create a new custom form with multiple field types', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click create form button
    await page.click('[data-testid="create-form-btn"]');
    
    // Fill form details
    await page.fill('[name="formTitle"]', 'Event Registration Form');
    await page.fill('[name="formDescription"]', 'Please fill out this registration form');
    
    // Add text field
    await page.click('[data-testid="add-field-btn"]');
    await page.selectOption('[data-testid="field-type"]', 'text');
    await page.fill('[data-testid="field-label"]', 'Full Name');
    await page.check('[data-testid="field-required"]');
    await page.click('[data-testid="save-field-btn"]');
    
    // Add email field
    await page.click('[data-testid="add-field-btn"]');
    await page.selectOption('[data-testid="field-type"]', 'email');
    await page.fill('[data-testid="field-label"]', 'Email Address');
    await page.check('[data-testid="field-required"]');
    await page.click('[data-testid="save-field-btn"]');
    
    // Add dropdown field
    await page.click('[data-testid="add-field-btn"]');
    await page.selectOption('[data-testid="field-type"]', 'select');
    await page.fill('[data-testid="field-label"]', 'T-Shirt Size');
    await page.fill('[data-testid="option-1"]', 'Small');
    await page.fill('[data-testid="option-2"]', 'Medium');
    await page.fill('[data-testid="option-3"]', 'Large');
    await page.click('[data-testid="save-field-btn"]');
    
    // Add checkbox field
    await page.click('[data-testid="add-field-btn"]');
    await page.selectOption('[data-testid="field-type"]', 'checkbox');
    await page.fill('[data-testid="field-label"]', 'I agree to terms and conditions');
    await page.check('[data-testid="field-required"]');
    await page.click('[data-testid="save-field-btn"]');
    
    // Submit form
    await page.click('[data-testid="submit-form-btn"]');
    
    // Verify success
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form created successfully');
    await expect(page.locator('text=Event Registration Form')).toBeVisible();
  });

  test('should fill and submit a custom form', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click on first form
    await page.click('[data-testid="form-item"]:first-child');
    
    // Fill form fields
    await page.fill('[name="Full Name"]', 'John Doe');
    await page.fill('[name="Email Address"]', 'john@example.com');
    await page.selectOption('[name="T-Shirt Size"]', 'Medium');
    await page.check('[name="I agree to terms and conditions"]');
    
    // Submit form
    await page.click('[data-testid="submit-response-btn"]');
    
    // Verify submission
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form submitted successfully');
  });

  test('should edit custom form', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click edit on first form
    await page.click('[data-testid="form-item"]:first-child [data-testid="edit-form-btn"]');
    
    // Update form title
    await page.fill('[name="formTitle"]', 'Updated Registration Form');
    
    // Add new field
    await page.click('[data-testid="add-field-btn"]');
    await page.selectOption('[data-testid="field-type"]', 'textarea');
    await page.fill('[data-testid="field-label"]', 'Additional Comments');
    await page.click('[data-testid="save-field-btn"]');
    
    // Submit changes
    await page.click('[data-testid="submit-form-btn"]');
    
    // Verify update
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form updated successfully');
    await expect(page.locator('text=Updated Registration Form')).toBeVisible();
  });

  test('should delete custom form', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Get initial form count
    const initialCount = await page.locator('[data-testid="form-item"]').count();
    
    // Click delete on first form
    await page.click('[data-testid="form-item"]:first-child [data-testid="delete-form-btn"]');
    
    // Confirm deletion
    await page.click('[data-testid="confirm-delete-btn"]');
    
    // Verify deletion
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form deleted successfully');
    
    const newCount = await page.locator('[data-testid="form-item"]').count();
    expect(newCount).toBe(initialCount - 1);
  });

  test('should view form responses', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click on first form
    await page.click('[data-testid="form-item"]:first-child');
    
    // Click view responses button
    await page.click('[data-testid="view-responses-btn"]');
    
    // Verify responses page
    await expect(page.locator('h2')).toContainText('Form Responses');
    await expect(page.locator('[data-testid="responses-table"]')).toBeVisible();
  });

  test('should export form responses to CSV', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click on first form
    await page.click('[data-testid="form-item"]:first-child');
    
    // Click view responses
    await page.click('[data-testid="view-responses-btn"]');
    
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-responses-btn"]');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('responses');
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click on first form
    await page.click('[data-testid="form-item"]:first-child');
    
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-response-btn"]');
    
    // Verify validation errors
    await expect(page.locator('text=This field is required')).toBeVisible();
  });

  test('should duplicate form', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Get initial form count
    const initialCount = await page.locator('[data-testid="form-item"]').count();
    
    // Click duplicate on first form
    await page.click('[data-testid="form-item"]:first-child [data-testid="duplicate-form-btn"]');
    
    // Verify duplication
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form duplicated successfully');
    
    const newCount = await page.locator('[data-testid="form-item"]').count();
    expect(newCount).toBe(initialCount + 1);
  });

  test('should reorder form fields using drag and drop', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click edit on first form
    await page.click('[data-testid="form-item"]:first-child [data-testid="edit-form-btn"]');
    
    // Get first and second field
    const firstField = page.locator('[data-testid="form-field"]').first();
    const secondField = page.locator('[data-testid="form-field"]').nth(1);
    
    // Drag first field to second position
    await firstField.dragTo(secondField);
    
    // Save form
    await page.click('[data-testid="submit-form-btn"]');
    
    // Verify reordering was saved
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form updated successfully');
  });

  test('should set form visibility (Public/Private)', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click edit on first form
    await page.click('[data-testid="form-item"]:first-child [data-testid="edit-form-btn"]');
    
    // Change visibility to private
    await page.click('[data-testid="visibility-private"]');
    
    // Save form
    await page.click('[data-testid="submit-form-btn"]');
    
    // Verify visibility change
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form updated successfully');
    await expect(page.locator('[data-testid="form-item"]:first-child [data-testid="form-visibility"]')).toContainText('Private');
  });

  test('should add conditional logic to form fields', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click edit on first form
    await page.click('[data-testid="form-item"]:first-child [data-testid="edit-form-btn"]');
    
    // Add a field with conditional logic
    await page.click('[data-testid="add-field-btn"]');
    await page.selectOption('[data-testid="field-type"]', 'text');
    await page.fill('[data-testid="field-label"]', 'Company Name');
    
    // Set condition: Show only if "Employment Status" is "Employed"
    await page.click('[data-testid="add-condition-btn"]');
    await page.selectOption('[data-testid="condition-field"]', 'Employment Status');
    await page.selectOption('[data-testid="condition-operator"]', 'equals');
    await page.fill('[data-testid="condition-value"]', 'Employed');
    
    await page.click('[data-testid="save-field-btn"]');
    
    // Save form
    await page.click('[data-testid="submit-form-btn"]');
    
    // Verify conditional logic was saved
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Form updated successfully');
  });

  test('should display form statistics', async ({ page }) => {
    await page.goto('/custom-forms');
    
    // Click on first form
    await page.click('[data-testid="form-item"]:first-child');
    
    // Verify statistics are displayed
    await expect(page.locator('[data-testid="total-responses"]')).toBeVisible();
    await expect(page.locator('[data-testid="completion-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-time"]')).toBeVisible();
  });
});

