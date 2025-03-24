
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CSVData, ColumnMapping } from '../CSVImportStepper';
import { 
  HeaderSection, 
  MappingTable, 
  ValidationError, 
  validateMapping,
  startupFields
} from './column-mapping';

interface Step2ColumnMappingProps {
  csvData: CSVData;
  columnMapping: ColumnMapping;
  setColumnMapping: React.Dispatch<React.SetStateAction<ColumnMapping>>;
  onNext: () => void;
  onPrevious: () => void;
}

export const Step2ColumnMapping: React.FC<Step2ColumnMappingProps> = ({
  csvData,
  columnMapping,
  setColumnMapping,
  onNext,
  onPrevious
}) => {
  const [error, setError] = useState<string | null>(null);
  const [autoMappedCount, setAutoMappedCount] = useState(0);

  console.log('Step2ColumnMapping rendered with csvData:', csvData);

  // Auto-map columns on first render
  useEffect(() => {
    // Skip if mapping already exists
    if (Object.keys(columnMapping).length > 0) {
      console.log('Using existing column mapping:', columnMapping);
      return;
    }

    console.log('Auto-mapping columns from headers:', csvData.headers);
    const initialMapping: ColumnMapping = {};
    let mappedCount = 0;

    csvData.headers.forEach(header => {
      // Try to find matching startup field by comparing lowercase, trimmed versions
      const normalizedHeader = header.toLowerCase().trim();
      
      // Try to map CSV headers to startup fields
      const matchedField = startupFields.find(field => {
        const fieldName = field.label.toLowerCase().trim();
        const fieldValue = field.value.toLowerCase().trim();
        
        return normalizedHeader === fieldName || 
               normalizedHeader === fieldValue ||
               normalizedHeader.includes(fieldName) ||
               fieldName.includes(normalizedHeader);
      });
      
      if (matchedField) {
        initialMapping[header] = matchedField.value;
        mappedCount++;
        console.log(`Mapped "${header}" to "${matchedField.label}"`);
      } else {
        initialMapping[header] = null;
        console.log(`Could not map "${header}" automatically`);
      }
    });
    
    setColumnMapping(initialMapping);
    setAutoMappedCount(mappedCount);
    console.log(`Auto-mapped ${mappedCount} of ${csvData.headers.length} columns`);
  }, [csvData.headers, setColumnMapping]);

  const handleMappingChange = (csvHeader: string, startupField: string | null) => {
    console.log(`Changing mapping for "${csvHeader}" to "${startupField}"`);
    setColumnMapping(prev => ({
      ...prev,
      [csvHeader]: startupField
    }));
  };

  const handleNext = () => {
    console.log('Attempting to proceed to next step...');
    const validation = validateMapping(columnMapping, startupFields);
    
    if (validation.isValid) {
      console.log('Validation successful, moving to next step');
      setError(null);
      onNext();
    } else {
      console.log('Validation failed, staying on current step');
      setError(validation.error);
    }
  };

  return (
    <div className="space-y-6">
      <HeaderSection 
        autoMappedCount={autoMappedCount} 
        totalHeaders={csvData.headers.length} 
      />
      
      <ValidationError error={error} />

      <MappingTable 
        csvData={csvData}
        columnMapping={columnMapping}
        onMappingChange={handleMappingChange}
        startupFields={startupFields}
      />
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrevious}>Voltar</Button>
        <Button onClick={handleNext}>Continuar</Button>
      </div>
    </div>
  );
};
