
import React from 'react';
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
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log('Form submit data:', data);
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <StatusDescriptionSection form={form} statuses={statuses} />
        <BasicInfoSection form={form} />
        <TeamSection form={form} />
        <CompanyDetailsSection form={form} />
        <MarketSection form={form} />
        <BusinessSection form={form} />
        <FinancialSection form={form} />
        <MetricsSection form={form} />
        <AnalysisSection form={form} />
        <FormActions onCancel={onCancel} isSubmitting={isSubmitting} isEditMode={!!startup} />
      </form>
    </Form>
  );
};

export default StartupForm;
