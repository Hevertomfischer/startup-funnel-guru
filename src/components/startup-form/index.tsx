
import React, { useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { BasicInfoSection } from './BasicInfoSection';
import { TeamSection } from './TeamSection';
import { CompanyDetailsSection } from './CompanyDetailsSection';
import { MarketSection } from './MarketSection';
import { BusinessSection } from './BusinessSection';
import { AnalysisSection } from './AnalysisSection';
import { MetricsSection } from './MetricsSection';
import { FinancialSection } from './FinancialSection';
import { StatusDescriptionSection } from './StatusDescriptionSection';
import { FormActions } from './FormActions';
import { FormNavigation } from './FormNavigation';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Status } from '@/types';
import { useStartupForm } from './use-startup-form';
import { StartupFormTabs } from './StartupFormTabs';

interface StartupFormProps {
  startup?: any;
  statuses: Status[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const StartupForm: React.FC<StartupFormProps> = ({
  startup,
  statuses,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  console.log('StartupForm rendered with startup:', startup?.id);
  
  const { 
    form, 
    activeTab, 
    setActiveTab, 
    progress, 
    handleSubmit 
  } = useStartupForm({ 
    startup, 
    statuses, 
    onSubmit 
  });

  useEffect(() => {
    console.log('Current active tab:', activeTab);
  }, [activeTab]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <FormNavigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          progress={progress} 
        />
        
        <div className="mt-4">
          <StartupFormTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            form={form} 
            statuses={statuses}
          />
        </div>
        
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} isEditMode={!!startup} />
      </form>
    </Form>
  );
};

export default StartupForm;
