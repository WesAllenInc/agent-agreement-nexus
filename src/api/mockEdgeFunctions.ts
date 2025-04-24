
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

  // Simulate successful user creation
  return {
    success: true,
    user: {
      id: "mock-user-id-" + Date.now(),
      email,
      role: "sales_agent",
    }
  };
};

/**
 * Mock implementation of the sendInviteEmail Edge Function
 */
export const sendInviteEmail = async (email: string) => {
  // Simple validation
  if (!email || !email.includes("@")) {
    throw new Error("Please enter a valid email address");
  }

  // Simulate sending invitation
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response
  return {
    success: true,
    message: "Invitation sent successfully",
    id: "mock-invitation-id-" + Date.now()
  };
};
