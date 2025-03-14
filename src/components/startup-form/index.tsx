
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import { Status } from '@/types';
import { startupSchema, StartupFormValues } from './schema';
import { BasicInfoSection } from './BasicInfoSection';
import { BusinessSection } from './BusinessSection';
import { MetricsSection } from './MetricsSection';
import { StatusDescriptionSection } from './StatusDescriptionSection';
import { AttachmentSection } from './AttachmentSection';
import { FormActions } from './FormActions';

interface StartupFormProps {
  startup?: any;
  statuses: Status[];
  onSubmit: (values: StartupFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const StartupForm: React.FC<StartupFormProps> = ({
  startup,
  statuses,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: startup?.name || '',
      problem_solved: startup?.problem_solved || '',
      description: startup?.description || '',
      sector: startup?.sector || '',
      business_model: startup?.business_model || '',
      website: startup?.website || '',
      mrr: startup?.mrr || undefined,
      client_count: startup?.client_count || undefined,
      priority: startup?.priority || 'medium',
      status_id: startup?.status_id || statuses[0]?.id || '',
      attachments: startup?.attachments || [],
    },
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection />
          <BusinessSection />
          <MetricsSection />
          <StatusDescriptionSection statuses={statuses} />
          <AttachmentSection />
          <FormActions 
            onCancel={onCancel} 
            isSubmitting={isSubmitting} 
            isEditMode={!!startup} 
          />
        </form>
      </Form>
    </FormProvider>
  );
};

export default StartupForm;
