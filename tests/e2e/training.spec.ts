import { test, expect } from '@playwright/test';
// Import test-specific Supabase client
import { supabase } from '../utils/test-supabase';
import { v4 as uuidv4 } from 'uuid';

// Test data
const adminCredentials = {
  email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
  password: process.env.TEST_ADMIN_PASSWORD || 'password123',
};

const agentCredentials = {
  email: process.env.TEST_AGENT_EMAIL || 'agent@example.com',
  password: process.env.TEST_AGENT_PASSWORD || 'password123',
};

// Helper function to debug page state
async function debugPageState(page, message) {
  if (process.env.DEBUG) {
    console.log(`DEBUG: ${message}`);
    console.log(`Current URL: ${page.url()}`);
    console.log(await page.content());
  }
}

const testModule = {
  title: `Test Module ${uuidv4().substring(0, 8)}`,
  description: 'This is a test training module created for E2E testing',
  order_index: 0,
  status: 'active',
};

const testMaterial = {
  title: `Test Material ${uuidv4().substring(0, 8)}`,
  description: 'This is a test training material created for E2E testing',
  module_type: 'pdf',
  order_index: 0,
  is_required: true,
};

// Helper function to clean up test data
async function cleanupTestData(moduleId: string) {
  // Get all materials for this module
  const { data: moduleMaterials } = await supabase
    .from('module_materials')
    .select('material_id')
    .eq('module_id', moduleId);

  if (moduleMaterials && moduleMaterials.length > 0) {
    const materialIds = moduleMaterials.map(mm => mm.material_id);

    // Delete completions for these materials
    await supabase
      .from('training_completions')
      .delete()
      .in('material_id', materialIds);

    // Delete module_materials entries
    await supabase
      .from('module_materials')
      .delete()
      .eq('module_id', moduleId);

    // Delete training_materials
    await supabase
      .from('training_materials')
      .delete()
      .in('id', materialIds);
  }

  // Delete the module
  await supabase
    .from('training_modules')
    .delete()
    .eq('id', moduleId);
}

// Add a debug test that just pauses for interactive debugging
test('Debug login page with inspector', async ({ page }) => {
  test.skip(!process.env.DEBUG_INSPECTOR, 'Only run this test with DEBUG_INSPECTOR=true');
  
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');
  console.log('Opening inspector for debugging. Press "Resume" to continue.');
  await page.pause(); // This will open the inspector UI
});

test.describe('Training Module End-to-End Test', () => {
  let moduleId: string;
  let materialId: string;
  let agentId: string;

  test('Admin can create a training module and upload material', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Always dump HTML to logs for debugging
    console.log("LOGIN PAGE HTML:\n", await page.content());
    
    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'login-page-admin.png', fullPage: true });
    
    // Try multiple selector strategies to find the email input
    try {
      // Make sure the email input is there - try different selectors
      await Promise.any([
        page.waitForSelector('input#email', { timeout: 5000 }),
        page.waitForSelector('input[type="email"]', { timeout: 5000 }),
        page.waitForSelector('input[name="email"]', { timeout: 5000 }),
        page.waitForSelector('input[placeholder*="@"]', { timeout: 5000 })
      ]);
    } catch (error) {
      console.error('Failed to find email input with any selector strategy');
      // Take another screenshot at failure point
      await page.screenshot({ path: 'login-page-admin-failure.png', fullPage: true });
      throw error;
    }
    
    // Try to find and use the most appropriate selector for filling
    try {
      // Try to use the accessibility-friendly getByLabel method first
      await page.getByLabel(/email/i).fill(adminCredentials.email);
    } catch (error) {
      console.log('Falling back to direct selectors for email field');
      // Fall back to direct selectors if getByLabel fails
      if (await page.locator('input#email').count() > 0) {
        await page.fill('input#email', adminCredentials.email);
      } else if (await page.locator('input[name="email"]').count() > 0) {
        await page.fill('input[name="email"]', adminCredentials.email);
      } else if (await page.locator('input[type="email"]').count() > 0) {
        await page.fill('input[type="email"]', adminCredentials.email);
      } else {
        throw new Error('Could not find email input with any selector');
      }
    }
    
    // Similar approach for password
    try {
      await page.getByLabel(/password/i).fill(adminCredentials.password);
    } catch (error) {
      console.log('Falling back to direct selectors for password field');
      if (await page.locator('input#password').count() > 0) {
        await page.fill('input#password', adminCredentials.password);
      } else if (await page.locator('input[name="password"]').count() > 0) {
        await page.fill('input[name="password"]', adminCredentials.password);
      } else if (await page.locator('input[type="password"]').count() > 0) {
        await page.fill('input[type="password"]', adminCredentials.password);
      } else {
        throw new Error('Could not find password input with any selector');
      }
    }
    
    // Wait for the button to be enabled before clicking
    await page.waitForSelector('button[type="submit"]:not([disabled])');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');
    
    // Navigate to training manager
    await page.goto('/training');
    await page.waitForSelector('h1:has-text("Training Manager")');
    
    // Click "Add Training Module" button
    await page.click('button:has-text("Add Training Module")');
    
    // Fill module form
    await page.fill('input#title', testModule.title);
    await page.fill('textarea#description', testModule.description);
    await page.fill('input#order', testModule.order_index.toString());
    
    // Create module
    await page.click('button:has-text("Create Module")');
    
    // Wait for success toast
    await page.waitForSelector('div[role="status"]:has-text("created successfully")');
    
    // Find the newly created module
    await page.waitForSelector(`div:has-text("${testModule.title}")`);
    
    // Expand the module
    await page.locator(`div:has-text("${testModule.title}") button`).first().click();
    
    // Click "Add Material" button
    await page.click('button:has-text("Add Material")');
    
    // Fill material form
    await page.fill('input#material-title', testMaterial.title);
    await page.fill('textarea#material-description', testMaterial.description);
    
    // Select PDF as material type
    await page.click('button#material-type');
    await page.click('div[role="option"]:has-text("PDF Document")');
    
    // Select the module
    await page.click('button#material-module');
    await page.click(`div[role="option"]:has-text("${testModule.title}")`);
    
    // Upload a test PDF file
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('./public/test-files/test.pdf');
    
    // Upload material
    await page.click('button:has-text("Upload Material")');
    
    // Wait for success toast
    await page.waitForSelector('div[role="status"]:has-text("uploaded successfully")');
    
    // Store module ID for later cleanup
    const { data: modules } = await supabase
      .from('training_modules')
      .select('id')
      .eq('title', testModule.title)
      .limit(1);
    
    if (modules && modules.length > 0) {
      moduleId = modules[0].id;
      
      // Get material ID
      const { data: materials } = await supabase
        .from('training_materials')
        .select('id')
        .eq('title', testMaterial.title)
        .limit(1);
      
      if (materials && materials.length > 0) {
        materialId = materials[0].id;
      }
    }
    
    // Verify module and material were created
    expect(moduleId).toBeDefined();
    expect(materialId).toBeDefined();
  });

  test('Agent can complete the training material', async ({ page }) => {
    // Skip if module or material wasn't created
    test.skip(!moduleId || !materialId, 'Module or material not created in previous test');
    
    // Login as agent
    await page.goto('/auth/login');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Always dump HTML to logs for debugging
    console.log("AGENT LOGIN PAGE HTML:\n", await page.content());
    
    // Take a screenshot for visual inspection
    await page.screenshot({ path: 'login-page-agent.png', fullPage: true });
    
    // Try multiple selector strategies to find the email input
    try {
      // Make sure the email input is there - try different selectors
      await Promise.any([
        page.waitForSelector('input#email', { timeout: 5000 }),
        page.waitForSelector('input[type="email"]', { timeout: 5000 }),
        page.waitForSelector('input[name="email"]', { timeout: 5000 }),
        page.waitForSelector('input[placeholder*="@"]', { timeout: 5000 })
      ]);
    } catch (error) {
      console.error('Failed to find email input with any selector strategy');
      // Take another screenshot at failure point
      await page.screenshot({ path: 'login-page-agent-failure.png', fullPage: true });
      throw error;
    }
    
    // Try to find and use the most appropriate selector for filling
    try {
      // Try to use the accessibility-friendly getByLabel method first
      await page.getByLabel(/email/i).fill(agentCredentials.email);
    } catch (error) {
      console.log('Falling back to direct selectors for email field');
      // Fall back to direct selectors if getByLabel fails
      if (await page.locator('input#email').count() > 0) {
        await page.fill('input#email', agentCredentials.email);
      } else if (await page.locator('input[name="email"]').count() > 0) {
        await page.fill('input[name="email"]', agentCredentials.email);
      } else if (await page.locator('input[type="email"]').count() > 0) {
        await page.fill('input[type="email"]', agentCredentials.email);
      } else {
        throw new Error('Could not find email input with any selector');
      }
    }
    
    // Similar approach for password
    try {
      await page.getByLabel(/password/i).fill(agentCredentials.password);
    } catch (error) {
      console.log('Falling back to direct selectors for password field');
      if (await page.locator('input#password').count() > 0) {
        await page.fill('input#password', agentCredentials.password);
      } else if (await page.locator('input[name="password"]').count() > 0) {
        await page.fill('input[name="password"]', agentCredentials.password);
      } else if (await page.locator('input[type="password"]').count() > 0) {
        await page.fill('input[type="password"]', agentCredentials.password);
      } else {
        throw new Error('Could not find password input with any selector');
      }
    }
    
    // Wait for the button to be enabled before clicking
    await page.waitForSelector('button[type="submit"]:not([disabled])');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard');
    
    // Get agent ID
    const { data: { user } } = await supabase.auth.getUser();
    agentId = user?.id || '';
    
    // Navigate to training center
    await page.goto('/agent/training');
    await page.waitForSelector('h1:has-text("Training Center")');
    
    // Find and click on the test module
    await page.click(`div:has-text("${testModule.title}")`);
    
    // Find and click on the test material
    await page.click(`div:has-text("${testMaterial.title}")`);
    
    // Wait for PDF viewer to load
    await page.waitForSelector('iframe');
    
    // Click "Mark as Completed" button
    await page.click('button:has-text("Mark as Completed")');
    
    // Wait for success toast
    await page.waitForSelector('div[role="status"]:has-text("completed")');
    
    // Verify completion record in database
    const { data: completions, error } = await supabase
      .from('training_completions')
      .select('*')
      .eq('user_id', agentId)
      .eq('material_id', materialId)
      .eq('status', 'completed');
    
    expect(error).toBeNull();
    expect(completions).toHaveLength(1);
    expect(completions?.[0].status).toBe('completed');
    expect(completions?.[0].completed_at).not.toBeNull();
  });

  test.afterAll(async () => {
    // Clean up test data
    if (moduleId) {
      await cleanupTestData(moduleId);
    }
  });
});
