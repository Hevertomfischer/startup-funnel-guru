
import React from 'react';
import { FormSection } from './FormSection';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';

export const FinancialSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Métricas Financeiras">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="values.Quantidade de Clientes"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Quantidade de Clientes</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Número de clientes" 
                  value={value === undefined ? '' : value} 
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? '' : Number(val));
                  }}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Receita Recorrente Mensal (MRR)"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Receita Recorrente Mensal (MRR)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="R$ 0,00" 
                  value={value === undefined ? '' : value} 
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? '' : Number(val));
                  }}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Receita Acumulada no Ano corrente"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Receita Acumulada no Ano Corrente</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="R$ 0,00" 
                  value={value === undefined ? '' : value} 
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? '' : Number(val));
                  }}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Receita Total do último Ano"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Receita Total do Último Ano</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="R$ 0,00" 
                  value={value === undefined ? '' : value} 
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? '' : Number(val));
                  }}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Receita total do penúltimo Ano"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Receita Total do Penúltimo Ano</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="R$ 0,00" 
                  value={value === undefined ? '' : value} 
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? '' : Number(val));
                  }}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
};
