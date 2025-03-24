
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCreateStartupMutation } from '@/hooks/queries/startups/use-create-mutation';
import CSVImportStepper from '@/components/csv-import/CSVImportStepper';
import { Button } from '@/components/ui/button';

const StartupImport = () => {
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const createStartupMutation = useCreateStartupMutation();

  const handleImportComplete = () => {
    toast.success('Importação concluída com sucesso');
    navigate('/board');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container py-6 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Importar Startups</h1>
        <Button variant="outline" onClick={handleCancel}>Voltar</Button>
      </div>

      {isImporting ? (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Processando importação...</p>
        </div>
      ) : (
        <CSVImportStepper 
          createStartupMutation={createStartupMutation}
          onImportComplete={handleImportComplete}
          setIsImporting={setIsImporting}
        />
      )}
    </div>
  );
};

export default StartupImport;
