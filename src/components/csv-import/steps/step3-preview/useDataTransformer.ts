
import { useState, useEffect } from 'react';
import { CSVData, ColumnMapping } from '../../CSVImportStepper';
import { StartupPreview, ValidationError } from './types';

export const useDataTransformer = (csvData: CSVData, columnMapping: ColumnMapping) => {
  const [startupsPreview, setStartupsPreview] = useState<StartupPreview[]>([]);
  
  useEffect(() => {
    // Transform and validate the CSV data
    const transformedData = transformAndValidateData();
    setStartupsPreview(transformedData);
  }, [csvData, columnMapping]);

  const transformAndValidateData = () => {
    return csvData.records.map(record => {
      const startupData: Record<string, any> = {};
      const errors: ValidationError[] = [];
      
      // Map CSV values to startup fields
      Object.entries(columnMapping).forEach(([csvHeader, startupField]) => {
        if (!startupField) return; // Skip unmapped columns
        
        const headerIndex = csvData.headers.indexOf(csvHeader);
        if (headerIndex !== -1) {
          const value = record[headerIndex]?.trim() || '';
          startupData[startupField] = value;
          
          // Validate the field
          if (startupField === 'name' && !value) {
            errors.push({
              field: 'name',
              message: 'Nome da startup é obrigatório'
            });
          }
          
          // Validate numeric fields
          if (['mrr', 'client_count', 'tam', 'sam', 'som'].includes(startupField) && value) {
            if (isNaN(Number(value))) {
              errors.push({
                field: startupField,
                message: `${startupField} deve ser um número válido`
              });
            }
          }
          
          // Could add more validations for other fields like email, dates, etc.
        }
      });
      
      return {
        data: startupData,
        errors,
        selected: errors.length === 0 // Pre-select only valid records
      };
    });
  };

  const prepareStartupData = (data: Record<string, any>) => {
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
  
  return {
    startupsPreview,
    setStartupsPreview,
    transformAndValidateData,
    prepareStartupData
  };
};
