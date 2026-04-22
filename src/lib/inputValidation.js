/**
 * Input Validation & Sanitization Utility
 * Designed to prevent ModSecurity false positives and enhance security.
 */

// Regex patterns that often trigger WAFs
const SQL_KEYWORDS = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|DECLARE)\b/gi;
const SCRIPT_TAGS = /<script\b[^>]*>([\s\S]*?)<\/script>/gim;
const SPECIAL_CHARS = /[;'"<>\\]/g; // Basic special chars often flagged

/**
 * Sanitizes input text by removing potentially dangerous characters and patterns.
 * @param {string} text - The input text to sanitize.
 * @returns {string} - The sanitized text.
 */
export const sanitizeInput = (text) => {
  if (typeof text !== 'string') return '';
  
  let sanitized = text
    .replace(SCRIPT_TAGS, '') // Remove script tags
    .replace(SQL_KEYWORDS, '') // Remove SQL keywords
    .replace(SPECIAL_CHARS, '') // Remove special characters
    .trim();
    
  // Escape HTML entities just in case
  sanitized = escapeHtml(sanitized);
  
  return sanitized;
};

/**
 * Validates email format strictly.
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  // RFC 5322 compliant regex
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format.
 * Allows +, -, space, brackets, and digits.
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneRegex.test(phone);
};

/**
 * Validates a search term to ensure it's safe for URL parameters.
 * @param {string} term 
 * @returns {boolean}
 */
export const validateSearchTerm = (term) => {
  if (!term) return true;
  // Fail if contains common SQL injection chars or script tags
  if (SQL_KEYWORDS.test(term) || SCRIPT_TAGS.test(term) || /[;'"<>]/.test(term)) {
    return false;
  }
  return true;
};

/**
 * Escapes HTML characters to prevent XSS.
 * @param {string} text 
 * @returns {string}
 */
export const escapeHtml = (text) => {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Validates file upload for type and size.
 * @param {File} file 
 * @param {string[]} allowedTypes 
 * @param {number} maxSize (in bytes)
 * @returns {object} { valid: boolean, error: string }
 */
export const validateFileUpload = (file, allowedTypes, maxSize) => {
  if (!file) return { valid: false, error: "No file selected." };

  // Validate File Name (prevent double extensions like .php.jpg)
  const fileName = file.name.toLowerCase();
  const suspiciousPattern = /\.(php|pl|py|rb|sh|exe|dll|bat|cmd|vbs)\./;
  if (suspiciousPattern.test(fileName)) {
    return { valid: false, error: "Invalid file name format." };
  }

  // Validate Type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` };
  }

  // Validate Size
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max size: ${maxSize / 1024 / 1024}MB` };
  }

  return { valid: true, error: null };
};