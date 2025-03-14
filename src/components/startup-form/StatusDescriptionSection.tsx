
import React from 'react';
import { FormField } from "@/components/ui/form";
import { TextareaInput, StatusSelect } from './FormSection';
import { useFormContext } from 'react-hook-form';
import { Status } from '@/types';

interface StatusDescriptionSectionProps {
  statuses: Status[];
}

export const StatusDescriptionSection: React.FC<StatusDescriptionSectionProps> = ({ statuses }) => {
  const { control } = useFormContext();
  
  return (
    <>
      <FormField
        control={control}
        name="status_id"
        render={({ field }) => (
          <StatusSelect
            label="Status"
            control={{ field }}
            statuses={statuses}
          />
        )}
      />

      <FormField
        control={control}
        name="description"
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
