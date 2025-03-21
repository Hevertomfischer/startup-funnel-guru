
import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Activity,
  FileText,
  Users,
  Building,
  Globe,
  Briefcase,
  DollarSign,
  BarChart2,
  Search,
  Paperclip
} from "lucide-react";

interface FormNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progress: number;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  activeTab,
  setActiveTab,
  progress,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Progresso do formulário
        </h3>
        <span className="text-sm text-muted-foreground">
          {progress}%
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="w-full flex flex-nowrap overflow-x-auto h-auto bg-transparent space-x-1 py-1">
          <TabsTrigger 
            value="status" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="w-4 h-4 mr-1" />
            Status
          </TabsTrigger>
          <TabsTrigger 
            value="basic" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="w-4 h-4 mr-1" />
            Básico
          </TabsTrigger>
          <TabsTrigger 
            value="team" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Users className="w-4 h-4 mr-1" />
            Time
          </TabsTrigger>
          <TabsTrigger 
            value="company" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building className="w-4 h-4 mr-1" />
            Empresa
          </TabsTrigger>
          <TabsTrigger 
            value="market" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Globe className="w-4 h-4 mr-1" />
            Mercado
          </TabsTrigger>
          <TabsTrigger 
            value="business" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Briefcase className="w-4 h-4 mr-1" />
            Negócio
          </TabsTrigger>
          <TabsTrigger 
            value="financial" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger 
            value="metrics" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart2 className="w-4 h-4 mr-1" />
            Métricas
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Search className="w-4 h-4 mr-1" />
            Análise
          </TabsTrigger>
          <TabsTrigger 
            value="attachments" 
            className="flex-shrink-0 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Paperclip className="w-4 h-4 mr-1" />
            Anexos
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
