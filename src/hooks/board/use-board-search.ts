
import { useState } from 'react';

export function useBoardSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Search handler
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    setSearchTerm,
    handleSearch
  };
}
