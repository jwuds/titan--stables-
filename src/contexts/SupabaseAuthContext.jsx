/**
 * Legacy Auth Context for backward compatibility.
 * Redirects to the new AuthContext implementation.
 */
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';

export { AuthProvider, useAuth };