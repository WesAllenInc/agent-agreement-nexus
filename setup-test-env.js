/**
 * Setup Test Environment Script
 * 
 * This script helps set up the test environment for the Agent Agreement Nexus application.
 * It creates test users in Supabase and sets up the necessary database tables.
 * 
 * Usage:
 * 1. Create a .env file with your Supabase credentials
 * 2. Run this script: node setup-test-env.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Check if .env file exists
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('Creating .env file...');
  const envContent = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_TRAINING_MODULE=true
`;
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.error('\x1b[31m%s\x1b[0m', 'ERROR: Please edit the .env file with your Supabase credentials before running this script again.');
  process.exit(1);
}

// Get Supabase credentials from .env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('\x1b[31m%s\x1b[0m', 'ERROR: Missing Supabase credentials in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test users to create
const testUsers = [
  {
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    fullName: 'Admin User'
  },
  {
    email: 'agent@example.com',
    password: 'password123',
    role: 'agent',
    fullName: 'Agent User'
  },
  {
    email: 'test@example.com',
    password: 'password123',
    role: 'user',
    fullName: 'Test User'
  }
];

// Create test users
async function createTestUsers() {
  console.log('Creating test users...');
  
  for (const user of testUsers) {
    try {
      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email);
      
      if (existingUsers && existingUsers.length > 0) {
        console.log(`User ${user.email} already exists. Skipping...`);
        continue;
      }
      
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.fullName
          }
        }
      });
      
      if (error) {
        console.error(`Error creating user ${user.email}:`, error.message);
        continue;
      }
      
      const userId = data.user.id;
      console.log(`Created user ${user.email} with ID ${userId}`);
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: uuidv4(),
            user_id: userId,
            full_name: user.fullName,
            email: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (profileError) {
        console.error(`Error creating profile for ${user.email}:`, profileError.message);
        continue;
      }
      
      // Assign user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          {
            id: uuidv4(),
            user_id: userId,
            roles: [user.role],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (roleError) {
        console.error(`Error assigning role for ${user.email}:`, roleError.message);
        continue;
      }
      
      console.log(`Successfully set up user ${user.email} with role ${user.role}`);
    } catch (error) {
      console.error(`Unexpected error for ${user.email}:`, error.message);
    }
  }
}

// Create sample training modules
async function createSampleTrainingModules() {
  console.log('Creating sample training modules...');
  
  // Create a test module
  const moduleId = uuidv4();
  const { error: moduleError } = await supabase
    .from('training_modules')
    .insert([
      {
        id: moduleId,
        title: 'Getting Started Guide',
        description: 'Essential onboarding information for new agents',
        order_index: 0,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  
  if (moduleError) {
    console.error('Error creating training module:', moduleError.message);
    return;
  }
  
  // Create a test material
  const materialId = uuidv4();
  const { error: materialError } = await supabase
    .from('training_materials')
    .insert([
      {
        id: materialId,
        title: 'Welcome to Agent Agreement Nexus',
        description: 'An introduction to the platform and its features',
        module_type: 'pdf',
        file_path: 'training/welcome.pdf',
        order_index: 0,
        is_required: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  
  if (materialError) {
    console.error('Error creating training material:', materialError.message);
    return;
  }
  
  // Link material to module
  const { error: linkError } = await supabase
    .from('module_materials')
    .insert([
      {
        id: uuidv4(),
        module_id: moduleId,
        material_id: materialId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  
  if (linkError) {
    console.error('Error linking material to module:', linkError.message);
    return;
  }
  
  console.log('Successfully created sample training module and material');
}

// Create sample agreements
async function createSampleAgreements() {
  console.log('Creating sample agreements...');
  
  // Get admin user ID
  const { data: adminUsers } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', 'admin@example.com');
  
  if (!adminUsers || adminUsers.length === 0) {
    console.error('Admin user not found. Skipping agreement creation.');
    return;
  }
  
  const adminId = adminUsers[0].user_id;
  
  // Create a sample agreement
  const { error: agreementError } = await supabase
    .from('agreements')
    .insert([
      {
        id: uuidv4(),
        title: 'Standard Agent Agreement',
        description: 'Standard agreement for all agents',
        file_path: 'agreements/standard-agreement.pdf',
        created_by: adminId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);
  
  if (agreementError) {
    console.error('Error creating agreement:', agreementError.message);
    return;
  }
  
  console.log('Successfully created sample agreement');
}

// Main function
async function main() {
  try {
    console.log('Setting up test environment for Agent Agreement Nexus...');
    
    // Create test users
    await createTestUsers();
    
    // Create sample training modules
    await createSampleTrainingModules();
    
    // Create sample agreements
    await createSampleAgreements();
    
    console.log('\x1b[32m%s\x1b[0m', 'Test environment setup complete!');
    console.log('\nYou can now log in with the following test accounts:');
    console.log('- Admin: admin@example.com / password123');
    console.log('- Agent: agent@example.com / password123');
    console.log('- User: test@example.com / password123');
    
    console.log('\nStart the development server with:');
    console.log('npm run dev');
  } catch (error) {
    console.error('Error setting up test environment:', error.message);
  }
}

main();
