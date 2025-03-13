
import React from 'react';
import { LayoutDashboard, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewToggleProps {
  view: 'board' | 'list';
  setView: (view: 'board' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  return (
    <Tabs value={view} onValueChange={(v) => setView(v as 'board' | 'list')} className="hidden md:block">
      <TabsList className="grid w-full grid-cols-2 h-9">
        <TabsTrigger 
          value="board" 
          className="flex items-center gap-1 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Board</span>
        </TabsTrigger>
        <TabsTrigger 
          value="list" 
          className="flex items-center gap-1 px-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          <List className="h-4 w-4" />
          <span>List</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ViewToggle;
