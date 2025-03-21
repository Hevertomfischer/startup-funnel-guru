
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/auth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const { user, isLoading, initializationComplete } = useAuth();
  const navigate = useNavigate();
  const [extendedLoading, setExtendedLoading] = useState(false);
  
  useEffect(() => {
    console.log('Index: Estado atual -', { 
      isLoading, 
      user: !!user, 
      initializationComplete 
    });
    
    // Só redirecionar quando a inicialização estiver completa
    if (initializationComplete && !isLoading) {
      if (user) {
        console.log('Index: Usuário autenticado, redirecionando para dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('Index: Usuário não autenticado, redirecionando para login');
        navigate('/login', { replace: true });
      }
    }
    
    // Configurar timeout para mostrar mensagem de carregamento estendido
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Index: Tempo estendido de carregamento atingido');
        setExtendedLoading(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, navigate, initializationComplete]);

  // Mostrar estado de carregamento enquanto verifica a autenticação
  if (isLoading || !initializationComplete) {
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="default" 
                onClick={() => {
                  console.log('Index: Forçando redirecionamento para login');
                  navigate('/login', { replace: true });
                }}
              >
                Ir para login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Index: Recarregando página');
                  window.location.reload();
                }}
              >
                Recarregar página
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Isso quase nunca deve ser visto, pois o useEffect deve redirecionar imediatamente
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
