# Agent Agreement Nexus

## Project Overview

This portal manages PDF agreements for agents, allowing administrators to manage documents and for agents to view and sign necessary documentation. The system handles authentication, document management, and role-based access control.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query, React Context
- **Routing**: React Router
- **Backend**: Supabase (Auth, Database, Storage)
- **PDF Handling**: Custom PDF viewer with annotation capabilities
- **Build Tool**: Vite with optimized production configuration

## Project Structure

### Core Directories

```
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── ui/              # Base UI components (shadcn)
│   ├── pdf/             # PDF viewer and related components
│   └── layout/          # Layout components (Header, Navigation)
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication hook with AuthProvider
│   └── useAgreements.ts # Agreements management hook
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
│   ├── roles.ts         # User role definitions and utilities
│   └── utils.ts         # General utility functions
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── user/            # User pages
│   └── auth/            # Authentication pages
├── types/               # TypeScript type definitions
└── App.tsx              # Main app component with routes
```

### Database Schema Overview

The application uses these key tables in Supabase:
- `profiles`: User profiles with role information
- `user_roles`: User role assignments
- `agreements`: PDF agreements and metadata
- `agreement_signatures`: Records of signed agreements
- `agreement_views`: Tracking when users view agreements

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

- **Code Splitting**: Manual chunks configuration in Vite for optimal loading
- **Component Memoization**: React.memo and useMemo for performance-critical components
- **Callback Optimization**: useCallback for stable function references
- **Build Optimization**: esbuild minification and CSS optimization
- **Conditional Logging**: Development-only console logs

## Deployment

The application is configured for deployment on Vercel:

```json
// vercel.json configuration
{
  "version": 2,
  "builds": [{ "src": "package.json", "use": "@vercel/static-build" }],
  "routes": [
    { "src": "^/assets/(.*)", "dest": "/assets/$1" },
    { "src": "^/(.*)\\.(js|css|ico|png|jpg|jpeg|svg|webp|json|txt|woff|woff2|ttf|otf)", "dest": "/$1.$2" },
    { "src": ".*", "dest": "/index.html" }
  ]
}
```

Deployment is automated via GitHub Actions workflow:

```yaml
# .github/workflows/vercel-deploy.yml
name: Deploy to Vercel with Context7 Documentation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  document:
    # Documentation generation with Context7
    # ...

  deploy:
    # Vercel deployment
    # ...
```

## Development

To run the project locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Role-Based Access Control**: Different views and capabilities based on user roles
- **Secure File Storage**: Controlled access to PDF files
- **Authentication**: Email/password authentication via Supabase
