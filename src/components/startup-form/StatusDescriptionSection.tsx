
import React from 'react';
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
