
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStartupData } from '@/hooks/use-startup-data';
import { useStartupList } from '@/hooks/use-startup-list';
import ListViewHeader from '@/components/list-view/ListViewHeader';
import StartupTable from '@/components/list-view/StartupTable';

const ListView = () => {
  const { toast } = useToast();
  
  // Get startup data
  const {
    formattedStartups,
    statusesData,
    isLoadingStartups,
    isLoadingStatuses,
    isErrorStartups,
  } = useStartupData();
  
  // Set up sorting and filtering
  const {
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    sortedStartups,
    handleSort,
  } = useStartupList(formattedStartups);
  
  const handleRowClick = (startup) => {
    toast({
      title: "Startup details",
      description: `Opening details for ${startup.values.Startup}`,
    });
    // Navigate to startup details page would go here
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
      <ListViewHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        startups={sortedStartups}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <StartupTable
          startups={sortedStartups}
          statusesData={statusesData}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          handleRowClick={handleRowClick}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default ListView;
