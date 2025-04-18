
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
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';

export const BusinessSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Problema e Solução">
      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="values.Problema que Resolve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Problema que Resolve</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o problema que a startup resolve..."
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
          name="values.Como Resolve o Problema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Como Resolve o Problema</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva como a startup resolve o problema..."
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
          name="values.Diferenciais da Startup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diferenciais da Startup</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os diferenciais competitivos da startup..."
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
          name="values.Principais Concorrentes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principais Concorrentes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Liste os principais concorrentes da startup..."
                  className="min-h-24"
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
