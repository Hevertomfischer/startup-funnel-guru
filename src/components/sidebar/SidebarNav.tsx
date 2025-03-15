
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban, 
  List, 
  TrendingUp, 
  Workflow, 
  Users, 
  Mail, 
  Settings,
  FileBarChart,
  ClipboardList
} from 'lucide-react';

const SidebarNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Board', path: '/board', icon: <Kanban className="h-5 w-5" /> },
    { name: 'List View', path: '/list', icon: <List className="h-5 w-5" /> },
    { name: 'Tasks', path: '/tasks', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Workflow', path: '/workflow', icon: <Workflow className="h-5 w-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <TrendingUp className="h-5 w-5" /> },
    { name: 'Team', path: '/team', icon: <Users className="h-5 w-5" /> },
    { name: 'Email Templates', path: '/emails', icon: <Mail className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <FileBarChart className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className={`
            flex items-center px-3 py-2 text-sm rounded-md transition-colors
            ${currentPath === item.path || (item.path !== '/dashboard' && currentPath.includes(item.path))
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }
          `}
        >
          {item.icon}
          <span className="ml-3">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default SidebarNav;
