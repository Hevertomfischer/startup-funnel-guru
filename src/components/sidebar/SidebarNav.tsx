
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  List, 
  KanbanSquare, 
  Users, 
  BarChartHorizontal, 
  FileText, 
  Mail, 
  Settings, 
  Workflow, 
  ListTodo,
  Briefcase
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-accent text-accent-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

const SidebarNav: React.FC = () => {
  const iconSize = { size: 18 };

  return (
    <nav className="space-y-1 px-2">
      <SidebarLink to="/dashboard" icon={<LayoutDashboard {...iconSize} />} label="Dashboard" />
      <SidebarLink to="/board" icon={<KanbanSquare {...iconSize} />} label="Board" />
      <SidebarLink to="/list" icon={<List {...iconSize} />} label="Lista" />
      <SidebarLink to="/portfolio" icon={<Briefcase {...iconSize} />} label="Portfólio" />
      <SidebarLink to="/tasks" icon={<ListTodo {...iconSize} />} label="Tarefas" />
      <SidebarLink to="/workflow" icon={<Workflow {...iconSize} />} label="Workflow" />
      <SidebarLink to="/team" icon={<Users {...iconSize} />} label="Equipe" />
      <SidebarLink to="/analytics" icon={<BarChartHorizontal {...iconSize} />} label="Analytics" />
      <SidebarLink to="/reports" icon={<FileText {...iconSize} />} label="Relatórios" />
      <SidebarLink to="/emails" icon={<Mail {...iconSize} />} label="E-mails" />
      <SidebarLink to="/settings" icon={<Settings {...iconSize} />} label="Configurações" />
    </nav>
  );
};

export default SidebarNav;
