import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home page object model
 * Represents the main landing page of the application
 */
export class HomePage extends BasePage {
  readonly navHeader: Locator;
  readonly mainContent: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;
  readonly profileLink: Locator;
  readonly adminLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navHeader = page.locator('nav, .nav-header, header');
    this.mainContent = page.locator('main, .main-content, #app');
    this.signInLink = page.locator('a[href*="signin"], a:has-text("Sign In"), button:has-text("Sign In")');
    this.signUpLink = page.locator('a[href*="signup"], a:has-text("Sign Up"), button:has-text("Sign Up")');
    this.profileLink = page.locator('a[href*="profile"], a:has-text("Profile")');
    this.adminLink = page.locator('a[href*="admin"], a:has-text("Admin")');
  }

  /**
   * Navigate to the home page
   */
  async goto() {
    await super.goto('/');
    await this.waitForLoad();
  }

  /**
   * Check if the page has loaded correctly
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.mainContent.waitFor({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigate to the sign in page
   */
  async navigateToSignIn() {
    await this.signInLink.first().click();
    await this.page.waitForURL('**/signin');
  }

  /**
   * Navigate to the sign up page
   */
  async navigateToSignUp() {
    await this.signUpLink.first().click();
    await this.page.waitForURL('**/signup');
  }

  /**
   * Navigate to the profile page (requires authentication)
   */
  async navigateToProfile() {
    await this.profileLink.first().click();
    await this.page.waitForURL('**/profile');
  }

  /**
   * Navigate to the admin page (requires admin authentication)
   */
  async navigateToAdmin() {
    await this.adminLink.first().click();
    await this.page.waitForURL('**/admin**');
  }

  /**
   * Check if user is authenticated (by looking for profile/logout links)
   */
  async isUserAuthenticated(): Promise<boolean> {
    const profileVisible = await this.profileLink.first().isVisible();
    const logoutLink = this.page.locator('a:has-text("Logout"), a:has-text("Sign Out"), button:has-text("Logout")');
    const logoutVisible = await logoutLink.first().isVisible();
    
    return profileVisible || logoutVisible;
  }

  /**
   * Get the navigation links that are currently visible
   */
  async getVisibleNavLinks(): Promise<string[]> {
    const links = await this.navHeader.locator('a').all();
    const visibleLinks: string[] = [];
    
    for (const link of links) {
      if (await link.isVisible()) {
        const text = await link.textContent();
        if (text && text.trim()) {
          visibleLinks.push(text.trim());
        }
      }
    }
    
    return visibleLinks;
  }

  /**
   * Verify the page title
   */
  async verifyTitle(expectedTitle?: string) {
    if (expectedTitle) {
      await expect(this.page).toHaveTitle(expectedTitle);
    } else {
      // Check that title exists and is not empty
      const title = await this.page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    }
  }
}