
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImportResult } from '../CSVImportStepper';
import { CheckCircle, XCircle, Download, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Step4ResultsProps {
  importResult: ImportResult;
  onReset: () => void;
  onComplete: () => void;
}

export const Step4Results: React.FC<Step4ResultsProps> = ({
  importResult,
  onReset,
  onComplete
}) => {
  const exportLog = () => {
    // Create a log text
    let logText = `Relatório de Importação de Startups\n`;
    logText += `Gerado em: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;
    logText += `Total processado: ${importResult.success + importResult.failed}\n`;
    logText += `Sucesso: ${importResult.success}\n`;
    logText += `Falhas: ${importResult.failed}\n\n`;
    
    if (importResult.errors.length > 0) {
      logText += `ERROS ENCONTRADOS:\n`;
      importResult.errors.forEach((error, index) => {
        logText += `${index + 1}. Linha ${error.row}: ${error.error}\n`;
      });
      logText += `\n`;
    }
    
    if (importResult.successfulStartups.length > 0) {
      logText += `STARTUPS IMPORTADAS COM SUCESSO:\n`;
      importResult.successfulStartups.forEach((startup, index) => {
        logText += `${index + 1}. ${startup.name} (ID: ${startup.id})\n`;
      });
    }
    
    // Create a blob and download it
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `importacao-startups-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Resultado da Importação</h3>
        <p className="text-muted-foreground">
          A importação foi concluída.
        </p>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-4 bg-background rounded-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 mb-2">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-medium">{importResult.success}</h4>
            <p className="text-muted-foreground">Startups importadas com sucesso</p>
          </div>
          
          <div className="text-center p-4 bg-background rounded-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-700 mb-2">
              <XCircle className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-medium">{importResult.failed}</h4>
            <p className="text-muted-foreground">Startups com falha na importação</p>
          </div>
        </div>
      </div>
      
      {importResult.errors.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="errors">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                {importResult.errors.length} erros encontrados
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {importResult.errors.map((error, index) => (
                    <div 
                      key={index} 
                      className="p-2 border rounded-md text-sm flex items-start gap-2"
                    >
                      <span className="font-medium">Linha {error.row}:</span>
                      <span>{error.error}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {importResult.success > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="success">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-700" />
                {importResult.success} startups importadas com sucesso
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importResult.successfulStartups.map((startup, index) => (
                      <TableRow key={index}>
                        <TableCell>{startup.name}</TableCell>
                        <TableCell className="font-mono text-xs">{startup.id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <Button 
          variant="outline" 
          onClick={exportLog}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Nova Importação
          </Button>
          
          <Button onClick={onComplete}>
            Concluir
          </Button>
        </div>
      </div>
    </div>
  );
};
