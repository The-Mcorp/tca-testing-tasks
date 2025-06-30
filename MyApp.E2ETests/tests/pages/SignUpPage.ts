import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Sign Up page object model
 * Handles user registration functionality
 */
export class SignUpPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly signUpButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly signInLink: Locator;
  readonly termsCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"]:first-of-type, input[placeholder*="password" i]:first-of-type');
    this.confirmPasswordInput = page.locator('input[name*="confirm"], input[name*="repeat"], input[type="password"]:last-of-type');
    this.firstNameInput = page.locator('input[name*="first"], input[name*="fname"], input[placeholder*="first" i]');
    this.lastNameInput = page.locator('input[name*="last"], input[name*="lname"], input[placeholder*="last" i]');
    this.signUpButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Register")');
    this.errorMessage = page.locator('.error, .alert-danger, [role="alert"], .text-red-500');
    this.successMessage = page.locator('.success, .alert-success, .text-green-500');
    this.signInLink = page.locator('a:has-text("Sign In"), a:has-text("Login")');
    this.termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"]:near(text="Terms")');
  }

  /**
   * Navigate to the sign up page
   */
  async goto() {
    await super.goto('/signup');
    await this.waitForLoad();
  }

  /**
   * Sign up with user details
   */
  async signUp(userDetails: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    acceptTerms?: boolean;
  }) {
    if (userDetails.firstName && await this.firstNameInput.isVisible()) {
      await this.firstNameInput.fill(userDetails.firstName);
    }
    
    if (userDetails.lastName && await this.lastNameInput.isVisible()) {
      await this.lastNameInput.fill(userDetails.lastName);
    }
    
    await this.emailInput.fill(userDetails.email);
    await this.passwordInput.fill(userDetails.password);
    
    if (userDetails.confirmPassword && await this.confirmPasswordInput.isVisible()) {
      await this.confirmPasswordInput.fill(userDetails.confirmPassword);
    }
    
    if (userDetails.acceptTerms && await this.termsCheckbox.isVisible()) {
      await this.termsCheckbox.check();
    }
    
    await this.signUpButton.click();
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Fill confirm password field
   */
  async fillConfirmPassword(confirmPassword: string) {
    if (await this.confirmPasswordInput.isVisible()) {
      await this.confirmPasswordInput.fill(confirmPassword);
    }
  }

  /**
   * Fill first name field
   */
  async fillFirstName(firstName: string) {
    if (await this.firstNameInput.isVisible()) {
      await this.firstNameInput.fill(firstName);
    }
  }

  /**
   * Fill last name field
   */
  async fillLastName(lastName: string) {
    if (await this.lastNameInput.isVisible()) {
      await this.lastNameInput.fill(lastName);
    }
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms() {
    if (await this.termsCheckbox.isVisible()) {
      await this.termsCheckbox.check();
    }
  }

  /**
   * Click the sign up button
   */
  async clickSignUp() {
    await this.signUpButton.click();
  }

  /**
   * Navigate to sign in page
   */
  async navigateToSignIn() {
    await this.signInLink.click();
    await this.page.waitForURL('**/signin');
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
   * Check if there's a success message displayed
   */
  async hasSuccessMessage(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  /**
   * Get the success message text
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.hasSuccessMessage()) {
      return await this.successMessage.textContent() || '';
    }
    return '';
  }

  /**
   * Wait for successful registration
   */
  async waitForSuccessfulRegistration() {
    // Wait for either success message or redirect
    await Promise.race([
      this.successMessage.waitFor({ timeout: 10000 }),
      this.page.waitForURL('**/signup-confirm', { timeout: 10000 }),
      this.page.waitForURL('**/', { timeout: 10000 })
    ]);
  }

  /**
   * Verify the page has loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
  }

  /**
   * Attempt sign up and wait for result
   */
  async signUpAndWaitForResult(userDetails: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
    acceptTerms?: boolean;
  }): Promise<'success' | 'error'> {
    await this.signUp(userDetails);
    
    try {
      await Promise.race([
        this.successMessage.waitFor({ timeout: 5000 }),
        this.page.waitForURL('**/signup-confirm', { timeout: 5000 }),
        this.errorMessage.waitFor({ timeout: 5000 })
      ]);
      
      if (await this.hasErrorMessage()) {
        return 'error';
      } else {
        return 'success';
      }
    } catch {
      // If no clear result, check current state
      if (await this.hasErrorMessage()) {
        return 'error';
      }
      return 'success';
    }
  }
}