# Admin Access Debugging Guide

This guide helps troubleshoot issues with admin access in the Titan Stables application. The system now uses Supabase Auth Metadata (`user_metadata`) instead of a separate `admin_profiles` table for role management.

## 1. Quick Verification

To verify if you are correctly logged in as an admin, open your browser's Developer Tools (F12) and check the Console tab.

Look for these logs when you navigate to `/admin` or refresh the page:
- `ProtectedRoute Check`
- `User: your-email@example.com`
- `Role: admin` (or `super_admin`)
- `Is Admin: true`

If `Role` is missing, `user` or `null`, you do not have admin privileges.

## 2. Checking Role via Console

You can manually inspect your current session in the browser console by running this snippet: