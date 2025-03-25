
import React, { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import BoardView from '@/components/board/BoardView';
import FixNullStatusButton from '@/components/board/FixNullStatusButton';
import { updateAllNullStatusToDeclined } from '@/services/scripts/update-null-status-startups';

const Board = () => {
  // Automatically run the fix on page load
  useEffect(() => {
    const fixNullStatuses = async () => {
      try {
        console.log('Automatically fixing null status startups...');
        await updateAllNullStatusToDeclined();
      } catch (error) {
        console.error('Failed to automatically fix null statuses:', error);
      }
    };
    
    fixNullStatuses();
  }, []);
  
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading board...</span>
      </div>
    }>
      <div className="relative">
        <div className="absolute top-4 right-4 z-10">
          <FixNullStatusButton />
        </div>
        <BoardView />
      </div>
    </Suspense>
  );
};

export default Board;
