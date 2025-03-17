
// Define the profile type matching our Supabase schema
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'investor';
  created_at: string;
  updated_at: string;
};
