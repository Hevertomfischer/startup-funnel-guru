
import React, { useEffect } from 'react';
import { Startup } from '@/types/startup';
import { Status } from '@/types/status';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CardBadges } from './CardBadges';
import { CardMenu } from './CardMenu';
import { BusinessInfo } from './BusinessInfo';
import { ContactInfo } from './ContactInfo';
import { FinancialMetrics } from './FinancialMetrics';
import { CardFooterContent } from './CardFooter';

interface StartupCardProps {
  startup: Startup;
  statuses: Status[];
  users?: { [key: string]: { name: string; avatar?: string } };
  onClick: (startup: Startup) => void;
  onDelete?: (startupId: string) => void;
  compact?: boolean;
  onCreateTask?: (startupId: string) => void;
}

const StartupCard: React.FC<StartupCardProps> = ({ 
  startup, 
  statuses, 
  users = {}, 
  onClick,
  onDelete,
  compact = false,
  onCreateTask
}) => {
  const status = statuses.find(s => s.id === startup.statusId);
  const dueDate = startup.dueDate ? new Date(startup.dueDate) : undefined;
  const assignedUser = startup.assignedTo && users[startup.assignedTo];
  
  // Check if the startup has a pitchdeck with a valid URL
  const hasPitchDeck = Boolean(startup.pitchDeck?.url);
  
  // Get tasks from localStorage
  const getOpenTasksCount = () => {
    try {
      const storedTasks = localStorage.getItem('workflowTasks');
      if (!storedTasks) return 0;
      
      const tasks = JSON.parse(storedTasks);
      return tasks.filter(
        (task: any) => task.relatedStartupId === startup.id && task.status !== 'completed'
      ).length;
    } catch (e) {
      console.error('Error getting open tasks count:', e);
      return 0;
    }
  };
  
  const openTasksCount = getOpenTasksCount();
  
  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  // Format currency for financial values
  const formatCurrency = (value?: number) => {
    if (value === undefined) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onDelete) {
      onDelete(startup.id);
    }
  };

  const handleTaskIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onCreateTask) {
      onCreateTask(startup.id);
    }
  };

  const handlePitchDeckClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    console.log("Pitch deck clicked, URL:", startup.pitchDeck?.url);
    if (hasPitchDeck && startup.pitchDeck?.url) {
      window.open(startup.pitchDeck.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Log what deck we found for debugging
  useEffect(() => {
    console.log('Card for startup:', startup.id, 'Has pitchDeck:', hasPitchDeck, startup.pitchDeck);
  }, [hasPitchDeck, startup.pitchDeck, startup.id]);

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
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <CardTitle className={`${compact ? 'text-base' : 'text-lg'} line-clamp-1`}>
              {startup.values.Startup || 'Unnamed Startup'}
            </CardTitle>
            {!compact && (
              <CardDescription className="line-clamp-2">
                {startup.values['Problema que Resolve'] || 'No problem description'}
              </CardDescription>
            )}
          </div>
          <CardMenu onDelete={onDelete ? handleDelete : undefined} />
        </div>
        
        {/* Badges Section */}
        <div className="mt-2">
          <CardBadges 
            openTasksCount={openTasksCount}
            hasPitchDeck={hasPitchDeck}
            startup={startup}
            priorityColors={priorityColors}
            onTaskIconClick={handleTaskIconClick}
            onPitchDeckClick={handlePitchDeckClick}
          />
        </div>
      </CardHeader>
      <CardContent className={compact ? 'p-3 pt-0' : 'px-4 pb-2'}>
        {!compact && (
          <>
            {/* Business Information */}
            <BusinessInfo startup={startup} />

            {/* Contact Information */}
            <ContactInfo 
              startup={startup}
              onPitchDeckLinkClick={handlePitchDeckClick}
            />

            {/* Financial Metrics */}
            <FinancialMetrics 
              startup={startup}
              formatCurrency={formatCurrency}
            />
          </>
        )}
      </CardContent>
      <CardFooter className={`${compact ? 'p-3 pt-0' : 'p-4'} flex flex-wrap gap-2 justify-between`}>
        <CardFooterContent
          assignedUser={assignedUser}
          assignedTo={startup.assignedTo}
          dueDate={dueDate}
          timeTracking={startup.timeTracking}
        />
      </CardFooter>
    </Card>
  );
};

export default StartupCard;
