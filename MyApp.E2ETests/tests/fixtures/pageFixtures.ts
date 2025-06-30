import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { EXISTING_USERS, TestUser } from './testData';

/**
 * Extended test fixtures that provide page objects and authentication helpers
 */
export interface PageFixtures {
  homePage: HomePage;
  signInPage: SignInPage;
  signUpPage: SignUpPage;
}

export interface AuthFixtures {
  authenticatedUser: Page;
  adminUser: Page;
  managerUser: Page;
  employeeUser: Page;
}

/**
 * Base test with page object fixtures
 */
export const test = base.extend<PageFixtures & AuthFixtures>({
  // Page Object fixtures
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },

  signUpPage: async ({ page }, use) => {
    const signUpPage = new SignUpPage(page);
    await use(signUpPage);
  },

  // Authenticated user fixtures
  authenticatedUser: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in with default user
    await signInUser(page, EXISTING_USERS.user);
    
    await use(page);
    await context.close();
  },

  adminUser: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in with admin user
    await signInUser(page, EXISTING_USERS.admin);
    
    await use(page);
    await context.close();
  },

  managerUser: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in with manager user
    await signInUser(page, EXISTING_USERS.manager);
    
    await use(page);
    await context.close();
  },

  employeeUser: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Sign in with employee user
    await signInUser(page, EXISTING_USERS.employee);
    
    await use(page);
    await context.close();
  }
});

/**
 * Helper function to sign in a user
 */
async function signInUser(page: Page, user: TestUser) {
  const signInPage = new SignInPage(page);
  await signInPage.goto();
  
  const result = await signInPage.signInAndWaitForResult(user.email, user.password);
  
  if (result === 'error') {
    throw new Error(`Failed to sign in user: ${user.email}`);
  }
  
  // Wait for page to load after authentication
  await page.waitForLoadState('networkidle');
}

/**
 * Custom expect function with page fixtures
 */
export { expect } from '@playwright/test';