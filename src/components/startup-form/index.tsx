
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startupFormSchema, StartupFormValues } from './schema';
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
  // Default values for the form
  const defaultValues = {
    priority: startup?.priority || 'medium',
    statusId: startup?.statusId || '',
    dueDate: startup?.dueDate || '',
    assignedTo: startup?.assignedTo || '',
    values: {
      ...startup?.values || {}
    },
  };

  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [progress, setProgress] = useState(0);

  // Calculate form completion progress
  useEffect(() => {
    const values = form.getValues();
    const requiredFields = [
      'values.Startup', 
      'priority', 
      'statusId'
    ];
    
    const optionalFields = [
      'values.Setor',
      'values.Modelo de Negócio',
      'values.Problema que Resolve',
      'values.Site da Startup',
      'values.MRR',
      'values.Quantidade de Clientes',
      'values.Nome do CEO',
      'values.Pontos Positivos',
      'values.Pontos de Atenção'
    ];
    
    // Count filled required fields
    const filledRequired = requiredFields.filter(field => {
      const fieldValue = field.split('.').reduce((obj, key) => obj && obj[key], values as any);
      return fieldValue !== undefined && fieldValue !== '';
    }).length;
    
    // Count filled optional fields
    const filledOptional = optionalFields.filter(field => {
      const fieldValue = field.split('.').reduce((obj, key) => obj && obj[key], values as any);
      return fieldValue !== undefined && fieldValue !== '';
    }).length;
    
    // Calculate progress percentage
    const requiredWeight = 60; // 60% of progress from required fields
    const optionalWeight = 40; // 40% of progress from optional fields
    
    const requiredProgress = (filledRequired / requiredFields.length) * requiredWeight;
    const optionalProgress = (filledOptional / optionalFields.length) * optionalWeight;
    
    setProgress(Math.round(requiredProgress + optionalProgress));
  }, [form.watch()]);

  const handleSubmit = form.handleSubmit((data) => {
    console.log('Form submit data:', data);
    onSubmit(data);
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
          </Tabs>
        </div>
        
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} isEditMode={!!startup} />
      </form>
    </Form>
  );
};

export default StartupForm;
