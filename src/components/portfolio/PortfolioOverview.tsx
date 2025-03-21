
import React from 'react';
import { Startup } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, BarChartHorizontal, LineChart, PieChart, Activity, Layers } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioOverviewProps {
  startup?: Startup;
  portfolio: any;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ startup, portfolio }) => {
  const { startups, isLoading } = portfolio;
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }
  
  // When viewing a specific startup
  if (startup) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Fundação</dt>
                  <dd>{startup.founding_date || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Localização</dt>
                  <dd>{startup.city}{startup.state ? `, ${startup.state}` : ''}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Website</dt>
                  <dd>
                    {startup.website ? (
                      <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {startup.website}
                      </a>
                    ) : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">CEO</dt>
                  <dd>{startup.ceo_name || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Métricas Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">MRR Atual</dt>
                  <dd>
                    {startup.mrr 
                      ? `R$ ${Number(startup.mrr).toLocaleString('pt-BR')}` 
                      : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Receita Acumulada (Ano Atual)</dt>
                  <dd>
                    {startup.accumulated_revenue_current_year 
                      ? `R$ ${Number(startup.accumulated_revenue_current_year).toLocaleString('pt-BR')}` 
                      : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Receita Total (Último Ano)</dt>
                  <dd>
                    {startup.total_revenue_last_year 
                      ? `R$ ${Number(startup.total_revenue_last_year).toLocaleString('pt-BR')}` 
                      : 'N/A'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Métricas Operacionais</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Clientes</dt>
                  <dd>{startup.client_count || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sócios</dt>
                  <dd>{startup.partner_count || 'N/A'}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pontos Positivos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {startup.positive_points ? (
                <p className="whitespace-pre-line">{startup.positive_points}</p>
              ) : (
                <p className="text-muted-foreground italic">Nenhum ponto positivo registrado</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pontos de Atenção</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {startup.attention_points ? (
                <p className="whitespace-pre-line">{startup.attention_points}</p>
              ) : (
                <p className="text-muted-foreground italic">Nenhum ponto de atenção registrado</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Portfolio overview (no startup selected)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Startups Investidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{startups.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Setores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(startups.map(s => s.sector).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Modelos de Negócio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(startups.map(s => s.business_model).filter(Boolean)).size}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribuição por Setor</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PieChart className="h-10 w-10 mx-auto mb-2" />
              <p>Gráfico de distribuição por setor</p>
              <p className="text-xs">(Será implementado em versões futuras)</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita por Startup (MRR)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChartHorizontal className="h-10 w-10 mx-auto mb-2" />
              <p>Gráfico de receita por startup</p>
              <p className="text-xs">(Será implementado em versões futuras)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crescimento por Trimestre</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LineChart className="h-10 w-10 mx-auto mb-2" />
              <p>Gráfico de crescimento por trimestre</p>
              <p className="text-xs">(Será implementado em versões futuras)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioOverview;
