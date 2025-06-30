# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end (E2E) tests for the TCA Testing Tasks application using Playwright. These tests complement the existing unit tests by verifying the entire application flow from a user's perspective.

## 🎯 Testing Philosophy

The E2E tests are designed to:
- **Test Critical User Journeys**: Focus on the most important user flows and business scenarios
- **Validate Cross-Browser Compatibility**: Ensure the application works across different browsers
- **Verify Visual Consistency**: Use visual regression testing to catch UI changes
- **Test Real User Interactions**: Simulate actual user behavior with clicks, form submissions, and navigation
- **Complement Unit Tests**: Cover integration scenarios that unit tests cannot verify

## 📁 Directory Structure

```
MyApp.E2ETests/
├── tests/
│   ├── fixtures/
│   │   ├── pageFixtures.ts      # Custom test fixtures with page objects
│   │   └── testData.ts          # Test data and user credentials
│   ├── pages/
│   │   ├── BasePage.ts          # Base page object with common functionality
│   │   ├── HomePage.ts          # Home page object model
│   │   ├── SignInPage.ts        # Sign in page object model
│   │   └── SignUpPage.ts        # Sign up page object model
│   ├── auth.signin.spec.ts      # Authentication - Sign in tests
│   ├── auth.signup.spec.ts      # Authentication - Sign up tests
│   └── home.spec.ts             # Home page tests
├── playwright.config.ts         # Playwright configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

Before running the E2E tests, ensure you have:
1. The main application running (backend + frontend)
2. Node.js installed (version 16 or higher)
3. The test database populated with default users

### Installation

1. **Navigate to the E2E tests directory:**
   ```bash
   cd MyApp.E2ETests
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npm run install
   ```

4. **Install system dependencies (Linux/CI):**
   ```bash
   npm run install:deps
   ```

### Running Tests

#### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

#### Docker Execution (Recommended for CI/CD)

```bash
# Run tests in Docker (as mentioned in the MCP integration)
npm run test:docker
```

#### Specific Test Execution

```bash
# Run specific test file
npx playwright test auth.signin.spec.ts

# Run specific test by name
npx playwright test --grep "should sign in with valid credentials"

# Run tests for specific browser
npx playwright test --project=chromium
```

#### Test Reports

```bash
# Show test report
npm run test:report

# Generate and open HTML report
npx playwright show-report
```

## 🧪 Test Categories

### 1. Authentication Tests (`auth.*.spec.ts`)

**Sign In Tests (`auth.signin.spec.ts`):**
- Valid credential authentication
- Invalid credential handling
- Security testing (SQL injection, XSS)
- Form validation
- Remember me functionality
- Visual regression testing

**Sign Up Tests (`auth.signup.spec.ts`):**
- New user registration
- Email validation and uniqueness
- Password strength requirements
- Form validation
- Security testing
- Complete registration flow

### 2. Home Page Tests (`home.spec.ts`)

- Page loading and rendering
- Navigation functionality
- Responsive design testing
- Performance verification
- Console error detection
- Visual regression testing

### 3. Page Object Model

All tests use the Page Object Model pattern for maintainability:

- **BasePage**: Common functionality shared across all pages
- **HomePage**: Home page specific actions and verifications
- **SignInPage**: Authentication form handling
- **SignUpPage**: User registration form handling

### 4. Test Data Management

- **Existing Users**: Pre-configured users (admin, manager, employee, user)
- **Generated Users**: Dynamic test data for registration scenarios
- **Invalid Data**: Test data for negative testing scenarios
- **Security Payloads**: Data for security testing

## 🔧 Configuration

### Environment Variables

```bash
# Base URL for the application
BASE_URL=https://localhost:5001

# API URL (optional)
API_URL=https://localhost:5001/api
```

### Playwright Configuration

The `playwright.config.ts` file includes:

- **Multi-browser support**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Automatic server startup**: Starts the .NET application before tests
- **Test artifacts**: Screenshots, videos, and traces on failure
- **Parallel execution**: Optimized for CI/CD environments
- **Retry logic**: Automatic retries for flaky tests

### Browser Matrix

Tests run across multiple browsers and viewports:
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)
- **Tablet**: iPad viewports

## 📊 Test Results and Reporting

### HTML Report

Playwright generates a comprehensive HTML report with:
- Test execution summary
- Failed test details with screenshots
- Trace viewer for debugging
- Performance metrics

### CI/CD Integration

The tests are configured for continuous integration:

```yaml
# Example GitHub Actions workflow
- name: Run E2E Tests
  run: |
    cd MyApp.E2ETests
    npm ci
    npm run test:docker
```

### Visual Regression Testing

Screenshots are automatically captured for:
- Page layouts and components
- Error states and messages
- Mobile and desktop viewports
- Different browser renderings

## 🔍 Debugging Tests

### Interactive Debugging

```bash
# Run with Playwright Inspector
npm run test:debug

# Generate test code with Codegen
npm run test:codegen
```

### Common Issues and Solutions

1. **Test Timeouts**: 
   - Increase timeout in `playwright.config.ts`
   - Check if application is running
   - Verify network connectivity

2. **Visual Regression Failures**:
   - Update baseline screenshots: `npx playwright test --update-snapshots`
   - Check for environment differences (fonts, OS)

3. **Authentication Issues**:
   - Verify test users exist in database
   - Check user credentials in `testData.ts`
   - Ensure database is in correct state

4. **Flaky Tests**:
   - Add proper wait conditions
   - Use `page.waitForLoadState('networkidle')`
   - Implement retry logic for specific actions

## 🎯 Test Coverage Goals

### Functional Coverage
- ✅ User authentication (sign in/sign up)
- ✅ Navigation and routing
- ✅ Form validation and submission
- ✅ Error handling
- 🔄 Profile management (to be added)
- 🔄 Admin functionality (to be added)
- 🔄 Booking system (to be added)

### Cross-Browser Coverage
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile browsers

### Visual Coverage
- ✅ Page layouts
- ✅ Component rendering
- ✅ Error states
- ✅ Responsive design

## 📈 Performance Testing

Basic performance metrics are captured:
- Page load times
- Network request monitoring
- Console error detection
- Core Web Vitals (planned)

## 🔐 Security Testing

Security-focused test scenarios:
- SQL injection attempts
- XSS payload injection
- Authentication bypass attempts
- Rate limiting verification
- Input validation testing

## 🚀 MCP Integration

The tests support MCP (Model Context Protocol) integration with Docker:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "--init", "mcp/playwright"],
      "tools": ["*"]
    }
  }
}
```

This allows running tests in a consistent Docker environment, ideal for:
- CI/CD pipelines
- Cross-platform testing
- Isolated test execution
- Reproducible test environments

## 📚 Best Practices

### Writing Tests
1. **Use descriptive test names**: Clearly describe what is being tested
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Keep tests independent**: Each test should be able to run in isolation
4. **Use Page Object Model**: Maintain reusable page objects
5. **Handle async operations**: Use proper waiting strategies

### Test Data Management
1. **Use fixtures**: Centralize test data in fixture files
2. **Generate dynamic data**: Use unique test data to avoid conflicts
3. **Clean up test data**: Ensure tests don't leave persistent data
4. **Use realistic data**: Test with data that resembles production

### Debugging and Maintenance
1. **Take screenshots**: Capture visual evidence of test states
2. **Use trace files**: Enable tracing for complex debugging
3. **Monitor test stability**: Track and fix flaky tests
4. **Regular updates**: Keep tests updated with application changes

## 🤝 Contributing

When adding new E2E tests:

1. **Follow the existing structure**: Use the established patterns
2. **Add page objects**: Create reusable page objects for new pages
3. **Include visual tests**: Add screenshot tests for visual regression
4. **Test multiple scenarios**: Cover both positive and negative cases
5. **Update documentation**: Keep this README updated with new test categories

## 📞 Support

For issues with E2E tests:
1. Check the test output and HTML report
2. Review the trace files for failed tests
3. Verify the application is running correctly
4. Check the browser console for errors
5. Refer to the [Playwright documentation](https://playwright.dev/docs/intro)