
import React from 'react';

const EmptyColumnPlaceholder: React.FC = () => {
  return (
    <div className="h-20 flex items-center justify-center border border-dashed rounded-md text-muted-foreground text-sm">
      Drop startups here
    </div>
  );
};

export default EmptyColumnPlaceholder;
