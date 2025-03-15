
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListTodo, 
  Kanban, 
  Workflow, 
  Settings, 
  Users, 
  BarChart,
  FileText,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Sidebar = () => {
  const location = useLocation();
  const [isLightMode, setIsLightMode] = useState(false);
  
  useEffect(() => {
    // Check if light mode is active and update state when theme changes
    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light'));
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
  
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
    },
    {
      title: 'Board View',
      icon: Kanban,
      path: '/board',
    },
    {
      title: 'List View',
      icon: ListTodo,
      path: '/list',
    },
    {
      title: 'Workflow',
      icon: Workflow,
      path: '/workflow',
    },
    {
      title: 'Analytics',
      icon: BarChart,
      path: '/analytics',
    },
    {
      title: 'Emails',
      icon: Mail,
      path: '/emails',
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/reports',
    },
    {
      title: 'Team',
      icon: Users,
      path: '/team',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];
  
  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-sidebar fixed">
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={isLightMode 
              ? "/lovable-uploads/d882938e-4517-400d-aeac-d32ae1759a49.png" 
              : "/lovable-uploads/52b2437c-f1ce-4662-9136-9d1b36a72734.png"} 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 px-3",
                  (location.pathname === item.path || 
                   (item.path === '/' && location.pathname === '/')) && 
                   "bg-accent text-accent-foreground font-medium"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-accent p-4">
          <div className="mb-2 flex items-center justify-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              SC
            </span>
          </div>
          <p className="mb-1 text-center text-sm font-medium">SCVentures Pro</p>
          <p className="text-center text-xs text-muted-foreground">
            Managing your startup funnel with precision
          </p>
          <Separator className="my-2" />
          <Button size="sm" className="w-full text-xs">
            Account Settings
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
