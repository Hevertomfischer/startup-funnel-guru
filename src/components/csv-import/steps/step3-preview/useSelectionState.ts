
import { useState, useEffect } from 'react';
import { StartupPreview } from './types';

export const useSelectionState = (startupsPreview: StartupPreview[]) => {
  const [selectAll, setSelectAll] = useState(true);
  const [selectedCount, setSelectedCount] = useState(0);
  
  useEffect(() => {
    const count = startupsPreview.filter(s => s.selected).length;
    setSelectedCount(count);
    setSelectAll(count === startupsPreview.length);
  }, [startupsPreview]);

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    return startupsPreview.map(startup => ({
      ...startup,
      selected: checked
    }));
  };

  const handleRowSelectionChange = (startups: StartupPreview[], index: number, checked: boolean) => {
    const newData = [...startups];
    newData[index].selected = checked;
    
    // Update selectAll state based on all rows
    const allSelected = newData.every(s => s.selected);
    setSelectAll(allSelected);
    
    return newData;
  };
  
  return {
    selectAll,
    selectedCount,
    handleSelectAllChange,
    handleRowSelectionChange
  };
};
