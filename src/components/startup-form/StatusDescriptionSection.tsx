
import React, { useEffect } from 'react';
import { FormField } from "@/components/ui/form";
import { TextareaInput, StatusSelect } from './FormSection';
import { UseFormReturn } from 'react-hook-form';
import { Status } from '@/types';
import { StartupFormValues } from './schema';

interface StatusDescriptionSectionProps {
  form: UseFormReturn<StartupFormValues>;
  statuses: Status[];
}

export const StatusDescriptionSection: React.FC<StatusDescriptionSectionProps> = ({ 
  form, 
  statuses 
}) => {
  // Ensure a valid status is always selected
  useEffect(() => {
    if (statuses && statuses.length > 0) {
      const currentStatusId = form.getValues('statusId');
      
      // Check if the current statusId is valid
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const isValidUuid = currentStatusId && uuidPattern.test(currentStatusId);
      const statusExists = isValidUuid && statuses.some(s => s.id === currentStatusId);
      
      // If the current status is not valid or doesn't exist, set to the first available status
      if (!statusExists && statuses[0]?.id) {
        form.setValue('statusId', statuses[0].id);
      }
    }
  }, [statuses, form]);

  return (
    <>
      <FormField
        control={form.control}
        name="statusId"
        render={({ field }) => (
          <StatusSelect
            label="Status"
            control={{ field }}
            statuses={statuses}
          />
        )}
      />

      <FormField
        control={form.control}
        name="values.Observações"
        render={({ field }) => (
          <TextareaInput
            label="Descrição Adicional"
            name="description"
            placeholder="Detalhes adicionais sobre a startup"
            control={{ field }}
          />
        )}
      />
    </>
  );
};
