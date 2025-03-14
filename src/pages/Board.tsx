
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import BoardView from '@/components/board/BoardView';

const Board = () => {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading board...</span>
      </div>
    }>
      <BoardView />
    </Suspense>
  );
};

export default Board;
