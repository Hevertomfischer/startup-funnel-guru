
import React from 'react';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StartupStatusTimelineProps {
  history: any[];
}

const formatDuration = (seconds: number | null): string => {
  if (!seconds) return 'N/A';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} dia${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`);
  
  if (parts.length === 0) return 'menos de 1 minuto';
  return parts.join(', ');
};

const StartupStatusTimeline: React.FC<StartupStatusTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum histórico de status registrado para esta startup
      </div>
    );
  }

  return (
    <div className="relative ml-4 pl-6 border-l">
      {history.map((event, index) => {
        const statusName = event.statuses?.name || 'Desconhecido';
        const statusColor = event.statuses?.color || '#cccccc';
        const previousStatusName = event.previous_statuses?.name || 'Início';
        const enteredAt = new Date(event.entered_at);
        const exited = event.exited_at ? new Date(event.exited_at) : null;
        
        let timeInStatus;
        if (event.duration_seconds) {
          timeInStatus = formatDuration(event.duration_seconds);
        } else if (exited) {
          timeInStatus = formatDistance(exited, enteredAt, { locale: ptBR });
        } else {
          timeInStatus = 'Até o momento (' + formatDistance(new Date(), enteredAt, { locale: ptBR, addSuffix: false }) + ')';
        }

        return (
          <div key={event.id} className="mb-8 relative">
            <div 
              className="absolute -left-10 w-4 h-4 rounded-full border-2 border-background z-10"
              style={{ backgroundColor: statusColor }}
            />
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    Movido para <span style={{ color: statusColor }}>{statusName}</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    De: {previousStatusName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    {format(enteredAt, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </div>
                  {exited && (
                    <div className="text-xs text-muted-foreground">
                      Até: {format(exited, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 px-3 py-1 bg-muted rounded-md text-sm">
                Tempo no status: {timeInStatus}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StartupStatusTimeline;
