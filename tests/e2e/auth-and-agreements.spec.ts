import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Test credentials
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

// Test data
const testFileName = `test-agreement-${Date.now()}.pdf`;
const testFilePath = path.join(__dirname, '../fixtures/sample-agreement.pdf');

// Create test fixture if it doesn't exist
test.beforeAll(async () => {
  const fixturesDir = path.join(__dirname, '../fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  
  // Create a simple PDF if it doesn't exist
  if (!fs.existsSync(testFilePath)) {
    // Simple PDF content
    const pdfContent = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Resources<<>>/Contents 4 0 R/Parent 2 0 R>>endobj 4 0 obj<</Length 21>>stream\nBT /F1 12 Tf 100 700 Td (Test Agreement) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\n0000000199 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n269\n%%EOF';
    fs.writeFileSync(testFilePath, pdfContent);
  }
});

test.describe('Authentication and Agreement Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/auth', { waitUntil: 'networkidle' });
    
    // Wait for the login form to be visible
    await page.waitForSelector('form', { state: 'visible' });
  });

  test('should login successfully and navigate to dashboard', async ({ page }) => {
    // Fill in login form
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    
    // Click login button and wait for navigation
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/agent/agreement', { waitUntil: 'networkidle' });
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*\/agent\/agreement/);
    
    // Verify user is logged in by checking for profile elements
    await expect(page.getByRole('button', { name: /profile/i })).toBeVisible();
  });

  test('should display error message with invalid credentials', async ({ page }) => {
    // Fill in login form with invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Click login button
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for error toast to appear
    await page.waitForSelector('[data-sonner-toast]', { state: 'visible' });
    
    // Verify error message is displayed
    const errorToast = await page.locator('[data-sonner-toast]').innerText();
    expect(errorToast).toContain('Login failed');
    
    // Verify we're still on the login page
    await expect(page).toHaveURL(/.*\/auth/);
  });

  test('should upload and view an agreement', async ({ page }) => {
    // Login first
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/agent/agreement', { waitUntil: 'networkidle' });
    
    // Navigate to agreements page
    await page.getByRole('link', { name: /agreements/i }).click();
    await page.waitForURL('**/agreements', { waitUntil: 'networkidle' });
    
    // Click on upload button
    await page.getByRole('button', { name: /upload/i }).click();
    
    // Wait for upload dialog to appear
    await page.waitForSelector('input[type="file"]', { state: 'visible' });
    
    // Upload file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(testFilePath);
    
    // Click upload button in dialog
    await page.getByRole('button', { name: /upload/i }).click();
    
    // Wait for success message
    await page.waitForSelector('[data-sonner-toast]', { state: 'visible' });
    const successToast = await page.locator('[data-sonner-toast]').innerText();
    expect(successToast).toContain('uploaded successfully');
    
    // Verify the agreement appears in the list
    await page.waitForSelector('[data-test="agreement-list-item"]', { state: 'visible' });
    const agreementItems = await page.locator('[data-test="agreement-list-item"]').count();
    expect(agreementItems).toBeGreaterThan(0);
    
    // Click on the first agreement to view it
    await page.locator('[data-test="agreement-list-item"]').first().click();
    
    // Wait for PDF viewer to load
    await page.waitForSelector('[data-test="pdf-viewer"]', { state: 'visible' });
    
    // Verify PDF viewer is visible
    await expect(page.locator('[data-test="pdf-viewer"]')).toBeVisible();
  });

  test('should log out successfully', async ({ page }) => {
    // Login first
    await page.getByLabel('Email').fill(TEST_EMAIL);
    await page.getByLabel('Password').fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/agent/agreement', { waitUntil: 'networkidle' });
    
    // Click on profile menu
    await page.getByRole('button', { name: /profile/i }).click();
    
    // Wait for dropdown menu and click logout
    await page.waitForSelector('[role="menuitem"]', { state: 'visible' });
    await page.getByRole('menuitem', { name: /log out/i }).click();
    
    // Wait for redirect to login page
    await page.waitForURL('**/auth', { waitUntil: 'networkidle' });
    
    // Verify we're on the login page
    await expect(page).toHaveURL(/.*\/auth/);
    
    // Verify login form is visible
    await expect(page.getByLabel('Email')).toBeVisible();
  });
});
