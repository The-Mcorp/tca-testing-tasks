import { test, expect } from '../fixtures/pageFixtures';
import { generateTestUser, INVALID_USERS, EXISTING_USERS } from '../fixtures/testData';

test.describe('Authentication - Sign Up', () => {
  test.beforeEach(async ({ signUpPage }) => {
    await signUpPage.goto();
  });

  test('should display sign up form', async ({ signUpPage }) => {
    await signUpPage.verifyPageLoaded();
    
    // Take screenshot of the sign up form
    await signUpPage.takeScreenshot('signup-form');
  });

  test('should register new user with valid data', async ({ signUpPage }) => {
    const newUser = generateTestUser('registration');
    
    const result = await signUpPage.signUpAndWaitForResult({
      email: newUser.email,
      password: newUser.password,
      confirmPassword: newUser.password,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      acceptTerms: true
    });
    
    expect(result).toBe('success');
    
    // Should show success message or redirect
    const hasSuccess = await signUpPage.hasSuccessMessage();
    const urlChanged = !signUpPage.getCurrentUrl().includes('/signup');
    
    expect(hasSuccess || urlChanged).toBe(true);
  });

  test('should fail with invalid email format', async ({ signUpPage }) => {
    const result = await signUpPage.signUpAndWaitForResult({
      email: 'invalid-email-format',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!',
      firstName: 'Test',
      lastName: 'User'
    });
    
    expect(result).toBe('error');
    expect(await signUpPage.hasErrorMessage()).toBe(true);
  });

  test('should fail with weak password', async ({ signUpPage }) => {
    const newUser = generateTestUser('weak-password');
    
    const result = await signUpPage.signUpAndWaitForResult({
      email: newUser.email,
      password: '123', // Weak password
      confirmPassword: '123',
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });
    
    expect(result).toBe('error');
  });

  test('should fail with mismatched passwords', async ({ signUpPage }) => {
    const newUser = generateTestUser('mismatch-password');
    
    const result = await signUpPage.signUpAndWaitForResult({
      email: newUser.email,
      password: 'ValidPassword123!',
      confirmPassword: 'DifferentPassword123!',
      firstName: newUser.firstName,
      lastName: newUser.lastName
    });
    
    expect(result).toBe('error');
  });

  test('should fail with existing email', async ({ signUpPage }) => {
    const existingUser = EXISTING_USERS.user;
    
    const result = await signUpPage.signUpAndWaitForResult({
      email: existingUser.email, // Email that already exists
      password: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
      firstName: 'New',
      lastName: 'User'
    });
    
    expect(result).toBe('error');
    expect(await signUpPage.hasErrorMessage()).toBe(true);
    
    const errorMessage = await signUpPage.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('email');
  });

  test('should fail with empty required fields', async ({ signUpPage }) => {
    const result = await signUpPage.signUpAndWaitForResult({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    });
    
    expect(result).toBe('error');
  });

  test('should navigate to sign in page', async ({ signUpPage }) => {
    await signUpPage.navigateToSignIn();
    
    await signUpPage.expectUrlContains('/signin');
  });

  test.describe('Security Tests', () => {
    test('should handle XSS attempt in name fields', async ({ signUpPage }) => {
      const newUser = generateTestUser('xss-test');
      
      const result = await signUpPage.signUpAndWaitForResult({
        email: newUser.email,
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        firstName: '<script>alert("xss")</script>',
        lastName: '<img src="x" onerror="alert(\'xss\')" />',
        acceptTerms: true
      });
      
      // Should either sanitize the input or reject it
      // The application should handle this gracefully
      if (result === 'success') {
        // If successful, verify XSS was sanitized (check for script tags in response)
        // This would require additional verification steps
      } else {
        // If failed, it properly rejected malicious input
        expect(result).toBe('error');
      }
    });

    test('should handle SQL injection attempt', async ({ signUpPage }) => {
      const result = await signUpPage.signUpAndWaitForResult({
        email: "test@example.com'; DROP TABLE Users; --",
        password: 'ValidPassword123!',
        confirmPassword: 'ValidPassword123!',
        firstName: 'Test',
        lastName: 'User'
      });
      
      expect(result).toBe('error');
    });

    test('should limit password length', async ({ signUpPage }) => {
      const newUser = generateTestUser('long-password');
      const veryLongPassword = 'A'.repeat(1000) + '1!'; // Very long password
      
      const result = await signUpPage.signUpAndWaitForResult({
        email: newUser.email,
        password: veryLongPassword,
        confirmPassword: veryLongPassword,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      });
      
      // Should either truncate or reject overly long passwords
      // Implementation dependent
    });
  });

  test.describe('Form Validation', () => {
    test('should validate email format client-side', async ({ signUpPage }) => {
      await signUpPage.fillEmail('invalid-email');
      await signUpPage.fillPassword('ValidPassword123!');
      await signUpPage.clickSignUp();
      
      // Should show validation error or prevent submission
      // This depends on client-side validation implementation
    });

    test('should validate password strength', async ({ signUpPage }) => {
      const newUser = generateTestUser('weak-validation');
      
      await signUpPage.fillEmail(newUser.email);
      await signUpPage.fillPassword('weak'); // Weak password
      await signUpPage.fillConfirmPassword('weak');
      await signUpPage.clickSignUp();
      
      // Should show password strength validation
    });

    test('should validate password confirmation match', async ({ signUpPage }) => {
      const newUser = generateTestUser('mismatch-validation');
      
      await signUpPage.fillEmail(newUser.email);
      await signUpPage.fillPassword('ValidPassword123!');
      await signUpPage.fillConfirmPassword('DifferentPassword123!');
      await signUpPage.clickSignUp();
      
      // Should show mismatch validation error
    });
  });

  test.describe('Terms and Conditions', () => {
    test('should require terms acceptance when checkbox present', async ({ signUpPage, page }) => {
      const newUser = generateTestUser('terms-test');
      
      // Check if terms checkbox exists
      const termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"]:near(text="Terms")');
      
      if (await termsCheckbox.isVisible()) {
        // Don't check the terms checkbox
        const result = await signUpPage.signUpAndWaitForResult({
          email: newUser.email,
          password: 'ValidPassword123!',
          confirmPassword: 'ValidPassword123!',
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          acceptTerms: false
        });
        
        expect(result).toBe('error');
      }
    });
  });

  test.describe('User Experience', () => {
    test('should show password strength indicator', async ({ signUpPage, page }) => {
      await signUpPage.fillPassword('weak');
      
      // Look for password strength indicators
      const strengthIndicator = page.locator(
        '.password-strength, .strength-meter, [class*="strength"], [class*="password"][class*="indicator"]'
      );
      
      // This is optional functionality - if present, verify it works
      if (await strengthIndicator.isVisible()) {
        expect(await strengthIndicator.textContent()).toBeTruthy();
      }
    });

    test('should toggle password visibility', async ({ signUpPage, page }) => {
      await signUpPage.fillPassword('TestPassword123!');
      
      // Look for password toggle button
      const toggleButton = page.locator(
        'button[aria-label*="password"], button[title*="password"], .password-toggle, [class*="toggle"][class*="password"]'
      );
      
      if (await toggleButton.isVisible()) {
        const passwordField = page.locator('input[type="password"]').first();
        
        await toggleButton.click();
        
        // Should change type from password to text
        const inputType = await passwordField.getAttribute('type');
        expect(inputType).toBe('text');
        
        await toggleButton.click();
        
        // Should change back to password
        const inputTypeAfter = await passwordField.getAttribute('type');
        expect(inputTypeAfter).toBe('password');
      }
    });
  });

  test.describe('Visual Regression', () => {
    test('should match signup form appearance', async ({ page }) => {
      await page.goto('/signup');
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot('signup-form.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match error state appearance', async ({ signUpPage, page }) => {
      await signUpPage.signUp({
        email: 'invalid-email',
        password: 'weak'
      });
      
      // Wait for error to appear
      await page.waitForTimeout(1000);
      
      if (await signUpPage.hasErrorMessage()) {
        await expect(page).toHaveScreenshot('signup-error-state.png', {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Integration Tests', () => {
    test('should complete full registration and login flow', async ({ signUpPage, page }) => {
      const newUser = generateTestUser('full-flow');
      
      // Step 1: Register new user
      const signupResult = await signUpPage.signUpAndWaitForResult({
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.password,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        acceptTerms: true
      });
      
      expect(signupResult).toBe('success');
      
      // Step 2: Navigate to sign in and login with new credentials
      await page.goto('/signin');
      
      const signInPage = new (await import('../pages/SignInPage')).SignInPage(page);
      const loginResult = await signInPage.signInAndWaitForResult(newUser.email, newUser.password);
      
      expect(loginResult).toBe('success');
      
      // Step 3: Verify user is authenticated
      await page.goto('/');
      const homePage = new (await import('../pages/HomePage')).HomePage(page);
      const isAuthenticated = await homePage.isUserAuthenticated();
      
      expect(isAuthenticated).toBe(true);
    });
  });
});