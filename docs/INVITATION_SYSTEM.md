# Invitation System Documentation

## Overview
The invitation system provides a secure way to invite and onboard new sales agents to the Ireland Pay platform. It implements industry-standard security practices, rate limiting, and audit logging.

## Architecture

### Components
1. **Edge Functions**
   - `validateToken`: Validates invitation tokens
   - `createUserFromInvitation`: Creates user accounts from valid invitations
   - `sendInviteEmail`: Sends invitation emails to new users

2. **Database Tables**
   - `invitations`: Stores invitation records
   - `rate_limits`: Manages rate limiting
   - `security_audit_logs`: Tracks security events

3. **Security Utilities**
   - Rate limiting
   - Input validation
   - Password strength enforcement
   - Security headers
   - Audit logging

## Security Features

### 1. Rate Limiting
```typescript
// Example rate limit configuration
{
  key: 'validate_token:${ip}',  // Unique identifier
  window: 3600,                 // Time window in seconds
  maxAttempts: 10              // Max attempts per window
}
```

- Token validation: 10 attempts per hour
- Account creation: 5 attempts per hour
- Invitation sending: 50 attempts per day (admin only)

### 2. Input Validation
- Email format validation
- Password requirements:
  - Minimum 12 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- Input sanitization for XSS prevention

### 3. Security Headers
```typescript
{
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'self'...",
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

### 4. Row Level Security
- Admins can manage all invitations
- Users can only validate their own invitations
- Service role required for audit logs

## Database Schema

### Invitations Table
```sql
CREATE TABLE invitations (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    status invitation_status DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    user_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### Security Audit Logs
```sql
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY,
    event_type audit_event_type NOT NULL,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@example.com

# Application Configuration
PUBLIC_APP_URL=http://localhost:5173
INVITATION_EXPIRY_DAYS=7
```

## Workflow

1. **Sending Invitations**
   ```typescript
   // Admin creates invitation
   const response = await sendInviteEmail(email);
   ```

2. **Validating Tokens**
   ```typescript
   // User clicks invitation link
   const response = await validateToken(token, email);
   ```

3. **Creating Accounts**
   ```typescript
   // User submits registration form
   const response = await createUserFromInvitation(token, email, password);
   ```

## Security Best Practices

1. **Token Security**
   - One-time use tokens
   - 7-day expiration
   - Automatic cleanup of expired tokens
   - Secure token generation using crypto

2. **Password Security**
   - Strong password requirements
   - Password strength meter
   - Secure password storage using Supabase Auth

3. **Rate Limiting**
   - IP-based rate limiting
   - Automatic blocking of suspicious activity
   - Cleanup of old rate limit records

4. **Audit Logging**
   - All security events are logged
   - IP and user agent tracking
   - Success/failure tracking
   - Suspicious activity detection

## Error Handling

1. **Common Errors**
   - Invalid token
   - Expired invitation
   - Rate limit exceeded
   - Invalid email format
   - Weak password
   - Already accepted invitation

2. **Error Responses**
   ```typescript
   {
     success: false,
     error: "Detailed error message"
   }
   ```

## Maintenance

1. **Automatic Cleanup**
   - Expired invitations: After 30 days
   - Rate limit records: After 24 hours
   - Failed audit logs: After 90 days

2. **Monitoring**
   - Watch for suspicious activity in audit logs
   - Monitor rate limit violations
   - Track invitation acceptance rates

## Testing

1. **Security Testing**
   - Rate limit testing
   - Token validation testing
   - Input validation testing
   - SQL injection prevention
   - XSS prevention

2. **Integration Testing**
   - Email delivery testing
   - User creation flow
   - Error handling
   - Edge cases

## Deployment

1. **Edge Functions**
   ```bash
   # Deploy Edge Functions
   supabase functions deploy validateToken
   supabase functions deploy createUserFromInvitation
   supabase functions deploy sendInviteEmail
   ```

2. **Database Migrations**
   ```bash
   # Run migrations
   supabase db push
   ```

## Support

For security issues or vulnerabilities, contact:
- Security Team: security@irelandpay.com
- Emergency: +1-XXX-XXX-XXXX
