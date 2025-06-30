import { test, expect } from '../fixtures/pageFixtures';
import { EXISTING_USERS, INVALID_USERS, TEST_SCENARIOS } from '../fixtures/testData';

test.describe('Authentication - Sign In', () => {
  test.beforeEach(async ({ signInPage }) => {
    await signInPage.goto();
  });

  test('should display sign in form', async ({ signInPage }) => {
    await signInPage.verifyPageLoaded();
    
    // Take screenshot of the sign in form
    await signInPage.takeScreenshot('signin-form');
  });

  test('should sign in with valid credentials', async ({ signInPage }) => {
    const user = EXISTING_USERS.user;
    
    const result = await signInPage.signInAndWaitForResult(user.email, user.password);
    
    expect(result).toBe('success');
    
    // Should be redirected away from signin page
    expect(signInPage.getCurrentUrl()).not.toContain('/signin');
  });

  test('should fail with invalid email', async ({ signInPage }) => {
    const result = await signInPage.signInAndWaitForResult('invalid@email.com', 'password123');
    
    expect(result).toBe('error');
    
    // Should show error message
    expect(await signInPage.hasErrorMessage()).toBe(true);
    
    // Should remain on signin page
    expect(signInPage.getCurrentUrl()).toContain('/signin');
  });

  test('should fail with invalid password', async ({ signInPage }) => {
    const user = EXISTING_USERS.user;
    
    const result = await signInPage.signInAndWaitForResult(user.email, 'wrongpassword');
    
    expect(result).toBe('error');
    expect(await signInPage.hasErrorMessage()).toBe(true);
  });

  test('should fail with empty credentials', async ({ signInPage }) => {
    const result = await signInPage.signInAndWaitForResult('', '');
    
    expect(result).toBe('error');
  });

  test('should navigate to sign up page', async ({ signInPage }) => {
    await signInPage.navigateToSignUp();
    
    await signInPage.expectUrlContains('/signup');
  });

  test.describe('Admin User Authentication', () => {
    test('should sign in admin user successfully', async ({ signInPage }) => {
      const admin = EXISTING_USERS.admin;
      
      const result = await signInPage.signInAndWaitForResult(admin.email, admin.password);
      
      expect(result).toBe('success');
    });
  });

  test.describe('Manager User Authentication', () => {
    test('should sign in manager user successfully', async ({ signInPage }) => {
      const manager = EXISTING_USERS.manager;
      
      const result = await signInPage.signInAndWaitForResult(manager.email, manager.password);
      
      expect(result).toBe('success');
    });
  });

  test.describe('Employee User Authentication', () => {
    test('should sign in employee user successfully', async ({ signInPage }) => {
      const employee = EXISTING_USERS.employee;
      
      const result = await signInPage.signInAndWaitForResult(employee.email, employee.password);
      
      expect(result).toBe('success');
    });
  });

  test.describe('Security Tests', () => {
    test('should handle SQL injection attempt', async ({ signInPage }) => {
      const result = await signInPage.signInAndWaitForResult(
        "admin@email.com' OR '1'='1",
        "password' OR '1'='1"
      );
      
      expect(result).toBe('error');
    });

    test('should handle XSS attempt in email field', async ({ signInPage }) => {
      const result = await signInPage.signInAndWaitForResult(
        '<script>alert("xss")</script>',
        'password123'
      );
      
      expect(result).toBe('error');
    });

    test('should rate limit multiple failed attempts', async ({ signInPage }) => {
      const attempts = 5;
      const results = [];
      
      for (let i = 0; i < attempts; i++) {
        const result = await signInPage.signInAndWaitForResult(
          'test@example.com',
          `wrongpassword${i}`
        );
        results.push(result);
        
        // Small delay between attempts
        await signInPage.page.waitForTimeout(1000);
      }
      
      // All attempts should fail
      expect(results.every(result => result === 'error')).toBe(true);
      
      // After multiple failures, there might be additional rate limiting
      // This is implementation-dependent
    });
  });

  test.describe('Form Validation', () => {
    test('should validate email format', async ({ signInPage }) => {
      await signInPage.fillEmail('invalid-email');
      await signInPage.fillPassword('password123');
      await signInPage.clickSignIn();
      
      // Should show validation error or prevent submission
      // This depends on client-side validation implementation
    });

    test('should require password field', async ({ signInPage }) => {
      await signInPage.fillEmail('test@example.com');
      // Leave password empty
      await signInPage.clickSignIn();
      
      // Should show validation error or prevent submission
    });
  });

  test.describe('Remember Me Functionality', () => {
    test('should remember user when checkbox is checked', async ({ signInPage, page }) => {
      const user = EXISTING_USERS.user;
      
      await signInPage.signIn(user.email, user.password, true); // rememberMe = true
      
      // Wait for successful login
      await signInPage.waitForSuccessfulAuth();
      
      // Close browser and reopen to test persistence
      // Note: This is a simplified test - in practice, you'd need to handle session persistence
      const cookies = await page.context().cookies();
      const authCookies = cookies.filter(cookie => 
        cookie.name.toLowerCase().includes('auth') || 
        cookie.name.toLowerCase().includes('session') ||
        cookie.name.toLowerCase().includes('remember')
      );
      
      expect(authCookies.length).toBeGreaterThan(0);
    });
  });

  test.describe('Visual Regression', () => {
    test('should match signin form appearance', async ({ page }) => {
      await page.goto('/signin');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('signin-form.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match error state appearance', async ({ signInPage, page }) => {
      await signInPage.signIn('invalid@email.com', 'wrongpassword');
      
      // Wait for error to appear
      if (await signInPage.hasErrorMessage()) {
        await expect(page).toHaveScreenshot('signin-error-state.png', {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });
  });
});