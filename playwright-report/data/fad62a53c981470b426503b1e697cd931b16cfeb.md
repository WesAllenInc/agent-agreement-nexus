# Test info

- Name: Training Module End-to-End Test >> Admin can create a training module and upload material
- Location: C:\App DEV\agent-agreement-nexus\agent-agreement-nexus\tests\e2e\training.spec.ts:74:7

# Error details

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

    at C:\App DEV\agent-agreement-nexus\agent-agreement-nexus\tests\e2e\training.spec.ts:77:16
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
   17 | const testModule = {
   18 |   title: `Test Module ${uuidv4().substring(0, 8)}`,
   19 |   description: 'This is a test training module created for E2E testing',
   20 |   order_index: 0,
   21 |   status: 'active',
   22 | };
   23 |
   24 | const testMaterial = {
   25 |   title: `Test Material ${uuidv4().substring(0, 8)}`,
   26 |   description: 'This is a test training material created for E2E testing',
   27 |   module_type: 'pdf',
   28 |   order_index: 0,
   29 |   is_required: true,
   30 | };
   31 |
   32 | // Helper function to clean up test data
   33 | async function cleanupTestData(moduleId: string) {
   34 |   // Get all materials for this module
   35 |   const { data: moduleMaterials } = await supabase
   36 |     .from('module_materials')
   37 |     .select('material_id')
   38 |     .eq('module_id', moduleId);
   39 |
   40 |   if (moduleMaterials && moduleMaterials.length > 0) {
   41 |     const materialIds = moduleMaterials.map(mm => mm.material_id);
   42 |
   43 |     // Delete completions for these materials
   44 |     await supabase
   45 |       .from('training_completions')
   46 |       .delete()
   47 |       .in('material_id', materialIds);
   48 |
   49 |     // Delete module_materials entries
   50 |     await supabase
   51 |       .from('module_materials')
   52 |       .delete()
   53 |       .eq('module_id', moduleId);
   54 |
   55 |     // Delete training_materials
   56 |     await supabase
   57 |       .from('training_materials')
   58 |       .delete()
   59 |       .in('id', materialIds);
   60 |   }
   61 |
   62 |   // Delete the module
   63 |   await supabase
   64 |     .from('training_modules')
   65 |     .delete()
   66 |     .eq('id', moduleId);
   67 | }
   68 |
   69 | test.describe('Training Module End-to-End Test', () => {
   70 |   let moduleId: string;
   71 |   let materialId: string;
   72 |   let agentId: string;
   73 |
   74 |   test('Admin can create a training module and upload material', async ({ page }) => {
   75 |     // Login as admin
   76 |     await page.goto('/auth/login');
>  77 |     await page.fill('input[type="email"]', adminCredentials.email);
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
   78 |     await page.fill('input[type="password"]', adminCredentials.password);
   79 |     await page.click('button[type="submit"]');
   80 |     
   81 |     // Wait for navigation to dashboard
   82 |     await page.waitForURL('**/dashboard');
   83 |     
   84 |     // Navigate to training manager
   85 |     await page.goto('/training');
   86 |     await page.waitForSelector('h1:has-text("Training Manager")');
   87 |     
   88 |     // Click "Add Training Module" button
   89 |     await page.click('button:has-text("Add Training Module")');
   90 |     
   91 |     // Fill module form
   92 |     await page.fill('input#title', testModule.title);
   93 |     await page.fill('textarea#description', testModule.description);
   94 |     await page.fill('input#order', testModule.order_index.toString());
   95 |     
   96 |     // Create module
   97 |     await page.click('button:has-text("Create Module")');
   98 |     
   99 |     // Wait for success toast
  100 |     await page.waitForSelector('div[role="status"]:has-text("created successfully")');
  101 |     
  102 |     // Find the newly created module
  103 |     await page.waitForSelector(`div:has-text("${testModule.title}")`);
  104 |     
  105 |     // Expand the module
  106 |     await page.locator(`div:has-text("${testModule.title}") button`).first().click();
  107 |     
  108 |     // Click "Add Material" button
  109 |     await page.click('button:has-text("Add Material")');
  110 |     
  111 |     // Fill material form
  112 |     await page.fill('input#material-title', testMaterial.title);
  113 |     await page.fill('textarea#material-description', testMaterial.description);
  114 |     
  115 |     // Select PDF as material type
  116 |     await page.click('button#material-type');
  117 |     await page.click('div[role="option"]:has-text("PDF Document")');
  118 |     
  119 |     // Select the module
  120 |     await page.click('button#material-module');
  121 |     await page.click(`div[role="option"]:has-text("${testModule.title}")`);
  122 |     
  123 |     // Upload a test PDF file
  124 |     const fileInput = await page.locator('input[type="file"]');
  125 |     await fileInput.setInputFiles('./public/test-files/test.pdf');
  126 |     
  127 |     // Upload material
  128 |     await page.click('button:has-text("Upload Material")');
  129 |     
  130 |     // Wait for success toast
  131 |     await page.waitForSelector('div[role="status"]:has-text("uploaded successfully")');
  132 |     
  133 |     // Store module ID for later cleanup
  134 |     const { data: modules } = await supabase
  135 |       .from('training_modules')
  136 |       .select('id')
  137 |       .eq('title', testModule.title)
  138 |       .limit(1);
  139 |     
  140 |     if (modules && modules.length > 0) {
  141 |       moduleId = modules[0].id;
  142 |       
  143 |       // Get material ID
  144 |       const { data: materials } = await supabase
  145 |         .from('training_materials')
  146 |         .select('id')
  147 |         .eq('title', testMaterial.title)
  148 |         .limit(1);
  149 |       
  150 |       if (materials && materials.length > 0) {
  151 |         materialId = materials[0].id;
  152 |       }
  153 |     }
  154 |     
  155 |     // Verify module and material were created
  156 |     expect(moduleId).toBeDefined();
  157 |     expect(materialId).toBeDefined();
  158 |   });
  159 |
  160 |   test('Agent can complete the training material', async ({ page }) => {
  161 |     // Skip if module or material wasn't created
  162 |     test.skip(!moduleId || !materialId, 'Module or material not created in previous test');
  163 |     
  164 |     // Login as agent
  165 |     await page.goto('/auth/login');
  166 |     await page.fill('input[type="email"]', agentCredentials.email);
  167 |     await page.fill('input[type="password"]', agentCredentials.password);
  168 |     await page.click('button[type="submit"]');
  169 |     
  170 |     // Wait for navigation to dashboard
  171 |     await page.waitForURL('**/dashboard');
  172 |     
  173 |     // Get agent ID
  174 |     const { data: { user } } = await supabase.auth.getUser();
  175 |     agentId = user?.id || '';
  176 |     
  177 |     // Navigate to training center
```