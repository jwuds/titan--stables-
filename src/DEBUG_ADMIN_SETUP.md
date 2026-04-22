# Admin Role Setup & Debugging Guide

This guide details how the admin role system works, how to troubleshoot access issues, and how to manually provision admin users.

## How It Works

The system uses **Supabase User Metadata** (`raw_user_meta_data`) to store role information. 
It does **NOT** rely on a separate `admin_profiles` table for permission checks (though that table may exist for legacy reasons).

- **Role Location:** `auth.users.raw_user_meta_data -> role`
- **Valid Roles:** `admin`, `super_admin`, `editor`, `user`
- **Admin Check:** `user_metadata.role === 'admin' || 'super_admin'`

## Auto-Provisioning (Self-Service)

For ease of setup/development, the **Login Page** currently includes logic to:
1. Detect if a user logs in without a role.
2. Automatically call `setCurrentUserAsAdmin()` to promote them to `admin`.
3. Refresh the session to apply the new role.

This allows the first user (you) to log in and immediately gain access.

## Debugging Access Issues

If you cannot access `/admin`:

### 1. Check Browser Console
Open Developer Tools (F12) -> Console. The `AuthContext` and `ProtectedRoute` emit logs:
- `[AuthContext] Role missing...`
- `ProtectedRoute Access Check`
    - `User Role: ...`
    - `Is Admin: false`

### 2. Use the Debug Page
Navigate manually to:
`https://your-domain.com/admin-debug`

This page provides:
- Live view of your current `user_metadata`.
- A button to **Force Set Admin Role** (fixes missing roles).
- Session refresh controls.

### 3. Manual Verification (Console)
Paste this into your browser console to see your current state: