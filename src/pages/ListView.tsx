
import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Clock,
  User,
  Link
} from 'lucide-react';
import { Startup, Status } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { USERS } from '@/data/mockData';
import { format } from 'date-fns';
import { useStartupsQuery, useStatusesQuery } from '@/hooks/use-supabase-query';
import { Loader2 } from 'lucide-react';

const ListView = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch startups and statuses from Supabase
  const { data: startupsData, isLoading: isLoadingStartups, isError: isErrorStartups } = useStartupsQuery();
  const { data: statusesData, isLoading: isLoadingStatuses } = useStatusesQuery();

  // State to hold the formatted startups data
  const [formattedStartups, setFormattedStartups] = useState<Startup[]>([]);

  // Format Supabase startups data to match the Startup type
  useEffect(() => {
    if (startupsData && Array.isArray(startupsData)) {
      const formatted = startupsData.map(startup => ({
        id: startup.id,
        createdAt: new Date(startup.created_at),
        updatedAt: new Date(startup.updated_at),
        statusId: startup.status_id || '',
        values: {
          Startup: startup.name,
          'Problema que Resolve': startup.problem_solved,
          Setor: startup.sector,
          'Modelo de Negócio': startup.business_model,
          'Site da Startup': startup.website,
          MRR: startup.mrr,
          'Quantidade de Clientes': startup.client_count
        },
        labels: [],
        priority: startup.priority as 'low' | 'medium' | 'high' || 'medium',
        assignedTo: startup.assigned_to,
        dueDate: startup.due_date ? new Date(startup.due_date) : undefined,
        timeTracking: startup.time_tracking || 0,
        attachments: []
      }));
      setFormattedStartups(formatted);
    }
  }, [startupsData]);

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
  
  const handleRowClick = (startup: Startup) => {
    toast({
      title: "Startup details",
      description: `Opening details for ${startup.values.Startup}`,
    });
    // Navigate to startup details page would go here
  };
  
  const handleAddStartup = () => {
    toast({
      title: "Add startup",
      description: "Opening startup form",
    });
    // Add startup functionality would go here
  };
  
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" /> 
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };
  
  // Priority colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  // Loading state
  if (isLoadingStartups || isLoadingStatuses) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading startups...</span>
      </div>
    );
  }

  // Error state
  if (isErrorStartups) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Failed to load startups</h2>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Startup Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your startup investment funnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search startups..."
              className="w-full pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Startups</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                By Status
              </DropdownMenuItem>
              <DropdownMenuItem>
                By Priority
              </DropdownMenuItem>
              <DropdownMenuItem>
                By Label
              </DropdownMenuItem>
              <DropdownMenuItem>
                By Assigned User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleAddStartup}>
            <Plus className="h-4 w-4 mr-1" />
            Add Startup
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[250px]">
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleSort('Startup')}
                  >
                    Startup Name
                    {renderSortIcon('Startup')}
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleSort('Setor')}
                  >
                    Sector
                    {renderSortIcon('Setor')}
                  </div>
                </TableHead>
                <TableHead className="w-[150px]">
                  <div 
                    className="flex items-center cursor-pointer" 
                    onClick={() => handleSort('Modelo de Negócio')}
                  >
                    Business Model
                    {renderSortIcon('Modelo de Negócio')}
                  </div>
                </TableHead>
                <TableHead className="text-right w-[150px]">
                  <div 
                    className="flex items-center justify-end cursor-pointer" 
                    onClick={() => handleSort('MRR')}
                  >
                    MRR
                    {renderSortIcon('MRR')}
                  </div>
                </TableHead>
                <TableHead className="text-right w-[150px]">
                  <div 
                    className="flex items-center justify-end cursor-pointer" 
                    onClick={() => handleSort('Quantidade de Clientes')}
                  >
                    Clients
                    {renderSortIcon('Quantidade de Clientes')}
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    Status
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">
                    Priority
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    Assigned To
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    Due Date
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStartups.length > 0 ? (
                sortedStartups.map((startup) => {
                  const status = statusesData?.find(s => s.id === startup.statusId);
                  const assignedUser = startup.assignedTo && USERS[startup.assignedTo];
                  const dueDate = startup.dueDate ? new Date(startup.dueDate) : undefined;
                  
                  return (
                    <TableRow 
                      key={startup.id} 
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => handleRowClick(startup)}
                    >
                      <TableCell className="font-medium">
                        {startup.values.Startup || 'Unnamed Startup'}
                      </TableCell>
                      <TableCell>
                        {startup.values.Setor || '-'}
                      </TableCell>
                      <TableCell>
                        {startup.values['Modelo de Negócio'] || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {typeof startup.values.MRR === 'number' 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(startup.values.MRR) 
                          : (startup.values.MRR || '-')}
                      </TableCell>
                      <TableCell className="text-right">
                        {startup.values['Quantidade de Clientes'] || '-'}
                      </TableCell>
                      <TableCell>
                        {status && (
                          <Badge 
                            className="whitespace-nowrap" 
                            style={{ 
                              backgroundColor: `${status.color}20`, 
                              color: status.color,
                              borderColor: `${status.color}30`
                            }}
                            variant="outline"
                          >
                            {status.name}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${priorityColors[startup.priority]} text-xs`}
                        >
                          {startup.priority.charAt(0).toUpperCase() + startup.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignedUser ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {assignedUser.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs truncate max-w-[80px]">
                              {assignedUser.name}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Unassigned</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {dueDate ? (
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            <span>{format(dueDate, 'dd/MM/yyyy')}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
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
      </div>
    </div>
  );
};

export default ListView;
