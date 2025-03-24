
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingPlaceholder: React.FC = () => {
  return (
    <div className="h-20 flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingPlaceholder;
