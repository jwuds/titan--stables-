# ModSecurity Compatibility Audit Report

**Date:** 2026-01-08
**Project:** Titan Stables
**Scope:** Frontend Codebase & API Interactions

## Executive Summary
A comprehensive review of the codebase identified several patterns likely to trigger ModSecurity (WAF) false positives or blocks. ModSecurity rulesets (like OWASP CRS) often flag specific character combinations, SQL-like syntax in inputs, and missing headers.

## 1. Suspicious Patterns Found
*   **SQL Injection-like Patterns:**
    *   `HorseFilters.jsx`: Search inputs allow raw text which might contain characters like `'`, `--`, `;`, or `UNION` that trigger SQLi rules.
    *   `ContactForm.jsx`: Message fields allow unrestricted text which could look like XSS or SQL injection attacks if users type specific symbols (e.g., `<script>`, `SELECT`).
*   **XSS Vectors:**
    *   `ProductDetailPage.jsx`: Uses `dangerouslySetInnerHTML` for description rendering. While convenient, if the content contains script tags, it will trigger WAF rules on submission or rendering.
    *   `RichTextEditor.jsx` (implied usage): HTML content submission is a primary trigger for WAFs.

## 2. Form Validation Gaps
*   **ContactForm.jsx:**
    *   Missing strict sanitization on `message` field.
    *   No rate limiting implemented on the client side.
    *   Missing `Content-Type` specification in some API calls logic (relies on default).
*   **HorseFilters.jsx:**
    *   URL query parameters (`?search=...`) are a common vector. If a user searches for `"UNION SELECT"`, the WAF will block the entire page load.
*   **AuthPage.jsx:**
    *   Email inputs not strictly validated before sending to Supabase.

## 3. API Endpoint Issues
*   **Supabase Client:**
    *   Direct database queries (`.from('table').select()`) are generally safe because Supabase uses parameterized queries, but the *payload* sent over HTTP is JSON. ModSecurity inspects JSON bodies.
    *   Keys containing special characters or excessively long strings in JSON payloads can trigger body limit rules.

## 4. Header Problems
*   **Missing Standard Headers:**
    *   Requests often lack `X-Requested-With`, `Accept`, or explicit `Content-Type` in custom fetch calls, which protocol anomalies rules might flag.
*   **User-Agent:**
    *   Automated fetches might not set a standard User-Agent, though browser requests usually handle this.

## 5. Input Handling Vulnerabilities
*   **File Uploads (`HorseUpload.jsx`, `ProductsList.jsx`):**
    *   File names with special characters or double extensions (`image.php.jpg`) are high-risk triggers.
    *   MIME type validation is client-side only in some instances.

## 6. URL Encoding Issues
*   **Query Strings:**
    *   Filters in `HorseFilters` put user input directly into URL state. If not properly encoded, spaces, quotes, and brackets will break or be flagged.

## 7. Recommendations (Implemented in subsequent tasks)
1.  **Sanitization:** Create a central `inputValidation.js` library.
2.  **Rate Limiting:** Implement a simple client-side leaky bucket or timestamp check.
3.  **Headers:** Ensure all fetch calls include security headers.
4.  **Encoding:** Use `encodeURIComponent` strictly for all URL parameters.