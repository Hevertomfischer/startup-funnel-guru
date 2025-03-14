
import React from 'react';
import { Calendar, User } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Startup, Status } from '@/types';
import { USERS } from '@/data/mockData';
import { format } from 'date-fns';

interface StartupTableRowProps {
  startup: Startup;
  status?: Status;
  onRowClick: (startup: Startup) => void;
}

const StartupTableRow = ({ startup, status, onRowClick }: StartupTableRowProps) => {
  const assignedUser = startup.assignedTo && USERS[startup.assignedTo];
  const dueDate = startup.dueDate ? new Date(startup.dueDate) : undefined;
  
  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  
  return (
    <TableRow 
      key={startup.id} 
      className="cursor-pointer hover:bg-accent/50"
      onClick={() => onRowClick(startup)}
    >
      <TableCell className="font-medium">
        {startup.values.Startup || 'Unnamed Startup'}
      </TableCell>
      <TableCell>
        {startup.values.Setor || '-'}
      </TableCell>
      <TableCell>
        {startup.values['Modelo de Negócio'] || '-'}
      </TableCell>
      <TableCell className="text-right">
        {typeof startup.values.MRR === 'number' 
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(startup.values.MRR) 
          : (startup.values.MRR || '-')}
      </TableCell>
      <TableCell className="text-right">
        {startup.values['Quantidade de Clientes'] || '-'}
      </TableCell>
      <TableCell>
        {status && (
          <Badge 
            className="whitespace-nowrap" 
            style={{ 
              backgroundColor: `${status.color}20`, 
              color: status.color,
              borderColor: `${status.color}30`
            }}
            variant="outline"
          >
            {status.name}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={`${priorityColors[startup.priority]} text-xs`}
        >
          {startup.priority.charAt(0).toUpperCase() + startup.priority.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        {assignedUser ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {assignedUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs truncate max-w-[80px]">
              {assignedUser.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span>Unassigned</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        {dueDate ? (
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{format(dueDate, 'dd/MM/yyyy')}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default StartupTableRow;
