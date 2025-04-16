import { ErrorMessages } from './types/error-message';

/**
 * Default set of error messages used across the application.
 * These messages are used when no custom error messages are provided.
 * Each key corresponds to a common validation error.
 */
export const DEFAULT_ERROR_MESSAGES: ErrorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minlength: (val) => `Minimum length is ${val.requiredLength} characters`,
  maxlength: (val) => `Maximum length is ${val.requiredLength} characters`,
  pattern: 'Invalid format',
  min: (val) => `Minimum value is ${val.min}`,
  max: (val) => `Maximum value is ${val.max}`
};
