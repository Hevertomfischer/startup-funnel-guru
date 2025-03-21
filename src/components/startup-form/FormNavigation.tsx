
import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
        <TabsList className="w-full flex flex-wrap h-auto bg-transparent space-x-1 space-y-1">
          <div className="w-full flex flex-wrap gap-1">
            <TabsTrigger 
              value="status" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Status
            </TabsTrigger>
            <TabsTrigger 
              value="basic" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Básico
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Time
            </TabsTrigger>
          </div>
          
          <div className="w-full flex flex-wrap gap-1">
            <TabsTrigger 
              value="company" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Empresa
            </TabsTrigger>
            <TabsTrigger 
              value="market" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Mercado
            </TabsTrigger>
            <TabsTrigger 
              value="business" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Negócio
            </TabsTrigger>
          </div>
          
          <div className="w-full flex flex-wrap gap-1">
            <TabsTrigger 
              value="financial" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Financeiro
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Métricas
            </TabsTrigger>
            <TabsTrigger 
              value="analysis" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Análise
            </TabsTrigger>
            <TabsTrigger 
              value="attachments" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Anexos
            </TabsTrigger>
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
};
