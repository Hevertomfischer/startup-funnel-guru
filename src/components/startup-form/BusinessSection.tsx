
import React from 'react';
import { FormField } from "@/components/ui/form";
import { TextInput } from './FormSection';
import { useFormContext } from 'react-hook-form';

export const BusinessSection: React.FC = () => {
  const { control } = useFormContext();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="sector"
        render={({ field }) => (
          <TextInput
            label="Setor"
            name="sector"
            placeholder="ex: FinTech, HealthTech"
            control={{ field }}
          />
        )}
      />

      <FormField
        control={control}
        name="business_model"
        render={({ field }) => (
          <TextInput
            label="Modelo de Negócio"
            name="business_model"
            placeholder="ex: SaaS, Marketplace"
            control={{ field }}
          />
        )}
      />
    </div>
  );
};
