# ModSecurity Fixes Documentation

**Date:** 2026-01-08
**Project:** Titan Stables Security Hardening

## 1. Overview
This document outlines the changes implemented to ensure the Titan Stables frontend is compatible with ModSecurity (WAF) and adheres to security best practices. The goal was to eliminate false positives caused by benign user input and to harden the application against actual attacks.

## 2. Modified Files
*   `src/lib/inputValidation.js`: New utility for sanitizing and validating inputs.
*   `src/lib/securityHeaders.js`: New utility for generating standard API headers.
*   `src/lib/formSubmissionHelper.js`: New utility for safe form handling and rate limiting.
*   `src/components/ContactForm.jsx`: Implemented rate limiting, sanitization, and length checks.
*   `src/components/HorseFilters.jsx`: Added input cleaning for search terms.
*   `src/components/ProductsList.jsx`: Added file upload validation and input sanitization.
*   `src/pages/AuthPage.jsx`: Added rate limiting and email validation.

## 3. Key Fixes & ModSecurity Impact

### A. SQL Injection Prevention
*   **Fix:** Removed SQL keywords (`SELECT`, `UNION`, etc.) and special characters (`'`, `;`, `--`) from user inputs via `sanitizeInput()`.
*   **ModSecurity Rule:** Prevents triggering SQLi rulesets (e.g., OWASP CRS 942xxx).

### B. XSS Prevention
*   **Fix:** Stripped `<script>` tags and implemented HTML entity escaping for text rendering.
*   **ModSecurity Rule:** Prevents triggering XSS rulesets (e.g., OWASP CRS 941xxx).

### C. Protocol Anomalies
*   **Fix:** Added `Accept`, `Content-Type`, and `User-Agent` (implicitly via browser) to API calls.
*   **ModSecurity Rule:** Prevents flagging requests as malformed HTTP (OWASP CRS 920xxx).

### D. Rate Limiting
*   **Fix:** Implemented client-side checks to prevent rapid firing of form submissions (e.g., max 3 per minute for contact form).
*   **ModSecurity Rule:** Helps mitigate Denial of Service (DoS) detection rules.

## 4. Implementation Details

### Before vs After (Search Input)
**Before:**