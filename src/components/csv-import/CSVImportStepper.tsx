
import React, { useState } from 'react';
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
  
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const resetImport = () => {
    setCsvData(null);
    setColumnMapping({});
    setImportResult(null);
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1FileUpload
            onFileUploaded={setCsvData}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <Step2ColumnMapping
            csvData={csvData!}
            columnMapping={columnMapping}
            setColumnMapping={setColumnMapping}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <Step3Preview
            csvData={csvData!}
            columnMapping={columnMapping}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            onImport={(result) => {
              setImportResult(result);
              setIsImporting(false);
              goToNextStep();
            }}
            setIsImporting={setIsImporting}
            createStartupMutation={createStartupMutation}
          />
        );
      case 4:
        return (
          <Step4Results
            importResult={importResult!}
            onReset={resetImport}
            onComplete={onImportComplete}
          />
        );
      default:
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
