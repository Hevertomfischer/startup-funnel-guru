
import React from 'react';
import { Calendar, Clock, Link2, User } from 'lucide-react';
import { Startup, Status } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format } from 'date-fns';

interface StartupCardProps {
  startup: Startup;
  statuses: Status[];
  users?: { [key: string]: { name: string; avatar?: string } };
  onClick: (startup: Startup) => void;
  compact?: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ 
  startup, 
  statuses, 
  users = {}, 
  onClick,
  compact = false 
}) => {
  const status = statuses.find(s => s.id === startup.statusId);
  const dueDate = startup.dueDate ? new Date(startup.dueDate) : undefined;
  const assignedUser = startup.assignedTo && users[startup.assignedTo];
  
  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <Card 
      className="glass-card cursor-pointer overflow-hidden group" 
      onClick={() => onClick(startup)}
    >
      <div 
        className="h-1.5 w-full" 
        style={{ backgroundColor: status?.color || '#e2e8f0' }}
      />
      <CardHeader className={compact ? 'p-3' : 'p-4'}>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className={`${compact ? 'text-base' : 'text-lg'} line-clamp-1`}>
            {startup.values.Startup || 'Unnamed Startup'}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${priorityColors[startup.priority]} text-xs`}
          >
            {startup.priority.charAt(0).toUpperCase() + startup.priority.slice(1)}
          </Badge>
        </div>
        {!compact && (
          <CardDescription className="line-clamp-2 mt-1">
            {startup.values['Problema que Resolve'] || 'No problem description'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={compact ? 'p-3 pt-0' : 'px-4 pb-2'}>
        {!compact && (
          <>
            {startup.values['Setor'] && (
              <div className="mb-2">
                <Badge variant="secondary" className="mr-1 text-xs">
                  {startup.values['Setor']}
                </Badge>
                {startup.values['Modelo de Negócio'] && (
                  <Badge variant="secondary" className="text-xs">
                    {startup.values['Modelo de Negócio']}
                  </Badge>
                )}
              </div>
            )}
            {startup.values['Site da Startup'] && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Link2 className="h-3 w-3" />
                <a 
                  href={startup.values['Site da Startup']} 
                  className="truncate hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {startup.values['Site da Startup'].replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {startup.values['MRR'] && (
              <div className="flex items-center gap-1 text-xs font-medium">
                MRR: {typeof startup.values['MRR'] === 'number' 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(startup.values['MRR']) 
                  : startup.values['MRR']}
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className={`${compact ? 'p-3 pt-0' : 'p-4'} flex flex-wrap gap-2 justify-between`}>
        <div className="flex items-center gap-2">
          {assignedUser && (
            <div className="flex items-center">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {assignedUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          {!assignedUser && startup.assignedTo && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>Unassigned</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(dueDate, 'dd/MM/yyyy')}</span>
            </div>
          )}
          {startup.timeTracking !== undefined && startup.timeTracking > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{Math.floor(startup.timeTracking / 60)}h {startup.timeTracking % 60}m</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default StartupCard;
