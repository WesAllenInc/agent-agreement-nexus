# Agent Agreement Nexus - Project Map

This document provides a detailed map of the project structure, key files, and their relationships.

## Core Files

### Entry Points
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component with routing

### Configuration
- `vite.config.ts` - Vite build configuration with optimizations
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `netlify.toml` - Netlify deployment configuration

## Authentication System

### Auth Hooks and Context
- `src/hooks/useAuth.ts` - Authentication hook and AuthProvider component
- `src/lib/roles.ts` - User role definitions and utilities

### Auth Components
- `src/components/auth/LoginForm.tsx` - User login form
- `src/components/auth/SignUpForm.tsx` - User registration form
- `src/components/auth/ResetPassword.tsx` - Password reset functionality

## PDF Agreement System

### Agreement Management
- `src/hooks/useAgreements.ts` - Hook for managing agreements
- `src/components/pdf/PdfViewer.tsx` - PDF viewing component
- `src/components/pdf/PdfAnnotation.tsx` - PDF annotation functionality
- `src/components/pdf/SignatureField.tsx` - Signature capture for PDFs

### Agreement Pages
- `src/pages/admin/Agreements.tsx` - Admin agreement management
- `src/pages/user/Agreements.tsx` - User agreement viewing
- `src/pages/user/ViewAgreement.tsx` - Detailed agreement view

## Layout and Navigation

### Layout Components
- `src/components/layout/MainLayout.tsx` - Main application layout
- `src/components/layout/Header.tsx` - Application header
- `src/components/layout/Navigation.tsx` - Navigation sidebar
- `src/components/layout/Footer.tsx` - Application footer

### UI Components
- `src/components/ui/` - Base UI components from shadcn/ui
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/dialog.tsx` - Modal dialog component
- `src/components/ui/form.tsx` - Form components

## Database Integration

### Supabase Integration
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `src/integrations/supabase/types.ts` - TypeScript types for Supabase data

### Database Tables
1. **profiles** - User profiles
   - Fields: id, user_id, full_name, email, created_at, updated_at
   
2. **user_roles** - User role assignments
   - Fields: id, user_id, roles, created_at, updated_at
   
3. **agreements** - PDF agreements
   - Fields: id, title, description, file_path, created_by, created_at, updated_at
   
4. **agreement_signatures** - Signature records
   - Fields: id, agreement_id, user_id, signature_data, signed_at
   
5. **agreement_views** - View tracking
   - Fields: id, agreement_id, user_id, viewed_at

## Admin Features

### Admin Pages
- `src/pages/admin/Dashboard.tsx` - Admin dashboard
- `src/pages/admin/Users.tsx` - User management
- `src/pages/admin/Agreements.tsx` - Agreement management

### Admin Components
- `src/components/admin/UserTable.tsx` - User management table
- `src/components/admin/AgreementTable.tsx` - Agreement management table
- `src/components/admin/Stats.tsx` - Statistics display

## User Features

### User Pages
- `src/pages/user/Dashboard.tsx` - User dashboard
- `src/pages/user/Agreements.tsx` - User agreements list
- `src/pages/user/Profile.tsx` - User profile management

### User Components
- `src/components/user/AgreementCard.tsx` - Agreement card display
- `src/components/user/ProfileForm.tsx` - Profile editing form

## Utilities and Helpers

### Utility Functions
- `src/lib/utils.ts` - General utility functions
- `src/lib/date-utils.ts` - Date formatting utilities
- `src/lib/validation.ts` - Form validation utilities

### Type Definitions
- `src/types/index.ts` - Common TypeScript types
- `src/types/supabase.ts` - Supabase-specific types

## Performance Optimizations

### Code Splitting
- Manual chunks in `vite.config.ts`:
  - vendor: React, React Router
  - ui: UI component libraries
  - supabase: Supabase client

### Component Optimizations
- Memoization in `src/hooks/useAuth.ts`
- useCallback for stable function references
- useMemo for computed values

## Deployment

### Netlify Configuration
- `netlify.toml` - Build settings and redirects
- Environment variables in Netlify dashboard:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

## Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run TypeScript type checking
npm run tsc

# Build for production
npm run build
```

### Deployment Process
1. Commit changes to GitHub
2. Netlify automatically deploys from main branch
3. Check build logs for any issues
4. Verify deployment at the Netlify URL
