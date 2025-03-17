
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TimeData {
  statusId: string;
  name: string;
  color: string;
  totalTimeSeconds: number;
  events: number;
}

interface StartupTimeInColumnsProps {
  timeData: TimeData[];
}

const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  if (parts.length === 0) return '< 1m';
  return parts.join(' ');
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-2 border rounded-md shadow-sm">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          <span className="font-medium">Tempo total:</span> {formatDuration(data.totalTimeSeconds)}
        </p>
        <p className="text-sm">
          <span className="font-medium">Eventos:</span> {data.events}
        </p>
      </div>
    );
  }
  return null;
};

const StartupTimeInColumns: React.FC<StartupTimeInColumnsProps> = ({ timeData }) => {
  if (!timeData || timeData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Sem dados de tempo em colunas disponíveis
      </div>
    );
  }
  
  // Preparar dados para o gráfico
  const chartData = timeData.map(item => ({
    ...item,
    formattedTime: formatDuration(item.totalTimeSeconds)
  }));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                tickFormatter={(value) => formatDuration(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="totalTimeSeconds" 
                name="Tempo Total" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8 space-y-4">
          {chartData.map(status => (
            <div key={status.statusId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span className="font-medium">{status.name}</span>
              </div>
              <div className="text-muted-foreground">
                {formatDuration(status.totalTimeSeconds)}
                <span className="text-xs ml-1">({status.events} {status.events === 1 ? 'evento' : 'eventos'})</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StartupTimeInColumns;
