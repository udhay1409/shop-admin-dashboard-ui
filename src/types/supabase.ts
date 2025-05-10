
// Custom types for Supabase tables
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: 'admin' | 'staff' | 'customer';
  created_at: string;
  updated_at: string;
};
