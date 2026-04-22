import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vogxdytjgsryftdynyro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ3hkeXRqZ3NyeWZ0ZHlueXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNzI4NDYsImV4cCI6MjA3ODc0ODg0Nn0.WcAuXgora_I5kqGlhcp3HZx93YBTnZenMMgnBaKisec';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
