
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Check, X, ArrowRight } from 'lucide-react';
import { createStartup } from '@/services/startup/create-service';

const ExternalFormAdmin = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('external_startup_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSubmissions(data || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Erro ao buscar submissões', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, data: any) => {
    setProcessingId(id);
    try {
      console.log('Approving submission:', data);
      
      // Create the startup using the service
      const result = await createStartup({
        ...data.data,
        // Make sure the status is set to a valid value
        status_id: null // This will be set to the default status
      });
      
      if (!result) {
        throw new Error('Falha ao criar startup');
      }
      
      // Update the submission status
      const { error } = await supabase
        .from('external_startup_submissions')
        .update({ status: 'approved', processed_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Startup aprovada e criada com sucesso');
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error approving submission:', error);
      toast.error('Erro ao aprovar submissão', {
        description: error.message
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('external_startup_submissions')
        .update({ status: 'rejected', processed_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Submissão rejeitada');
      fetchSubmissions();
    } catch (error: any) {
      console.error('Error rejecting submission:', error);
      toast.error('Erro ao rejeitar submissão', {
        description: error.message
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submissões de Formulários Externos</h1>
        <Button onClick={fetchSubmissions} variant="outline">
          Atualizar
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground text-lg">Nenhuma submissão encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{submission.data.values?.Startup || 'Sem nome'}</CardTitle>
                    <CardDescription>
                      Enviado em {new Date(submission.created_at).toLocaleString('pt-BR')}
                    </CardDescription>
                  </div>
                  <div>
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Informações da Startup</h3>
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">Setor:</dt>
                        <dd className="col-span-2">{submission.data.values?.Setor || '-'}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">Cidade/Estado:</dt>
                        <dd className="col-span-2">{submission.data.values?.Cidade || '-'}/{submission.data.values?.Estado || '-'}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">MRR:</dt>
                        <dd className="col-span-2">{submission.data.values?.MRR ? `R$ ${submission.data.values.MRR}` : '-'}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">Modelo de Negócio:</dt>
                        <dd className="col-span-2">{submission.data.values?.['Modelo de Negócio'] || '-'}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">Website:</dt>
                        <dd className="col-span-2">
                          {submission.data.values?.['Site da Startup'] ? (
                            <a href={submission.data.values['Site da Startup']} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {submission.data.values['Site da Startup']}
                            </a>
                          ) : '-'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Informações do CEO</h3>
                    <dl className="space-y-2">
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">Nome:</dt>
                        <dd className="col-span-2">{submission.data.values?.['Nome do CEO'] || '-'}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                        <dd className="col-span-2">{submission.data.values?.['E-mail do CEO'] || '-'}</dd>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <dt className="text-sm font-medium text-muted-foreground">WhatsApp:</dt>
                        <dd className="col-span-2">{submission.data.values?.['Whatsapp do CEO'] || '-'}</dd>
                      </div>
                    </dl>
                    
                    <h3 className="font-medium mt-6 mb-4">Pitch Deck</h3>
                    {submission.data.pitchDeck ? (
                      <a 
                        href={submission.data.pitchDeck.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {submission.data.pitchDeck.name}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    ) : '-'}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Problema e Solução</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Problema que Resolve:</h4>
                      <p className="text-sm bg-muted/30 p-3 rounded">{submission.data.values?.['Problema que Resolve'] || '-'}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Solução para o Problema:</h4>
                      <p className="text-sm bg-muted/30 p-3 rounded">{submission.data.values?.['Como Resolve o Problema'] || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {submission.status === 'pending' && (
                  <div className="mt-6 flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      className="border-red-200 hover:bg-red-50 text-red-600"
                      onClick={() => handleReject(submission.id)}
                      disabled={!!processingId}
                    >
                      {processingId === submission.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Rejeitar
                    </Button>
                    <Button 
                      onClick={() => handleApprove(submission.id, submission)}
                      disabled={!!processingId}
                    >
                      {processingId === submission.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Aprovar e Criar Startup
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalFormAdmin;
