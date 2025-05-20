# Testing Guide for Agent Agreement Nexus

This directory contains tests for the Agent Agreement Nexus application. We use Vitest as our test runner and Testing Library for rendering and interacting with React components. For end-to-end testing, we use Playwright.

## Test Structure

The tests are organized as follows:

- `setup.ts`: Configuration for Vitest and Testing Library, including global mocks for Supabase
- `utils.tsx`: Helper functions for rendering components with all necessary providers
- `auth.test.tsx`: Tests for authentication (login and signup)
- `agreement.test.tsx`: Tests for viewing and signing agreements
- `dashboard.test.tsx`: Tests for the agent dashboard
- `attachments.test.tsx`: Tests for agreement attachments
- `training-e2e.test.ts`: End-to-end test for the training module system
- `create-test-pdf.js`: Utility script to generate a test PDF for training module tests

## Running Tests

You can run the tests using the following npm scripts:

```bash
# Run all unit tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run all end-to-end tests
npm run test:e2e

# Run only the training module end-to-end test
npm run test:e2e:training
```

## End-to-End Testing

We use Playwright for end-to-end testing to verify critical user flows across the application.

### Training Module End-to-End Test

The `training-e2e.test.ts` file contains a comprehensive end-to-end test that verifies the training module system works correctly. This test:

1. Logs in as an admin and creates a new training module with a PDF material
2. Logs in as an agent and completes the training material
3. Verifies that a record is correctly created in the `training_completions` table

To run this test, you need:

1. A running development server (the test will start one automatically)
2. Valid admin and agent credentials (set via environment variables or use the defaults in the test file)
3. A test PDF file (generated automatically by the `create-test-pdf.js` script)

Before running the test for the first time, generate the test PDF:

```bash
node src/test/create-test-pdf.js
```

Then run the test:

```bash
npm run test:e2e:training
```

## Writing New Tests

When writing new tests, follow these guidelines:

1. Use the `render` function from `./utils.tsx` instead of the one from Testing Library to ensure all providers are included
2. Mock external dependencies and hooks using `vi.mock()`
3. For end-to-end tests, use Playwright's page object model for better maintainability
3. Use `data-testid` attributes for elements that don't have accessible roles or text
4. Use Testing Library's `userEvent` for simulating user interactions

## CI Integration

Tests are automatically run in the CI pipeline as part of the GitHub Actions workflow. The workflow is configured to:

1. Run tests before deployment
2. Generate coverage reports
3. Fail the build if tests fail

See `.github/workflows/test.yml` and `.github/workflows/vercel-deploy.yml` for the CI configuration.

## Mocking Strategy

For components that depend on Supabase or other external services:

1. Mock the service in `setup.ts` for global mocks
2. Use component-specific mocks in individual test files
3. Use `vi.fn()` for functions that need to be spied on or have their return values controlled
