
import { useState } from 'react';
import { CSVData } from '../../CSVImportStepper';

export const useCSVParser = (initialFile: File | null = null, initialSeparator: string = ';') => {
  const [file, setFile] = useState<File | null>(initialFile);
  const [separator, setSeparator] = useState<string>(initialSeparator);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateFile = (selectedFile: File | null): boolean => {
    resetMessages();

    if (!selectedFile) {
      setError('Selecione um arquivo CSV para continuar.');
      return false;
    }
    
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Por favor, selecione um arquivo com a extensão .csv');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      return true;
    }
    
    setFile(null);
    return false;
  };

  const handleSeparatorChange = (newSeparator: string) => {
    setSeparator(newSeparator);
  };

  const parseCSV = (text: string): CSVData | null => {
    try {
      // Split by newlines and filter out empty lines
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        setError('O arquivo CSV deve conter pelo menos uma linha de cabeçalho e uma linha de dados.');
        return null;
      }
      
      // Use the selected separator
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

  const resetMessages = () => {
    setError(null);
    setWarning(null);
  };

  const processFile = (onSuccess: (data: CSVData) => void): void => {
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
        onSuccess(parsedData);
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

  return {
    file,
    separator,
    error,
    warning,
    isProcessing,
    handleFileChange,
    handleSeparatorChange,
    parseCSV,
    resetMessages,
    processFile,
    validateFile
  };
};
