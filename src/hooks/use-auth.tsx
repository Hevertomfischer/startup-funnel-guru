
import { useAuthContext } from '@/contexts/auth-context';
import { Profile } from '@/types/auth';

// Re-export the AuthProvider from the context
export { AuthProvider } from '@/contexts/auth-context';

// Re-export the Profile type
export type { Profile };

// Custom hook to use the auth context
export const useAuth = () => {
  return useAuthContext();
};

// Re-export the useRequireAuth functionality
export { useRoleGuard as useRequireAuth } from './use-role-guard';
