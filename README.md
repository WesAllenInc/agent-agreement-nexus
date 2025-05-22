# Agent Agreement Nexus

## Project Overview

This portal manages PDF agreements for agents, allowing administrators to manage documents and for agents to view and sign necessary documentation. The system handles authentication, document management, and role-based access control.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query (React Query), React Context
- **Routing**: React Router
- **Backend**: Supabase (Auth, Database, Storage)
- **PDF Handling**: Custom PDF viewer with annotation capabilities
- **Build Tool**: Vite with optimized production configuration
- **Deployment**: Vercel with GitHub Actions CI/CD

## Project Structure

### Core Directories

```
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   │   ├── UserTable.tsx       # User management table
│   │   ├── AgreementTable.tsx  # Agreement management table
│   │   └── Stats.tsx           # Statistics display
│   ├── ui/              # Base UI components (shadcn)
│   ├── pdf/             # PDF viewer and related components
│   │   ├── PdfViewer.tsx       # PDF viewing component
│   │   ├── PdfAnnotation.tsx   # PDF annotation functionality
│   │   └── SignatureField.tsx  # Signature capture for PDFs
│   ├── auth/            # Authentication components
│   │   ├── LoginForm.tsx       # User login form
│   │   ├── SignUpForm.tsx      # User registration form
│   │   └── ResetPassword.tsx   # Password reset functionality
│   ├── user/            # User-specific components
│   │   ├── AgreementCard.tsx   # Agreement card display
│   │   └── ProfileForm.tsx     # Profile editing form
│   └── layout/          # Layout components
│       ├── MainLayout.tsx      # Main application layout
│       ├── Header.tsx          # Application header
│       ├── Navigation.tsx      # Navigation sidebar
│       └── Footer.tsx          # Application footer
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook with AuthProvider
│   └── useAgreements.ts # Agreements management hook
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
│       ├── client.ts          # Supabase client configuration
│       └── types.ts           # TypeScript types for Supabase data
├── lib/                 # Utility functions
│   ├── roles.ts         # User role definitions and utilities
│   ├── utils.ts         # General utility functions
│   ├── date-utils.ts    # Date formatting utilities
│   └── validation.ts    # Form validation utilities
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   │   ├── Dashboard.tsx      # Admin dashboard
│   │   ├── Users.tsx          # User management
│   │   └── Agreements.tsx     # Agreement management
│   ├── user/            # User pages
│   │   ├── Dashboard.tsx      # User dashboard
│   │   ├── Agreements.tsx     # User agreements list
│   │   ├── ViewAgreement.tsx  # Detailed agreement view
│   │   └── Profile.tsx        # User profile management
│   └── auth/            # Authentication pages
├── types/               # TypeScript type definitions
│   ├── index.ts         # Common TypeScript types
│   └── supabase.ts      # Supabase-specific types
└── App.tsx              # Main app component with routes
```

### Entry Points
- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component with routing

### Configuration Files
- `vite.config.ts` - Vite build configuration with optimizations
- `tailwind.config.ts` - Tailwind CSS configuration (TypeScript)
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration for Tailwind

### Database Schema Overview

The application uses these key tables in Supabase:

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

## Key Components

### Authentication & User Management

- **AuthProvider** (`src/hooks/useAuth.ts`): Manages authentication state and user roles
- **LoginForm** (`src/components/auth/LoginForm.tsx`): Handles user login
- **SignUpForm** (`src/components/auth/SignUpForm.tsx`): Handles user registration

### Layout Components

- **MainLayout** (`src/components/layout/MainLayout.tsx`): Main application layout wrapper
- **Header** (`src/components/layout/Header.tsx`): Top navigation bar
- **Navigation** (`src/components/layout/Navigation.tsx`): Sidebar navigation based on user role

### Admin Features

- **Dashboard** (`src/pages/admin/Dashboard.tsx`): Admin overview with stats
- **Agreements** (`src/pages/admin/Agreements.tsx`): View and manage all agreements
- **Users** (`src/pages/admin/Users.tsx`): Manage users and their roles

### User Features

- **UserDashboard** (`src/pages/user/Dashboard.tsx`): User portal home page
- **UserAgreements** (`src/pages/user/Agreements.tsx`): View assigned agreements
- **ViewAgreement** (`src/pages/user/ViewAgreement.tsx`): View and sign specific agreements

### PDF Components

- **PdfViewer** (`src/components/pdf/PdfViewer.tsx`): Custom PDF viewer with navigation
- **PdfAnnotation** (`src/components/pdf/PdfAnnotation.tsx`): PDF annotation capabilities
- **SignatureField** (`src/components/pdf/SignatureField.tsx`): Signature capture for PDFs

## Performance Optimizations

The project has undergone comprehensive performance optimization:

- **Code Splitting**: Manual chunks in Vite configuration:
  - vendor: React, React Router
  - ui: UI component libraries
  - supabase: Supabase client
- **Component Memoization**: React.memo and useMemo for performance-critical components
- **Callback Optimization**: useCallback for stable function references
- **Build Optimization**: esbuild minification and CSS optimization
- **Conditional Logging**: Development-only console logs
- **Asset Compression**: Optimized asset delivery
- **Tree-Shaking**: Elimination of unused code

## Deployment

### Automated Deployment with GitHub Actions

The application is deployed to Vercel using GitHub Actions:

- **Production deployments**: Trigger automatically on push to the main branch
- **Preview deployments**: Generate automatically for pull requests
- **Documentation**: Context7 documentation is generated before deployment

> Note: The workflow file may show context access warnings in IDE static analysis, but these won't affect actual deployment functionality.

### Manual Deployment Commands

If you need to deploy manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview environment
vercel

# Deploy to production
vercel --prod
```

### Environment Configuration

Ensure these environment variables are set in your Vercel project settings:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to Settings > Environment Variables
4. Add all required variables from the Environment Setup section

### Deployment Troubleshooting

If you encounter issues with deployment:

1. Check GitHub Actions logs for errors
2. Verify environment variables are correctly set
3. Ensure build commands are working locally with `npm run build`
4. Check Vercel deployment logs in the dashboard

## Development

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 8.0.0
- Supabase account with project setup

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/WesAllenInc/agent-agreement-nexus.git
   cd agent-agreement-nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in the required environment variables

4. **Initialize Supabase local development** (optional)
   ```bash
   npx supabase init
   npx supabase start
   ```
   Or use your remote Supabase instance.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

### Common Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Preview production build
npm run preview

# Start Storybook development server
npm run storybook

# Build Storybook static site
npm run build-storybook

# Publish to Chromatic
npm run chromatic
```

## Storybook & Chromatic Integration

The project uses Storybook for component development and Chromatic for visual testing and UI review.

### Storybook Configuration

Storybook is configured in the `.storybook/` directory with the following files:

- `main.jsx` - Main configuration for stories, addons, and Vite settings
- `preview.jsx` - Global decorators and parameters for all stories
- `vitest.setup.ts` - Test configuration for Storybook components

### Running Storybook Locally

```bash
# Start Storybook development server
npm run storybook

# Build Storybook static site
npm run build-storybook
```

Storybook will be available at http://localhost:6006 when running the development server.

### Chromatic Integration

Chromatic is used for visual testing and UI review. It captures snapshots of your Storybook components and allows for visual regression testing.

```bash
# Publish to Chromatic (requires CHROMATIC_PROJECT_TOKEN)
npm run chromatic
```

### CI/CD Integration

The GitHub Actions workflow automatically builds Storybook and publishes to Chromatic on each push to main and pull request:

1. Builds Storybook with proper environment variables
2. Publishes to Chromatic for visual testing
3. Provides a link to review UI changes

### Environment Variables for Storybook/Chromatic

These environment variables are required for Storybook and Chromatic:

```bash
# Supabase credentials (required for components that use Supabase)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Chromatic project token
CHROMATIC_PROJECT_TOKEN=your_chromatic_project_token
```

### Database Migrations

When making changes to the database schema:

```bash
# Generate migration from local changes
npx supabase db diff -f migration_name

# Apply migrations
npx supabase db push
```

Refer to the [Supabase Schema](https://supabase.com/dashboard/project/_/database/tables) for the current database structure.

## Environment Setup

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Integration
VITE_EMAIL_SERVICE=sendgrid_or_other_provider
VITE_EMAIL_API_KEY=your_email_service_api_key
VITE_EMAIL_FROM=noreply@yourdomain.com

# Error Tracking
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_TRAINING_MODULE=true

# Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Environment Configuration Files

The project uses different environment files for various deployment contexts:

- `.env.development` - Development environment variables
- `.env.production` - Production environment variables
- `.env.test` - Testing environment variables

Never commit these files to the repository. Use `.env.example` as a template.

## Security Features

- **Row Level Security (RLS)**: Database-level security policies for all tables
- **Role-Based Access Control**: Different views and capabilities based on user roles
- **Secure File Storage**: Controlled access to PDF files and attachments
- **Authentication**: Email/password authentication via Supabase
- **Error Tracking**: Comprehensive error tracking with Sentry
- **Form Validation**: Zod schema validation for all forms
- **Data Integrity**: Database constraints and validation

## MVP Completion Status

The MVP is now complete and ready for production. The following items have been addressed:

### Completed Items

#### Performance Optimization
- ✅ Implemented code splitting for large components using React.lazy() and Suspense
- ✅ Optimized asset loading and compression
- ✅ Added memoization for performance-critical components (useMemo, useCallback)

#### Security
- ✅ Completed RLS policies for all tables
- ✅ Implemented comprehensive error handling with Sentry
- ✅ Set up secure file access controls for attachments

#### User Experience
- ✅ Implemented email notification system for agreement events
- ✅ Enhanced responsive design for all components
- ✅ Added consistent loading states for async operations

#### Data Integrity
- ✅ Implemented Zod validation for all form inputs
- ✅ Added database constraints for critical relationships
- ✅ Set up error logging and recovery procedures

#### Testing
- ✅ Added tests for critical user flows
- ✅ Implemented GitHub Actions for CI/CD
- ✅ Added accessibility improvements

## MVP Readiness Checklist

Based on our audit findings, the following items need to be addressed before the MVP can be considered ready for production:

### Critical Path Items

- [x] **Performance Optimization**
  - [x] Implement code splitting for large components
  - [x] Optimize asset loading and compression
  - [x] Add memoization for performance-critical components

- [x] **Security**
  - [x] Complete RLS policies for all tables
  - [x] Implement proper error handling with Sentry
  - [x] Set up secure file access controls

- [x] **User Experience**
  - [x] Complete notification system for agreement status changes
  - [x] Implement responsive design for mobile devices
  - [x] Add loading states for all async operations

- [x] **Data Integrity**
  - [x] Implement validation for all form inputs using Zod
  - [x] Add database constraints for critical relationships
  - [x] Set up backup and recovery procedures

- [x] **Testing**
  - [x] Achieve >80% test coverage for critical paths
  - [x] Complete end-to-end testing for main user flows
  - [x] Implement accessibility testing

### Nice-to-Have Items

- [ ] **Analytics**
  - [ ] Set up user behavior tracking
  - [ ] Implement dashboard for usage statistics

- [ ] **Internationalization**
  - [ ] Prepare codebase for i18n support
  - [ ] Add language selection option

- [ ] **Advanced Features**
  - [ ] Implement bulk operations for agreements
  - [ ] Add advanced search and filtering
  - [ ] Create export functionality for reports

## Database Schema

The application uses these key tables in Supabase. View the complete schema in the [Supabase Dashboard](https://supabase.com/dashboard/project/_/database/tables).

1. **profiles** - User profiles
   - Fields: id, user_id, full_name, email, created_at, updated_at, status
   
2. **user_roles** - User role assignments
   - Fields: id, user_id, roles, created_at, updated_at
   
3. **agreements** - PDF agreements
   - Fields: id, title, description, file_path, created_by, status, version, created_at, updated_at
   
4. **agreement_signatures** - Signature records
   - Fields: id, agreement_id, user_id, signature_data, signed_at, ip_address
   
5. **agreement_views** - View tracking
   - Fields: id, agreement_id, user_id, viewed_at, device_info

6. **training_materials** - Training content
   - Fields: id, title, description, file_path, type, created_at, updated_at

7. **agreement_notifications** - Notification records
   - Fields: id, agreement_id, user_id, message, read, created_at
   
8. **agreement_attachments** - Agreement attachments (Schedule B/C)
   - Fields: id, agreement_id, type, file_url, file_name, file_size, content_type, created_at, updated_at, created_by

9. **ach_info** - ACH authorization information
   - Fields: id, user_id, agreement_id, account_type, bank_name, account_number, routing_number, created_at, updated_at

10. **email_logs** - Email notification logs
    - Fields: id, notification_type, recipient, status, error_message, sent_at, created_at

11. **email_errors** - Failed email notification tracking
    - Fields: id, notification_type, recipient, error_message, payload, retry_count, created_at, last_retry_at, resolved, resolved_at, created_by
