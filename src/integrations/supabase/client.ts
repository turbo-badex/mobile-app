
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from '@/hooks/use-toast';

// Try to use environment variables first, fall back to hardcoded values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://iimybykuxkeaellzdkvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpbXlieWt1eGtlYWVsbHpka3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNTU0MjAsImV4cCI6MjA1NjYzMTQyMH0.6TU-4_QJYi2q8zUWWixxOfKF0052pC1jKG6GDuMVvsY";

// Check if we have Supabase configuration
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase configuration');
  toast({
    title: 'Configuration Error',
    description: 'Supabase is not properly configured',
    variant: 'destructive',
  });
}

// Create and export the supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Export a helper to check if user is logged in
export const isUserLoggedIn = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};
