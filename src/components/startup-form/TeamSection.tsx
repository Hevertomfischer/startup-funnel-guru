
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

export const TeamSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Informações da Equipe">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="values.Nome do CEO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do CEO</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo do CEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.E-mail do CEO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail do CEO</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Whatsapp do CEO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp do CEO</FormLabel>
              <FormControl>
                <Input placeholder="(XX) XXXXX-XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Linkedin CEO"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn do CEO</FormLabel>
              <FormControl>
                <Input placeholder="URL do perfil no LinkedIn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="values.Quantidade de Sócios"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Quantidade de Sócios</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Número de sócios" 
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
