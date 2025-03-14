
/**
 * Utility functions for exporting data
 */

import { Startup } from '@/types';

/**
 * Convert startup data to CSV format and trigger download
 */
export const exportStartupsToCSV = (startups: Startup[]) => {
  // Define CSV headers
  const headers = [
    'Startup',
    'Setor',
    'Modelo de Negócio',
    'Problema que Resolve',
    'Site da Startup',
    'MRR',
    'Quantidade de Clientes',
    'Prioridade',
    'Data de Criação'
  ];

  // Map data to CSV rows
  const csvRows = startups.map(startup => {
    return [
      startup.values.Startup || '',
      startup.values.Setor || '',
      startup.values['Modelo de Negócio'] || '',
      startup.values['Problema que Resolve'] || '',
      startup.values['Site da Startup'] || '',
      startup.values.MRR || '',
      startup.values['Quantidade de Clientes'] || '',
      startup.priority || '',
      startup.createdAt.toLocaleDateString()
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up and trigger download
  link.setAttribute('href', url);
  link.setAttribute('download', `startups_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
