
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

const MARKET_OPTIONS = [
  "B2B", "B2C", "B2B2C", "B2G", "P2P", "D2C", "Outro"
];

interface MarketTypeSelectProps {
  form: UseFormReturn<StartupFormValues>;
}

export const MarketTypeSelect: React.FC<MarketTypeSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="values.Mercado"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mercado</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mercado" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {MARKET_OPTIONS.map((option) => (
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
