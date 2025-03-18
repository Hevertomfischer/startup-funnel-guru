
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

// Sample options for sector field
const SECTOR_OPTIONS = [
  "Agtech", "Edtech", "Fintech", "Foodtech", "Healthtech", 
  "Insurtech", "Legaltech", "Martech", "Proptech", "Retailtech", "Outro"
];

interface SectorSelectProps {
  form: UseFormReturn<StartupFormValues>;
}

export const SectorSelect: React.FC<SectorSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="values.Setor"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Setor</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {SECTOR_OPTIONS.map((option) => (
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
