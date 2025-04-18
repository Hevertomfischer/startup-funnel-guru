
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
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';

export const BasicInfoSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Informações Básicas">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="values.Startup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Startup*</FormLabel>
              <FormControl>
                <Input placeholder="Nome da Startup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Site da Startup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site da Startup</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com.br" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Status Current"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Atual</FormLabel>
              <FormControl>
                <Input placeholder="Status atual da startup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Origem Lead"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origem do Lead</FormLabel>
              <FormControl>
                <Input placeholder="Como conhecemos esta startup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Quem Indicou"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quem Indicou</FormLabel>
              <FormControl>
                <Input placeholder="Nome de quem indicou" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Observações"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Input placeholder="Observações gerais" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormSection>
  );
};
