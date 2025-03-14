
import React from 'react';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Status } from '@/types';

interface TextInputProps {
  label: string;
  name: string;
  placeholder: string;
  control: any;
  type?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  placeholder,
  control,
  type = "text"
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input 
          type={type} 
          placeholder={placeholder} 
          {...control.field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

interface TextareaInputProps {
  label: string;
  name: string;
  placeholder: string;
  control: any;
}

export const TextareaInput: React.FC<TextareaInputProps> = ({
  label,
  name,
  placeholder,
  control
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Textarea 
          placeholder={placeholder} 
          {...control.field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

interface SelectInputProps {
  label: string;
  name: string;
  placeholder: string;
  control: any;
  options: { value: string; label: string }[];
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  placeholder,
  control,
  options
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select 
        onValueChange={control.field.onChange} 
        defaultValue={control.field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

interface StatusSelectProps {
  label: string;
  control: any;
  statuses: Status[];
}

export const StatusSelect: React.FC<StatusSelectProps> = ({
  label,
  control,
  statuses
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select 
        onValueChange={control.field.onChange} 
        defaultValue={control.field.value}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              {status.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};
