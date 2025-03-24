
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { MappingTableProps } from './types';

export const MappingTable: React.FC<MappingTableProps> = ({
  csvData,
  columnMapping,
  onMappingChange,
  startupFields
}) => {
  return (
    <div className="overflow-auto max-h-[400px] pr-2">
      <table className="w-full border-collapse">
        <thead className="bg-muted sticky top-0">
          <tr>
            <th className="text-left py-2 px-4">Coluna do CSV</th>
            <th className="text-left py-2 px-4">Campo da Startup</th>
            <th className="text-left py-2 px-4 w-16">Amostra</th>
          </tr>
        </thead>
        <tbody>
          {csvData.headers.map((header, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{header}</td>
              <td className="py-2 px-4">
                <div className="flex items-center gap-2">
                  <Select
                    value={columnMapping[header] || ""}
                    onValueChange={(value) => onMappingChange(header, value || null)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ignore">Ignorar esta coluna</SelectItem>
                      {startupFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label} 
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {columnMapping[header] && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {startupFields.find(f => f.value === columnMapping[header])?.description}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </td>
              <td className="py-2 px-4">
                {csvData.records[0] && (
                  <Badge variant="outline" className="truncate max-w-[100px]">
                    {csvData.records[0][csvData.headers.indexOf(header)]}
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
