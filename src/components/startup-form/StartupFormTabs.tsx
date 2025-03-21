
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
    <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue={activeTab}>
      <TabsContent value="status" className="m-0">
        <StatusDescriptionSection form={form} statuses={statuses} />
      </TabsContent>
      
      <TabsContent value="basic" className="m-0">
        <BasicInfoSection form={form} />
      </TabsContent>
      
      <TabsContent value="team" className="m-0">
        <TeamSection form={form} />
      </TabsContent>
      
      <TabsContent value="company" className="m-0">
        <CompanyDetailsSection form={form} />
      </TabsContent>
      
      <TabsContent value="market" className="m-0">
        <MarketSection form={form} />
      </TabsContent>
      
      <TabsContent value="business" className="m-0">
        <BusinessSection form={form} />
      </TabsContent>
      
      <TabsContent value="financial" className="m-0">
        <FinancialSection form={form} />
      </TabsContent>
      
      <TabsContent value="metrics" className="m-0">
        <MetricsSection form={form} />
      </TabsContent>
      
      <TabsContent value="analysis" className="m-0">
        <AnalysisSection form={form} />
      </TabsContent>
      
      <TabsContent value="attachments" className="m-0">
        <div className="space-y-8">
          <PitchDeckSection />
          <AttachmentSection />
        </div>
      </TabsContent>
    </Tabs>
  );
};
