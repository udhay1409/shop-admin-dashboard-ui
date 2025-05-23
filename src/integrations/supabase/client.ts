
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { Profile, UserRole } from '@/types/supabase';

const SUPABASE_URL = "https://uhahxzsenmhdtgmltrjs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoYWh4enNlbm1oZHRnbWx0cmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NjU3ODUsImV4cCI6MjA2MjQ0MTc4NX0.Se3lpJxv8wrKMluLWGtFMIxtwDjS8ZAFAtMOb12TjFM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Define custom database type that includes our tables
type CustomDatabase = Database & {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserRole, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};

export const supabase = createClient<CustomDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
