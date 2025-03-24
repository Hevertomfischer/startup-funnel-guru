
import React, { useState, useEffect } from 'react';
import { Step1FileUpload } from './steps/Step1FileUpload';
import { Step2ColumnMapping } from './steps/Step2ColumnMapping';
import { Step3Preview } from './steps/Step3Preview';
import { Step4Results } from './steps/Step4Results';
import { UseMutationResult } from '@tanstack/react-query';
import { Startup } from '@/integrations/supabase/client';

export interface CSVData {
  headers: string[];
  records: string[][];
  fileName: string;
  fileSize: number;
}

export interface ColumnMapping {
  [csvHeader: string]: string | null;
}

export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string }>;
  successfulStartups: Startup[];
}

interface CSVImportStepperProps {
  createStartupMutation: UseMutationResult<Startup | null, Error, any, unknown>;
  onImportComplete: () => void;
  setIsImporting: (importing: boolean) => void;
}

const CSVImportStepper: React.FC<CSVImportStepperProps> = ({
  createStartupMutation,
  onImportComplete,
  setIsImporting
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  
  // Log component state for debugging
  useEffect(() => {
    console.log('CSVImportStepper - Current step:', currentStep);
    console.log('CSVImportStepper - CSV data present:', !!csvData);
    console.log('CSVImportStepper - Column mapping entries:', Object.keys(columnMapping).length);
  }, [currentStep, csvData, columnMapping]);
  
  const goToNextStep = () => {
    console.log(`Moving from step ${currentStep} to step ${currentStep + 1}`);
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPreviousStep = () => {
    console.log(`Moving from step ${currentStep} to step ${currentStep - 1}`);
    setCurrentStep(prev => prev - 1);
  };
  
  const resetImport = () => {
    console.log('Resetting import process');
    setCsvData(null);
    setColumnMapping({});
    setImportResult(null);
    setCurrentStep(1);
  };

  const handleFileUploaded = (data: CSVData) => {
    console.log('File uploaded with', data.headers.length, 'columns and', data.records.length, 'records');
    setCsvData(data);
  };

  // Ensure we have the required data for each step
  useEffect(() => {
    if (currentStep === 2 && !csvData) {
      console.warn('Attempted to access step 2 without CSV data, reverting to step 1');
      setCurrentStep(1);
    }
    
    if (currentStep === 3 && (!csvData || Object.keys(columnMapping).length === 0)) {
      console.warn('Attempted to access step 3 without required data, reverting to appropriate step');
      setCurrentStep(!csvData ? 1 : 2);
    }
    
    if (currentStep === 4 && !importResult) {
      console.warn('Attempted to access step 4 without import result, reverting to step 3');
      setCurrentStep(3);
    }
  }, [currentStep, csvData, columnMapping, importResult]);

  const renderStep = () => {
    console.log('Rendering step', currentStep);
    
    switch (currentStep) {
      case 1:
        return (
          <Step1FileUpload
            onFileUploaded={handleFileUploaded}
            onNext={goToNextStep}
          />
        );
      case 2:
        // Safety check to ensure we have CSV data
        if (!csvData) {
          console.error('No CSV data available for step 2');
          return null;
        }
        return (
          <Step2ColumnMapping
            csvData={csvData}
            columnMapping={columnMapping}
            setColumnMapping={setColumnMapping}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        // Safety check to ensure we have all required data
        if (!csvData || Object.keys(columnMapping).length === 0) {
          console.error('Missing required data for step 3');
          return null;
        }
        return (
          <Step3Preview
            csvData={csvData}
            columnMapping={columnMapping}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            onImport={(result) => {
              console.log('Import completed with results:', result);
              setImportResult(result);
              setIsImporting(false);
              goToNextStep();
            }}
            setIsImporting={setIsImporting}
            createStartupMutation={createStartupMutation}
          />
        );
      case 4:
        // Safety check to ensure we have import results
        if (!importResult) {
          console.error('No import results available for step 4');
          return null;
        }
        return (
          <Step4Results
            importResult={importResult}
            onReset={resetImport}
            onComplete={onImportComplete}
          />
        );
      default:
        console.error('Invalid step number:', currentStep);
        return null;
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`flex-1 text-center ${currentStep === step ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
            >
              <div className="relative">
                <div 
                  className={`h-2 absolute top-2 left-0 right-0 -mx-1 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                  style={{ display: step === 4 ? 'none' : 'block' }}
                />
                <div 
                  className={`h-4 w-4 mx-auto rounded-full relative z-10 ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              </div>
              <div className="mt-2 text-xs">{
                step === 1 ? 'Upload' : 
                step === 2 ? 'Mapeamento' : 
                step === 3 ? 'Pré-visualização' : 
                'Resultados'
              }</div>
            </div>
          ))}
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default CSVImportStepper;
