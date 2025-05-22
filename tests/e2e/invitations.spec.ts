import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';

test.describe('Invitation Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/auth', { waitUntil: 'networkidle' });
    
    // Wait for the login form to be visible
    await page.waitForSelector('form', { state: 'visible' });
    
    // Login as admin
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/dashboard', { waitUntil: 'networkidle' });
    
    // Navigate to invitations page
    await page.getByRole('link', { name: /invitations/i }).click();
    await page.waitForURL('**/invitations', { waitUntil: 'networkidle' });
  });

  test('should create and send a new invitation', async ({ page }) => {
    // Generate test data
    const testEmail = faker.internet.email();
    
    // Click on "New Invitation" button
    await page.getByRole('button', { name: /new invitation/i }).click();
    
    // Wait for dialog to appear
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Fill in invitation form
    await page.getByLabel(/email/i).fill(testEmail);
    
    // Select agent role
    await page.getByRole('combobox', { name: /role/i }).click();
    await page.getByRole('option', { name: /agent/i }).click();
    
    // Click send invitation button
    await page.getByRole('button', { name: /send invitation/i }).click();
    
    // Wait for success message
    await page.waitForSelector('[data-sonner-toast]', { state: 'visible' });
    const successToast = await page.locator('[data-sonner-toast]').innerText();
    expect(successToast).toContain('Invitation sent');
    
    // Verify the invitation appears in the list
    await page.waitForSelector('table', { state: 'visible' });
    const invitationRow = page.getByRole('row', { name: new RegExp(testEmail, 'i') });
    await expect(invitationRow).toBeVisible();
    
    // Verify invitation status is "Pending"
    const statusCell = invitationRow.getByRole('cell', { name: /pending/i });
    await expect(statusCell).toBeVisible();
  });
  
  test('should filter and search invitations', async ({ page }) => {
    // Wait for invitation table to load
    await page.waitForSelector('table', { state: 'visible' });
    
    // Get initial count of invitations
    const initialCount = await page.getByRole('row').count() - 1; // Subtract header row
    
    // Filter by status (Pending)
    await page.getByRole('combobox', { name: /status/i }).click();
    await page.getByRole('option', { name: /pending/i }).click();
    
    // Wait for filtered results
    await page.waitForTimeout(500); // Small delay for filter to apply
    
    // Get filtered count
    const filteredCount = await page.getByRole('row').count() - 1; // Subtract header row
    
    // Verify filtering worked (count may be the same if all invitations are pending)
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Search for a specific invitation
    const firstInvitationEmail = await page.getByRole('row').nth(1).getByRole('cell').first().innerText();
    
    // Use the first few characters of the email to search
    const searchTerm = firstInvitationEmail.substring(0, 5);
    await page.getByPlaceholder(/search/i).fill(searchTerm);
    
    // Wait for search results
    await page.waitForTimeout(500); // Small delay for search to apply
    
    // Verify search results contain the email
    const searchResultsCount = await page.getByRole('row').count() - 1; // Subtract header row
    expect(searchResultsCount).toBeGreaterThan(0);
    
    // Clear search
    await page.getByPlaceholder(/search/i).clear();
    
    // Wait for results to reset
    await page.waitForTimeout(500);
    
    // Verify results are reset
    const resetCount = await page.getByRole('row').count() - 1; // Subtract header row
    expect(resetCount).toBeGreaterThanOrEqual(searchResultsCount);
  });
  
  test('should resend an invitation', async ({ page }) => {
    // Wait for invitation table to load
    await page.waitForSelector('table', { state: 'visible' });
    
    // Find a pending invitation
    const pendingRow = page.getByRole('row', { name: /pending/i }).first();
    
    // Click on the actions menu for this invitation
    await pendingRow.getByRole('button', { name: /actions/i }).click();
    
    // Wait for dropdown menu and click resend
    await page.waitForSelector('[role="menuitem"]', { state: 'visible' });
    await page.getByRole('menuitem', { name: /resend/i }).click();
    
    // Wait for confirmation dialog
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Confirm resend
    await page.getByRole('button', { name: /resend/i }).click();
    
    // Wait for success message
    await page.waitForSelector('[data-sonner-toast]', { state: 'visible' });
    const successToast = await page.locator('[data-sonner-toast]').innerText();
    expect(successToast).toContain('Invitation resent');
  });
  
  test('should cancel an invitation', async ({ page }) => {
    // Wait for invitation table to load
    await page.waitForSelector('table', { state: 'visible' });
    
    // Find a pending invitation
    const pendingRow = page.getByRole('row', { name: /pending/i }).first();
    
    // Get the email of the invitation for verification later
    const invitationEmail = await pendingRow.getByRole('cell').first().innerText();
    
    // Click on the actions menu for this invitation
    await pendingRow.getByRole('button', { name: /actions/i }).click();
    
    // Wait for dropdown menu and click cancel
    await page.waitForSelector('[role="menuitem"]', { state: 'visible' });
    await page.getByRole('menuitem', { name: /cancel/i }).click();
    
    // Wait for confirmation dialog
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Confirm cancellation
    await page.getByRole('button', { name: /cancel invitation/i }).click();
    
    // Wait for success message
    await page.waitForSelector('[data-sonner-toast]', { state: 'visible' });
    const successToast = await page.locator('[data-sonner-toast]').innerText();
    expect(successToast).toContain('Invitation cancelled');
    
    // Verify the invitation status is now "Expired" or has been removed
    // First check if it's been removed
    const rowWithEmail = page.getByRole('row', { name: new RegExp(invitationEmail, 'i') });
    const isVisible = await rowWithEmail.isVisible().catch(() => false);
    
    if (isVisible) {
      // If still visible, check if status is now "Expired"
      const statusCell = rowWithEmail.getByRole('cell', { name: /expired/i });
      await expect(statusCell).toBeVisible();
    }
    // If not visible, the row was removed, which is also a valid outcome
  });
});
