
import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CardFooterProps {
  assignedUser: { name: string; avatar?: string } | null;
  assignedTo?: string;
  dueDate?: Date;
  timeTracking?: number;
}

export const CardFooterContent: React.FC<CardFooterProps> = ({ 
  assignedUser, 
  assignedTo,
  dueDate,
  timeTracking
}) => {
  return (
    <>
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
        {!assignedUser && assignedTo && (
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
        {timeTracking !== undefined && timeTracking > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{Math.floor(timeTracking / 60)}h {timeTracking % 60}m</span>
          </div>
        )}
      </div>
    </>
  );
};
