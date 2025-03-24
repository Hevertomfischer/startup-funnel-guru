
import React from 'react';

const ErrorPlaceholder: React.FC = () => {
  return (
    <div className="h-20 flex items-center justify-center text-destructive text-sm">
      Failed to load startups
    </div>
  );
};

export default ErrorPlaceholder;
