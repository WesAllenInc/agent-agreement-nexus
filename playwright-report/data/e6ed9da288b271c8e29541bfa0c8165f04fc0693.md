# Test info

- Name: Debug login page with inspector
- Location: C:\App DEV\agent-agreement-nexus\agent-agreement-nexus\tests\e2e\training.spec.ts:79:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:5173/auth/login", waiting until "load"

    at C:\App DEV\agent-agreement-nexus\agent-agreement-nexus\tests\e2e\training.spec.ts:82:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | // Import test-specific Supabase client
   3 | import { supabase } from '../utils/test-supabase';
   4 | import { v4 as uuidv4 } from 'uuid';
   5 |
   6 | // Test data
   7 | const adminCredentials = {
   8 |   email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
   9 |   password: process.env.TEST_ADMIN_PASSWORD || 'password123',
   10 | };
   11 |
   12 | const agentCredentials = {
   13 |   email: process.env.TEST_AGENT_EMAIL || 'agent@example.com',
   14 |   password: process.env.TEST_AGENT_PASSWORD || 'password123',
   15 | };
   16 |
   17 | // Helper function to debug page state
   18 | async function debugPageState(page, message) {
   19 |   if (process.env.DEBUG) {
   20 |     console.log(`DEBUG: ${message}`);
   21 |     console.log(`Current URL: ${page.url()}`);
   22 |     console.log(await page.content());
   23 |   }
   24 | }
   25 |
   26 | const testModule = {
   27 |   title: `Test Module ${uuidv4().substring(0, 8)}`,
   28 |   description: 'This is a test training module created for E2E testing',
   29 |   order_index: 0,
   30 |   status: 'active',
   31 | };
   32 |
   33 | const testMaterial = {
   34 |   title: `Test Material ${uuidv4().substring(0, 8)}`,
   35 |   description: 'This is a test training material created for E2E testing',
   36 |   module_type: 'pdf',
   37 |   order_index: 0,
   38 |   is_required: true,
   39 | };
   40 |
   41 | // Helper function to clean up test data
   42 | async function cleanupTestData(moduleId: string) {
   43 |   // Get all materials for this module
   44 |   const { data: moduleMaterials } = await supabase
   45 |     .from('module_materials')
   46 |     .select('material_id')
   47 |     .eq('module_id', moduleId);
   48 |
   49 |   if (moduleMaterials && moduleMaterials.length > 0) {
   50 |     const materialIds = moduleMaterials.map(mm => mm.material_id);
   51 |
   52 |     // Delete completions for these materials
   53 |     await supabase
   54 |       .from('training_completions')
   55 |       .delete()
   56 |       .in('material_id', materialIds);
   57 |
   58 |     // Delete module_materials entries
   59 |     await supabase
   60 |       .from('module_materials')
   61 |       .delete()
   62 |       .eq('module_id', moduleId);
   63 |
   64 |     // Delete training_materials
   65 |     await supabase
   66 |       .from('training_materials')
   67 |       .delete()
   68 |       .in('id', materialIds);
   69 |   }
   70 |
   71 |   // Delete the module
   72 |   await supabase
   73 |     .from('training_modules')
   74 |     .delete()
   75 |     .eq('id', moduleId);
   76 | }
   77 |
   78 | // Add a debug test that just pauses for interactive debugging
   79 | test('Debug login page with inspector', async ({ page }) => {
   80 |   test.skip(!process.env.DEBUG_INSPECTOR, 'Only run this test with DEBUG_INSPECTOR=true');
   81 |   
>  82 |   await page.goto('/auth/login');
      |              ^ Error: page.goto: Target page, context or browser has been closed
   83 |   await page.waitForLoadState('networkidle');
   84 |   console.log('Opening inspector for debugging. Press "Resume" to continue.');
   85 |   await page.pause(); // This will open the inspector UI
   86 | });
   87 |
   88 | test.describe('Training Module End-to-End Test', () => {
   89 |   let moduleId: string;
   90 |   let materialId: string;
   91 |   let agentId: string;
   92 |
   93 |   test('Admin can create a training module and upload material', async ({ page }) => {
   94 |     // Login as admin
   95 |     await page.goto('/auth/login');
   96 |     
   97 |     // Wait for the page to be fully loaded
   98 |     await page.waitForLoadState('networkidle');
   99 |     
  100 |     // Always dump HTML to logs for debugging
  101 |     console.log("LOGIN PAGE HTML:\n", await page.content());
  102 |     
  103 |     // Take a screenshot for visual inspection
  104 |     await page.screenshot({ path: 'login-page-admin.png', fullPage: true });
  105 |     
  106 |     // Try multiple selector strategies to find the email input
  107 |     try {
  108 |       // Make sure the email input is there - try different selectors
  109 |       await Promise.any([
  110 |         page.waitForSelector('input#email', { timeout: 5000 }),
  111 |         page.waitForSelector('input[type="email"]', { timeout: 5000 }),
  112 |         page.waitForSelector('input[name="email"]', { timeout: 5000 }),
  113 |         page.waitForSelector('input[placeholder*="@"]', { timeout: 5000 })
  114 |       ]);
  115 |     } catch (error) {
  116 |       console.error('Failed to find email input with any selector strategy');
  117 |       // Take another screenshot at failure point
  118 |       await page.screenshot({ path: 'login-page-admin-failure.png', fullPage: true });
  119 |       throw error;
  120 |     }
  121 |     
  122 |     // Try to find and use the most appropriate selector for filling
  123 |     try {
  124 |       // Try to use the accessibility-friendly getByLabel method first
  125 |       await page.getByLabel(/email/i).fill(adminCredentials.email);
  126 |     } catch (error) {
  127 |       console.log('Falling back to direct selectors for email field');
  128 |       // Fall back to direct selectors if getByLabel fails
  129 |       if (await page.locator('input#email').count() > 0) {
  130 |         await page.fill('input#email', adminCredentials.email);
  131 |       } else if (await page.locator('input[name="email"]').count() > 0) {
  132 |         await page.fill('input[name="email"]', adminCredentials.email);
  133 |       } else if (await page.locator('input[type="email"]').count() > 0) {
  134 |         await page.fill('input[type="email"]', adminCredentials.email);
  135 |       } else {
  136 |         throw new Error('Could not find email input with any selector');
  137 |       }
  138 |     }
  139 |     
  140 |     // Similar approach for password
  141 |     try {
  142 |       await page.getByLabel(/password/i).fill(adminCredentials.password);
  143 |     } catch (error) {
  144 |       console.log('Falling back to direct selectors for password field');
  145 |       if (await page.locator('input#password').count() > 0) {
  146 |         await page.fill('input#password', adminCredentials.password);
  147 |       } else if (await page.locator('input[name="password"]').count() > 0) {
  148 |         await page.fill('input[name="password"]', adminCredentials.password);
  149 |       } else if (await page.locator('input[type="password"]').count() > 0) {
  150 |         await page.fill('input[type="password"]', adminCredentials.password);
  151 |       } else {
  152 |         throw new Error('Could not find password input with any selector');
  153 |       }
  154 |     }
  155 |     
  156 |     // Wait for the button to be enabled before clicking
  157 |     await page.waitForSelector('button[type="submit"]:not([disabled])');
  158 |     await page.click('button[type="submit"]');
  159 |     
  160 |     // Wait for navigation to dashboard
  161 |     await page.waitForURL('**/dashboard');
  162 |     
  163 |     // Navigate to training manager
  164 |     await page.goto('/training');
  165 |     await page.waitForSelector('h1:has-text("Training Manager")');
  166 |     
  167 |     // Click "Add Training Module" button
  168 |     await page.click('button:has-text("Add Training Module")');
  169 |     
  170 |     // Fill module form
  171 |     await page.fill('input#title', testModule.title);
  172 |     await page.fill('textarea#description', testModule.description);
  173 |     await page.fill('input#order', testModule.order_index.toString());
  174 |     
  175 |     // Create module
  176 |     await page.click('button:has-text("Create Module")');
  177 |     
  178 |     // Wait for success toast
  179 |     await page.waitForSelector('div[role="status"]:has-text("created successfully")');
  180 |     
  181 |     // Find the newly created module
  182 |     await page.waitForSelector(`div:has-text("${testModule.title}")`);
```