
import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './Header';
import { ViewMode } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [view, setView] = useState<ViewMode>('board');
  
  // Define a search handler function
  const handleSearch = (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    // In a real implementation, this might filter content or trigger navigation
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          view={view} 
          setView={setView} 
          onSearch={handleSearch}
        />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
