
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from '../schema';

const BUSINESS_MODEL_OPTIONS = [
  "SaaS", "Marketplace", "E-commerce", "Subscription", "Freemium", 
  "Transaction Fee", "Advertising", "Data as a Service", "Outro"
];

interface BusinessModelSelectProps {
  form: UseFormReturn<StartupFormValues>;
}

export const BusinessModelSelect: React.FC<BusinessModelSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="values.Modelo de Negócio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Modelo de Negócio</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o modelo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {BUSINESS_MODEL_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
