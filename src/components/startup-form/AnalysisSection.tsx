
import React from 'react';
import { FormSection } from './FormSection';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';

export const AnalysisSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Análise de Investimento">
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="values.Pontos Positivos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos Positivos</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os pontos positivos da startup..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Pontos de Atenção"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos de Atenção</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os pontos que merecem atenção..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="values.Como a SCAngels pode agregar valor na Startup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Como a SCAngels pode agregar valor</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva como a SCAngels pode agregar valor..."
                  className="min-h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="values.Motivo Não Investimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo para Não Investimento</FormLabel>
              <FormControl>
                <Input
                  placeholder="Caso aplicável, motivo para não investir"
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
