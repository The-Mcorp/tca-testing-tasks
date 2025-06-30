import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Sign In page object model
 * Handles authentication functionality
 */
export class SignInPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], input[placeholder*="password" i]');
    this.signInButton = page.locator('button[type="submit"], button:has-text("Sign In"), input[type="submit"]');
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"], .text-red-500');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset")');
    this.signUpLink = page.locator('a:has-text("Sign Up"), a:has-text("Register")');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"][name*="remember"], input[type="checkbox"]:near(text="Remember")');
  }

  /**
   * Navigate to the sign in page
   */
  async goto() {
    await super.goto('/signin');
    await this.waitForLoad();
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string, rememberMe: boolean = false) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.checkRememberMe();
    }
    
    await this.clickSignIn();
  }

  /**
   * Fill the email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Check the remember me checkbox
   */
  async checkRememberMe() {
    if (await this.rememberMeCheckbox.isVisible()) {
      await this.rememberMeCheckbox.check();
    }
  }

  /**
   * Click the sign in button
   */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /**
   * Navigate to sign up page
   */
  async navigateToSignUp() {
    await this.signUpLink.click();
    await this.page.waitForURL('**/signup');
  }

  /**
   * Navigate to forgot password
   */
  async navigateToForgotPassword() {
    await this.forgotPasswordLink.click();
    // Wait for navigation - adjust URL pattern based on actual implementation
  }

  /**
   * Check if there's an error message displayed
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    if (await this.hasErrorMessage()) {
      return await this.errorMessage.textContent() || '';
    }
    return '';
  }

  /**
   * Wait for successful authentication (redirect to another page)
   */
  async waitForSuccessfulAuth(expectedUrl: string = '/') {
    await this.page.waitForURL(`**${expectedUrl}`, { timeout: 10000 });
  }

  /**
   * Verify the page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  /**
   * Attempt sign in and wait for result
   */
  async signInAndWaitForResult(email: string, password: string): Promise<'success' | 'error'> {
    await this.signIn(email, password);
    
    // Wait for either success (URL change) or error message
    try {
      await Promise.race([
        this.page.waitForURL('**/', { timeout: 5000 }),
        this.errorMessage.waitFor({ timeout: 5000 })
      ]);
      
      // Check if we're still on signin page (indicates error)
      if (this.page.url().includes('/signin')) {
        return 'error';
      } else {
        return 'success';
      }
    } catch {
      // If neither happens, check current state
      if (await this.hasErrorMessage()) {
        return 'error';
      }
      return 'success';
    }
  }
}