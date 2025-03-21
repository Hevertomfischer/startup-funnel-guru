
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './use-auth-hook';
import { Skeleton } from '@/components/ui/skeleton';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [extendedLoading, setExtendedLoading] = useState(false);
  
  // Set a timeout to show extended loading message if auth takes too long
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setExtendedLoading(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setExtendedLoading(false);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 p-4">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-3 w-32 mx-auto" />
          <p className="text-muted-foreground text-sm mt-4">Verificando autenticação...</p>
          
          {extendedLoading && (
            <div className="mt-4 text-amber-500 text-sm max-w-md">
              <p>A verificação está demorando mais que o normal.</p>
              <p className="mt-2">Se o problema persistir, tente recarregar a página ou fazer login novamente.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login, but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
