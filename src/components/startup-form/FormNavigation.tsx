
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, User, Building2, TrendingUp, BarChartBig, FileText, FileSpreadsheet, PercentSquare } from 'lucide-react';

interface FormNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  progress: number;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  activeTab,
  setActiveTab,
  progress
}) => {
  const tabs = [
    { id: 'status', label: 'Status', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'basic', label: 'Básico', icon: <FileText className="h-4 w-4" /> },
    { id: 'team', label: 'Time', icon: <User className="h-4 w-4" /> },
    { id: 'company', label: 'Empresa', icon: <Building2 className="h-4 w-4" /> },
    { id: 'market', label: 'Mercado', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'business', label: 'Negócio', icon: <BarChartBig className="h-4 w-4" /> },
    { id: 'financial', label: 'Financeiro', icon: <FileSpreadsheet className="h-4 w-4" /> },
    { id: 'metrics', label: 'Métricas', icon: <PercentSquare className="h-4 w-4" /> },
    { id: 'analysis', label: 'Análise', icon: <ClipboardList className="h-4 w-4" /> },
  ];
  
  return (
    <div className="space-y-4 sticky top-0 bg-background z-10 py-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Formulário de Startup</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{progress}% completo</span>
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full h-auto flex-wrap mb-2 bg-muted/50">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-1 py-1.5 px-2 text-xs"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
