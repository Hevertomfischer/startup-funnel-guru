import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Bell, Settings, User, Menu, X, Moon, Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ViewMode } from '@/types';

interface HeaderProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onSearch: (searchTerm: string) => void;
  onAddStartup?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  view, 
  setView, 
  onSearch, 
  onAddStartup,
  children 
}) => {
  const { toast } = useToast();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check if light mode is active and update states accordingly
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light');
      setIsLightMode(isLight);
      setIsDarkMode(!isLight);
    };
    
    // Initial check
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Call onSearch immediately on every change
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    setIsDarkMode(!isDarkMode);
    setIsLightMode(!isLightMode);
  };

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
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search startups..."
              className="w-full pl-8 bg-background"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
        </div>

        <div className="flex items-center gap-2">
          {children}

          <Button 
            onClick={toggleDarkMode} 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search startups..."
            className="w-full pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background border-b z-50 shadow-lg animate-fade-in">
          <nav className="px-4 py-3">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 py-2 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/board" 
                  className="flex items-center gap-2 py-2 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Board
                </Link>
              </li>
              <li>
                <Link 
                  to="/list" 
                  className="flex items-center gap-2 py-2 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  List View
                </Link>
              </li>
              <li>
                <Link 
                  to="/workflow" 
                  className="flex items-center gap-2 py-2 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Workflow
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
