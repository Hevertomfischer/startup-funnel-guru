
import React from 'react';
import { FormField } from "@/components/ui/form";
import { TextInput, SelectInput } from './FormSection';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';

interface MetricsSectionProps {
  form: UseFormReturn<StartupFormValues>;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  form
}) => {
  const { control } = form;
  
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
          name="values.Site da Startup"
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
          name="values.MRR"
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
          name="values.Quantidade de Clientes"
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
