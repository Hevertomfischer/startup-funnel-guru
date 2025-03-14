
import { useState, useEffect } from 'react';
import { Startup } from '@/types';

export const useStartupList = (formattedStartups: Startup[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Filter startups based on search term
  const filteredStartups = formattedStartups.filter(startup => {
    const name = startup.values.Startup?.toString().toLowerCase() || '';
    const sector = startup.values.Setor?.toString().toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase()) || 
           sector.includes(searchTerm.toLowerCase());
  });

  // Sort startups based on sort field and direction
  const sortedStartups = [...filteredStartups].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a.values[sortField] || '';
    const bValue = b.values[sortField] || '';
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime();
    }
    
    const aString = String(aValue).toLowerCase();
    const bString = String(bValue).toLowerCase();
    
    return sortDirection === 'asc'
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  return {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    sortedStartups,
    handleSort,
  };
};
