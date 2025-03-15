
import React from 'react';
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

const SidebarNav = () => {
  const location = useLocation();
  
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
  );
};

export default SidebarNav;
