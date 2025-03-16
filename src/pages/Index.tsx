
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import ViewToggle from '@/components/ViewToggle';
import { ViewMode } from '@/types';
import { useAuth } from '@/hooks/use-auth';

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
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Show loading or redirect to login if not authenticated
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
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
