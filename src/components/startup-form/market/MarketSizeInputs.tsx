
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from '../schema';

interface MarketSizeInputsProps {
  form: UseFormReturn<StartupFormValues>;
}

export const MarketSizeInputs: React.FC<MarketSizeInputsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="values.TAM"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>TAM (Mercado Total Endereçável)</FormLabel>
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
        name="values.SAM"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>SAM (Mercado Disponível Acessável)</FormLabel>
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
        name="values.SOM"
        render={({ field: { value, onChange, ...field } }) => (
          <FormItem>
            <FormLabel>SOM (Mercado Disponível Obtível)</FormLabel>
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
    </>
  );
};
