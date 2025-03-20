
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!isLoading && user) {
      navigate('/dashboard', { replace: true });
    } else if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
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
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Bem-vindo ao Sistema</h1>
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Index;
