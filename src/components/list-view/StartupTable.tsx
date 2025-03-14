
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Startup, Status } from '@/types';
import StartupTableHeader from './StartupTableHeader';
import StartupTableRow from './StartupTableRow';

interface StartupTableProps {
  startups: Startup[];
  statusesData?: Status[];
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: string) => void;
  handleRowClick: (startup: Startup) => void;
  searchTerm: string;
}

const StartupTable = ({
  startups,
  statusesData,
  sortField,
  sortDirection,
  handleSort,
  handleRowClick,
  searchTerm,
}: StartupTableProps) => {
  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <StartupTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
        />
        <TableBody>
          {startups.length > 0 ? (
            startups.map((startup) => {
              const status = statusesData?.find(s => s.id === startup.statusId);
              
              return (
                <StartupTableRow
                  key={startup.id}
                  startup={startup}
                  status={status}
                  onRowClick={handleRowClick}
                />
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                {searchTerm ? "No startups found matching your search" : "No startups found. Add your first startup to get started."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StartupTable;
