
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { StartupFormValues } from './schema';

// Sample options for select fields
const SECTOR_OPTIONS = [
  "Agtech", "Edtech", "Fintech", "Foodtech", "Healthtech", 
  "Insurtech", "Legaltech", "Martech", "Proptech", "Retailtech", "Outro"
];

const BUSINESS_MODEL_OPTIONS = [
  "SaaS", "Marketplace", "E-commerce", "Subscription", "Freemium", 
  "Transaction Fee", "Advertising", "Data as a Service", "Outro"
];

const MARKET_OPTIONS = [
  "B2B", "B2C", "B2B2C", "B2G", "P2P", "D2C", "Outro"
];

export const MarketSection = ({
  form,
}: {
  form: UseFormReturn<StartupFormValues>;
}) => {
  return (
    <FormSection title="Mercado">
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </FormSection>
  );
};
