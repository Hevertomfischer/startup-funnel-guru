
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, History, Clock } from 'lucide-react';
import { getStartupHistory, getStartupStatusHistory, getTimeInEachColumn } from '@/services/startup-history-service';
import StartupChangesHistory from './StartupChangesHistory';
import StartupStatusTimeline from './StartupStatusTimeline';
import StartupTimeInColumns from './StartupTimeInColumns';

interface StartupHistoryTabProps {
  startupId: string;
}

const StartupHistoryTab: React.FC<StartupHistoryTabProps> = ({ startupId }) => {
  const [changesHistory, setChangesHistory] = useState<any[]>([]);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [timeInColumns, setTimeInColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryData = async () => {
      setIsLoading(true);
      try {
        const [changesData, statusData, columnTimeData] = await Promise.all([
          getStartupHistory(startupId),
          getStartupStatusHistory(startupId),
          getTimeInEachColumn(startupId)
        ]);
        
        setChangesHistory(changesData);
        setStatusHistory(statusData);
        setTimeInColumns(columnTimeData);
      } catch (error) {
        console.error('Erro ao buscar dados de histórico:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (startupId) {
      fetchHistoryData();
    }
  }, [startupId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Histórico da Startup</CardTitle>
        <CardDescription>
          Veja todas as alterações feitas nesta startup e o tempo que ela permaneceu em cada coluna
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="changes">
          <TabsList className="mb-4">
            <TabsTrigger value="changes">
              <History className="h-4 w-4 mr-2" />
              Alterações
            </TabsTrigger>
            <TabsTrigger value="status">
              <Clock className="h-4 w-4 mr-2" />
              Linha do Tempo
            </TabsTrigger>
            <TabsTrigger value="time">
              <Clock className="h-4 w-4 mr-2" />
              Tempo em Colunas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="changes">
            <StartupChangesHistory history={changesHistory} />
          </TabsContent>
          
          <TabsContent value="status">
            <StartupStatusTimeline history={statusHistory} />
          </TabsContent>
          
          <TabsContent value="time">
            <StartupTimeInColumns timeData={timeInColumns} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StartupHistoryTab;
