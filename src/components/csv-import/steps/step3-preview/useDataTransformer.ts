
import { useState, useEffect } from 'react';
import { CSVData, ColumnMapping } from '../../CSVImportStepper';
import { StartupPreview, ValidationError, FieldValidator } from './types';

// Field validators for different startup data fields
const validators: FieldValidator[] = [
  {
    field: 'name',
    validate: (value) => {
      if (!value) {
        return {
          field: 'name',
          message: 'Nome da startup é obrigatório'
        };
      }
      return null;
    }
  },
  {
    field: 'mrr',
    validate: (value) => {
      if (value && isNaN(Number(value))) {
        return {
          field: 'mrr',
          message: 'MRR deve ser um número válido'
        };
      }
      return null;
    }
  },
  {
    field: 'client_count',
    validate: (value) => {
      if (value && isNaN(Number(value))) {
        return {
          field: 'client_count',
          message: 'Quantidade de clientes deve ser um número válido'
        };
      }
      return null;
    }
  },
  {
    field: 'tam',
    validate: (value) => {
      if (value && isNaN(Number(value))) {
        return {
          field: 'tam',
          message: 'TAM deve ser um número válido'
        };
      }
      return null;
    }
  },
  {
    field: 'sam',
    validate: (value) => {
      if (value && isNaN(Number(value))) {
        return {
          field: 'sam',
          message: 'SAM deve ser um número válido'
        };
      }
      return null;
    }
  },
  {
    field: 'som',
    validate: (value) => {
      if (value && isNaN(Number(value))) {
        return {
          field: 'som',
          message: 'SOM deve ser um número válido'
        };
      }
      return null;
    }
  }
];

// Maps CSV data to startup fields and validates the data
const mapAndValidate = (record: string[], headers: string[], columnMapping: ColumnMapping): { 
  data: Record<string, any>; 
  errors: ValidationError[];
} => {
  const startupData: Record<string, any> = {};
  const errors: ValidationError[] = [];
  
  // Map CSV values to startup fields
  Object.entries(columnMapping).forEach(([csvHeader, startupField]) => {
    if (!startupField) return; // Skip unmapped columns
    
    const headerIndex = headers.indexOf(csvHeader);
    if (headerIndex !== -1) {
      const value = record[headerIndex]?.trim() || '';
      startupData[startupField] = value;
      
      // Validate the field
      validators.forEach(validator => {
        if (validator.field === startupField) {
          const validationError = validator.validate(value);
          if (validationError) {
            errors.push(validationError);
          }
        }
      });
    }
  });
  
  return { data: startupData, errors };
};

// Converts string values to appropriate types for API submission
export const prepareStartupDataForAPI = (data: Record<string, any>) => {
  // Create a proper startup object for API
  const startupData: any = {
    name: data.name || '', // Required field
    status_id: data.status_id || null,
    problem_solved: data.problem_solved || null,
    sector: data.sector || null,
    business_model: data.business_model || null,
    website: data.website || null,
    // Convert numeric fields
    mrr: data.mrr ? Number(data.mrr) : null,
    client_count: data.client_count ? Number(data.client_count) : null,
    tam: data.tam ? Number(data.tam) : null,
    sam: data.sam ? Number(data.sam) : null,
    som: data.som ? Number(data.som) : null,
    // Add other fields
    ceo_name: data.ceo_name || null,
    ceo_email: data.ceo_email || null,
    ceo_whatsapp: data.ceo_whatsapp || null,
    ceo_linkedin: data.ceo_linkedin || null,
    founding_date: data.founding_date || null,
    city: data.city || null,
    state: data.state || null,
    market: data.market || null,
    competitors: data.competitors || null,
    description: data.description || null,
    // Default values
    priority: 'medium'
  };
  
  return startupData;
};

export const useDataTransformer = (csvData: CSVData, columnMapping: ColumnMapping) => {
  const [startupsPreview, setStartupsPreview] = useState<StartupPreview[]>([]);
  
  useEffect(() => {
    // Transform and validate the CSV data
    const transformedData = transformAndValidateData();
    setStartupsPreview(transformedData);
  }, [csvData, columnMapping]);

  const transformAndValidateData = () => {
    if (!csvData.records || !csvData.headers) {
      console.error('CSV data is missing headers or records');
      return [];
    }
    
    try {
      return csvData.records.map(record => {
        const { data, errors } = mapAndValidate(record, csvData.headers, columnMapping);
        
        return {
          data,
          errors,
          selected: errors.length === 0 // Pre-select only valid records
        };
      });
    } catch (error) {
      console.error('Error transforming CSV data:', error);
      return [];
    }
  };
  
  return {
    startupsPreview,
    setStartupsPreview,
    transformAndValidateData,
    prepareStartupData: prepareStartupDataForAPI
  };
};
