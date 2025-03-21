
import React from 'react';
import { Startup } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface PortfolioStartupListProps {
  startups: Startup[];
  isLoading: boolean;
  selectedStartupId: string | null;
  onSelectStartup: (id: string) => void;
}

const PortfolioStartupList: React.FC<PortfolioStartupListProps> = ({
  startups,
  isLoading,
  selectedStartupId,
  onSelectStartup
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma startup investida encontrada
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {startups.map((startup) => (
        <Button
          key={startup.id}
          variant={selectedStartupId === startup.id ? "default" : "outline"}
          className="w-full justify-start text-left h-auto py-3"
          onClick={() => onSelectStartup(startup.id)}
        >
          <div className="flex flex-col items-start">
            <div className="font-medium">{startup.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {startup.sector && (
                <Badge variant="outline" className="mr-1 text-xs">
                  {startup.sector}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default PortfolioStartupList;
