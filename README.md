
# Ireland Pay Sales Agent Agreement Portal

This project is a web application for managing sales agent agreements for Ireland Pay.

## Supabase Edge Functions

The project includes Supabase Edge Functions located in the `/supabase/functions/` directory. These functions are designed to be deployed directly to Supabase's serverless environment. They are not part of the TypeScript build process for the frontend.

### Available Edge Functions:

- **createUserFromInvitation**: Creates a new user account from an invitation token
- **sendInviteEmail**: Sends an invitation email to a new sales agent
- **validateToken**: Validates an invitation token

## Development

For local development, the project uses mock implementations of the Edge Functions located in `src/api/mockEdgeFunctions.ts`.

### Deployment Steps for Edge Functions

When deploying to Supabase:

1. Navigate to the edge function directory:
   ```
   cd supabase/functions/[function-name]
   ```

2. Deploy using the Supabase CLI:
   ```
   supabase functions deploy [function-name]
   ```

3. Set required environment variables in the Supabase dashboard:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
   - SMTP_HOSTNAME (for sendInviteEmail)
   - SMTP_PORT (for sendInviteEmail)
   - SMTP_USERNAME (for sendInviteEmail)
   - SMTP_PASSWORD (for sendInviteEmail)
   - SMTP_FROM (for sendInviteEmail)
   - FRONTEND_URL (for sendInviteEmail)

## Features

- **Authentication**: Admin and Sales Agent roles
- **Invitation System**: Email-based invitations with secure tokens
- **Multi-step Agreement**: Form wizard for completing sales agent agreements
- **E-Signature**: Digital signature capture for agreements
- **Admin Dashboard**: Overview of invitations and agreements

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Supabase for backend services (Auth, Database, Edge Functions)
- Shadcn UI components
