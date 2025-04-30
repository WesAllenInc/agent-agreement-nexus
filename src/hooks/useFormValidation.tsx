
import { useState, useEffect } from 'react';

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface PasswordStrength {
  score: number;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
  };
}

export function useFormValidation() {
  const validateEmail = (email: string): ValidationState => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
    };
  };

  const validatePassword = (password: string): { strength: PasswordStrength; message: string } => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let message = '';
    if (!requirements.minLength) message = 'Password must be at least 8 characters';
    else if (!requirements.hasUpperCase) message = 'Include at least one uppercase letter';
    else if (!requirements.hasNumber) message = 'Include at least one number';
    else if (!requirements.hasSymbol) message = 'Include at least one symbol';

    return {
      strength: { score, requirements },
      message
    };
  };

  const validatePasswordMatch = (password: string, confirmPassword: string): ValidationState => ({
    isValid: password === confirmPassword,
    message: password === confirmPassword ? '' : 'Passwords do not match'
  });

  return {
    validateEmail,
    validatePassword,
    validatePasswordMatch
  };
}

