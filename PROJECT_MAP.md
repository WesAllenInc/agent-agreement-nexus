
# Ireland Pay Sales Agent Portal - Detailed Component Map

This document provides a comprehensive breakdown of all major components and their responsibilities in the project.

## Pages

### Admin Pages

| File | Purpose |
|------|---------|
| `src/pages/admin/Dashboard.tsx` | Admin homepage displaying statistics, charts, and recent activity |
| `src/pages/admin/Invitations.tsx` | Interface for creating and managing sales agent invitations |
| `src/pages/admin/Agreements.tsx` | List view of all agent agreements with filtering options |
| `src/pages/admin/AgreementDetails.tsx` | Detailed view of a specific agreement with metadata and content |
| `src/pages/admin/Agents.tsx` | Management interface for sales agent accounts |
| `src/pages/admin/Users.tsx` | Administrative user management |

### Agent Pages

| File | Purpose |
|------|---------|
| `src/pages/agent/AgentDashboard.tsx` | Agent homepage with document management and quick links |
| `src/pages/agent/Dashboard.tsx` | Alternative agent dashboard (legacy) |
| `src/pages/agent/Agreement.tsx` | Multi-step agreement completion workflow |
| `src/pages/agent/AgentDocuments.tsx` | Document management interface for agents |
| `src/pages/agent/Profile.tsx` | Agent profile management |
| `src/pages/agent/Confirmation.tsx` | Confirmation page after agreement completion |

### Authentication Pages

| File | Purpose |
|------|---------|
| `src/pages/auth/Auth.tsx` | Authentication container with login/signup forms |
| `src/pages/AcceptInvitation.tsx` | Handles invitation token validation and account creation |
| `src/pages/Index.tsx` | Landing page with links to appropriate dashboards |

## Components

### Layout Components

| File | Purpose |
|------|---------|
| `src/components/layout/MainLayout.tsx` | Main application layout with sidebar and content area |
| `src/components/layout/Header.tsx` | Application header with navigation and user menu |
| `src/components/layout/Navigation.tsx` | Sidebar navigation for admin interface |

### Admin Components

| File | Purpose |
|------|---------|
| `src/components/admin/DashboardStats.tsx` | Statistics cards for the admin dashboard |
| `src/components/admin/RecentSignupsChart.tsx` | Chart showing recent agent signups |
| `src/components/admin/AgreementStatusChart.tsx` | Chart displaying agreement status trends |
| `src/components/admin/AgentActivityDashboard.tsx` | Agent activity overview |
| `src/components/admin/agreement/*.tsx` | Components for viewing agreement details |

### Agent Components

| File | Purpose |
|------|---------|
| `src/components/agent/dashboard/DocumentUpload.tsx` | Interface for uploading documents |
| `src/components/agent/dashboard/DocumentDownload.tsx` | Interface for downloading agreements and documents |
| `src/components/agent/dashboard/PhysicalAgreementUpload.tsx` | Upload interface for physically signed agreements |
| `src/components/agent/dashboard/ExternalLinks.tsx` | Quick links to external resources for agents |
| `src/components/agent/profile/ProfileOverview.tsx` | Agent profile information display |
| `src/components/agent/documents/DocumentsList.tsx` | List view of agent documents |

### Agreement Components

| File | Purpose |
|------|---------|
| `src/components/agreement/WizardContext.tsx` | Context provider for multi-step form state |
| `src/components/agreement/WizardStepper.tsx` | Navigation for the agreement wizard |
| `src/components/agreement/WizardSteps.tsx` | Step configuration for the agreement wizard |
| `src/components/agreement/SignatureCanvas.tsx` | E-signature capture component |
| `src/components/agreement/steps/*.tsx` | Individual steps in the agreement workflow |
| `src/components/agreement/sections/*.tsx` | Content sections of the agreement document |

### Authentication Components

| File | Purpose |
|------|---------|
| `src/components/auth/LoginForm.tsx` | User login form |
| `src/components/auth/SignUpForm.tsx` | User registration form |
| `src/components/auth/AcceptInvitationForm.tsx` | Form for accepting invitations |
| `src/components/auth/PasswordStrengthMeter.tsx` | Password strength indicator |

## Hooks and Contexts

| File | Purpose |
|------|---------|
| `src/hooks/useAuth.tsx` | Authentication state management and methods |
| `src/hooks/useProfile.tsx` | User profile data management |
| `src/hooks/useAutoSave.tsx` | Auto-saving functionality for forms |
| `src/hooks/useFormValidation.tsx` | Form validation utilities |
| `src/hooks/use-mobile.tsx` | Responsive design helper |
| `src/hooks/use-toast.ts` | Toast notification system |
| `src/contexts/AuthContext.tsx` | Authentication context definition |

## Database Integration

| File | Purpose |
|------|---------|
| `src/integrations/supabase/client.ts` | Supabase client configuration |
| `src/integrations/supabase/types.ts` | TypeScript definitions for database schema |

## Edge Functions (Serverless Functions)

| File | Purpose |
|------|---------|
| `supabase/functions/createUserFromInvitation/index.ts` | Creates user accounts from invitation tokens |
| `supabase/functions/sendInviteEmail/index.ts` | Sends email invitations |
| `supabase/functions/validateToken/index.ts` | Validates invitation tokens |
| `src/api/mockEdgeFunctions.ts` | Local development mocks for edge functions |

## Utility and Helper Files

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | General utility functions |
| `src/database/schema.sql` | SQL schema definition |

## Type Definitions

| File | Purpose |
|------|---------|
| `src/types/auth.ts` | Authentication-related types |
| `src/types/index.ts` | Core application type definitions |

## Development Notes

### Key Workflows

1. **Invitation Process**:
   - Admin creates invitation (`Invitations.tsx` → `InviteForm.tsx` → `sendInviteEmail` edge function)
   - Agent receives email with token
   - Agent uses token to create account (`AcceptInvitation.tsx` → `AcceptInvitationForm.tsx` → `createUserFromInvitation` edge function)

2. **Agreement Completion**:
   - Agent navigates to Agreement (`Agreement.tsx`)
   - Multi-step form using `WizardContext.tsx` for state management
   - Agreement data saved to `agreement_drafts` table with auto-save
   - Final submission stores in `executed_agreements` table

3. **Physical Agreement Upload**:
   - Agent uploads scanned agreement via `PhysicalAgreementUpload.tsx`
   - File stored in Supabase storage
   - Metadata stored in `physical_agreements` table

### Issues to Be Aware Of

1. There are currently two agent dashboard implementations:
   - `/agent/dashboard` (lowercase)
   - `/agent/AgentDashboard` (capitalized)
   - Header navigation points to the capitalized version

2. Authentication flow depends on proper configuration of Supabase auth settings
