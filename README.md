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

The application is deployed to Vercel using GitHub Actions:

### GitHub Actions Workflow

The project uses automated deployment to Vercel through GitHub Actions:

- Production deployments trigger on push to the main branch
- Preview deployments generate for pull requests
- Environment variables for Vercel are securely passed (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- Context7 documentation is generated before deployment

> Note: The workflow file may show context access warnings in IDE static analysis, but these won't affect actual deployment functionality.

## Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript type checking
npm run lint

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Preview production build
npm run preview
```

### Node.js Requirements
- Node.js ≥ 18.0.0
- npm ≥ 8.0.0

## Environment Setup

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Role-Based Access Control**: Different views and capabilities based on user roles
- **Secure File Storage**: Controlled access to PDF files
- **Authentication**: Email/password authentication via Supabase
