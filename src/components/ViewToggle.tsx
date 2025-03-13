
import React from 'react';
import { LayoutDashboard, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewMode } from '@/types';

interface ViewToggleProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, setView }) => {
  return (
    <div className="relative">
      <Tabs 
        value={view} 
        onValueChange={(v) => setView(v as ViewMode)} 
        className="hidden md:block"
      >
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
      
      {/* Mobile view toggle */}
      <div className="md:hidden flex rounded-md overflow-hidden border">
        <button
          onClick={() => setView('board')}
          className={`flex items-center gap-1 px-3 py-1.5 ${
            view === 'board' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-muted'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1 px-3 py-1.5 ${
            view === 'list' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-muted'
          }`}
        >
          <List className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
