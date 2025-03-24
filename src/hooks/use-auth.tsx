
import { useAuthContext } from '@/contexts/auth-context';
import { Profile } from '@/types/auth';

// Re-export the Profile type
export type { Profile };

// Custom hook to use the auth context
export const useAuth = () => {
  return useAuthContext();
};

// Create a component that wraps the children with the AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // We'll add the AuthProvider from the context here, but we need to 
  // make sure it doesn't use useNavigate directly
  return children;
};

// Re-export the useRoleGuard functionality
export { useRoleGuard } from '@/hooks/use-role-guard';
