import { sanitizeInput, escapeHtml } from './inputValidation';
import { getSecurityHeaders, generateClientToken } from './securityHeaders';

// Rate Limiting Storage
const SUBMISSION_HISTORY = {};

/**
 * Checks if a user is rate limited for a specific form action.
 * @param {string} formId - Unique identifier for the form.
 * @param {number} limit - Max submissions allowed.
 * @param {number} windowSeconds - Time window in seconds.
 * @returns {boolean} - True if allowed, false if rate limited.
 */
export const checkRateLimit = (formId, limit = 3, windowSeconds = 60) => {
  const now = Date.now();
  const history = SUBMISSION_HISTORY[formId] || [];
  
  // Filter out old timestamps
  const validHistory = history.filter(time => time > now - (windowSeconds * 1000));
  
  if (validHistory.length >= limit) {
    return false;
  }
  
  validHistory.push(now);
  SUBMISSION_HISTORY[formId] = validHistory;
  return true;
};

/**
 * Prepares form data by sanitizing all string fields.
 * @param {object} formData 
 * @returns {object} Sanitized form data
 */
export const prepareFormData = (formData) => {
  const cleanData = {};
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      cleanData[key] = sanitizeInput(value);
    } else {
      cleanData[key] = value;
    }
  }
  return cleanData;
};

/**
 * Validates form data against a simple schema.
 * @param {object} formData 
 * @param {object} schema - e.g. { email: { required: true, type: 'email' } }
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateFormData = (formData, schema) => {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const value = formData[field];

    if (rules.required && (!value || value === '')) {
      errors[field] = 'This field is required';
      isValid = false;
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) {
        errors[field] = `Max length is ${rules.maxLength} characters`;
        isValid = false;
    }
  }

  return { valid: isValid, errors };
};

/**
 * Adds security headers and client token to request options.
 * @param {object} options - existing fetch options
 * @returns {object} - new options with headers
 */
export const addSecurityHeaders = (options = {}) => {
  const headers = {
    ...getSecurityHeaders(),
    'X-Client-Token': generateClientToken(),
    ...(options.headers || {})
  };
  return { ...options, headers };
};