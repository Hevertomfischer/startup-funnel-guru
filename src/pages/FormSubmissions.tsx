
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Download } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const FormSubmissions = () => {
  // Mock data for demonstration
  const [submissions, setSubmissions] = useState([
    { 
      id: '1', 
      name: 'Startup A', 
      email: 'ceo@startupa.com', 
      date: '2023-06-15T10:30:00Z' 
    },
    { 
      id: '2', 
      name: 'Startup B', 
      email: 'founder@startupb.com', 
      date: '2023-06-14T14:22:00Z' 
    },
    { 
      id: '3', 
      name: 'Startup C', 
      email: 'cto@startupc.com', 
      date: '2023-06-13T09:15:00Z' 
    },
  ]);

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
    // CSV export logic would go here
    alert('Exportação CSV implementada em breve!');
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
            {submissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome da Startup</TableHead>
                    <TableHead>E-mail do CEO</TableHead>
                    <TableHead>Data de Submissão</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map(submission => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{formatDate(submission.date)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
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
