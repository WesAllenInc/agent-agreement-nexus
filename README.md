
# Ireland Pay Sales Agent Portal

## Project Overview

This portal manages sales agent agreements for Ireland Pay, allowing administrators to manage agents and for agents to complete necessary documentation. The system handles invitations, agreement workflows, document management, and authentication.

## Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query, React Context
- **Routing**: React Router
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Charting**: Recharts

## Project Structure

### Core Directories

```
src/
├── components/          # Reusable UI components
│   ├── admin/           # Admin-specific components
│   ├── agent/           # Agent-specific components
│   ├── agreement/       # Agreement form components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Header, Navigation)
│   └── ui/              # Base UI components (shadcn)
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── lib/                 # Utility functions
├── pages/               # Page components
│   ├── admin/           # Admin pages
│   ├── agent/           # Agent pages
│   └── auth/            # Auth pages
├── types/               # TypeScript type definitions
└── App.tsx              # Main app component with routes
```

### Database Schema Overview

The application uses these key tables in Supabase:
- `profiles`: User profiles with role information
- `invitations`: Sales agent invitations
- `agreement_drafts`: Draft agreement data
- `executed_agreements`: Finalized agreements
- `physical_agreements`: Records of physically signed agreements
- `activity_log`: System activity tracking

## Key Components

### Authentication & User Management

- **AuthProvider** (`src/hooks/useAuth.tsx`): Manages authentication state
- **LoginForm** (`src/components/auth/LoginForm.tsx`): Handles user login
- **AcceptInvitationForm** (`src/components/auth/AcceptInvitationForm.tsx`): Processes invitation acceptance

### Layout Components

- **MainLayout** (`src/components/layout/MainLayout.tsx`): Main application layout wrapper
- **Header** (`src/components/layout/Header.tsx`): Top navigation bar
- **Navigation** (`src/components/layout/Navigation.tsx`): Sidebar navigation for admin users

### Admin Features

- **Dashboard** (`src/pages/admin/Dashboard.tsx`): Admin overview with stats and charts
- **Invitations** (`src/pages/admin/Invitations.tsx`): Manage agent invitations
- **Agreements** (`src/pages/admin/Agreements.tsx`): View and manage agreements
- **Agents** (`src/pages/admin/Agents.tsx`): Manage sales agents

### Agent Features

- **AgentDashboard** (`src/pages/agent/AgentDashboard.tsx`): Agent portal home page
- **Agreement** (`src/pages/agent/Agreement.tsx`): Agreement completion workflow
- **DocumentUpload/Download** (`src/components/agent/dashboard/*.tsx`): Document management
- **PhysicalAgreementUpload** (`src/components/agent/dashboard/PhysicalAgreementUpload.tsx`): Upload physically signed agreements

### Agreement Components

- **WizardStepper** (`src/components/agreement/WizardStepper.tsx`): Multi-step form navigation
- **WizardContext** (`src/components/agreement/WizardContext.tsx`): Form state management
- **SignatureCanvas** (`src/components/agreement/SignatureCanvas.tsx`): E-signature capture

## Edge Functions

Supabase Edge Functions are used for:
- **createUserFromInvitation**: Creates user accounts from invitation tokens
- **sendInviteEmail**: Sends email invitations to new sales agents
- **validateToken**: Validates invitation tokens

## User Flows

### Administrator Flow
1. Admin logs in
2. Admin manages invitations to new agents
3. Admin tracks agreements and agent activity
4. Admin generates reports and manages documentation

### Sales Agent Flow
1. Agent receives invitation via email
2. Agent creates account via invitation link
3. Agent completes multi-step agreement form
4. Agent e-signs agreement or uploads physical agreement
5. Agent accesses portal for document management

## Development Notes

- Local development uses mock implementations of Edge Functions (`src/api/mockEdgeFunctions.ts`)
- Authentication and authorization are handled via Supabase Row Level Security policies
- Database schema is defined in `src/database/schema.sql`

## Deployment

Edge Functions should be deployed using the Supabase CLI:
```bash
cd supabase/functions/[function-name]
supabase functions deploy [function-name]
```

Required environment variables are documented in each Edge Function.
