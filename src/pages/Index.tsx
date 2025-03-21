
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/auth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [extendedLoading, setExtendedLoading] = useState(false);
  
  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!isLoading) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
    
    // Set a timeout to show extended loading message if auth takes too long
    const timer = setTimeout(() => {
      if (isLoading) {
        setExtendedLoading(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  // Show a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 p-4">
        <div className="text-center max-w-sm w-full">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto mb-2" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
        <p className="text-muted-foreground">Carregando aplicação...</p>
        
        {extendedLoading && (
          <div className="mt-4 space-y-4">
            <p className="text-amber-500">O carregamento está demorando mais que o normal.</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/login', { replace: true })}
            >
              Ir para login
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
              className="ml-2"
            >
              Recarregar página
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bem-vindo ao Sistema</h1>
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
        <Button 
          className="mt-6" 
          onClick={() => navigate('/login')}
        >
          Ir para Login
        </Button>
      </div>
    </div>
  );
};

export default Index;
