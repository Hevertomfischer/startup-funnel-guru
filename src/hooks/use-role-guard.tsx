
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';

/**
 * Hook to guard routes based on user role
 * @param adminOnly If true, only admins can access the route
 * @returns Object with isAllowed flag
 */
export const useRoleGuard = (adminOnly: boolean = true) => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If still loading auth state, do nothing yet
    if (isLoading) return;

    // If not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // If admin required but user is not admin, redirect to dashboard
    if (adminOnly && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, isLoading, user, adminOnly, navigate]);

  return {
    isAllowed: !isLoading && !!user && (!adminOnly || isAdmin),
  };
};

/**
 * Component that only renders its children if the user has the required role
 */
export const ProtectedContent = ({
  children,
  adminOnly = true,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { isAllowed } = useRoleGuard(adminOnly);
  
  if (!isAllowed) {
    return null;
  }
  
  return <>{children}</>;
};
