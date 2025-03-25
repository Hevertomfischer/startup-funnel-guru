
import { useState, useCallback } from 'react';

export function useBoardSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Search handler with debounce logic
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    handleSearch
  };
}
