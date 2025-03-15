
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clipboard } from 'lucide-react';

interface TaskEmptyStateProps {
  hasNoTasks: boolean;
  onResetFilter: () => void;
}

const TaskEmptyState = ({ hasNoTasks, onResetFilter }: TaskEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Clipboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {hasNoTasks 
            ? "No tasks have been created yet. Create your first task to get started."
            : "No tasks match your current filter."}
        </p>
        {!hasNoTasks && (
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onResetFilter}
          >
            Show All Tasks
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskEmptyState;
