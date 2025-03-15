
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SidebarFooter = () => {
  return (
    <div className="mt-auto p-4">
      <div className="rounded-lg bg-accent p-4">
        <div className="mb-2 flex items-center justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            SC
          </span>
        </div>
        <p className="mb-1 text-center text-sm font-medium">SCVentures Pro</p>
        <p className="text-center text-xs text-muted-foreground">
          Managing your startup funnel with precision
        </p>
        <Separator className="my-2" />
        <Button size="sm" className="w-full text-xs">
          Account Settings
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;
