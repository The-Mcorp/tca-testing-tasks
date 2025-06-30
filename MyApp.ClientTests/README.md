# MyApp.ClientTests

This directory contains unit tests for the MyApp.Client Vue.js application, specifically focusing on the `api.ts` module.

## Overview

The test suite provides comprehensive coverage of the `MyApp.Client/src/api.ts` file, testing all exported functions and ensuring robust error handling.

## Test Framework

- **Testing Framework**: [Vitest](https://vitest.dev/)
- **Test Environment**: jsdom
- **Coverage Provider**: v8
- **Mocking**: Vitest built-in mocking capabilities

## Test Structure

### api.test.ts

This file contains unit tests for the `api.ts` module, covering:

#### Tested Functions:
1. **client** - JsonServiceClient instance export
2. **useApp()** - Function returning object with load method and client
3. **checkAuth()** - Authentication function with error handling
4. **logout()** - Logout function 
5. **apiUrl()** - URL construction utility function

#### Test Categories:

**Module Structure Tests:**
- Verifies all expected exports are present
- Validates function signatures and types

**useApp Function Tests:**
- Object structure validation
- Consistency across multiple calls
- Client reference sharing

**checkAuth Function Tests:**
- Async function verification
- Error handling without throwing exceptions
- Return type validation

**logout Function Tests:**
- Async function verification
- Error resilience testing

**apiUrl Function Tests:**
- String return type validation
- Path format handling (various formats)
- Path inclusion in results
- Global API_URL usage

**Error Resilience Tests:**
- Module loading without throwing
- Missing global variable handling
- Type safety verification

**Integration Tests:**
- Location search parameter handling
- API_URL configuration changes
- Error scenario recovery

## Running Tests

### Prerequisites

1. Ensure you have Node.js installed
2. Navigate to the MyApp.ClientTests directory:
   ```bash
   cd MyApp.ClientTests
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Test Commands

```bash
# Run all tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (interactive)
npm test

# Run tests with UI interface
npm run test:ui
```

### Coverage Goals

The tests aim to achieve at least 80% coverage across:
- Lines
- Functions
- Branches
- Statements

## Test Philosophy

These tests focus on:

1. **Structural Validation**: Ensuring the module exports the expected functions and objects
2. **Type Safety**: Verifying functions accept correct parameter types
3. **Error Resilience**: Testing that functions handle errors gracefully
4. **Behavioral Consistency**: Ensuring consistent behavior across different scenarios

## Mocking Strategy

Due to the complexity of ServiceStack dependencies, the tests use a pragmatic mocking approach:

- **External Libraries**: ServiceStack client and Vue composables are mocked
- **Global Variables**: location and API_URL are mocked for controlled testing
- **Network Calls**: All HTTP requests are mocked to avoid external dependencies

## Limitations

- Some complex ServiceStack behaviors cannot be fully mocked
- Coverage reporting may not reflect actual line coverage due to mocking limitations
- Focus is on testable behavior rather than internal implementation details

## Test Documentation

Each test includes detailed documentation explaining:
- **What** is being tested
- **Expected** behavior
- **Why** the test is important

This ensures the test suite serves as both validation and documentation of the expected API behavior.

## Continuous Integration

These tests are designed to:
- Run quickly in CI environments
- Not require external dependencies
- Provide clear failure messages
- Be reliable and not flaky

## Contributing

When adding new tests:

1. Follow the existing documentation pattern
2. Include clear test descriptions
3. Test both success and error scenarios
4. Ensure tests are independent and can run in any order
5. Mock external dependencies appropriately