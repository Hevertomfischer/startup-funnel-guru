
import React, { useState } from 'react';
import { usePortfolio } from '@/hooks/portfolio/use-portfolio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, FileText, PieChart, CalendarDays, AlertTriangle, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PortfolioKPISection from '@/components/portfolio/PortfolioKPISection';
import PortfolioBoardMeetingsSection from '@/components/portfolio/PortfolioBoardMeetingsSection';
import PortfolioNeedsSection from '@/components/portfolio/PortfolioNeedsSection';
import PortfolioHighlightsSection from '@/components/portfolio/PortfolioHighlightsSection';
import PortfolioStartupList from '@/components/portfolio/PortfolioStartupList';
import PortfolioOverview from '@/components/portfolio/PortfolioOverview';

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const portfolio = usePortfolio();
  
  const {
    startups,
    isLoadingStartups,
    selectedStartupId,
    setSelectedStartupId,
    selectedStartup
  } = portfolio;
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with startups list */}
        <div className="w-full md:w-1/4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Portfólio de Startups</CardTitle>
              <CardDescription>
                {startups.length} startups investidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <PortfolioStartupList 
                  startups={startups}
                  isLoading={isLoadingStartups}
                  selectedStartupId={selectedStartupId}
                  onSelectStartup={setSelectedStartupId}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="w-full md:w-3/4">
          {selectedStartup ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedStartup.name}</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStartupId(null)}>
                      Voltar para Visão Geral
                    </Button>
                  </div>
                  <CardDescription>
                    {selectedStartup.sector || 'Sem setor definido'} • {selectedStartup.business_model || 'Modelo de negócio não definido'}
                  </CardDescription>
                </CardHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-5 mb-4">
                    <TabsTrigger value="overview">
                      <PieChart className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Visão Geral</span>
                    </TabsTrigger>
                    <TabsTrigger value="kpis">
                      <BarChart className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">KPIs</span>
                    </TabsTrigger>
                    <TabsTrigger value="board">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Conselho</span>
                    </TabsTrigger>
                    <TabsTrigger value="needs">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Necessidades</span>
                    </TabsTrigger>
                    <TabsTrigger value="highlights">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Destaques</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <CardContent>
                      <PortfolioOverview startup={selectedStartup} portfolio={portfolio} />
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="kpis">
                    <CardContent>
                      <PortfolioKPISection startupId={selectedStartupId!} portfolio={portfolio} />
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="board">
                    <CardContent>
                      <PortfolioBoardMeetingsSection startupId={selectedStartupId!} portfolio={portfolio} />
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="needs">
                    <CardContent>
                      <PortfolioNeedsSection startupId={selectedStartupId!} portfolio={portfolio} />
                    </CardContent>
                  </TabsContent>
                  
                  <TabsContent value="highlights">
                    <CardContent>
                      <PortfolioHighlightsSection startupId={selectedStartupId!} portfolio={portfolio} />
                    </CardContent>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Visão Geral do Portfólio</CardTitle>
                <CardDescription>
                  Análise geral do portfólio de startups investidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioOverview portfolio={portfolio} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
