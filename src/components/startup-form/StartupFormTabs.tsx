
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BasicInfoSection } from './BasicInfoSection';
import { TeamSection } from './TeamSection';
import { CompanyDetailsSection } from './CompanyDetailsSection';
import { MarketSection } from './MarketSection';
import { BusinessSection } from './BusinessSection';
import { AnalysisSection } from './AnalysisSection';
import { MetricsSection } from './MetricsSection';
import { FinancialSection } from './FinancialSection';
import { StatusDescriptionSection } from './StatusDescriptionSection';
import { PitchDeckSection } from './PitchDeckSection';
import { AttachmentSection } from './AttachmentSection';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';
import { Status } from '@/types';
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

interface StartupFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  form: UseFormReturn<StartupFormValues>;
  statuses: Status[];
}

export const StartupFormTabs: React.FC<StartupFormTabsProps> = ({
  activeTab,
  setActiveTab,
  form,
  statuses
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue={activeTab} className="mt-2">
      <TabsContent value="status" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Activity className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Status</h2>
        </div>
        <StatusDescriptionSection form={form} statuses={statuses} />
      </TabsContent>
      
      <TabsContent value="basic" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <FileText className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Informações Básicas</h2>
        </div>
        <BasicInfoSection form={form} />
      </TabsContent>
      
      <TabsContent value="team" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Users className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Time</h2>
        </div>
        <TeamSection form={form} />
      </TabsContent>
      
      <TabsContent value="company" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Building className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Empresa</h2>
        </div>
        <CompanyDetailsSection form={form} />
      </TabsContent>
      
      <TabsContent value="market" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Globe className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Mercado</h2>
        </div>
        <MarketSection form={form} />
      </TabsContent>
      
      <TabsContent value="business" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Briefcase className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Negócio</h2>
        </div>
        <BusinessSection form={form} />
      </TabsContent>
      
      <TabsContent value="financial" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <DollarSign className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Financeiro</h2>
        </div>
        <FinancialSection form={form} />
      </TabsContent>
      
      <TabsContent value="metrics" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <BarChart2 className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Métricas</h2>
        </div>
        <MetricsSection form={form} />
      </TabsContent>
      
      <TabsContent value="analysis" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Search className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Análise</h2>
        </div>
        <AnalysisSection form={form} />
      </TabsContent>
      
      <TabsContent value="attachments" className="m-0 pt-4">
        <div className="flex items-center mb-4 text-primary">
          <Paperclip className="w-5 h-5 mr-2" />
          <h2 className="text-xl font-semibold">Anexos</h2>
        </div>
        <div className="space-y-8">
          <PitchDeckSection />
          <AttachmentSection />
        </div>
      </TabsContent>
    </Tabs>
  );
};
