
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { startupFormSchema, StartupFormValues } from './schema';
import { mapStartupToFormValues, calculateFormProgress } from './form-utils';
import { Status } from '@/types';
import { toast } from 'sonner';

interface UseStartupFormProps {
  startup?: any;
  statuses: Status[];
  onSubmit: (data: any) => void;
}

export const useStartupForm = ({ startup, statuses, onSubmit }: UseStartupFormProps) => {
  // Map the database values to our form structure
  const defaultValues = mapStartupToFormValues(startup, statuses);
  
  const form = useForm<StartupFormValues>({
    resolver: zodResolver(startupFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [progress, setProgress] = useState(0);

  // Reset form when startup changes
  useEffect(() => {
    if (startup) {
      const mappedValues = mapStartupToFormValues(startup, statuses);
      console.log('Resetting form with values:', mappedValues);
      form.reset(mappedValues);
    }
  }, [startup, form, statuses]);

  // Calculate form completion progress
  useEffect(() => {
    const values = form.getValues();
    setProgress(calculateFormProgress(values));
  }, [form.watch()]);

  const handleSubmit = form.handleSubmit((data) => {
    console.log('Form submit data:', data);
    
    // Validação básica
    if (!data.values.Startup) {
      toast.error('Nome da startup é obrigatório');
      return;
    }
    
    onSubmit(data);
  });

  return {
    form,
    activeTab,
    setActiveTab,
    progress,
    handleSubmit
  };
};
