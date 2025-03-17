
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import ViewToggle from '@/components/ViewToggle';
import { ViewMode } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log('Searching for:', term);
    // Further search implementation would go here
  };

  useEffect(() => {
    // Redirect to login if not authenticated and not currently loading
    if (!isLoading && !user) {
      console.log('No user detected, redirecting to login page');
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <div className="text-center">
          <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-48 mx-auto mb-2" />
          <Skeleton className="h-3 w-32 mx-auto" />
        </div>
        <p className="text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }

  // If not loading and no user, return null (will redirect in useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header 
          view={viewMode} 
          setView={setViewMode} 
          onSearch={handleSearch}
        >
          <div className="flex items-center gap-4">
            <ViewToggle view={viewMode} setView={setViewMode} />
          </div>
        </Header>
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
          <Toaster position="top-right" />
        </main>
      </div>
    </div>
  );
};

export default Index;
