import { test, expect } from '../fixtures/pageFixtures';

test.describe('Home Page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('should load successfully', async ({ homePage }) => {
    // Verify page loads
    expect(await homePage.isLoaded()).toBe(true);
    
    // Verify title is set
    await homePage.verifyTitle();
    
    // Take screenshot for visual comparison
    await homePage.takeScreenshot('home-page-loaded');
  });

  test('should display navigation elements', async ({ homePage }) => {
    // Check that navigation is visible
    const navLinks = await homePage.getVisibleNavLinks();
    expect(navLinks.length).toBeGreaterThan(0);
    
    // Should have basic navigation items
    const navText = navLinks.join(' ').toLowerCase();
    expect(navText).toContain('sign'); // Should contain "Sign In" or "Sign Up"
  });

  test('should navigate to sign in page', async ({ homePage }) => {
    await homePage.navigateToSignIn();
    
    // Verify we're on the sign in page
    await homePage.expectUrlContains('/signin');
  });

  test('should navigate to sign up page', async ({ homePage }) => {
    await homePage.navigateToSignUp();
    
    // Verify we're on the sign up page
    await homePage.expectUrlContains('/signup');
  });

  test('should show unauthenticated state by default', async ({ homePage }) => {
    const isAuthenticated = await homePage.isUserAuthenticated();
    expect(isAuthenticated).toBe(false);
  });

  test.describe('Visual Regression', () => {
    test('should match home page screenshot', async ({ page }) => {
      await page.goto('/');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot('home-page-full.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match navigation header', async ({ page }) => {
      await page.goto('/');
      
      // Screenshot just the navigation area
      const nav = page.locator('nav, header, .nav-header').first();
      if (await nav.isVisible()) {
        await expect(nav).toHaveScreenshot('navigation-header.png');
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Verify page loads on mobile
      await page.waitForLoadState('networkidle');
      
      // Check that essential elements are still visible
      const mainContent = page.locator('main, #app, .main-content').first();
      await expect(mainContent).toBeVisible();
      
      // Take mobile screenshot
      await expect(page).toHaveScreenshot('home-page-mobile.png', {
        fullPage: true
      });
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      await page.waitForLoadState('networkidle');
      
      // Take tablet screenshot
      await expect(page).toHaveScreenshot('home-page-tablet.png', {
        fullPage: true
      });
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have console errors', async ({ page }) => {
      const consoleErrors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Filter out known acceptable errors (if any)
      const significantErrors = consoleErrors.filter(error => 
        !error.includes('favicon') && // Ignore favicon errors
        !error.includes('ServiceWorker') // Ignore SW errors if not using SW
      );
      
      expect(significantErrors).toHaveLength(0);
    });
  });
});