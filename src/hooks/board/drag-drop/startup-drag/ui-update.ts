
import { Column } from '@/types';

/**
 * Updates columns optimistically before the API call completes
 */
export const updateColumnsOptimistically = (
  columns: Column[],
  startupId: string,
  targetColumnId: string
): Column[] => {
  console.log('Updating columns optimistically:', {
    columns: columns.length,
    startupId,
    targetColumnId
  });
  
  // First log the current state of columns for debugging
  columns.forEach(col => {
    console.log(`Column ${col.id}: ${col.startupIds.length} startups`);
  });
  
  // Create a deep copy to prevent reference issues
  const updatedColumns = JSON.parse(JSON.stringify(columns));
  
  // First, remove the startup from any column it might be in
  for (let i = 0; i < updatedColumns.length; i++) {
    const oldColumnIndex = updatedColumns[i].startupIds.indexOf(startupId);
    if (oldColumnIndex !== -1) {
      console.log(`Removing startup ${startupId} from column ${updatedColumns[i].id}`);
      updatedColumns[i].startupIds.splice(oldColumnIndex, 1);
    }
  }
  
  // Then add it to the target column
  const targetColumn = updatedColumns.find(col => col.id === targetColumnId);
  if (targetColumn) {
    console.log(`Adding startup ${startupId} to column ${targetColumnId}`);
    if (!targetColumn.startupIds.includes(startupId)) {
      targetColumn.startupIds.push(startupId);
    }
  } else {
    console.error(`Target column ${targetColumnId} not found`);
  }
  
  // Log the updated columns state
  updatedColumns.forEach(col => {
    console.log(`Updated column ${col.id}: ${col.startupIds.length} startups`);
  });
  
  return updatedColumns;
};

// Adiciona uma nova função de sincronização para garantir que as contagens estejam corretas
export const syncColumnCounts = (columns: Column[], startup: any): Column[] => {
  // Faz uma cópia profunda
  const updatedColumns = JSON.parse(JSON.stringify(columns));
  
  // Garante que cada startup está na coluna correta com base em seu status_id
  const startupId = startup.id;
  const statusId = startup.status_id || startup.statusId;
  
  console.log(`Sincronizando contagens para startup ${startupId} com status ${statusId}`);
  
  if (!statusId) {
    console.warn(`Startup ${startupId} não tem status_id, não pode sincronizar`);
    return updatedColumns;
  }
  
  // Remove o startup de qualquer coluna em que ele possa estar
  for (let i = 0; i < updatedColumns.length; i++) {
    const oldColumnIndex = updatedColumns[i].startupIds.indexOf(startupId);
    if (oldColumnIndex !== -1) {
      console.log(`Removendo startup ${startupId} da coluna ${updatedColumns[i].id}`);
      updatedColumns[i].startupIds.splice(oldColumnIndex, 1);
    }
  }
  
  // Adiciona à coluna correta
  const targetColumn = updatedColumns.find(col => col.id === statusId);
  if (targetColumn) {
    console.log(`Adicionando startup ${startupId} à coluna ${statusId}`);
    if (!targetColumn.startupIds.includes(startupId)) {
      targetColumn.startupIds.push(startupId);
    }
  }
  
  return updatedColumns;
};
