import { createClient } from '@supabase/supabase-js';

// The system will replace these placeholders with your actual Supabase credentials.
// This ensures a secure and correct connection to your Supabase project.
const supabaseUrl = '__SUPABASE_URL__';
const supabaseAnonKey = '__SUPABASE_ANON_KEY__';

// Initialize the Supabase client with the provided credentials.
// The createClient function returns a new Supabase client instance.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);