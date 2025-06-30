/**
 * Test user data fixtures
 * Provides consistent test data for authentication and user management tests
 */

export interface TestUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'admin' | 'manager' | 'employee' | 'user';
}

/**
 * Pre-configured test users that should exist in the system
 * These match the users mentioned in the README
 */
export const EXISTING_USERS: Record<string, TestUser> = {
  admin: {
    email: 'admin@email.com',
    password: 'p@55wOrd',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  manager: {
    email: 'manager@email.com',
    password: 'p@55wOrd',
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager'
  },
  employee: {
    email: 'employee@email.com',
    password: 'p@55wOrd',
    firstName: 'Employee',
    lastName: 'User',
    role: 'employee'
  },
  user: {
    email: 'new@user.com',
    password: 'p@55wOrd',
    firstName: 'Test',
    lastName: 'User',
    role: 'user'
  }
};

/**
 * Generate test user data for registration tests
 */
export function generateTestUser(prefix: string = 'test'): TestUser {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  
  return {
    email: `${prefix}.${timestamp}.${random}@test.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  };
}

/**
 * Invalid user data for negative testing
 */
export const INVALID_USERS = {
  invalidEmail: {
    email: 'invalid-email',
    password: 'ValidPassword123!',
    firstName: 'Test',
    lastName: 'User'
  },
  shortPassword: {
    email: 'test@example.com',
    password: '123',
    firstName: 'Test',
    lastName: 'User'
  },
  emptyFields: {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  },
  sqlInjection: {
    email: 'test@example.com',
    password: "'; DROP TABLE Users; --",
    firstName: 'Test',
    lastName: 'User'
  },
  xssAttempt: {
    email: 'test@example.com',
    password: 'ValidPassword123!',
    firstName: '<script>alert("xss")</script>',
    lastName: 'User'
  }
};

/**
 * Test environment configuration
 */
export const TEST_CONFIG = {
  timeouts: {
    short: 5000,
    medium: 15000,
    long: 30000
  },
  retries: {
    flaky: 2,
    stable: 0
  },
  urls: {
    base: process.env.BASE_URL || 'https://localhost:5001',
    api: process.env.API_URL || 'https://localhost:5001/api'
  }
};

/**
 * Test data for different scenarios
 */
export const TEST_SCENARIOS = {
  validRegistration: {
    description: 'Valid user registration with all required fields',
    user: generateTestUser('valid')
  },
  duplicateEmail: {
    description: 'Registration with existing email address',
    user: { ...EXISTING_USERS.user, email: EXISTING_USERS.user.email }
  },
  invalidEmail: {
    description: 'Registration with invalid email format',
    user: INVALID_USERS.invalidEmail
  },
  weakPassword: {
    description: 'Registration with weak password',
    user: INVALID_USERS.shortPassword
  },
  validLogin: {
    description: 'Valid login with existing user',
    user: EXISTING_USERS.user
  },
  invalidCredentials: {
    description: 'Login with invalid credentials',
    user: {
      email: EXISTING_USERS.user.email,
      password: 'WrongPassword123!'
    }
  },
  nonExistentUser: {
    description: 'Login with non-existent user',
    user: {
      email: 'nonexistent@test.com',
      password: 'Password123!'
    }
  }
};