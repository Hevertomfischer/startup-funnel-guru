
import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, PieChart as PieChartIcon, BarChart3, TrendingUp, Award, AlertTriangle, Lightbulb } from 'lucide-react';
import { usePortfolioManagement } from '@/hooks/use-portfolio-management';
import { StartupHighlight } from '@/types/portfolio';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useStartupActions } from '@/hooks/use-startup-actions';

const Portfolio = () => {
  const navigate = useNavigate();
  const { handleStartupDetail } = useStartupActions();
  const { 
    investedStartups, 
    portfolioSummary,
    startupHighlights,
    boardMeetings,
    allStatuses
  } = usePortfolioManagement();
  
  const [activeTab, setActiveTab] = useState('overview');

  // Prepare data for sector distribution chart
  const sectorData = Object.entries(portfolioSummary.sectorsDistribution).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare data for stage distribution chart
  const stageData = Object.entries(portfolioSummary.stageDistribution).map(([name, value]) => ({
    name,
    value
  }));

  // Prepare data for quarterly performance chart
  const performanceData = Object.entries(portfolioSummary.performanceByQuarter)
    .map(([quarter, value]) => ({
      quarter,
      value
    }))
    .sort((a, b) => {
      const aYear = parseInt(a.quarter.split(' ')[1]);
      const aQuarter = parseInt(a.quarter.split('Q')[1].split(' ')[0]);
      const bYear = parseInt(b.quarter.split(' ')[1]);
      const bQuarter = parseInt(b.quarter.split('Q')[1].split(' ')[0]);
      
      if (aYear !== bYear) return aYear - bYear;
      return aQuarter - bQuarter;
    });

  // Get upcoming meetings
  const upcomingMeetings = boardMeetings
    .filter(meeting => meeting.status === 'scheduled' && new Date(meeting.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  // Get active highlights by type
  const getActiveHighlights = (type: 'achievement' | 'concern' | 'need') => {
    return startupHighlights
      .filter(highlight => highlight.type === type && highlight.status === 'active')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const achievements = getActiveHighlights('achievement');
  const concerns = getActiveHighlights('concern');
  const needs = getActiveHighlights('need');

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Display a highlight
  const renderHighlight = (highlight: StartupHighlight) => {
    const startup = investedStartups.find(s => s.id === highlight.startupId);
    const date = highlight.date instanceof Date ? highlight.date : new Date(highlight.date);
    
    return (
      <div key={highlight.id} className="p-4 border rounded-lg mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{highlight.title}</h4>
            <p className="text-sm text-muted-foreground">{highlight.description}</p>
            <div className="flex mt-2 items-center gap-2">
              {highlight.priority && (
                <Badge variant={
                  highlight.priority === 'high' ? 'destructive' : 
                  highlight.priority === 'medium' ? 'default' : 
                  'outline'
                }>
                  {highlight.priority}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {format(date, 'dd MMM yyyy', { locale: ptBR })}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleStartupDetail(startup!)}
          >
            Ver Startup
          </Button>
        </div>
      </div>
    );
  };

  // Show upcoming meeting
  const renderUpcomingMeeting = (meeting: any) => {
    const startup = investedStartups.find(s => s.id === meeting.startupId);
    const meetingDate = meeting.scheduledDate instanceof Date ? meeting.scheduledDate : new Date(meeting.scheduledDate);
    
    return (
      <div key={meeting.id} className="p-4 border rounded-lg mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{meeting.title}</h4>
            <p className="text-sm">{startup?.values.Startup || 'Startup'}</p>
            <div className="flex mt-2 items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(meetingDate, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleStartupDetail(startup!)}
          >
            Ver Startup
          </Button>
        </div>
        {meeting.agenda && (
          <p className="text-sm text-muted-foreground mt-2">{meeting.agenda}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portfólio de Startups Investidas</h1>
        <Button 
          onClick={() => navigate('/settings')}
          variant="outline"
        >
          Configurar Portfólio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Startups Investidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investedStartups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Setores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(portfolioSummary.sectorsDistribution).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reuniões Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{concerns.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="concerns">Pontos de Atenção</TabsTrigger>
          <TabsTrigger value="needs">Necessidades</TabsTrigger>
          <TabsTrigger value="meetings">Reuniões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <PieChartIcon className="mr-2 h-4 w-4" />
                  <CardTitle>Distribuição por Setor</CardTitle>
                </div>
                <CardDescription>
                  Distribuição das startups investidas por setor
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  <CardTitle>Distribuição por Estágio</CardTitle>
                </div>
                <CardDescription>
                  Distribuição das startups por estágio de investimento
                </CardDescription>
              </CardHeader>
              <CardContent className="p-1">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <CardTitle>Evolução do Portfólio</CardTitle>
              </div>
              <CardDescription>
                Evolução do desempenho financeiro trimestral
              </CardDescription>
            </CardHeader>
            <CardContent className="p-1">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <CardTitle>Próximas Reuniões</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {upcomingMeetings.length > 0 ? (
                    upcomingMeetings.slice(0, 5).map(meeting => renderUpcomingMeeting(meeting))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Não há reuniões agendadas
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <CardTitle>Pontos de Atenção Recentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {concerns.length > 0 ? (
                    concerns.slice(0, 5).map(concern => renderHighlight(concern))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Não há pontos de atenção ativos
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                <CardTitle>Conquistas</CardTitle>
              </div>
              <CardDescription>
                Conquistas e marcos significativos das startups investidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {achievements.length > 0 ? (
                  achievements.map(achievement => renderHighlight(achievement))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma conquista registrada
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="concerns">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <CardTitle>Pontos de Atenção</CardTitle>
              </div>
              <CardDescription>
                Pontos que requerem monitoramento ou intervenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {concerns.length > 0 ? (
                  concerns.map(concern => renderHighlight(concern))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum ponto de atenção ativo
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="needs">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Lightbulb className="mr-2 h-4 w-4" />
                <CardTitle>Necessidades</CardTitle>
              </div>
              <CardDescription>
                Necessidades específicas das startups que requerem suporte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {needs.length > 0 ? (
                  needs.map(need => renderHighlight(need))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma necessidade registrada
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="meetings">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <CardTitle>Reuniões Agendadas</CardTitle>
              </div>
              <CardDescription>
                Próximas reuniões de conselho e acompanhamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map(meeting => renderUpcomingMeeting(meeting))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Não há reuniões agendadas
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Startups Investidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {investedStartups.map(startup => (
            <Card key={startup.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStartupDetail(startup)}>
              <CardHeader className="pb-2">
                <CardTitle>{startup.values.Startup || 'Startup sem nome'}</CardTitle>
                <CardDescription>
                  {startup.values.Setor || 'Setor não especificado'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {startup.values['Modelo de Negócio'] && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Modelo:</span>
                      <span className="text-sm ml-2">{startup.values['Modelo de Negócio']}</span>
                    </div>
                  )}
                  {startup.values['MRR'] !== undefined && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium">MRR:</span>
                      <span className="text-sm ml-2">
                        {typeof startup.values.MRR === 'number' 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(startup.values.MRR) 
                          : startup.values.MRR}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm ml-2">
                      {allStatuses.find(s => s.id === startup.statusId)?.name || 'Desconhecido'}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    <span>{startup.highlights?.filter(h => h.type === 'achievement' && h.status === 'active').length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>{startup.highlights?.filter(h => h.type === 'concern' && h.status === 'active').length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    <span>{startup.highlights?.filter(h => h.type === 'need' && h.status === 'active').length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{startup.boardMeetings?.filter(m => m.status === 'scheduled').length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
