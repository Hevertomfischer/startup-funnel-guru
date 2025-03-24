
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, placeholder = "Search..." }: SearchBarProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm ?? localSearchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (setSearchTerm) {
      setSearchTerm(value);
    } else {
      setLocalSearchTerm(value);
    }
    onSearch(value);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="w-full pl-8 bg-background"
        value={searchTerm ?? localSearchTerm}
        onChange={handleSearchChange}
      />
    </form>
  );
};

export default SearchBar;
