
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Toaster } from 'sonner';
import ViewToggle from '@/components/ViewToggle';
import { ViewMode } from '@/types';

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header>
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
