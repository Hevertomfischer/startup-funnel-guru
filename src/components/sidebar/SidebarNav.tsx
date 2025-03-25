
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Kanban,
  ListTodo,
  CheckSquare,
  Upload,
  Users,
  Mail,
  BarChart2,
  FileText,
  Briefcase,
  DollarSign,
  GitBranch,
  Code,
  EmbedIcon
} from "lucide-react";

const SidebarNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutGrid className="mr-2 h-4 w-4" />,
    },
    {
      title: "Quadro",
      href: "/board",
      icon: <Kanban className="mr-2 h-4 w-4" />,
    },
    {
      title: "Lista",
      href: "/list",
      icon: <ListTodo className="mr-2 h-4 w-4" />,
    },
    {
      title: "Tarefas",
      href: "/tasks",
      icon: <CheckSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: "Importar",
      href: "/import",
      icon: <Upload className="mr-2 h-4 w-4" />,
    },
    {
      title: "Equipe",
      href: "/team",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "E-mails",
      href: "/emails",
      icon: <Mail className="mr-2 h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Relatórios",
      href: "/reports",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Portfólio",
      href: "/portfolio",
      icon: <Briefcase className="mr-2 h-4 w-4" />,
    },
    {
      title: "Investidores",
      href: "/investors",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
    },
    {
      title: "Workflow",
      href: "/workflow",
      icon: <GitBranch className="mr-2 h-4 w-4" />,
    },
    {
      title: "Formulário Embed",
      href: "/embed-form",
      icon: <EmbedIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "Submissões de Formulário",
      href: "/form-submissions",
      icon: <Code className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "justify-start",
            currentPath === item.href && "bg-accent"
          )}
          asChild
        >
          <Link to={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
};

export default SidebarNav;
