
import React from 'react';
import { FormField } from "@/components/ui/form";
import { TextInput, TextareaInput } from './FormSection';
import { useFormContext } from 'react-hook-form';

export const BasicInfoSection: React.FC = () => {
  const { control } = useFormContext();
  
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <TextInput
            label="Nome da Startup"
            name="name"
            placeholder="Digite o nome da startup"
            control={{ field }}
          />
        )}
      />

      <FormField
        control={control}
        name="problem_solved"
        render={({ field }) => (
          <TextareaInput
            label="Problema Resolvido"
            name="problem_solved"
            placeholder="Qual problema esta startup resolve?"
            control={{ field }}
          />
        )}
      />
    </>
  );
};
