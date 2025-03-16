
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoleGuard } from '@/hooks/use-role-guard';

const Investors = () => {
  // This page is accessible to both admins and investors
  const { isAllowed } = useRoleGuard(false);
  
  if (!isAllowed) {
    return null; // The hook will handle redirection
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Área do Investidor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Investimentos Ativos</CardTitle>
            <CardDescription>Acompanhe seus investimentos atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Este módulo está em desenvolvimento. Em breve você poderá visualizar e gerenciar seus investimentos.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades</CardTitle>
            <CardDescription>Novas oportunidades de investimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Este módulo está em desenvolvimento. Em breve você poderá ver novas oportunidades de investimento.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Desempenho dos seus investimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Este módulo está em desenvolvimento. Em breve você poderá acompanhar o desempenho dos seus investimentos.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Investors;
