
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Download, Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormSubmission {
  id: string;
  name: string;
  ceo_email: string;
  created_at: string;
  processed: boolean;
  status_id: string | null;
  pitch_deck_url?: string;
}

const FormSubmissions = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setSubmissions(data || []);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      setError(error.message || 'Erro ao carregar os dados');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as submissões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportCSV = () => {
    try {
      if (submissions.length === 0) {
        toast({
          title: "Aviso",
          description: "Não há dados para exportar",
          variant: "default",
        });
        return;
      }
      
      // Convert submissions to CSV format
      const headers = ['Nome da Startup', 'E-mail do CEO', 'Data de Submissão', 'Processado'];
      const csvRows = [headers.join(',')];
      
      submissions.forEach(submission => {
        const row = [
          `"${submission.name.replace(/"/g, '""')}"`, 
          `"${submission.ceo_email.replace(/"/g, '""')}"`,
          `"${formatDate(submission.created_at)}"`,
          `"${submission.processed ? 'Sim' : 'Não'}"`,
        ];
        csvRows.push(row.join(','));
      });
      
      const csvContent = csvRows.join('\n');
      
      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.setAttribute('href', url);
      link.setAttribute('download', `submissoes-formulario-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Sucesso",
        description: "Arquivo CSV exportado com sucesso",
      });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (submission: FormSubmission) => {
    // For now, just show basic details in toast
    toast({
      title: submission.name,
      description: `Processado: ${submission.processed ? 'Sim' : 'Não'}`,
    });
    
    // In the future this could open a modal with full details
  };

  const handleProcessSubmission = async (submissionId: string) => {
    try {
      toast({
        title: "Processando...",
        description: "Processando submissão...",
      });
      
      const { data, error } = await supabase
        .rpc('process_form_submission', { submission_id: submissionId });
      
      if (error) throw error;
      
      // Refresh the submissions list
      fetchSubmissions();
      
      toast({
        title: "Sucesso",
        description: "Submissão processada com sucesso.",
      });
    } catch (error: any) {
      console.error('Error processing submission:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao processar submissão",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Submissões de Formulário</h1>
      
      <div className="grid gap-6">
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportCSV}
            disabled={submissions.length === 0 || loading}
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Formulários Recebidos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando submissões...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao carregar dados</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : submissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Startup</TableHead>
                    <TableHead>E-mail do CEO</TableHead>
                    <TableHead>Data de Submissão</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map(submission => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.ceo_email}</TableCell>
                      <TableCell>{formatDate(submission.created_at)}</TableCell>
                      <TableCell>
                        {submission.processed ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Processado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                            Pendente
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(submission)}
                          >
                            Ver Detalhes
                          </Button>
                          {!submission.processed && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleProcessSubmission(submission.id)}
                            >
                              Processar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Nenhuma submissão encontrada</AlertTitle>
                <AlertDescription>
                  Ainda não há formulários enviados através do embed em seu site.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormSubmissions;
