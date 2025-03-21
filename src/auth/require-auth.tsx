
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './use-auth-hook';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, initializationComplete } = useAuth();
  const location = useLocation();
  const [extendedLoading, setExtendedLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  // Configurar um timeout para mostrar mensagem de carregamento estendido se a autenticação demorar muito
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    let redirectTimer: NodeJS.Timeout | undefined;
    
    if (isLoading) {
      console.log('RequireAuth: Iniciando timer para carregamento estendido');
      timer = setTimeout(() => {
        console.log('RequireAuth: Tempo estendido de carregamento atingido');
        setExtendedLoading(true);
        
        // Após um tempo adicional, automaticamente redirecionar para login
        redirectTimer = setTimeout(() => {
          if (isLoading) {
            console.log('RequireAuth: Redirecionando para login após tempo limite');
            toast.error('Tempo limite de autenticação excedido', {
              description: 'Redirecionando para a página de login'
            });
            setRedirectToLogin(true);
          }
        }, 5000); // 5 segundos adicionais antes de redirecionar
      }, 3000); // 3 segundos
      
      return () => {
        if (timer) clearTimeout(timer);
        if (redirectTimer) clearTimeout(redirectTimer);
      };
    } else {
      setExtendedLoading(false);
      if (timer) clearTimeout(timer);
      if (redirectTimer) clearTimeout(redirectTimer);
    }
  }, [isLoading]);

  console.log('RequireAuth: Estado atual -', { 
    isLoading, 
    user: !!user, 
    extendedLoading,
    initializationComplete,
    redirectToLogin
  });

  // Redirecionar para login se o timer de redirecionamento for ativado
  if (redirectToLogin) {
    console.log('RequireAuth: Redirecionando para login devido ao timer de redirecionamento');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mostrar carregamento durante a inicialização
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
              <p className="mt-2">Redirecionando para a página de login em breve...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Redirecionar para login se não houver usuário autenticado
  if (!user) {
    console.log('RequireAuth: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mostrar conteúdo protegido para usuários autenticados
  console.log('RequireAuth: Usuário autenticado, renderizando conteúdo protegido');
  return children;
};
