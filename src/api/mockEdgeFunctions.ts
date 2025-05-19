
import { toast } from "sonner";

/**
 * This file contains mock implementations of Supabase Edge Functions
 * for local development. In production, these would be replaced by
 * actual calls to the deployed Edge Functions.
 */

/**
 * Mock implementation of the validateToken Edge Function
 */
export const validateToken = async (token: string, email: string) => {
  // For demo purposes, we'll consider most tokens valid
  const isValidToken = !token.includes("invalid");
      
  if (!isValidToken) {
    return {
      valid: false,
      error: "This invitation link has expired or is invalid"
    };
  }
  
  return {
    valid: true,
    email
  };
};

/**
 * Mock implementation of the createUserFromInvitation Edge Function
 */
export const createUserFromInvitation = async (
  token: string,
  email: string,
  password: string
) => {
  // Simple validation
  if (!token || !email || !password) {
    throw new Error("Token, email, and password are required");
  }

  // For demo purposes
  if (token.includes("invalid")) {
    throw new Error("Invalid or expired invitation");
  }

  try {
    // In a real implementation, we would fetch the invitation details from Supabase
    // For demo purposes, we'll simulate this by using a mock invitation
    console.log(`Creating user from invitation: ${token} for email: ${email}`);
    
    // Simulate fetching invitation details from Supabase
    const mockInvitationDetails = {
      residual_percentage: 25, // Default value if not specified in the invitation
      role: 'agent',
      // In a real implementation, this would be fetched from the database
    };
    
    // Simulate creating the user in Supabase Auth
    console.log(`Creating user with role: ${mockInvitationDetails.role} and residual percentage: ${mockInvitationDetails.residual_percentage}%`);
    
    // Simulate creating a profile with the residual percentage
    console.log(`Setting up user profile with residual percentage: ${mockInvitationDetails.residual_percentage}%`);
    
    // Simulate successful user creation
    return {
      success: true,
      user: {
        id: "mock-user-id-" + Date.now(),
        email,
        role: "agent",
        residualPercentage: mockInvitationDetails.residual_percentage
      }
    };
  } catch (error) {
    console.error("Error creating user from invitation:", error);
    throw error;
  }
};

/**
 * Interface for invitation details
 */
export interface InvitationDetails {
  residualPercentage: number;
  token: string;
  inviteLink: string;
  role?: string;
}

/**
 * Mock implementation of the sendInviteEmail Edge Function
 */
export const sendInviteEmail = async (email: string, details?: InvitationDetails) => {
  // Simple validation
  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address");
  }

  // Log invitation details for development
  if (details) {
    console.log(`Sending invitation to ${email} with residual percentage: ${details.residualPercentage}%`);
    console.log(`Invitation link: ${details.inviteLink}`);
  }

  // Simulate sending invitation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response
  return {
    success: true,
    message: "Invitation sent successfully",
    id: "mock-invitation-id-" + Date.now(),
    details
  };
};
