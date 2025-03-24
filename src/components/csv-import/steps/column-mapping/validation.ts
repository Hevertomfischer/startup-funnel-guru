
import { ColumnMapping } from '../../CSVImportStepper';
import { StartupField } from './types';

export const validateMapping = (
  columnMapping: ColumnMapping,
  startupFields: StartupField[]
): { isValid: boolean; error: string | null } => {
  // Check if required fields are mapped
  const requiredFields = startupFields.filter(field => field.required);
  const mappedFields = Object.values(columnMapping).filter(Boolean) as string[];
  
  const missingRequiredFields = requiredFields.filter(
    field => !mappedFields.includes(field.value)
  );
  
  if (missingRequiredFields.length > 0) {
    const missingFieldNames = missingRequiredFields.map(f => f.label).join(', ');
    return {
      isValid: false,
      error: `Campos obrigatórios não mapeados: ${missingFieldNames}`
    };
  }
  
  // Check for duplicate mappings
  const fieldCounts: Record<string, number> = {};
  Object.values(columnMapping).forEach(field => {
    if (field) {
      fieldCounts[field] = (fieldCounts[field] || 0) + 1;
    }
  });
  
  const duplicateFields = Object.entries(fieldCounts)
    .filter(([_, count]) => count > 1)
    .map(([field]) => startupFields.find(f => f.value === field)?.label || field);
  
  if (duplicateFields.length > 0) {
    return {
      isValid: false,
      error: `Mapeamento duplicado para os campos: ${duplicateFields.join(', ')}`
    };
  }
  
  return { isValid: true, error: null };
};
