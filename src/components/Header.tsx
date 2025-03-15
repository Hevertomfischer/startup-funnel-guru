
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewMode } from '@/types';
import ThemeToggle from './header/ThemeToggle';
import SearchBar from './header/SearchBar';
import UserMenu from './header/UserMenu';
import MobileMenu from './header/MobileMenu';

interface HeaderProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onSearch: (searchTerm: string) => void;
  onAddStartup?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  children 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 mx-4 max-w-md">
          <SearchBar onSearch={onSearch} />
        </div>

        <div className="flex items-center gap-2">
          {children}

          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-3">
        <SearchBar onSearch={onSearch} />
      </div>
      
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
