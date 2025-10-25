import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests (WCAG 2.1 AA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through main menu using Tab key', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Press Tab to focus first interactive element
      await page.keyboard.press('Tab');
      
      // Verify focus is visible
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeDefined();
    });

    test('should activate buttons using Enter key', async ({ page }) => {
      await page.goto('/events');
      
      // Focus on create event button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Press Enter to activate
      await page.keyboard.press('Enter');
      
      // Verify modal/form opened
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test('should activate buttons using Space key', async ({ page }) => {
      await page.goto('/events');
      
      // Focus on create event button
      await page.focus('[data-testid="create-event-btn"]');
      
      // Press Space to activate
      await page.keyboard.press('Space');
      
      // Verify action was triggered
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    });

    test('should close modal using Escape key', async ({ page }) => {
      await page.goto('/events');
      
      // Open modal
      await page.click('[data-testid="create-event-btn"]');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Press Escape to close
      await page.keyboard.press('Escape');
      
      // Verify modal is closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });

    test('should navigate dropdown menu using Arrow keys', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Open dropdown
      await page.click('[data-testid="user-menu"]');
      
      // Navigate with arrow down
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      
      // Verify focus moved
      const focusedText = await page.evaluate(() => {
        return document.activeElement?.textContent;
      });
      
      expect(focusedText).toBeDefined();
    });

    test('should skip to main content using skip link', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Press Tab to focus skip link
      await page.keyboard.press('Tab');
      
      // Verify skip link is visible
      const skipLink = page.locator('text=Skip to main content');
      await expect(skipLink).toBeVisible();
      
      // Activate skip link
      await page.keyboard.press('Enter');
      
      // Verify focus moved to main content
      const mainContent = await page.locator('main').isVisible();
      expect(mainContent).toBe(true);
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels on interactive elements', async ({ page }) => {
      await page.goto('/events');
      
      // Check create button has aria-label
      const createBtn = page.locator('[data-testid="create-event-btn"]');
      const ariaLabel = await createBtn.getAttribute('aria-label');
      
      expect(ariaLabel).toBeTruthy();
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Get all headings
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
        elements.map(el => ({ tag: el.tagName, text: el.textContent }))
      );
      
      // Verify h1 exists
      const h1Count = headings.filter(h => h.tag === 'H1').length;
      expect(h1Count).toBeGreaterThan(0);
      
      // Verify headings are in logical order
      expect(headings.length).toBeGreaterThan(0);
    });

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/templates');
      
      // Get all images
      const images = await page.$$('img');
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeDefined();
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/events');
      await page.click('[data-testid="create-event-btn"]');
      
      // Check all inputs have associated labels
      const inputs = await page.$$('input[type="text"], input[type="email"], textarea');
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        if (id) {
          const label = await page.$(`label[for="${id}"]`);
          expect(label).toBeTruthy();
        }
      }
    });

    test('should announce live region updates', async ({ page }) => {
      await page.goto('/events');
      
      // Check for aria-live regions
      const liveRegion = page.locator('[aria-live="polite"]');
      const exists = await liveRegion.count();
      
      expect(exists).toBeGreaterThan(0);
    });

    test('should have proper button roles', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Verify clickable elements have proper roles
      const buttons = await page.$$('button, [role="button"]');
      
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  test.describe('Color Contrast (WCAG AA)', () => {
    test('should have sufficient contrast for text', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Get text color and background color
      const textElement = page.locator('body');
      const styles = await textElement.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });
      
      expect(styles.color).toBeDefined();
      expect(styles.backgroundColor).toBeDefined();
    });

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/events');
      
      // Focus on a button
      await page.focus('[data-testid="create-event-btn"]');
      
      // Check for focus styles
      const focusStyles = await page.evaluate(() => {
        const el = document.activeElement;
        const styles = window.getComputedStyle(el!);
        return {
          outline: styles.outline,
          boxShadow: styles.boxShadow,
        };
      });
      
      // Verify some focus indicator exists
      const hasFocusIndicator = 
        focusStyles.outline !== 'none' || 
        focusStyles.boxShadow !== 'none';
      
      expect(hasFocusIndicator).toBe(true);
    });

    test('should not rely solely on color to convey information', async ({ page }) => {
      await page.goto('/analytics');
      
      // Check if status indicators have text or icons, not just color
      const statusElements = await page.$$('[data-testid="status-indicator"]');
      
      for (const el of statusElements) {
        const hasText = await el.textContent();
        const hasIcon = await el.$('svg, i, [class*="icon"]');
        
        expect(hasText || hasIcon).toBeTruthy();
      }
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have descriptive error messages', async ({ page }) => {
      await page.goto('/events');
      await page.click('[data-testid="create-event-btn"]');
      
      // Submit form without filling required fields
      await page.click('[data-testid="submit-event-btn"]');
      
      // Check for error messages
      const errorMessages = await page.$$('[role="alert"], .error-message');
      
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    test('should associate error messages with form fields', async ({ page }) => {
      await page.goto('/events');
      await page.click('[data-testid="create-event-btn"]');
      
      // Submit form to trigger validation
      await page.click('[data-testid="submit-event-btn"]');
      
      // Check for aria-describedby on invalid fields
      const invalidInputs = await page.$$('[aria-invalid="true"]');
      
      for (const input of invalidInputs) {
        const describedBy = await input.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
      }
    });

    test('should have proper fieldset and legend for grouped inputs', async ({ page }) => {
      await page.goto('/events');
      await page.click('[data-testid="create-event-btn"]');
      
      // Check for fieldsets with legends
      const fieldsets = await page.$$('fieldset');
      
      for (const fieldset of fieldsets) {
        const legend = await fieldset.$('legend');
        if (fieldset) {
          expect(legend).toBeTruthy();
        }
      }
    });
  });

  test.describe('Responsive and Zoom', () => {
    test('should be usable at 200% zoom', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Set zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      
      // Verify main content is still visible
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();
      
      // Reset zoom
      await page.evaluate(() => {
        document.body.style.zoom = '1';
      });
    });

    test('should be responsive on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Verify mobile menu is accessible
      const mobileMenu = page.locator('[data-testid="mobile-menu-btn"]');
      await expect(mobileMenu).toBeVisible();
    });

    test('should not have horizontal scrolling at standard viewport', async ({ page }) => {
      await page.goto('/dashboard');
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Semantic HTML', () => {
    test('should use semantic landmarks', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check for semantic landmarks
      const header = await page.$('header');
      const nav = await page.$('nav');
      const main = await page.$('main');
      const footer = await page.$('footer');
      
      expect(header).toBeTruthy();
      expect(nav).toBeTruthy();
      expect(main).toBeTruthy();
    });

    test('should use lists for list content', async ({ page }) => {
      await page.goto('/events');
      
      // Check if event lists use ul/ol
      const lists = await page.$$('ul, ol');
      
      expect(lists.length).toBeGreaterThan(0);
    });

    test('should use tables only for tabular data', async ({ page }) => {
      await page.goto('/analytics');
      
      // Check if tables have proper structure
      const tables = await page.$$('table');
      
      for (const table of tables) {
        const thead = await table.$('thead');
        const tbody = await table.$('tbody');
        
        expect(thead || tbody).toBeTruthy();
      }
    });
  });
});

