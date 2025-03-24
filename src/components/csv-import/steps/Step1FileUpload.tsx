
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CSVData } from '../CSVImportStepper';
import { SeparatorSelector, FileDropzone, useCSVParser } from './file-upload';

interface Step1FileUploadProps {
  onFileUploaded: (data: CSVData) => void;
  onNext: () => void;
}

export const Step1FileUpload: React.FC<Step1FileUploadProps> = ({ onFileUploaded, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [separator, setSeparator] = useState<string>(';'); // Default separator is semicolon
  
  const { 
    error, 
    warning, 
    isProcessing, 
    resetMessages, 
    processFile 
  } = useCSVParser(file, separator);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    resetMessages();
    
    if (!selectedFile.name.endsWith('.csv')) {
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleSeparatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeparator(e.target.value);
  };

  const handleUpload = () => {
    processFile((parsedData) => {
      onFileUploaded(parsedData);
      // Ensure we're using React's state batching by using a timeout
      setTimeout(() => {
        console.log('Advancing to next step...');
        onNext();
      }, 0);
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Upload do arquivo CSV</h3>
        <p className="text-muted-foreground">
          Selecione um arquivo CSV contendo os dados das startups para importação.
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {warning && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Aviso</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <SeparatorSelector 
          separator={separator} 
          onSeparatorChange={handleSeparatorChange}
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />
        
        <FileDropzone 
          file={file} 
          onClick={() => fileInputRef.current?.click()}
        />
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isProcessing}
        >
          {isProcessing ? 'Processando...' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
};
