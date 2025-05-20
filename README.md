# Agent Agreement Nexus

## Project Overview

This portal manages PDF agreements for agents, allowing administrators to manage documents and for agents to view and sign necessary documentation. The system handles authentication, document management, and role-based access control.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI (with Polyfront UI design integration)
- **State Management**: TanStack Query, React Context
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
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

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

- **Row Level Security (RLS)**: Database-level security policies
- **Role-Based Access Control**: Different views and capabilities based on user roles
- **Secure File Storage**: Controlled access to PDF files
- **Authentication**: Email/password authentication via Supabase

## MVP Readiness Checklist

Based on our audit findings, the following items need to be addressed before the MVP can be considered ready for production:

### Critical Path Items

- [ ] **Performance Optimization**
  - [ ] Implement code splitting for large components
  - [ ] Optimize asset loading and compression
  - [ ] Add memoization for performance-critical components

- [ ] **Security**
  - [ ] Complete RLS policies for all tables
  - [ ] Implement proper error handling for authentication flows
  - [ ] Set up secure file access controls

- [ ] **User Experience**
  - [ ] Complete notification system for agreement status changes
  - [ ] Implement responsive design for mobile devices
  - [ ] Add loading states for all async operations

- [ ] **Data Integrity**
  - [ ] Implement validation for all form inputs
  - [ ] Add database constraints for critical relationships
  - [ ] Set up backup and recovery procedures

- [ ] **Testing**
  - [ ] Achieve >80% test coverage for critical paths
  - [ ] Complete end-to-end testing for main user flows
  - [ ] Implement accessibility testing

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
   - Fields: id, user_id, full_name, email, created_at, updated_at
   
2. **user_roles** - User role assignments
   - Fields: id, user_id, roles, created_at, updated_at
   
3. **agreements** - PDF agreements
   - Fields: id, title, description, file_path, created_by, created_at, updated_at
   
4. **agreement_signatures** - Signature records
   - Fields: id, agreement_id, user_id, signature_data, signed_at
   
5. **agreement_views** - View tracking
   - Fields: id, agreement_id, user_id, viewed_at

6. **training_materials** - Training content
   - Fields: id, title, description, file_path, type, created_at, updated_at

7. **agreement_notifications** - Notification records
   - Fields: id, agreement_id, user_id, message, read, created_at
