
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File, AlertCircle, AlertTriangle } from 'lucide-react';
import { CSVData } from '../CSVImportStepper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Step1FileUploadProps {
  onFileUploaded: (data: CSVData) => void;
  onNext: () => void;
}

export const Step1FileUpload: React.FC<Step1FileUploadProps> = ({ onFileUploaded, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [separator, setSeparator] = useState<string>(';'); // Default separator is now semicolon

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setError(null);
    setWarning(null);
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo CSV válido.');
      return;
    }
    
    setFile(selectedFile);
  };

  const parseCSV = (text: string): CSVData | null => {
    try {
      // Split by newlines and filter out empty lines
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        setError('O arquivo CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.');
        return null;
      }
      
      // Use the selected separator (now semicolon by default)
      const headers = lines[0].split(separator).map(header => header.trim());
      const headerCount = headers.length;
      
      let inconsistentRowsCount = 0;
      const records = lines.slice(1).map(line => {
        // Use the same separator for data rows
        const row = line.split(separator).map(cell => cell.trim());
        
        if (row.length !== headerCount) {
          inconsistentRowsCount++;
          
          if (row.length < headerCount) {
            return [...row, ...Array(headerCount - row.length).fill('')];
          } 
          else {
            return row.slice(0, headerCount);
          }
        }
        
        return row;
      });
      
      if (inconsistentRowsCount > 0) {
        setWarning(`${inconsistentRowsCount} linha(s) tinham um número inconsistente de colunas e foram ajustadas automaticamente.`);
      }
      
      return {
        headers,
        records,
        fileName: file!.name,
        fileSize: file!.size
      };
    } catch (err) {
      console.error('Error parsing CSV:', err);
      setError('Ocorreu um erro ao processar o arquivo CSV. Verifique o formato do arquivo.');
      return null;
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Selecione um arquivo CSV para continuar.');
      return;
    }
    
    setIsProcessing(true);
    console.log('Starting CSV processing...');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSV(text);
      
      if (parsedData) {
        console.log('CSV parsed successfully:', parsedData.headers.length, 'columns,', parsedData.records.length, 'records');
        onFileUploaded(parsedData);
        
        // Ensure we're using React's state batching by using a timeout
        setTimeout(() => {
          console.log('Advancing to next step...');
          onNext();
        }, 0);
      } else {
        console.error('Failed to parse CSV data');
      }
      
      setIsProcessing(false);
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      setError('Erro ao ler o arquivo. Tente novamente com outro arquivo.');
      setIsProcessing(false);
    };
    
    console.log('Reading CSV file...');
    reader.readAsText(file);
  };

  const handleSeparatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSeparator(e.target.value);
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
        <div className="flex items-center space-x-2">
          <label htmlFor="separator" className="text-sm font-medium">
            Separador CSV:
          </label>
          <select
            id="separator"
            value={separator}
            onChange={handleSeparatorChange}
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            <option value=";">Ponto e vírgula (;)</option>
            <option value=",">Vírgula (,)</option>
            <option value="\t">Tab</option>
          </select>
        </div>
        
        <div 
          className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
          />
          
          {file ? (
            <div className="space-y-2">
              <File className="mx-auto h-12 w-12 text-primary" />
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="font-medium">Clique para selecionar um arquivo</p>
              <p className="text-sm text-muted-foreground">
                ou arraste e solte um arquivo CSV aqui
              </p>
            </div>
          )}
        </div>
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
