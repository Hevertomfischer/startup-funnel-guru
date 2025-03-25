
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, CheckCircle, ExternalLink, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FormSubmissions = () => {
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  
  // Fetch form submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['form-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Process submission mutation
  const processMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { data, error } = await supabase
        .rpc('process_form_submission', { submission_id: submissionId });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, submissionId) => {
      toast.success('Submissão processada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['form-submissions'] });
    },
    onError: (error) => {
      toast.error(`Erro ao processar submissão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Delete submission mutation
  const deleteMutation = useMutation({
    mutationFn: async (submissionId: string) => {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', submissionId);
      
      if (error) throw error;
      return submissionId;
    },
    onSuccess: (submissionId) => {
      toast.success('Submissão excluída com sucesso');
      queryClient.invalidateQueries({ queryKey: ['form-submissions'] });
      
      if (selectedSubmission?.id === submissionId) {
        setIsViewOpen(false);
      }
    },
    onError: (error) => {
      toast.error(`Erro ao excluir submissão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  });
  
  // Handle process
  const handleProcess = (submissionId: string) => {
    processMutation.mutate(submissionId);
  };
  
  // Handle delete
  const handleDelete = (submissionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta submissão?')) {
      deleteMutation.mutate(submissionId);
    }
  };
  
  // Handle view
  const handleView = (submission: any) => {
    setSelectedSubmission(submission);
    setIsViewOpen(true);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const renderSubmissionDetails = (submission: any) => {
    if (!submission) return null;
    
    const fieldLabels: { [key: string]: string } = {
      name: 'Nome da Startup',
      ceo_name: 'Nome do CEO',
      ceo_email: 'E-mail do CEO',
      ceo_whatsapp: 'WhatsApp do CEO',
      founding_year: 'Ano da Fundação',
      problem_solved: 'Problema que Resolve',
      problem_solution: 'Solução para o Problema',
      differentials: 'Diferenciais da Startup',
      mrr: 'Faturamento (MRR)',
      business_model: 'Modelo de Negócio',
      sector: 'Setor',
      city: 'Cidade',
      state: 'Estado',
      website: 'Site da Startup',
      created_at: 'Data de Submissão'
    };
    
    return (
      <div className="grid gap-4">
        {Object.entries(submission).map(([key, value]) => {
          if (['id', 'processed', 'status_id'].includes(key)) return null;
          
          const label = fieldLabels[key] || key;
          
          if (key === 'created_at') {
            return (
              <div key={key}>
                <h3 className="text-sm font-medium">{label}</h3>
                <p className="text-sm">{formatDate(value as string)}</p>
              </div>
            );
          }
          
          if (key === 'website' && value) {
            return (
              <div key={key}>
                <h3 className="text-sm font-medium">{label}</h3>
                <p className="text-sm flex items-center">
                  <a href={value as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                    {value as string} <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </p>
              </div>
            );
          }
          
          if (key === 'mrr' && value) {
            return (
              <div key={key}>
                <h3 className="text-sm font-medium">{label}</h3>
                <p className="text-sm">R$ {Number(value).toLocaleString('pt-BR')}</p>
              </div>
            );
          }
          
          return (
            <div key={key}>
              <h3 className="text-sm font-medium">{label}</h3>
              <p className="text-sm whitespace-pre-wrap">{value as string}</p>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Formulários de Cadastro</h1>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loader">Carregando...</div>
        </div>
      ) : (
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="processed">Processados</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
          
          {['pending', 'processed', 'all'].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tabValue === 'pending' && 'Submissões Pendentes'}
                    {tabValue === 'processed' && 'Submissões Processadas'}
                    {tabValue === 'all' && 'Todas as Submissões'}
                  </CardTitle>
                  <CardDescription>
                    {submissions?.length || 0} {submissions?.length === 1 ? 'submissão' : 'submissões'} 
                    {tabValue === 'pending' ? ' pendentes' : tabValue === 'processed' ? ' processadas' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submissions && submissions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Startup</TableHead>
                          <TableHead>CEO</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {submissions
                          .filter(submission => {
                            if (tabValue === 'pending') return !submission.processed;
                            if (tabValue === 'processed') return submission.processed;
                            return true;
                          })
                          .map(submission => (
                            <TableRow key={submission.id}>
                              <TableCell>{submission.name}</TableCell>
                              <TableCell>{submission.ceo_name}</TableCell>
                              <TableCell>{format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                              <TableCell>
                                {submission.processed ? (
                                  <Badge variant="success" className="bg-green-100 text-green-800">
                                    Processado
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Pendente</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => handleView(submission)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  
                                  {!submission.processed && (
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      onClick={() => handleProcess(submission.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(submission.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Nenhuma submissão encontrada
                        {tabValue === 'pending' ? ' pendente' : tabValue === 'processed' ? ' processada' : ''}.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}
      
      {/* View submission dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.name}</DialogTitle>
            <DialogDescription>
              Detalhes da submissão
            </DialogDescription>
          </DialogHeader>
          
          {renderSubmissionDetails(selectedSubmission)}
          
          <DialogFooter className="flex items-center justify-between">
            <div className="flex-1">
              {selectedSubmission && !selectedSubmission.processed && (
                <Button 
                  variant="outline" 
                  className="mr-2"
                  onClick={() => {
                    handleProcess(selectedSubmission.id);
                    setIsViewOpen(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Processar
                </Button>
              )}
            </div>
            
            <Button variant="secondary" onClick={() => setIsViewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormSubmissions;
