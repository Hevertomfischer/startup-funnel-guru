
import React from 'react';
import { FormField } from "@/components/ui/form";
import { TextInput, SelectInput } from './FormSection';
import { useFormContext } from 'react-hook-form';

export const MetricsSection: React.FC = () => {
  const { control } = useFormContext();
  
  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="website"
          render={({ field }) => (
            <TextInput
              label="Website"
              name="website"
              placeholder="https://exemplo.com"
              control={{ field }}
            />
          )}
        />

        <FormField
          control={control}
          name="mrr"
          render={({ field }) => (
            <TextInput
              label="Receita Mensal Recorrente (MRR)"
              name="mrr"
              placeholder="0"
              type="number"
              control={{ field }}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="client_count"
          render={({ field }) => (
            <TextInput
              label="Quantidade de Clientes"
              name="client_count"
              placeholder="0"
              type="number"
              control={{ field }}
            />
          )}
        />

        <FormField
          control={control}
          name="priority"
          render={({ field }) => (
            <SelectInput
              label="Prioridade"
              name="priority"
              placeholder="Selecione a prioridade"
              control={{ field }}
              options={priorityOptions}
            />
          )}
        />
      </div>
    </>
  );
};
