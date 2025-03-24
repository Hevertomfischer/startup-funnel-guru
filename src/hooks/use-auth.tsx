
import { useAuthContext } from '@/contexts/auth-context';
import { Profile } from '@/types/auth';
import { AuthProvider as ContextAuthProvider } from '@/contexts/auth-context';

// Re-export the Profile type
export type { Profile };

// Custom hook to use the auth context
export const useAuth = () => {
  return useAuthContext();
};

// Create a component that wraps the children with the AuthProvider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the AuthProvider from the context
  return <ContextAuthProvider>{children}</ContextAuthProvider>;
};

// Re-export the useRoleGuard functionality
export { useRoleGuard } from '@/hooks/use-role-guard';
