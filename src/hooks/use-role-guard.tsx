
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

export const useRoleGuard = (adminOnly = false) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (adminOnly && !isAdmin) {
        toast({
          title: "Acesso Restrito",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, isAdmin, navigate, adminOnly, toast]);

  return { isAllowed: !isLoading && user && (!adminOnly || isAdmin) };
};

// HOC to protect routes based on role
export const withRoleGuard = (Component: React.ComponentType<any>, adminOnly = false) => {
  return (props: any) => {
    const { isAllowed } = useRoleGuard(adminOnly);
    const { isLoading } = useAuth();

    if (isLoading) {
      return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return isAllowed ? <Component {...props} /> : null;
  };
};

// Component wrapper for protected content
export const ProtectedContent = ({ 
  children, 
  adminOnly = false 
}: { 
  children: ReactNode; 
  adminOnly?: boolean;
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }
  
  if (!user) {
    return null;
  }
  
  if (adminOnly && !isAdmin) {
    return null;
  }
  
  return <>{children}</>;
};
