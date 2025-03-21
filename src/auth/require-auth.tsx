
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './use-auth-hook';
import { Skeleton } from '@/components/ui/skeleton';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Mostrar um indicador de carregamento por no máximo 3 segundos
  // Se demorar mais que isso, mostraremos uma mensagem mais detalhada
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 p-4">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-3 w-32 mx-auto" />
          <p className="text-muted-foreground text-sm mt-4">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
